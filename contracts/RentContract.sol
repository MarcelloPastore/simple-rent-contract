// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract RentContract {
    address public landlord;
    address public tenant1;
    address public tenant2;
    uint public rentAmount;
    bool public rentPaid;

    event RentPaid(address indexed tenant, uint amount);
    event RentStatusChanged(bool paid);

    constructor(address _landlord, address _tenant1, address _tenant2, uint _rentAmount) {
        landlord = _landlord; // Landlord passato come parametro
        tenant1 = _tenant1;
        tenant2 = _tenant2;
        rentAmount = _rentAmount;
        rentPaid = false;
    }

    function payRent() public payable {
        require(msg.sender == tenant1 || msg.sender == tenant2, "Only tenants can pay rent");
        require(msg.value == rentAmount, "Incorrect rent amount");
        require(!rentPaid, "Rent has already been paid");

        emit RentPaid(msg.sender, msg.value);
        
        // Transfer rent to landlord
        payable(landlord).transfer(msg.value);
        
        // Update rent status
        rentPaid = true;
        emit RentStatusChanged(rentPaid);
    }

    function resetRent() public {
        require(msg.sender == landlord, "Only landlord can reset rent");
        require(rentPaid, "Rent has not been paid yet");

        rentPaid = false;
        emit RentStatusChanged(rentPaid);
    }
}