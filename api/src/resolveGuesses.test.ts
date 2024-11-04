// ./src/lambda1.test.ts
import assert from "node:assert"
import { beforeEach, describe, it } from "node:test"
import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda"
import { mockClient } from "aws-sdk-client-mock"
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { handler } from "./resolveGuesses"
import fetchMock from "fetch-mock"

const dynamoMock = mockClient(DynamoDBDocumentClient)

beforeEach(() => {
  dynamoMock.reset()
  fetchMock.unmockGlobal()
})

describe("resolveGuesses handler", () => {
  it("does nothing if there are no pending guesses older than 1 minute", async (_t) => {
    const now = Date.now()

    dynamoMock.on(ScanCommand).resolves({
      Items: [
        {
          user_name: "some-user-1",
          inserted_at: now.toString(),
          guess: "decrease",
          price: 0.1234,
          score: 0,
        },
      ],
    })

    fetchMock.mockGlobal()

    const testEvent = {} as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    await handler(testEvent, testContext, testCallback)

    assert.strictEqual(dynamoMock.commandCalls(ScanCommand).length, 1)
    assert.strictEqual(fetchMock.callHistory.calls().length, 0)
  })

  it("resolves any pending guesses when invoked", async (_t) => {
    const now = Date.now()
    const twoMinutesAgo = now - 2 * 60 * 1000

    dynamoMock.on(ScanCommand).resolves({
      Items: [
        // This guess will not be resolved, it is not old enough
        {
          user_name: "some-user-1",
          inserted_at: now.toString(),
          guess: "decrease",
          price: 0.1234,
          score: 0,
        },
        // this guess will score -1
        {
          user_name: "some-user-2",
          inserted_at: twoMinutesAgo.toString(),
          guess: "increase",
          price: 0.4321,
          score: 0,
        },
        // this guess will score 1
        {
          user_name: "some-user-3",
          inserted_at: twoMinutesAgo.toString(),
          guess: "increase",
          price: 0.1234,
          score: 0,
        },
        // this guess will score -1
        {
          user_name: "some-user-4",
          inserted_at: twoMinutesAgo.toString(),
          guess: "decrease",
          price: 0.1234,
          score: 0,
        },
        // this guess will score 1
        {
          user_name: "some-user-5",
          inserted_at: twoMinutesAgo.toString(),
          guess: "decrease",
          price: 0.4321,
          score: 0,
        },
      ],
    })

    const url = "https://some.url"
    const api_key = "some-api-key"

    process.env.CMC_URL = url
    process.env.CMC_API_KEY = api_key

    fetchMock.mockGlobal().get(
      `${url}/v1/cryptocurrency/quotes/latest?slug=bitcoin&convert=EUR`,
      { data: { bitcoin: { quote: { EUR: { price: 0.2345 } } } } },
      {
        headers: {
          "X-CMC_PRO_API_KEY": api_key,
        },
      },
    )

    const testEvent = {} as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    await handler(testEvent, testContext, testCallback)

    assert.strictEqual(dynamoMock.commandCalls(ScanCommand).length, 1)
    assert.strictEqual(fetchMock.callHistory.calls().length, 1)

    // we expect 4 guesses to be resolved
    assert.strictEqual(dynamoMock.commandCalls(UpdateCommand).length, 4)
    assert.deepStrictEqual(dynamoMock.commandCalls(UpdateCommand)[0].args[0].input.ExpressionAttributeValues, {
      ":resolved_price": 0.2345,
      ":score": -1,
    })
    assert.deepStrictEqual(dynamoMock.commandCalls(UpdateCommand)[0].args[0].input.ExpressionAttributeValues, {
      ":resolved_price": 0.2345,
      ":score": -1,
    })
    assert.deepStrictEqual(dynamoMock.commandCalls(UpdateCommand)[1].args[0].input.ExpressionAttributeValues, {
      ":resolved_price": 0.2345,
      ":score": 1,
    })
    assert.deepStrictEqual(dynamoMock.commandCalls(UpdateCommand)[2].args[0].input.ExpressionAttributeValues, {
      ":resolved_price": 0.2345,
      ":score": -1,
    })
    assert.deepStrictEqual(dynamoMock.commandCalls(UpdateCommand)[3].args[0].input.ExpressionAttributeValues, {
      ":resolved_price": 0.2345,
      ":score": 1,
    })
  })
})
