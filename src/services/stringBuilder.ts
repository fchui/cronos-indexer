import QueryString from "qs";

export function whereStringBuilder(queries: QueryString.ParsedQs) {
    let stringBuild : Array<string> = []
    if (queries.logindex !== null && typeof queries.logindex == "string" && queries.logindex != '')
    {
      stringBuild.push(`logindex = ${queries.logindex}`)
    }
    if (queries.blocknumber !== null && typeof queries.blocknumber === "string" && queries.blocknumber != '')
    {
      stringBuild.push(`blocknumber = ${queries.blocknumber}`)
    }
    if (queries.transactionhash !== null && typeof queries.transactionhash === "string" && queries.transactionhash != '')
    {
      stringBuild.push(`transactionhash = ${queries.transactionhash}`)
    }
    if (queries.senderAddress !== null && typeof queries.senderAddress === "string" && queries.senderAddress != '')
    {
      stringBuild.push(`senderAddress = ${queries.senderAddress}`)
    }
    if (queries.receiverAddress !== null && typeof queries.receiverAddress === "string" && queries.receiverAddress != '')
    {
      stringBuild.push(`receiverAddress = ${queries.receiverAddress}`)
    }
    if (queries.tokenID !== null && typeof queries.tokenID === "string" && queries.tokenID != '')
    {
      stringBuild.push(`tokenID = ${queries.tokenID}`)
    }
    if (queries.contractAddress !== null && typeof queries.contractAddress === "string" && queries.contractAddress != '')
    {
      stringBuild.push(`contractAddress = ${queries.contractAddress}`)
    }
    if (stringBuild.length == 0)
    {
      return ''
    }
    else
    {
      let result : string = 'WHERE '
      result = result.concat(stringBuild[0])
      for (let i = 1; i < stringBuild.length; i++)
      {
        result = result.concat(` AND ${stringBuild[i]}`)
      }
      console.log(result)
      return result
    }
}