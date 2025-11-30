// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XCoinSaleV2 is Ownable {
    IERC20 public token;
    address public treasury;

    uint256 public pricePerTokenWeiFixed;   // ← ESTA VARIABLE FALTABA
    uint256 public cooldownBlocks;

    mapping(address => uint256) public lastBuyBlock;

    event Bought(address indexed buyer, uint256 ethSpent, uint256 tokensOut);

    constructor(
        address initialOwner,
        address _token,
        address _treasury,
        uint256 _pricePerTokenWei,
        uint256 _cooldownBlocks
    ) Ownable(initialOwner) {
        require(_token != address(0), "token=0");
        require(_treasury != address(0), "treasury=0");
        require(_pricePerTokenWei > 0, "price=0");

        token = IERC20(_token);
        treasury = _treasury;

        pricePerTokenWeiFixed = _pricePerTokenWei; // ← AHORA EXISTE
        cooldownBlocks = _cooldownBlocks;
    }

    function buy() external payable {
        require(msg.value > 0, "no ETH");
        require(
            block.number > lastBuyBlock[msg.sender] + cooldownBlocks,
            "cooldown"
        );

        uint256 tokensOut = (msg.value * 1e18) / pricePerTokenWeiFixed;

        require(
            token.balanceOf(address(this)) >= tokensOut,
            "no liquidity"
        );

        lastBuyBlock[msg.sender] = block.number;

        token.transfer(msg.sender, tokensOut);

        emit Bought(msg.sender, msg.value, tokensOut);
    }

    // Admin: retirar ETH
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Admin: retirar tokens sobrantes
    function withdrawTokens(uint256 amount) external onlyOwner {
        token.transfer(owner(), amount);
    }
}
