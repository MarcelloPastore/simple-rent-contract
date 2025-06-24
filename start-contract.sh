#!/bin/bash

echo "--- Avvio del contratto ---"

while ! nc -z localhost 8545; do
    sleep 1
done
echo "✅ Ganache avviato con successo!"

truffle migrate --reset
truffle test

echo "--- Forza il pagamento ---"
npx truffle exec scripts/force-payment.js

echo "Startup completato!"
