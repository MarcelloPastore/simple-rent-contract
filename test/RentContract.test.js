const RentContract = artifacts.require("RentContract");
const TimeOracle = artifacts.require("TimeOracle");
const PriceOracle = artifacts.require("PriceOracle");
const config = require("../config/addresses");

contract("RentContract", (accounts) => {
  let rentContract;
  let timeOracle;
  let priceOracle;
  const landlord = accounts[0];
  const tenant1 = accounts[1];
  const tenant2 = accounts[2];
  const rentAmountEur = config.rentAmountEur;
  const initialEthPrice = config.initialEthPrice;

  beforeEach(async () => {
    timeOracle = await TimeOracle.new({ from: landlord });
    priceOracle = await PriceOracle.new(initialEthPrice, { from: landlord });
    rentContract = await RentContract.new(
      landlord,
      tenant1,
      tenant2,
      rentAmountEur,
      timeOracle.address,
      priceOracle.address,
      { from: landlord }
    );
  });

  describe("Deployment", () => {
    it("should set correct values", async () => {
      assert.equal(await rentContract.landlord(), landlord);
      assert.equal(await rentContract.tenant1(), tenant1);
      assert.equal(await rentContract.tenant2(), tenant2);
      assert.equal(await rentContract.rentAmountEur(), rentAmountEur);
    });

    it("should calculate rent in wei", async () => {
      const rentInWei = await rentContract.getCurrentRentInWei();
      const expectedWei = web3.utils.toWei("0.4", "ether");
      assert.equal(rentInWei.toString(), expectedWei);
    });
  });

  describe("Payment", () => {
    it("should allow both tenants to pay", async () => {
      const rentInWei = await rentContract.getCurrentRentInWei();
      
      await rentContract.payCurrentMonthRent({ from: tenant1, value: rentInWei });
      await rentContract.payCurrentMonthRent({ from: tenant2, value: rentInWei });

      const isPaid = await rentContract.isCurrentRentPaid();
      assert.equal(isPaid, true);
    });

    it("should not allow double payment", async () => {
      const rentInWei = await rentContract.getCurrentRentInWei();
      await rentContract.payCurrentMonthRent({ from: tenant1, value: rentInWei });

      try {
        await rentContract.payCurrentMonthRent({ from: tenant1, value: rentInWei });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "You already paid for this month");
      }
    });

    it("should not allow insufficient payment", async () => {
      try {
        await rentContract.payCurrentMonthRent({ 
          from: tenant1, 
          value: web3.utils.toWei("0.1", "ether")
        });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Insufficient payment amount");
      }
    });

    it("should not allow non-tenants to pay", async () => {
      const rentInWei = await rentContract.getCurrentRentInWei();
      try {
        await rentContract.payCurrentMonthRent({ from: accounts[9], value: rentInWei });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Only tenants can pay rent");
      }
    });
  });

  describe("Oracle Management", () => {
    it("should update price and recalculate rent", async () => {
      await priceOracle.updatePrice(400000, { from: landlord });
      const rentInWei = await rentContract.getCurrentRentInWei();
      const expectedWei = web3.utils.toWei("0.2", "ether");
      assert.equal(rentInWei.toString(), expectedWei);
    });

    it("should allow landlord to update rent amount", async () => {
      await rentContract.updateRentAmount(50000, { from: landlord });
      const updatedRent = await rentContract.rentAmountEur();
      assert.equal(updatedRent, 50000);
    });

    it("should not allow non-landlord updates", async () => {
      try {
        await rentContract.updateRentAmount(50000, { from: tenant1 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Only landlord can call this function");
      }
    });
  });

  describe("Two Tenant Features", () => {
    it("should track individual payments", async () => {
      const rentInWei = await rentContract.getCurrentRentInWei();
      const currentMonth = await rentContract.getCurrentMonth();
      
      await rentContract.payCurrentMonthRent({ from: tenant1, value: rentInWei });

      const tenant1Paid = await rentContract.isTenantPaidForMonth(tenant1, currentMonth);
      const tenant2Paid = await rentContract.isTenantPaidForMonth(tenant2, currentMonth);
      const fullyPaid = await rentContract.isCurrentRentPaid();

      assert.equal(tenant1Paid, true);
      assert.equal(tenant2Paid, false);
      assert.equal(fullyPaid, false);
    });

    it("should enforce tenant assignment", async () => {
      const rentInWei = await rentContract.getCurrentRentInWei();
      const currentMonth = await rentContract.getCurrentMonth();
      
      await rentContract.assignTenantForMonth(currentMonth, tenant1, { from: landlord });
      
      try {
        await rentContract.payCurrentMonthRent({ from: tenant2, value: rentInWei });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Wrong tenant for this month");
      }
    });
  });
});