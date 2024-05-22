import dotenv from "dotenv";
import { EvmChain } from "@moralisweb3/common-evm-utils"
import { parseLatestBlock } from "./blockParse";
import { db } from "..";
import { ERC721Transfer } from "../data/erc721Interface";

dotenv.config();
const Moralis = require("moralis").default;

const MORALIS_API_KEY = process.env.MORALISAPIKEY;
const chain = EvmChain.CRONOS;
let latestBlock : number | undefined = 0;

export const startServer = async () => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
    defaultEvmApiChain: chain,
  });
  
};

export async function getDemoData() {
  setTimeout(getDemoData, 30000);
  if (typeof latestBlock == "undefined")
  {
    latestBlock = await parseLatestBlock();
    return
  }
  let curNumber : number = latestBlock;
  latestBlock = await parseLatestBlock();
  if (typeof latestBlock == "undefined" || curNumber-latestBlock == 0)
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