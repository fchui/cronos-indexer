// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Database from 'better-sqlite3';
import { whereStringBuilder } from './services/stringBuilder'
import { startServer, getDemoData } from "./services/Moralis";

dotenv.config();

const app: Express = express();

export const db = new Database('cronos.db')
db.pragma('journal_mode = WAL');

db.exec("CREATE TABLE IF NOT EXISTS transactions('blocknumber' varchar, 'transactionhash' varchar, 'logindex' integer, senderAddress varchar, receiverAddress varchar, tokenID varchar, contractAddress varchar, PRIMARY KEY (transactionhash, logindex))")
const port = process.env.PORT || 3000;

startServer();
setTimeout(getDemoData, 30000);

app.listen(port, () => {
  console.log(`Cronos app listening on port ${port}`);
});

app.get("/", (req: Request, res: Response) => {
  const whereQuery = whereStringBuilder(req.query)
  const row = db.prepare(`SELECT * FROM transactions ${whereQuery} LIMIT 100`).all();
  res.json(row)
});
