// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XCoinSaleV2 is Ownable {
    IERC20 public immutable token;
    address payable public immutable treasury;

    uint256 public pricePerTokenWei;
    bool public paused;
    uint256 public cooldownBlocks; // ej: 3 bloques entre compras
    mapping(address => uint256) public lastBuyBlock;

    event TokensPurchased(address indexed buyer, uint256 ethSpent, uint256 tokensBought);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event Paused(bool state);
    event CooldownUpdated(uint256 oldValue, uint256 newValue);

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
        cooldownBlocks = 0;
    }

    modifier whenNotPaused() {
        require(!paused, "XCoinSale: paused");
        _;
    }

    function setPricePerTokenWei(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "XCoinSale: zero price");
        uint256 old = pricePerTokenWei;
        pricePerTokenWei = newPrice;
        emit PriceUpdated(old, newPrice);
    }

    function setPaused(bool state) external onlyOwner {
        paused = state;
        emit Paused(state);
    }

    function setCooldownBlocks(uint256 newCooldown) external onlyOwner {
        uint256 old = cooldownBlocks;
        cooldownBlocks = newCooldown;
        emit CooldownUpdated(old, newCooldown);
    }

    function buy() external payable whenNotPaused {
        require(msg.value > 0, "XCoinSale: no ETH sent");

        if (cooldownBlocks > 0) {
            uint256 last = lastBuyBlock[msg.sender];
            require(
                last == 0 || block.number > last + cooldownBlocks,
                "XCoinSale: cooldown not passed"
            );
        }

        uint256 tokensToBuy = (msg.value * 1e18) / pricePerTokenWei;
        require(tokensToBuy > 0, "XCoinSale: ETH too low for 1 token");

        uint256 contractBalance = token.balanceOf(address(this));
        require(contractBalance >= tokensToBuy, "XCoinSale: not enough tokens");

        lastBuyBlock[msg.sender] = block.number;

        bool ok = token.transfer(msg.sender, tokensToBuy);
        require(ok, "XCoinSale: token transfer failed");

        (bool sent, ) = treasury.call{value: msg.value}("");
        require(sent, "XCoinSale: ETH transfer failed");

        emit TokensPurchased(msg.sender, msg.value, tokensToBuy);
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        bool ok = token.transfer(owner(), amount);
        require(ok, "XCoinSale: withdraw failed");
    }

    function rescueETH(uint256 amount) external onlyOwner {
        (bool sent, ) = owner().call{value: amount}("");
        require(sent, "XCoinSale: rescue ETH failed");
    }

    receive() external payable {
        buy();
    }
}
