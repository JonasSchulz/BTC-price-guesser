import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"
import type { Context, APIGatewayProxyStructuredResultV2, APIGatewayProxyEventV2, Handler } from "aws-lambda"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

type GetGuessesParams = {
  user_name: string
}

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  _context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const username = (event.queryStringParameters as GetGuessesParams).user_name

  // if (!username)
  //   return {
  //     statusCode: 400,
  //     body: "No username found",
  //   }

  // return {
  //   statusCode: 200,
  //   body: "No username found",
  // }

  const command = new QueryCommand({
    TableName: "GuessesTable",
    KeyConditionExpression: "user_name = :user_name",
    ExpressionAttributeValues: {
      ":user_name": username,
    },
  })

  const response = await docClient.send(command)
  console.log(response)
  return {
    statusCode: 200,
    body: "response",
  }
}
