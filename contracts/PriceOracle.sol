// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PriceOracle {
    address public owner;
    uint public ethPriceInEur;
    uint public lastUpdated;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Funzione riservata al proprietario");
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
    }

    function convertEurToWei(uint rentAmount) external view returns (uint) {
        return (rentAmount * 1 ether) / ethPriceInEur;
    }
}
