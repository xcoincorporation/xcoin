// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title XCoinSaleV2
/// @notice Contrato de venta de XCOIN en testnet con:
///         - Precio fijo en wei por token
///         - Cooldown por address en bloques
///         - Pausa de emergencias
///         - Forward automático de ETH a la tesorería
contract XCoinSaleV2 is Ownable, Pausable, ReentrancyGuard {
    IERC20 public immutable token;
    address public immutable treasury;

    /// @notice Precio de referencia en wei por 1 XCOIN (18 decimales)
    uint256 public pricePerTokenWei;

    /// @notice Cantidad de bloques que debe esperar una address entre compras
    uint256 public cooldownBlocks;

    /// @notice Último bloque en el que cada address compró
    mapping(address => uint256) public lastBuyBlock;

    event TokensPurchased(address indexed buyer, uint256 ethSpent, uint256 tokensBought);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event CooldownUpdated(uint256 oldCooldown, uint256 newCooldown);
    event EthRescued(address indexed to, uint256 amount);
    event TokenRescued(address indexed token, address indexed to, uint256 amount);

    /// @param initialOwner      Dirección que será el owner del contrato
    /// @param _token            Contrato ERC20 de XCOIN
    /// @param _treasury         Dirección de tesorería que recibe el ETH
    /// @param _pricePerTokenWei Precio inicial en wei por 1 XCOIN
    /// @param _cooldownBlocks   Bloques de cooldown entre compras de la misma address
    constructor(
        address initialOwner,
        IERC20 _token,
        address _treasury,
        uint256 _pricePerTokenWei,
        uint256 _cooldownBlocks
    ) Ownable(initialOwner) {
        require(address(_token) != address(0), "XCoinSaleV2: token is zero");
        require(_treasury != address(0), "XCoinSaleV2: treasury is zero");
        require(_pricePerTokenWei > 0, "XCoinSaleV2: price is zero");

        token = _token;
        treasury = _treasury;
        pricePerTokenWei = _pricePerTokenWei;
        cooldownBlocks = _cooldownBlocks;
    }

    // =====================================================
    //                    CONFIGURACION
    // =====================================================

    function setPricePerTokenWei(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "XCoinSaleV2: price is zero");
        uint256 old = pricePerTokenWei;
        pricePerTokenWei = newPrice;
        emit PriceUpdated(old, newPrice);
    }

    function setCooldownBlocks(uint256 newCooldown) external onlyOwner {
        uint256 old = cooldownBlocks;
        cooldownBlocks = newCooldown;
        emit CooldownUpdated(old, newCooldown);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // =====================================================
    //                     COMPRA PRINCIPAL
    // =====================================================

    /// @notice Compra de XCOIN enviando ETH directamente
    /// @dev Calcula tokens = msg.value * 1e18 / pricePerTokenWei
    function buy() public payable whenNotPaused nonReentrant {
        require(msg.value > 0, "XCoinSaleV2: no ETH sent");

        // Enforce cooldown si esta configurado
        if (cooldownBlocks > 0) {
            uint256 last = lastBuyBlock[msg.sender];
            require(
                last == 0 || block.number > last + cooldownBlocks,
                "XCoinSaleV2: cooldown not passed"
            );
        }

        uint256 tokensToBuy = (msg.value * 1e18) / pricePerTokenWei;
        require(tokensToBuy > 0, "XCoinSaleV2: ETH too low for 1 token");

        uint256 balance = token.balanceOf(address(this));
        require(balance >= tokensToBuy, "XCoinSaleV2: not enough tokens");

        // Registra el bloque de compra para cooldown
        lastBuyBlock[msg.sender] = block.number;

        // Envía los tokens al comprador
        bool ok = token.transfer(msg.sender, tokensToBuy);
        require(ok, "XCoinSaleV2: token transfer failed");

        // Forward del ETH a la tesoreria
        (bool sent, ) = treasury.call{ value: msg.value }("");
        require(sent, "XCoinSaleV2: treasury transfer failed");

        emit TokensPurchased(msg.sender, msg.value, tokensToBuy);
    }

    /// @notice Permite comprar enviando ETH directamente al contrato
    ///         Se enruta internamente a buy()
    receive() external payable {
        buy();
    }

    // =====================================================
    //                    FUNCIONES DE RESCATE
    // =====================================================

    /// @notice Rescatar ETH residual (no relacionado a ventas normales)
    function rescueETH(uint256 amount, address to) external onlyOwner {
        require(to != address(0), "XCoinSaleV2: to is zero");
        (bool sent, ) = to.call{ value: amount }("");
        require(sent, "XCoinSaleV2: rescue ETH failed");
        emit EthRescued(to, amount);
    }

    /// @notice Rescatar tokens ERC20 que hayan quedado bloqueados
    function rescueTokens(
        IERC20 erc20,
        uint256 amount,
        address to
    ) external onlyOwner {
        require(address(erc20) != address(0), "XCoinSaleV2: token is zero");
        require(to != address(0), "XCoinSaleV2: to is zero");
        bool ok = erc20.transfer(to, amount);
        require(ok, "XCoinSaleV2: rescue token failed");
        emit TokenRescued(address(erc20), to, amount);
    }
}
