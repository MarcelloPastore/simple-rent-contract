const TimeOracle = artifacts.require("TimeOracle");
const PriceOracle = artifacts.require("PriceOracle");
const config = require("../config/addresses");

module.exports = function (deployer) {
  deployer.deploy(TimeOracle);
  deployer.deploy(PriceOracle, config.rentAmountEur);
};
