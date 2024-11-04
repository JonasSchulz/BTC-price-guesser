import type { Context, APIGatewayProxyStructuredResultV2, APIGatewayProxyEventV2, Handler } from "aws-lambda"
import { getBtcPrice } from "./common/btcPriceFetcher"

export const handler: Handler = async (
  _event: APIGatewayProxyEventV2,
  _context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const price = await getBtcPrice()

  const priceData = {
    currentPrice: price,
    currency: "USD",
  }

  return {
    statusCode: 200,
    body: JSON.stringify(priceData),
  }
}
