import { useEffect, useState } from "react"

const base_path = "https://9bd0qh6986.execute-api.eu-central-1.amazonaws.com"

type CurrentBtcPriceResponse = {
  currency: string
  currentPrice: number
}

export const CurrentBtcPrice = () => {
  const [currentBtcPrice, setCurrentBtcPrice] = useState("")

  useEffect(() => {
    const fetchBtcPrice = async () => {
      const response = await fetch(`${base_path}/btc/price`)
      const json = (await response.json()) as CurrentBtcPriceResponse
  
      setCurrentBtcPrice(`${json.currentPrice} ${json.currency}`)
    }

    fetchBtcPrice()
  }, [])

  return <h1>{currentBtcPrice}</h1>
}
