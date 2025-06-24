// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TimeOracle.sol";
import "./PriceOracle.sol";

contract RentContract {
    address public landlord;
    address public tenant1;
    address public tenant2;
    uint public rentAmountEur;
    TimeOracle public timeOracle;
    PriceOracle public priceOracle;
    
    mapping(uint => mapping(address => bool)) public tenantPaidForMonth;

    modifier onlyLandlord() {
        require(msg.sender == landlord, "Funzione riservata al proprietario");
        _;
    }

    modifier onlyTenants() {
        require(msg.sender == tenant1 || msg.sender == tenant2, "Funzione riservata agli inquilini");
        _;
    }

    constructor(
        address _landlord, 
        address _tenant1, 
        address _tenant2, 
        uint _rentAmountEur, 
        address _timeOracle,
        address _priceOracle
    ) {
        landlord = _landlord;
        tenant1 = _tenant1;
        tenant2 = _tenant2;
        rentAmountEur = _rentAmountEur;
        timeOracle = TimeOracle(_timeOracle);
        priceOracle = PriceOracle(_priceOracle);
    }

    function payRent(uint month) public payable onlyTenants {
        uint requiredWei = priceOracle.convertEurToWei(rentAmountEur);
        require(msg.value >= requiredWei, "Importo insufficiente");
        require(!tenantPaidForMonth[month][msg.sender], "Affitto pagato per questo mese");
        require(timeOracle.isPaymentDue(month), "Pagamento non dovuto questo mese");

        tenantPaidForMonth[month][msg.sender] = true;
        
        payable(landlord).transfer(requiredWei);
        
        if (msg.value > requiredWei) {
            payable(msg.sender).transfer(msg.value - requiredWei);
        }
    }

    function payCurrentMonthRent() public payable onlyTenants {
        uint currentMonth = timeOracle.getCurrentMonth();
        payRent(currentMonth);
    }

    function isRentPaid(uint month) public view returns (bool) {
        return tenantPaidForMonth[month][tenant1] && tenantPaidForMonth[month][tenant2];
    }

    function isRentLate(uint month) public view returns (bool) {
        return timeOracle.isPaymentLate(month) && !isRentPaid(month);
    }

    function isInGracePeriod(uint month) public view returns (bool) {
        return timeOracle.isInGracePeriod(month) && !isRentPaid(month);
    }

    function setTimeOracle(address _timeOracle) external onlyLandlord {
        timeOracle = TimeOracle(_timeOracle);
    }

    function setPriceOracle(address _priceOracle) external onlyLandlord {
        priceOracle = PriceOracle(_priceOracle);
    }

    function getMonthPaymentStatus(uint month) external view returns (bool tenant1Paid, bool tenant2Paid, bool fullyPaid) {
        tenant1Paid = tenantPaidForMonth[month][tenant1];
        tenant2Paid = tenantPaidForMonth[month][tenant2];
        fullyPaid = tenant1Paid && tenant2Paid;
    }

    function getLateRentMonths() external view returns (uint[] memory) {
        uint currentMonth = timeOracle.getCurrentMonth();
        uint[] memory lateMonths = new uint[](currentMonth);
        uint count = 0;
        
        for (uint i = 1; i < currentMonth; i++) {
            if (isRentLate(i)) {
                lateMonths[count] = i;
                count++;
            }
        }
        
        uint[] memory result = new uint[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = lateMonths[i];
        }
        
        return result;
    }
}