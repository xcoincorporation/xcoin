// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * XCoinVault
 *
 * - Mantiene el 80% de supply para usuarios.
 * - Administra fases de desbloqueo en función del Market Cap (en unidades enteras, ej: 5_000_000 = 5M).
 * - Cada fase indica el % acumulado desbloqueado (en basis points, 10000 = 100%).
 * - Cada usuario tiene un "grant" (asignación total) y solo puede reclamar la parte desbloqueada.
 *
 * Flujo típico:
 *  1) El constructor solo fija owner y oracle.
 *  2) El owner llama a `setToken()` una vez, cuando el token ya está desplegado.
 *  3) El token XCOIN transfiere el 80% al address de este vault (constructor del token o transferencia manual).
 *  4) El owner asigna grants con `allocate()`.
 *  5) El oráculo (o el owner) llama a `syncMarketCap()` para avanzar fases según el Market Cap.
 *  6) Los usuarios llaman a `claim()` para retirar la parte vestida.
 */
contract XCoinVault is Ownable {
    IERC20 public token;
    bool public tokenSet;

    /// @dev Cuenta autorizada a informar MarketCap (puede ser un oráculo off-chain o el mismo owner).
    address public oracle;

    /// @dev Fase de desbloqueo.
    struct Phase {
        uint256 targetMarketCapUsd; // ej: 5_000_000 para 5M USD
        uint16 unlockBps;           // porcentaje acumulado desbloqueado, en basis points (10000 = 100%)
    }

    Phase[] private _phases;

    /// @dev Número de fases desbloqueadas (0 = ninguna, N = fases [0..N-1] desbloqueadas).
    uint256 public currentPhase;

    /// @dev Último Market Cap reportado por el oráculo.
    uint256 public lastMarketCapUsd;

    /// @dev Asignación para un beneficiario.
    struct Grant {
        uint256 total;     // monto total asignado (en unidades del token, 18 decimales)
        uint256 released;  // monto ya reclamado
    }

    mapping(address => Grant) public grants;

    /// @dev Total asignado vía `allocate`, para validar que no superamos el balance del vault.
    uint256 public totalAllocated;

    event TokenSet(address indexed token);
    event OracleUpdated(address indexed newOracle);
    event PhaseAdded(uint256 indexed index, uint256 targetMarketCapUsd, uint16 unlockBps);
    event PhaseUnlocked(uint256 indexed index, uint256 marketCapUsd, uint16 cumulativeUnlockBps);
    event GrantAllocated(address indexed beneficiary, uint256 amount);
    event TokensClaimed(address indexed beneficiary, uint256 amount);

    modifier onlyOracle() {
        require(msg.sender == oracle || msg.sender == owner(), "XCoinVault: not oracle");
        _;
    }

    /**
     * @param initialOwner  Owner inicial del vault (típicamente el deployer).
     * @param initialOracle Cuenta autorizada a llamar syncMarketCap (puede ser igual al owner al inicio).
     */
    constructor(address initialOwner, address initialOracle) Ownable(initialOwner) {
        require(initialOwner != address(0), "XCoinVault: owner is zero");
        require(initialOracle != address(0), "XCoinVault: oracle is zero");
        oracle = initialOracle;
    }

    // =========================
    //   CONFIGURACIÓN BÁSICA
    // =========================

    /// @dev Solo puede llamarse UNA VEZ, cuando el token ya está desplegado.
    function setToken(address tokenAddress) external onlyOwner {
        require(!tokenSet, "XCoinVault: token already set");
        require(tokenAddress != address(0), "XCoinVault: zero token");
        token = IERC20(tokenAddress);
        tokenSet = true;
        emit TokenSet(tokenAddress);
    }

    function setOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "XCoinVault: zero oracle");
        oracle = newOracle;
        emit OracleUpdated(newOracle);
    }

    // =========================
    //        FASES
    // =========================

    function phasesLength() external view returns (uint256) {
        return _phases.length;
    }

    function getPhase(uint256 index) external view returns (uint256 targetCap, uint16 unlockBps) {
        Phase memory p = _phases[index];
        return (p.targetMarketCapUsd, p.unlockBps);
    }

    /**
     * @dev Agrega una nueva fase.
     * - Debe tener MarketCap objetivo creciente.
     * - Debe tener unlockBps creciente y <= 10000.
     * - Ejemplo: [ (1_000_000, 2500), (2_500_000, 5000), (5_000_000, 7500), (10_000_000, 10000) ]
     */
    function addPhase(uint256 targetMarketCapUsd, uint16 unlockBps) external onlyOwner {
        require(unlockBps <= 10_000, "XCoinVault: bps > 100%");
        uint256 len = _phases.length;

        if (len == 0) {
            require(unlockBps > 0, "XCoinVault: first phase must unlock > 0");
        } else {
            Phase memory last = _phases[len - 1];
            require(targetMarketCapUsd > last.targetMarketCapUsd, "XCoinVault: cap not increasing");
            require(unlockBps > last.unlockBps, "XCoinVault: bps not increasing");
        }

        _phases.push(Phase({targetMarketCapUsd: targetMarketCapUsd, unlockBps: unlockBps}));
        emit PhaseAdded(len, targetMarketCapUsd, unlockBps);
    }

    /// @dev Devuelve el porcentaje acumulado desbloqueado (0..10000).
    function unlockedBps() public view returns (uint16) {
        if (currentPhase == 0) return 0;
        return _phases[currentPhase - 1].unlockBps;
    }

    /**
     * @dev Actualiza el MarketCap y desbloquea las fases cuyo target ya se haya alcanzado.
     * Debe ser llamada por el oráculo (o el owner) cuando haya un nuevo dato de MarketCap.
     *
     * @param marketCapUsd  MarketCap en unidades enteras (ej: 5_000_000 = 5M)
     */
    function syncMarketCap(uint256 marketCapUsd) external onlyOracle {
        lastMarketCapUsd = marketCapUsd;

        uint256 len = _phases.length;
        uint256 phaseIndex = currentPhase;

        while (phaseIndex < len && marketCapUsd >= _phases[phaseIndex].targetMarketCapUsd) {
            emit PhaseUnlocked(phaseIndex, marketCapUsd, _phases[phaseIndex].unlockBps);
            phaseIndex++;
        }

        currentPhase = phaseIndex;
    }

    // =========================
    //        GRANTS
    // =========================

    /**
     * @dev Asigna `amount` de tokens a un beneficiario.
     * - No mueve tokens; solo registra la asignación total.
     * - Valida que el total asignado no supere el balance del vault.
     *
     * IMPORTANTE: el vault debe tener previamente los XCOIN transferidos (80%).
     */
    function allocate(address beneficiary, uint256 amount) external onlyOwner {
        require(tokenSet, "XCoinVault: token not set");
        require(beneficiary != address(0), "XCoinVault: zero beneficiary");
        require(amount > 0, "XCoinVault: zero amount");

        uint256 balance = token.balanceOf(address(this));
        require(balance >= totalAllocated + amount, "XCoinVault: insufficient vault balance");

        Grant storage g = grants[beneficiary];
        g.total += amount;
        totalAllocated += amount;

        emit GrantAllocated(beneficiary, amount);
    }

    function grantOf(address beneficiary) external view returns (uint256 total, uint256 released) {
        Grant storage g = grants[beneficiary];
        return (g.total, g.released);
    }

    /// @dev Cálculo de cuánto puede reclamar hoy un beneficiario.
    function releasable(address beneficiary) public view returns (uint256) {
        Grant storage g = grants[beneficiary];
        if (g.total == 0) return 0;

        uint16 bps = unlockedBps();
        if (bps == 0) return 0;

        uint256 vested = (g.total * bps) / 10_000;
        if (vested <= g.released) return 0;

        return vested - g.released;
    }

    /// @dev El beneficiario reclama sus tokens liberados según la fase actual.
    function claim() external {
        require(tokenSet, "XCoinVault: token not set");

        uint256 amount = releasable(msg.sender);
        require(amount > 0, "XCoinVault: nothing to claim");

        Grant storage g = grants[msg.sender];
        g.released += amount;

        bool ok = token.transfer(msg.sender, amount);
        require(ok, "XCoinVault: transfer failed");

        emit TokensClaimed(msg.sender, amount);
    }
}