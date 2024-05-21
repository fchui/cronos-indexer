// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

function errorMessage(error: unknown) {
  if (error instanceof Error)
    return console.log(error.message)
  return console.log(String(error))
}

async function fetchUsers() {
  try {
    const response = await axios.get(`https://explorer-api.cronos.org/mainnet/api/v1/ethproxy/getBlockNumber?apikey=${process.env.APIKEY}`);
    const users = response.data;
    console.log('Initial block number:');
    console.log(users.result);
    console.log(parseInt(users.result.substring(2),16))
  } catch (error) {
    errorMessage(error)
  }
}

const myLogger = function (req: Request, res: Response, next: Function) {
  console.log('LOGGED')
  fetchUsers();
}

app.use(myLogger)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});