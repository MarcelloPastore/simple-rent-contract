const RentContract = artifacts.require("RentContract");
const TimeOracle = artifacts.require("TimeOracle");
const PriceOracle = artifacts.require("PriceOracle");
const config = require("../config/addresses");

contract("RentContract", (accounts) => {
  let rentContract, timeOracle, priceOracle;
  const [landlord, tenant1, tenant2] = accounts;
  const rentAmountEur = config.rentAmountEur;
  const initialEthPrice = config.initialEthPrice;

  beforeEach(async () => {
    timeOracle = await TimeOracle.new({ from: landlord });
    priceOracle = await PriceOracle.new(initialEthPrice, { from: landlord });
    rentContract = await RentContract.new(
      landlord, tenant1, tenant2, rentAmountEur,
      timeOracle.address, priceOracle.address,
      { from: landlord }
    );
  });

  it("Test dei valori", async () => {
    assert.equal(await rentContract.landlord(), landlord);
    assert.equal(await rentContract.tenant1(), tenant1);
    assert.equal(await rentContract.tenant2(), tenant2);
    assert.equal(await rentContract.rentAmountEur(), rentAmountEur);
  });

  it("Test conversione in wei", async () => {
    const rentInWei = await rentContract.getCurrentRentInWei();
    const expectedWei = web3.utils.toWei((rentAmountEur / initialEthPrice).toString(), "ether");
    assert.equal(rentInWei.toString(), expectedWei);
  });

  it("Test pagamento", async () => {
    const rentInWei = await rentContract.getCurrentRentInWei();
    await rentContract.payCurrentMonthRent({ from: tenant1, value: rentInWei });
    await rentContract.payCurrentMonthRent({ from: tenant2, value: rentInWei });
    assert.equal(await rentContract.isCurrentRentPaid(), true);
  });

  it("Test rifiuto pagamento", async () => {
    const rentInWei = await rentContract.getCurrentRentInWei();
    await rentContract.payCurrentMonthRent({ from: tenant1, value: rentInWei });
    
    try {
      await rentContract.payCurrentMonthRent({ from: tenant1, value: rentInWei });
      assert.fail("Errore, il pagamento dovrebbe fallire");
    } catch (error) {
      assert.include(error.message, "Affitto pagato per questo mese");
    }
  });

  it("Test modifica costo affitto", async () => {
    const newPrice = 400000;
    await priceOracle.updatePrice(newPrice, { from: landlord });
    const rentInWei = await rentContract.getCurrentRentInWei();
    const expectedWei = web3.utils.toWei((rentAmountEur / newPrice).toString(), "ether");
    assert.equal(rentInWei.toString(), expectedWei);
  });

  it("Test pagamento incompleto", async () => {
    const rentInWei = await rentContract.getCurrentRentInWei();
    const currentMonth = await rentContract.getCurrentMonth();
    
    await rentContract.payCurrentMonthRent({ from: tenant1, value: rentInWei });

    assert.equal(await rentContract.isTenantPaidForMonth(tenant1, currentMonth), true);
    assert.equal(await rentContract.isTenantPaidForMonth(tenant2, currentMonth), false);
    assert.equal(await rentContract.isCurrentRentPaid(), false);
  });
});