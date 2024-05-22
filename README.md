# cronos-indexer
Take Home assignment for Cronos Labs

Thanks for taking an interest in my program and job application!

I finished the implementation as requested in the assignment. Did not do any bonus implementation. This indexer features real-time indexing of the Cronos blockchain, filtering for ERC-721 token transfers and storing them in a database. Data can be queried as well.

## Setup
1. Setup API keys following guides from https://explorer-api-doc.cronos.org/mainnet/ and https://docs.moralis.io/2.0/web3-data-api/evm/get-your-api-key
2. Create a `.env` file and inside the file insert these secrets (port number is optional and defaulted to 3000 in the code):
```
    CRONOSEXPLORERAPIKEY={cronos api key}
    MORALISAPIKEY={moralis api key}
    PORT={port number}
```
3. Run the command `npm install` in any CLI inside root folder.
4. Run the command  `npm run dev`, which will open up the server
5. There will be a message like `Cronos app listening on port {portNumber}`  in the console, you can connect to this server on any web browser using the link `localhost:{portNumber}`

## Queries
An example query: `http://localhost:3000/?blocknumber=14051425&logindex=10`

The code has query support for all the parameters and supports AND statements:
- blocknumber
- transactionhash
- logindex
- senderAddress
- receiverAddress
- tokenID
- contractAddress

## Database
The current database uses SQLite which comes with the advantage of being simple setup (since I really wanted to avoid the usage of more API keys). In the short span and size of the assignment, I believe it was reasonable to use this.

My thoughts were that in a bigger scale where you hold the entire blockchain, perhaps a bigger noSQL database like MongoDB made more sense.

## API Keys
The code uses two API keys to grab data. I wanted to use one API key from cronos explorer as they allow for many API accesses. Unfortunately I was unable to parse ERC-721 information using this API, which brought me to bring Moralis. 

The code is basically a poller that checks for block number differences every 30 seconds (can be shortened to simulate real time). If there is a difference, it will grab all the ERC-721 transactions. Simply put the API keys roles are:

- Cronos Explorer: Checks for block differences
- Moralis: Grabs ERC-721 transactions
