import { useEffect, useState } from "react"
import { API_URL } from "../constants"

type CurrentBtcPriceResponse = {
  currency: string
  currentPrice: number
}

export const CurrentBtcPrice = () => {
  const [currentBtcPrice, setCurrentBtcPrice] = useState("")

  useEffect(() => {
    const fetchBtcPrice = async () => {
      const response = await fetch(`${API_URL}/btc/price`)
      const json = (await response.json()) as CurrentBtcPriceResponse
  
      setCurrentBtcPrice(`${json.currentPrice} ${json.currency}`)
    }

    fetchBtcPrice()
  }, [])

  return <h1>{currentBtcPrice}</h1>
}
