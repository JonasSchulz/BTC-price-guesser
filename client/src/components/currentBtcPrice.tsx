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

  return (
    <div className="m-4 flex flex-col text-3xl">
      <p className="text-center"> The current price for a Bitcoin is:</p>
      <p className="text-center">{currentBtcPrice}</p>
    </div>
  )
}
