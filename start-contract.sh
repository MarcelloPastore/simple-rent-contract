#!/bin/bash

echo "Starting contract deployment and testing..."

echo "Step 1: Migrating contracts..."
truffle migrate --reset

echo "Step 2: Running tests..."
truffle test

echo "Step 3: Executing force payment script..."
npx truffle exec scripts/force-payment.js

echo "Contract startup completed!"
