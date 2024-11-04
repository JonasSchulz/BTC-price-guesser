import { useEffect, useState } from "react"
import { API_URL } from "../constants"

type CurrentBtcPriceProps = {
  setCurrentPrice: (currentPrice: number) => void
}

type CurrentBtcPriceResponse = {
  currency: string
  currentPrice: number
}

export const CurrentBtcPrice = (props: CurrentBtcPriceProps) => {
  const { setCurrentPrice } = props
  const [currentBtcPrice, setCurrentBtcPrice] = useState("")

  useEffect(() => {
    const fetchBtcPrice = async () => {
      const response = await fetch(`${API_URL}/btc/price`)
      const json = (await response.json()) as CurrentBtcPriceResponse

      setCurrentPrice(json.currentPrice)
      setCurrentBtcPrice(`${json.currentPrice} ${json.currency}`)
    }

    fetchBtcPrice()
  }, [setCurrentPrice])

  return (
    <div className="m-4 flex flex-col text-3xl">
      <p className="text-center"> The current price for a Bitcoin is:</p>
      <p className="text-center">{currentBtcPrice}</p>
    </div>
  )
}
