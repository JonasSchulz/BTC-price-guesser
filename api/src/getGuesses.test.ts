// ./src/lambda1.test.ts
import assert from "node:assert"
import { beforeEach, describe, it } from "node:test"
import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda"
import { mockClient } from "aws-sdk-client-mock"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { handler } from "./getGuesses"

const dynamoMock = mockClient(DynamoDBDocumentClient)

beforeEach(() => {
  dynamoMock.reset()
})

describe("getGuesses handler", () => {
  it("errors when no username is provided", async (_t) => {
    const testEvent = {
      queryStringParameters: {
        not_username: "value1",
      },
    } as unknown as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    const response = await handler(testEvent, testContext, testCallback)

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.body, "No username found")
  })

  it("returns the list of existing guesses when invoked", async (_t) => {
    dynamoMock.on(QueryCommand).resolves({
      Items: [
        {
          guess: "decrease",
          inserted_at: "1730662299137",
          result: -1,
          user_name: "Jonas",
        },
        {
          guess: "increase",
          inserted_at: "1730662301474",
          result: 1,
          user_name: "Jonas",
        },
        {
          guess: "increase",
          inserted_at: "1730663650707",
          result: null,
          user_name: "Jonas",
        },
      ],
    })

    const testEvent = {
      queryStringParameters: {
        user_name: "some-user",
      },
    } as unknown as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    const response = await handler(testEvent, testContext, testCallback)

    assert.strictEqual(dynamoMock.commandCalls(QueryCommand).length, 1)
    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(
      response.body,
      JSON.stringify([
        {
          guess: "decrease",
          inserted_at: "1730662299137",
          result: -1,
          user_name: "Jonas",
        },
        {
          guess: "increase",
          inserted_at: "1730662301474",
          result: 1,
          user_name: "Jonas",
        },
        {
          guess: "increase",
          inserted_at: "1730663650707",
          result: null,
          user_name: "Jonas",
        },
      ]),
    )
  })
})
