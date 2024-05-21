// src/index.js
import express, { Express, Request, Response } from "express";
import { EvmChain } from "@moralisweb3/common-evm-utils"
import dotenv from "dotenv";
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

dotenv.config();

const app: Express = express();
const Moralis = require("moralis").default;
const port = process.env.PORT || 3000;

const MORALIS_API_KEY = process.env.MORALISAPIKEY;
const address = "cronos.org";
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
      "chain": "0x19",
      "order": "DESC",
      "fromBlock": curNumber,
      "toBlock": latestBlock
    });
    console.log(response.raw)
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