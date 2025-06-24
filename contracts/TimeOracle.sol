// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeOracle {
    address public owner;
    uint public contractStartDate;
    uint public constant TOLLERANZA = 10 days;
    uint public constant SecondsPerMonth = 2629746;
    uint private customCurrentMonth;
    bool private useCustomMonth;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Funzione riservata al proprietario");
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

    function setCurrentMonth(uint month) external onlyOwner {
        customCurrentMonth = month;
        useCustomMonth = true;
    }
    
    function getMonthForTimestamp(uint timestamp) public view returns (uint) {
        require(timestamp >= contractStartDate);
        uint monthsSinceStart = (timestamp - contractStartDate) / SecondsPerMonth;
        return monthsSinceStart + 1;
    }
    
    function isPaymentDue(uint month) public view returns (bool) {
        return getCurrentMonth() >= month;
    }
    
    function isPaymentLate(uint paidMonth) public view returns (bool) {
        uint gracePeriodEnd = calculateGracePeriodEnd(paidMonth);
        return block.timestamp > gracePeriodEnd;
    }
    
    function isInGracePeriod(uint paidMonth) public view returns (bool) {
        uint gracePeriodEnd = calculateGracePeriodEnd(paidMonth);
        return block.timestamp <= gracePeriodEnd && block.timestamp > (contractStartDate + ((paidMonth - 1) * SecondsPerMonth) + SecondsPerMonth);
    }

    function calculateGracePeriodEnd(uint paidMonth) private view returns (uint gracePeriodEnd) {
        uint currentMonth = getMonthForTimestamp(block.timestamp);
        if (currentMonth <= paidMonth) return 0;
        uint monthStartTimestamp = contractStartDate + ((paidMonth - 1) * SecondsPerMonth);
        return monthStartTimestamp + SecondsPerMonth + TOLLERANZA;
    }
    
    function getFirstOfCurrentMonth() private view returns (uint) {
        uint currentTime = block.timestamp;
        uint secondsPerDay = 86400;
        uint currentDay = (currentTime / secondsPerDay) % 30 + 1;
        return currentTime - ((currentDay - 1) * secondsPerDay);
    }
}
