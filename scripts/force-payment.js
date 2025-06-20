const RentContract = artifacts.require("RentContract");
const TimeOracle = artifacts.require("TimeOracle");

module.exports = async function(callback) {
  try {
    const landlord = "0x9d95C74C7da04CC842568a922D2096688c3Db4E9";
    const tenant1 = "0xe1539f39F74d16839bC9209c90A1aa256D29127d";
    const tenant2 = "0x6B9f89E2Ac08DD489Bd820bE1E50CcCC81D5b47b";

    console.log("🏠 Forzando pagamenti affitto...");
    
    const rentContract = await RentContract.deployed();
    const newTimeOracle = await TimeOracle.new({ from: landlord });
    await rentContract.setTimeOracle(newTimeOracle.address, { from: landlord });
    
    const rentInWei = await rentContract.getCurrentRentInWei();
    console.log(`💰 Quota: ${web3.utils.fromWei(rentInWei, "ether")} ETH`);

    // MESE 1 - Entrambi pagano
    console.log("\n📅 MESE 1:");
    await newTimeOracle.setCurrentMonth(1, { from: landlord });
    
    await rentContract.payRent(1, { from: tenant1, value: rentInWei });
    console.log("✅ Tenant1 pagato");
    
    await rentContract.payRent(1, { from: tenant2, value: rentInWei });
    console.log("✅ Tenant2 pagato");

    // MESE 2 - Entrambi pagano
    console.log("\n📅 MESE 2:");
    await newTimeOracle.setCurrentMonth(2, { from: landlord });
    
    await rentContract.payRent(2, { from: tenant1, value: rentInWei });
    console.log("✅ Tenant1 pagato");
    
    await rentContract.payRent(2, { from: tenant2, value: rentInWei });
    console.log("✅ Tenant2 pagato");

    // Risultato dettagliato
    const month1Status = await rentContract.isRentPaid(1);
    const month2Status = await rentContract.isRentPaid(2);
    
    // Stato dettagliato pagamenti
    const month1Details = await rentContract.getMonthPaymentStatus(1);
    const month2Details = await rentContract.getMonthPaymentStatus(2);
    
    console.log("\n🎯 RISULTATO DETTAGLIATO:");
    console.log(`Mese 1: ${month1Status ? "✅ COMPLETO" : "❌ INCOMPLETO"} (T1: ${month1Details.tenant1Paid ? "✅" : "❌"}, T2: ${month1Details.tenant2Paid ? "✅" : "❌"})`);
    console.log(`Mese 2: ${month2Status ? "✅ COMPLETO" : "❌ INCOMPLETO"} (T1: ${month2Details.tenant1Paid ? "✅" : "❌"}, T2: ${month2Details.tenant2Paid ? "✅" : "❌"})`);
    
    callback();
  } catch (error) {
    console.error("❌ ERRORE:", error.message);
    callback(error);
  }
};