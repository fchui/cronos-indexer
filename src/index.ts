// src/index.js
import express, { Express, Request, Response } from "express";
import { EvmChain } from "@moralisweb3/common-evm-utils"
import dotenv from "dotenv";
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { ERC721Transfer } from '../data/erc721Interface';
import Database, { Statement } from 'better-sqlite3';

dotenv.config();

const app: Express = express();

const db = new Database('cronos.db')
db.pragma('journal_mode = WAL');

db.exec("CREATE TABLE IF NOT EXISTS transactions('blocknumber' varchar, 'transactionhash' varchar PRIMARY KEY, 'logindex' integer PRIMARY KEY, senderAddress varchar, receiverAddress varchar, tokenID varchar, contractAddress varchar)")
/*
const stmt = db.prepare('INSERT OR IGNORE INTO users VALUES (?, ?, ?)');
stmt.run('1', '2', '3')
const row : any = db.prepare('SELECT * FROM users WHERE id = ?').get('3');
console.log(row)
*/
const Moralis = require("moralis").default;
const port = process.env.PORT || 3000;

const MORALIS_API_KEY = process.env.MORALISAPIKEY;
const chain = EvmChain.CRONOS;
let latestBlock : number = 0;


function errorMessage(error: unknown) {
  if (error instanceof Error)
    return console.log(error.message)
  return console.log(String(error))
}

async function parseLatestBlock()  {
  try {
    const response = await axios.get(`https://explorer-api.cronos.org/mainnet/api/v1/ethproxy/getBlockNumber?apikey=${process.env.APIKEY}`);
    const users = response.data;
    console.log('Initial block number:');
    console.log(users.result);
    latestBlock = parseInt(users.result.substring(2),16)
  } catch (error) {
    errorMessage(error)
  }
}

const startServer = async () => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
    defaultEvmApiChain: chain,
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

async function getDemoData() {
  setTimeout(getDemoData, 30000);
  let curNumber : number = latestBlock;
  await parseLatestBlock();
  console.log("from-to blocks")
  console.log(curNumber)
  console.log(latestBlock)
  if (curNumber-latestBlock == 0)
  {
    return
  }
  
  try {
    const response = await Moralis.EvmApi.nft.getNFTTransfersFromToBlock({
      "chain": chain,
      "order": "DESC",
      "fromBlock": curNumber,
      "toBlock": latestBlock
    });
    console.log(response.raw)
    if (response.raw.result === undefined || response.raw.result.length == 0)
    {
        console.log('no NFTs detected')
        return
    }

    const stmt = db.prepare('INSERT OR IGNORE INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (let transaction of response.raw.result){
      let tokenTransfer : ERC721Transfer = {
        blockNumber: transaction.block_number,
        transactionHash: transaction.transaction_hash,
        logIndex: transaction.log_index,
        senderAddress: transaction.from_address,
        receiverAddress: transaction.to_address,
        tokenID: transaction.token_id,
        contractAddress: transaction.token_address
      }
    stmt.run(tokenTransfer.blockNumber, tokenTransfer.transactionHash, tokenTransfer.logIndex, tokenTransfer.senderAddress, tokenTransfer.receiverAddress, tokenTransfer.tokenID, tokenTransfer.contractAddress)
    //console.log(tokenTransfer)
    }
  }
  catch (e) {
    console.error(e);
  }
}

parseLatestBlock();
startServer();
setTimeout(getDemoData, 5000);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});