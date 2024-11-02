import type { Context, APIGatewayProxyStructuredResultV2, APIGatewayProxyEventV2, Handler } from "aws-lambda"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)

const TABLE_NAME = "GuessesTable"

export const handler: Handler = async (
  _event: APIGatewayProxyEventV2,
  _context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {

  await dynamo.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        user_name: "some-test-user",
        inserted_at: Date.now(),
      },
    })
  );

  return {
    statusCode: 200,
    body: 'success'
  }
}
