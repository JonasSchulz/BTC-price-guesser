import type { Context, APIGatewayProxyStructuredResultV2, APIGatewayProxyEventV2, Handler } from "aws-lambda"

type BtcMarketData = {
  data: {
    bitcoin: {
      quote: {
        EUR: {
          price: number
        }
      }
    }
  }
}

export const handler: Handler = async (
  _event: APIGatewayProxyEventV2,
  _context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const base_path = process.env.CMC_URL || "https://sandbox-api.coinmarketcap.com"
  const api_key = process.env.CMC_API_KEY || "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c"

  const response = await fetch(`${base_path}/v1/cryptocurrency/quotes/latest?slug=bitcoin&convert=EUR`, {
    method: "GET",
    headers: {
      "X-CMC_PRO_API_KEY": api_key,
    },
  })

  const json = (await response.json()) as BtcMarketData

  const priceData = {
    currentPrice: json.data.bitcoin.quote.EUR.price,
    currency: "EUR",
  }

  return {
    statusCode: 200,
    body: JSON.stringify(priceData),
  }
}
