# Contratto di Affitto Semplice

Questo progetto implementa un contratto di affitto semplice utilizzando Solidity, permettendo a due conti di pagare l'affitto a un terzo conto. Il contratto è progettato per scopi educativi ed è distribuito su una blockchain locale Ganache.

## Struttura del Progetto

- **contracts/RentContract.sol**: Contiene il contratto smart Solidity che definisce la logica per i pagamenti dell'affitto e il monitoraggio dello stato dell'affitto.
- **migrations/1_deploy_contract.js**: Responsabile della distribuzione del RentContract sulla blockchain Ganache utilizzando il sistema di migrazione di Truffle.
- **test/RentContract.test.js**: Contiene i test per il RentContract, assicurando che il contratto funzioni come previsto.
- **truffle-config.js**: File di configurazione per Truffle, che specifica le impostazioni di rete per Ganache e altre configurazioni necessarie.
- **package.json**: Elenca le dipendenze richieste per il progetto, inclusi Truffle e librerie di test.
- **.gitignore**: Specifica i file e le directory da ignorare da Git, come node_modules e artefatti di build.

## Per Iniziare

### Prerequisiti

- Node.js e npm installati sulla tua macchina.
- Ganache installato e in esecuzione.

### Installazione

1. Clona il repository:
   ```
   git clone <repository-url>
   cd simple-rent-contract
   ```

2. Installa le dipendenze:
   ```
   npm install
   ```

### Esecuzione del Progetto

1. Avvia Ganache.
2. Distribuisci il contratto:
   ```
   truffle migrate
   ```

3. Esegui i test:
   ```
   truffle test
   ```

## Lavori Futuri

Questo progetto è progettato per essere esteso con funzionalità oracle in futuro, consentendo pagamenti di affitto dinamici basati su fonti di dati esterne.

## Licenza

Questo progetto è concesso in licenza sotto la Licenza MIT.