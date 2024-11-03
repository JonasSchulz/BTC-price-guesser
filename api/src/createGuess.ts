import type { Context, APIGatewayProxyStructuredResultV2, APIGatewayProxyEventV2, Handler } from "aws-lambda"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)

const TABLE_NAME = "GuessesTable"

type CreateGuessBody = {
  user_name: string
  guess: string
}

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  _context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: "No request body found",
    }
  } else {
    const requestBody: CreateGuessBody = JSON.parse(event.body)

    await dynamo.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          user_name: requestBody.user_name,
          inserted_at: Date.now().toString(),
          guess: requestBody.guess,
        },
      }),
    )

    return {
      statusCode: 200,
      body: "success",
    }
  }
}
