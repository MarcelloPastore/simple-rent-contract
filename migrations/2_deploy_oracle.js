const TimeOracle = artifacts.require("TimeOracle");
const PriceOracle = artifacts.require("PriceOracle");

module.exports = function (deployer) {
  deployer.deploy(TimeOracle);
  deployer.deploy(PriceOracle, 45000);
};
