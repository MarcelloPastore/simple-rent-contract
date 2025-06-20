const RentContract = artifacts.require("RentContract");
const TimeOracle = artifacts.require("TimeOracle");
const PriceOracle = artifacts.require("PriceOracle");

module.exports = function (deployer, network, accounts) {
  const landlord = "0x9d95C74C7da04CC842568a922D2096688c3Db4E9";
  const tenant1 = "0xe1539f39F74d16839bC9209c90A1aa256D29127d";
  const tenant2 = "0x6B9f89E2Ac08DD489Bd820bE1E50CcCC81D5b47b";
  const rentAmountEur = 45000;

  deployer.deploy(TimeOracle)
    .then(() => deployer.deploy(PriceOracle, 200000))
    .then(() => deployer.deploy(
      RentContract, 
      landlord, 
      tenant1, 
      tenant2, 
      rentAmountEur, 
      TimeOracle.address,
      PriceOracle.address
    ));
};