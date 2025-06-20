const RentContract = artifacts.require("RentContract");
const TimeOracle = artifacts.require("TimeOracle");
const PriceOracle = artifacts.require("PriceOracle");
const config = require("../config/addresses");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(TimeOracle)
    .then(() => deployer.deploy(PriceOracle, config.initialEthPrice))
    .then(() => deployer.deploy(
      RentContract, 
      config.landlord, 
      config.tenant1, 
      config.tenant2, 
      config.rentAmountEur, 
      TimeOracle.address,
      PriceOracle.address
    ));
};