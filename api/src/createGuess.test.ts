// ./src/lambda1.test.ts
import assert from "node:assert"
import { beforeEach, describe, it } from "node:test"
import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda"
import { handler } from "./createGuess"
import { mockClient } from "aws-sdk-client-mock"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"

process.env.CUSTOM_VAR = "test_value"

const dynamoMock = mockClient(DynamoDBDocumentClient)

beforeEach(() => {
  dynamoMock.reset()
})

describe("createGuess handler", () => {
  it("errors when no body is provided", async (_t) => {
    const testEvent = {
      body: undefined,
    } as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    const response = await handler(testEvent, testContext, testCallback)

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.body, "No request body found")
  })

  it("saves a new guess for the user when invoked", async (_t) => {
    dynamoMock.on(PutCommand).resolves({})

    const testEvent = {
      body: JSON.stringify({
        user_name: "some-username",
        guess: "some-guess",
      }),
    } as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    const response = await handler(testEvent, testContext, testCallback)

    assert.strictEqual(response.statusCode, 200)
  })
})
