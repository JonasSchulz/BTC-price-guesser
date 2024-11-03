import { useEffect, useState } from "react"
import { API_URL } from "../constants"
import { Guess, GuessTypes } from "../model/guess"

type GuessFormProps = {
  username: string
  setNewGuess: (guess: Guess) => void
  pastGuesses: Array<Guess>
}

export const GuessForm = (props: GuessFormProps) => {
  const { username, setNewGuess, pastGuesses } = props

  const [hasPendingGuess, setHasPendingGuess] = useState(true)

  useEffect(() => {
    console.log(pastGuesses)
    console.log(pastGuesses.some((pastGuess) => pastGuess.result === null))
    setHasPendingGuess(pastGuesses.some((pastGuess) => pastGuess.result === null))
  }, [pastGuesses])

  const makeGuess = async (guess: GuessTypes) => {
    const response = await fetch(`${API_URL}/guesses`, {
      method: "POST",
      body: JSON.stringify({
        user_name: username,
        guess: guess,
      }),
    })

    const newGuess = (await response.json()) as Guess
    setNewGuess(newGuess)
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
      ) : <p className="text-xl text-center">You have a pending guess. It needs to be resolved before you can guess again.</p>}
    </>
  )
}
