export interface ERC721Transfer {
    blockNumber: string,
    transactionHash : string,
    logIndex : number,
    senderAddress: string,
    receiverAddress: string,
    tokenID: string,
    contractAddress: string
}