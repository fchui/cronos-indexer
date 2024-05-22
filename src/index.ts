// src/index.js
import express, { Express, Request, Response } from "express";
import { EvmChain } from "@moralisweb3/common-evm-utils"
import dotenv from "dotenv";
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import Database, { Statement } from 'better-sqlite3';
import { ERC721Transfer } from './data/erc721Interface';
import { whereStringBuilder } from './services/stringBuilder'

dotenv.config();

const app: Express = express();

const db = new Database('cronos.db')
db.pragma('journal_mode = WAL');

db.exec("CREATE TABLE IF NOT EXISTS transactions('blocknumber' varchar, 'transactionhash' varchar, 'logindex' integer, senderAddress varchar, receiverAddress varchar, tokenID varchar, contractAddress varchar, PRIMARY KEY (transactionhash, logindex))")
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
    //console.log(response.raw)
    
    if (response.raw.result === undefined || response.raw.result.length == 0)
    {
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
    }
  }
  catch (e) {
    console.error(e);
  }
}

parseLatestBlock();
startServer();
setTimeout(getDemoData, 30000);

app.get("/", (req: Request, res: Response) => {
  const whereQuery = whereStringBuilder(req.query)
  const row = db.prepare(`SELECT * FROM transactions ${whereQuery} LIMIT 100`).all();
  res.json(row)
});