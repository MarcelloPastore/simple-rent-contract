#!/bin/bash

echo "--- Avvio del contratto ---"

cd ../Applications/ganache
./ganache-2.7.1-linux-x86_64.AppImage &
cd ../../simple-rent-contract

while ! nc -z localhost 8545; do
    sleep 1
done
echo "✅ Ganache avviato con successo!"

truffle migrate --reset
truffle test

echo "--- Forza il pagamento ---"
npx truffle exec scripts/force-payment.js

echo "Startup completato!"
