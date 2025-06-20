// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeOracle {
    address public owner;
    uint public contractStartDate;
    uint public constant TOLLERANZA = 10 days;
    uint private customCurrentMonth;
    bool private useCustomMonth;
    
    event ContractStartDateUpdated(uint newStartDate);
    event CurrentMonthSet(uint month);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        contractStartDate = getFirstOfCurrentMonth();
        useCustomMonth = false;
    }

    function getCurrentMonth() public view returns (uint) {
        if (useCustomMonth) {
            return customCurrentMonth;
        }
        return getMonthForTimestamp(block.timestamp);
    }
    
    function getMonthForTimestamp(uint timestamp) public view returns (uint) {
        require(timestamp >= contractStartDate, "Timestamp before contract start");
        uint secondsPerMonth = 2629746;
        uint monthsSinceStart = (timestamp - contractStartDate) / secondsPerMonth;
        return monthsSinceStart + 1;
    }
    
    function updateContractStartDate(uint newStartDate) external onlyOwner {
        contractStartDate = newStartDate;
        emit ContractStartDateUpdated(newStartDate);
    }
    
    function isPaymentDue(uint month) public view returns (bool) {
        return getCurrentMonth() >= month;
    }
    
    function isPaymentLate(uint month) public view returns (bool) {
        uint currentMonth = getMonthForTimestamp(block.timestamp);
        if (currentMonth <= month) return false;
        uint monthStartTimestamp = contractStartDate + ((month - 1) * 2629746);
        uint gracePeriodEnd = monthStartTimestamp + 2629746 + TOLLERANZA;
        return block.timestamp > gracePeriodEnd;
    }
    
    function isInGracePeriod(uint month) public view returns (bool) {
        uint currentMonth = getMonthForTimestamp(block.timestamp);
        if (currentMonth <= month) return false;
        uint monthStartTimestamp = contractStartDate + ((month - 1) * 2629746);
        uint gracePeriodEnd = monthStartTimestamp + 2629746 + TOLLERANZA;
        return block.timestamp <= gracePeriodEnd && block.timestamp > (monthStartTimestamp + 2629746);
    }
    
    function getFirstOfCurrentMonth() private view returns (uint) {
        uint currentTime = block.timestamp;
        uint secondsPerDay = 86400;
        uint currentDay = (currentTime / secondsPerDay) % 30 + 1;
        return currentTime - ((currentDay - 1) * secondsPerDay);
    }
    
    function setCurrentMonth(uint month) external onlyOwner {
        customCurrentMonth = month;
        useCustomMonth = true;
        emit CurrentMonthSet(month);    }
    
    function resetToActualTime() external onlyOwner {
        useCustomMonth = false;
    }
}
