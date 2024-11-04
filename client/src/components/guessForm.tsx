import { useEffect, useState } from "react"
import { API_URL } from "../constants"
import { Guess, GuessTypes, Scores } from "../model/guess"

type GuessFormProps = {
  username: string
  currentPrice: number
  pageRefreshes: number
  setPageRefreshes: (refreshGueses: number) => void
  pastGuesses: Array<Guess>
}

export const GuessForm = (props: GuessFormProps) => {
  const { username, currentPrice, pageRefreshes, setPageRefreshes, pastGuesses } = props

  const [hasPendingGuess, setHasPendingGuess] = useState(true)

  useEffect(() => {
    setHasPendingGuess(pastGuesses.some((pastGuess) => pastGuess.score === Scores.unresolved))
  }, [pastGuesses])

  const makeGuess = async (guess: GuessTypes) => {
    await fetch(`${API_URL}/guesses`, {
      method: "POST",
      body: JSON.stringify({
        user_name: username,
        guess: guess,
        price: currentPrice,
      }),
    })

    setPageRefreshes(pageRefreshes + 1)
  }

  return (
    <>
      {!hasPendingGuess ? (
        <div className="m-4 flex flex-col">
          <p className="text-center">Wanna guess what is going to happen to the price?</p>
          <div className="flex flex-row p-2">
            <button
              className="basis-1/2 border-2 border-black rounded-md m-1 p-1"
              onClick={() => makeGuess(GuessTypes.increase)}
            >
              Increase
            </button>
            <button
              className="basis-1/2 border-2 border-black rounded-md m-1 p-1"
              onClick={() => makeGuess(GuessTypes.decrease)}
            >
              Decrease
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xl text-center">
          You have a pending guess. It needs to be resolved before you can guess again.
        </p>
      )}
    </>
  )
}
