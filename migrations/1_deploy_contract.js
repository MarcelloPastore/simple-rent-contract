const RentContract = artifacts.require("RentContract");

module.exports = function (deployer, network, accounts) {
  const landlord = "0x8A8336d1Cd08C17c9aB1C8416bf4802db904D5F4"; // Nuovo indirizzo del landlord
  const tenant1 = "0x836313eE6016bD33E9e9a80e1Bda9D23Cf563b39"; // Indirizzo del primo affittuario
  const tenant2 = "0xE3e01268f184fb3112cF2d6463bDB67923505096"; // Indirizzo del secondo affittuario
  const rentAmount = web3.utils.toWei("0.375", "ether"); // Importo dell'affitto in wei

  deployer.deploy(RentContract, landlord, tenant1, tenant2, rentAmount);
};