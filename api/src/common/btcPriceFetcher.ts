import { BtcMarketData, SandboxBtcMarketData } from "./model"

export const getBtcPrice = async () => {
  const base_path = process.env.CMC_URL || "https://sandbox-api.coinmarketcap.com"
  const api_key = process.env.CMC_API_KEY || "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c"

  const response = await fetch(`${base_path}/v1/cryptocurrency/quotes/latest?slug=bitcoin&convert=USD`, {
    method: "GET",
    headers: {
      "X-CMC_PRO_API_KEY": api_key,
    },
  })

  if (base_path.includes("sandbox")) {
    const json = (await response.json()) as SandboxBtcMarketData

    return json.data.bitcoin.quote.USD.price
  } else {
    const json = (await response.json()) as BtcMarketData

    return json.data["1"].quote.USD.price
  }
}
