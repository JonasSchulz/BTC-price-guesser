// ./src/lambda1.test.ts
import assert from "node:assert"
import { beforeEach, describe, it } from "node:test"
import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda"
import { mockClient } from "aws-sdk-client-mock"
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { handler } from "./resolveGuesses"

const dynamoMock = mockClient(DynamoDBDocumentClient)

beforeEach(() => {
  dynamoMock.reset()
})

describe("resolveGuesses handler", () => {
  it.skip("resolves any pending guesses when invoked", async (_t) => {
    dynamoMock.on(ScanCommand).resolves({
      Items: [
        {
          user_name: "some-user",
          inserted_at: "1730662299137",
          guess: "decrease",
          price: 0.1234,
          score: -1,
        },
        {
          user_name: "some-user",
          inserted_at: "1730662301474",
          guess: "increase",
          price: 0.4321,
          score: 1,
        },
      ],
    })

    const testEvent = {} as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    const response = await handler(testEvent, testContext, testCallback)

    assert.strictEqual(dynamoMock.commandCalls(ScanCommand).length, 1)
    assert.strictEqual(response.statusCode, 200)
  })
})
