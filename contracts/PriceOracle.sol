// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PriceOracle {
    address public owner;
    uint public ethPriceInEur;
    uint public lastUpdated;
    
    event PriceUpdated(uint newPrice, uint timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor(uint _initialPrice) {
        owner = msg.sender;
        ethPriceInEur = _initialPrice;
        lastUpdated = block.timestamp;
    }
    
    function updatePrice(uint _newPrice) external onlyOwner {
        ethPriceInEur = _newPrice;
        lastUpdated = block.timestamp;
        emit PriceUpdated(_newPrice, block.timestamp);
    }
      function convertEurToWei(uint eurAmount) external view returns (uint) {
        require(ethPriceInEur > 0, "ETH price not set");
        return (eurAmount * 1 ether) / ethPriceInEur;
    }
}
