// ./src/lambda1.test.ts
import assert from "node:assert"
import { describe, it } from "node:test"
import { handler } from "./getBtcPrice"
import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda"

process.env.CUSTOM_VAR = "test_value"

describe("getBtcPrice handler", () => {
  it("retrieves the current BTC price when invoked", async (_t) => {
    const testEvent = {} as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    const response = await handler(testEvent, testContext, testCallback)

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(response.body.currency, "EUR")
    assert.strictEqual(typeof response.body.currentPrice, "number")
  })
})
