const RentContract = artifacts.require("RentContract");

contract("RentContract", accounts => {
    const [landlord, tenant1, tenant2] = accounts;
    let rentContract;

    beforeEach(async () => {
        const rentAmount = web3.utils.toWei("0.375", "ether"); // Importo dell'affitto in wei
        rentContract = await RentContract.new(landlord, tenant1, tenant2, rentAmount); // Passa tutti i parametri richiesti
    });

    it("should allow tenants to pay rent", async () => {
        const rentAmount = web3.utils.toWei("0.375", "ether");

        // Primo affittuario paga l'affitto
        await rentContract.payRent({ from: tenant1, value: rentAmount });

        // Verifica che l'affitto sia stato pagato
        const rentPaid = await rentContract.rentPaid();
        assert.equal(rentPaid, true, "Rent should be marked as paid");

        // Prova a far pagare il secondo affittuario (dovrebbe fallire)
        try {
            await rentContract.payRent({ from: tenant2, value: rentAmount });
            assert.fail("Second tenant should not be able to pay rent after it has already been paid");
        } catch (error) {
            assert(error.message.includes("revert"), "Expected revert error not received");
        }
    });

    it("should track rental status correctly", async () => {
        const rentAmount = web3.utils.toWei("0.375", "ether");

        await rentContract.payRent({ from: tenant1, value: rentAmount });
        const rentPaid = await rentContract.rentPaid();
        assert.equal(rentPaid, true, "Rent should be marked as paid");
    });

    it("should not allow payments from non-tenants", async () => {
        const rentAmount = web3.utils.toWei("0.375", "ether");

        try {
            await rentContract.payRent({ from: landlord, value: rentAmount });
            assert.fail("Landlord should not be able to pay rent");
        } catch (error) {
            assert(error.message.includes("revert"), "Expected revert error not received");
        }
    });
});