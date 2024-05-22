import dotenv from "dotenv";
import axios from 'axios';
import { errorMessage } from './errormessage';

dotenv.config()

export async function parseLatestBlock()  {
    try {
      const response = await axios.get(`https://explorer-api.cronos.org/mainnet/api/v1/ethproxy/getBlockNumber?apikey=${process.env.APIKEY}`);
      const users = response.data;
      return parseInt(users.result.substring(2),16)
    } catch (error) {
      errorMessage(error)
    }
}