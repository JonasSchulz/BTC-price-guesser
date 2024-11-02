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

//TODO: get these from env vars
const base_path = "https://sandbox-api.coinmarketcap.com"
const api_key = "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c"

export const handler: Handler = async (
  _event: APIGatewayProxyEventV2,
  _context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
  let priceData = undefined

  await fetch(`${base_path}/v1/cryptocurrency/quotes/latest?slug=bitcoin&convert=EUR`, {
    method: "GET",
    headers: {
      "X-CMC_PRO_API_KEY": api_key,
    },
  })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      priceData = {
        currentPrice: (data as BtcMarketData).data.bitcoin.quote.EUR.price,
        currency: "EUR"
      }
    })

  return {
    statusCode: 200,
    body: JSON.stringify(priceData),
  }
}
