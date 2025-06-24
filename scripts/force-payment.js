const RentContract = artifacts.require("RentContract");
const TimeOracle = artifacts.require("TimeOracle");
const PriceOracle = artifacts.require("PriceOracle");
const config = require("../config/addresses");

module.exports = async function(callback) {
  try {
    const { landlord, tenant1, tenant2, rentAmountEur } = config;

    console.log("--- Test pagamento ---");
    
    const rentContract = await RentContract.deployed();
    const newTimeOracle = await TimeOracle.new({ from: landlord });
    const newPriceOracle = await PriceOracle.deployed();
    await rentContract.setTimeOracle(newTimeOracle.address, { from: landlord });

    const rentInWei = await newPriceOracle.convertEurToWei(rentAmountEur);
    console.log(`Quota: ${web3.utils.fromWei(rentInWei, "ether")} ETH`);

    console.log("\nMESE 1:");
    await newTimeOracle.setCurrentMonth(1, { from: landlord });
    
    await rentContract.payRent(1, { from: tenant1, value: rentInWei });
    console.log("✅ Inquilino 1 ha pagato");
    
    await rentContract.payRent(1, { from: tenant2, value: rentInWei });
    console.log("✅ Inquilino 2 ha pagato");


    console.log("\nMESE 2:");
    await newTimeOracle.setCurrentMonth(2, { from: landlord });
    
    await rentContract.payRent(2, { from: tenant1, value: rentInWei });
    console.log("✅ Inquilino 1 ha pagato");

    const month1Status = await rentContract.isRentPaid(1);
    const month2Status = await rentContract.isRentPaid(2);
    
    const month1Details = await rentContract.getMonthPaymentStatus(1);
    const month2Details = await rentContract.getMonthPaymentStatus(2);
    
    console.log("\nRISULTATO PAGAMENTI:");
    console.log(`Mese 1: ${month1Status ? "✅ COMPLETO" : "❌ INCOMPLETO"} (T1: ${month1Details.tenant1Paid ? "✅" : "❌"}, T2: ${month1Details.tenant2Paid ? "✅" : "❌"})`);
    console.log(`Mese 2: ${month2Status ? "✅ COMPLETO" : "❌ INCOMPLETO"} (T1: ${month2Details.tenant1Paid ? "✅" : "❌"}, T2: ${month2Details.tenant2Paid ? "✅" : "❌"})`);

    callback();
  } catch (error) {
    console.error("❌ ERRORE:", error.message);
    callback(error);
  }
};