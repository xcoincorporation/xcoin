// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * XCoinSale
 *
 * Venta simple de XCOIN a cambio de ETH.
 *
 * - El contrato debe tener XCOIN pre-cargados (transferidos por el owner).
 * - El comprador envía ETH.
 * - Se calcula cuántos XCOIN recibe según un precio fijo.
 * - Los XCOIN se envían al comprador.
 * - El ETH se deriva a la tesorería.
 *
 * NOTA: Esta versión no integra vesting/Vault aún.
 *       Es una venta directa simple para modo beta.
 */
contract XCoinSale is Ownable {
    IERC20 public immutable token;
    address payable public immutable treasury;

    /// @dev Precio de 1 XCOIN en wei (ETH), con 18 decimales.
    /// Ejemplo: pricePerTokenWei = 0.0001 ETH -> 1e14
    uint256 public pricePerTokenWei;

    event TokensPurchased(
        address indexed buyer,
        uint256 ethSpent,
        uint256 tokensBought
    );

    event PriceUpdated(uint256 oldPrice, uint256 newPrice);

    constructor(
        address initialOwner,
        address tokenAddress,
        address payable treasuryAddress,
        uint256 initialPricePerTokenWei
    ) Ownable(initialOwner) {
        require(tokenAddress != address(0), "XCoinSale: zero token");
        require(treasuryAddress != address(0), "XCoinSale: zero treasury");
        require(initialPricePerTokenWei > 0, "XCoinSale: zero price");

        token = IERC20(tokenAddress);
        treasury = treasuryAddress;
        pricePerTokenWei = initialPricePerTokenWei;
    }

    /**
     * @dev Actualiza el precio de 1 XCOIN en wei.
     * Solo el owner puede cambiarlo.
     */
    function setPricePerTokenWei(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "XCoinSale: zero price");
        uint256 old = pricePerTokenWei;
        pricePerTokenWei = newPrice;
        emit PriceUpdated(old, newPrice);
    }

    /**
     * @dev Compra tokens enviando ETH.
     * msg.value es el ETH que el comprador paga.
     *
     * tokens = (msg.value * 1e18) / pricePerTokenWei
     */
    function buy() external payable {
        require(msg.value > 0, "XCoinSale: no ETH sent");

        uint256 tokensToBuy = (msg.value * 1e18) / pricePerTokenWei;
        require(tokensToBuy > 0, "XCoinSale: ETH too low for 1 token");

        uint256 contractBalance = token.balanceOf(address(this));
        require(contractBalance >= tokensToBuy, "XCoinSale: not enough tokens");

        // Enviar tokens al comprador
        bool ok = token.transfer(msg.sender, tokensToBuy);
        require(ok, "XCoinSale: token transfer failed");

        // Enviar ETH a tesoreria
        (bool sent, ) = treasury.call{value: msg.value}("");
        require(sent, "XCoinSale: ETH transfer failed");

        emit TokensPurchased(msg.sender, msg.value, tokensToBuy);
    }

    /**
     * @dev Permite al owner retirar tokens sobrantes (por si hay que migrar o cerrar la venta).
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        bool ok = token.transfer(owner(), amount);
        require(ok, "XCoinSale: withdraw failed");
    }

    /**
     * @dev Seguridad: si queda ETH atrapado, el owner puede recuperarlo.
     */
    function rescueETH(uint256 amount) external onlyOwner {
        (bool sent, ) = owner().call{value: amount}("");
        require(sent, "XCoinSale: rescue ETH failed");
    }

    receive() external payable {
    require(msg.value > 0, "XCoinSale: no ETH sent");

    uint256 tokensToBuy = (msg.value * 1e18) / pricePerTokenWei;
    require(tokensToBuy > 0, "XCoinSale: ETH too low for 1 token");

    uint256 contractBalance = token.balanceOf(address(this));
    require(contractBalance >= tokensToBuy, "XCoinSale: not enough tokens");

    // Enviar tokens al comprador
    bool ok = token.transfer(msg.sender, tokensToBuy);
    require(ok, "XCoinSale: token transfer failed");

    // Enviar ETH a tesoreria
    (bool sent, ) = treasury.call{value: msg.value}("");
    require(sent, "XCoinSale: ETH transfer failed");

    emit TokensPurchased(msg.sender, msg.value, tokensToBuy);
    }

}
