# Simple Rent Contract with Time Oracle

A Solidity smart contract system for managing monthly rent payments between landlords and tenants, enhanced with a time oracle for automated monthly payment tracking.

## Features

- Dual Tenant Support: Each tenant pays their share, tracked individually. The month is marked as paid only when both have paid.
- **Time Oracle Integration**: Automatic month tracking based on blockchain timestamps
- **Monthly Payment Tracking**: Prevents double payments and tracks payment history for each tenant
- **Tenant Assignment**: Landlord can assign specific tenants to specific months
- **Late Payment Detection**: Automatic detection of late payments
- **Secure Payments**: Direct transfers to landlord upon successful payment

## Contracts

### RentContract
Main contract handling rent payments and tenant management.

**Key Functions:**
- `payRent(uint month)`: Each tenant pays for a month, tracked individually.
- `payCurrentMonthRent()`: Pay rent for the current month
- `isRentPaid(uint month)`: True only if both tenants have paid for the month.
- `isTenantPaidForMonth(address tenant, uint month)`: Check if a tenant has paid for a month.
- `isCurrentRentPaid()`: Check if current month's rent is paid
- `isRentLate(uint month)`: Check if payment is late
- `assignTenantForMonth(uint month, address tenant)`: Assign specific tenant to a month

### TimeOracle
Oracle contract providing time-based functionality.

**Key Functions:**
- `getCurrentMonth()`: Get current month number
- `isPaymentDue(uint month)`: Check if payment is due
- `isPaymentLate(uint month)`: Check if payment is late
- `updateBaseTimestamp(uint timestamp)`: Update base timestamp (owner only)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start Ganache or local blockchain:
```bash
ganache-cli
```

3. Compile contracts:
```bash
npm run compile
```

4. Run migrations:
```bash
npm run migrate
```

5. Run tests:
```bash
npm test
```

## Usage Example

```javascript
// Deploy contracts
const timeOracle = await TimeOracle.new();
const rentContract = await RentContract.new(
  landlordAddress,
  tenant1Address,
  tenant2Address,
  rentAmount,
  timeOracle.address
);

// Pay current month's rent
await rentContract.payCurrentMonthRent({ 
  from: tenant1Address, 
  value: rentAmount 
});

// Check if rent is paid
const isPaid = await rentContract.isCurrentRentPaid();
console.log("Rent paid:", isPaid);
```

## Testing

The project includes comprehensive tests covering:
- Contract deployment and initialization
- Time oracle integration
- Rent payment functionality
- Tenant assignment features
- Oracle management
- Edge cases and error handling

Run tests with:
```bash
npm test
```

## Security Features

- **Access Control**: Only landlords can manage oracle and tenant assignments
- **Payment Validation**: Ensures correct rent amount and prevents overpayment
- **Double Payment Prevention**: Prevents multiple payments for the same month
- **Time Validation**: Ensures payments are only made when due

## Network Configuration

The project is configured for:
- Local development (Ganache)
- Testnet deployment ready
- Solidity 0.8.0 compatibility

## License

MIT License - see LICENSE file for details.