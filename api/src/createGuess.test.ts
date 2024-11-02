// ./src/lambda1.test.ts
import assert from "node:assert"
import { describe, it } from "node:test"
import { handler } from "./getBtcPrice"
import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda"

process.env.CUSTOM_VAR = "test_value"

describe("createGuess handler", () => {
  it("saves a new guess for the user when invoked", async (_t) => {
    const testEvent = {} as APIGatewayProxyEventV2
    const testContext = {} as Context
    const testCallback = {} as Callback

    const response = await handler(testEvent, testContext, testCallback)

    assert.strictEqual(response.statusCode, 200)
  })
})
