import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import type { Context, APIGatewayProxyStructuredResultV2, APIGatewayProxyEventV2, Handler } from "aws-lambda"

const client = new DynamoDBClient({})
const dbClient = DynamoDBDocumentClient.from(client)

export const handler: Handler = async (
  _event: APIGatewayProxyEventV2,
  _context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
  // scan DB for any pending guesses older than 1 minute
  const input: ScanCommandInput = {
    TableName: "GuessesTable",
    FilterExpression: "attribute_not_exists(score) or score = :null",
    ExpressionAttributeValues: marshall({
      ":null": null,
    }),
  }

  const command = new ScanCommand(input)
  const response = await dbClient.send(command)

  console.log(response)
  // if there are pending guesses, get the current BTC price

  // score any pending guesses

  return {
    statusCode: 200,
    body: "",
  }
}
