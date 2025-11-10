// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * XCoin (XCOIN)
 * Distribución inicial 80/20 en el constructor:
 *  - 80% a vaultUsuarios (bloqueo por fases, a definir)
 *  - 20% a tesoreria (la Casa)
 *
 * Suministro con 18 decimales.
 */
contract XCoinToken is ERC20, Ownable {
    address public immutable tesoreria;      // 20%
    address public immutable vaultUsuarios;  // 80%

    event InitialDistribution(uint256 total, uint256 toVault, uint256 toTreasury);

    constructor(
        uint256 initialSupplyTokens, // en unidades "enteras" (ej: 1_000_000)
        address _tesoreria,
        address _vaultUsuarios
    ) ERC20("XCoin", "XCOIN") Ownable(msg.sender) {
        require(_tesoreria != address(0), "Tesoreria = zero");
        require(_vaultUsuarios != address(0), "Vault = zero");
        tesoreria = _tesoreria;
        vaultUsuarios = _vaultUsuarios;

        // Convierte a 18 decimales
        uint256 supply = initialSupplyTokens * (10 ** decimals());

        // Mint total al contrato y luego distribuye 80/20
        _mint(address(this), supply);

        uint256 toVault = supply * 80 / 100;
        uint256 toTreasury = supply - toVault;

        _transfer(address(this), vaultUsuarios, toVault);
        _transfer(address(this), tesoreria, toTreasury);

        emit InitialDistribution(supply, toVault, toTreasury);
    }
}
