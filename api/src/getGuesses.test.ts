// ./src/lambda1.test.ts
import assert from "node:assert"
import { beforeEach, describe, it } from "node:test"
import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda"
import { mockClient } from "aws-sdk-client-mock"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { handler } from "./getGuesses"

const dynamoMock = mockClient(DynamoDBDocumentClient)

beforeEach(() => {
  dynamoMock.reset()
})

describe("getGuesses handler", () => {
  it("errors when no username is provided", async (_t) => {
    const testEvent = {} as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    const response = await handler(testEvent, testContext, testCallback)

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.body, "No username found")
  })

  //   it("saves a new guess for the user when invoked", async (_t) => {
  //     dynamoMock.on(PutCommand).resolves({})

  //     const testEvent = {
  //       body: JSON.stringify({
  //         user_name: "some-username",
  //         guess: "some-guess",
  //       }),
  //     } as APIGatewayProxyEventV2
  //     const testContext = {} as Context
  //     const testCallback = {} as Callback

  //     const response = await handler(testEvent, testContext, testCallback)

  //     assert.strictEqual(response.statusCode, 200)
  //   })
})
