// ./src/lambda1.test.ts
import assert from "node:assert"
import { beforeEach, describe, it } from "node:test"
import { handler } from "./getBtcPrice"
import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda"
import { mockClient } from "aws-sdk-client-mock"
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import fetchMock from "fetch-mock"

const dynamoMock = mockClient(DynamoDBDocumentClient)

beforeEach(() => {
  dynamoMock.reset()
  fetchMock.unmockGlobal()
})

describe("getBtcPrice handler", () => {
  it("retrieves the current BTC price when invoked", async (_t) => {
    const url = "https://some.url"
    const api_key = "some-api-key"

    process.env.CMC_URL = url
    process.env.CMC_API_KEY = api_key

    fetchMock.mockGlobal().get(
      `${url}/v1/cryptocurrency/quotes/latest?slug=bitcoin&convert=EUR`,
      { data: { bitcoin: { quote: { EUR: { price: 0.1234 } } } } },
      {
        headers: {
          "X-CMC_PRO_API_KEY": api_key,
        },
      },
    )

    const testEvent = {} as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    const response = await handler(testEvent, testContext, testCallback)

    const responseBody = JSON.parse(response.body)

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(responseBody.currency, "EUR")
    assert.strictEqual(responseBody.currentPrice, 0.1234)
  })
})
