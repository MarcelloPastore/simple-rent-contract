# Simple Rent Contract with Time Oracle

Questo progetto è uno smart contract in Solidity per la gestione di affitti mensili tra due inquilini e un proprietario, con tracciamento automatico dei mesi tramite oracolo temporale.

## Come provare il progetto

1. **Scarica e installa Ganache** (versione desktop consigliata):
   https://trufflesuite.com/ganache/

2. **Avvia Ganache** e assicurati che sia in ascolto sulla porta 8545 (default) oppure 7545 (modifica la porta in `truffle-config.js` se necessario).

3. **Copia gli account generati da Ganache** e inseriscili nel file `config/addresses.js`:
   - landlord: indirizzo del proprietario
   - tenant1: indirizzo del primo inquilino
   - tenant2: indirizzo del secondo inquilino

4. **Installa le dipendenze** del progetto:
   ```bash
   npm install
   ```

5. **Avvia lo script automatico**:
   ```bash
   ./start-contract.sh
   ```
   Questo script:
   - attende che Ganache sia attivo
   - esegue la migrazione dei contratti
   - lancia i test automatici
   - esegue uno script di esempio di pagamento

## Come funziona il progetto

Il contratto permette a due inquilini di pagare la propria quota mensile di affitto a un proprietario. Il pagamento di ogni mese viene tracciato individualmente per ciascun inquilino e il mese risulta saldato solo quando entrambi hanno pagato. Il proprietario può aggiornare gli oracoli tramite funzioni dedicate. Tutti i pagamenti e lo stato sono consultabili tramite funzioni pubbliche. Il sistema è pensato per essere facilmente estendibile e integrabile con un front-end o altri sistemi.

## Licenza

MIT License - vedi file LICENSE per dettagli.