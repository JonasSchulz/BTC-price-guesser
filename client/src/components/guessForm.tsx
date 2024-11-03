import { API_URL } from "../constants"
import { Guess, GuessTypes } from "../model/guess"

type GuessFormProps = {
  username: string
  pastGuesses: Array<Guess>
  setPastGuesses: (guesses: Array<Guess>) => void
}

export const GuessForm = (props: GuessFormProps) => {
  const { username, pastGuesses, setPastGuesses } = props

  const makeGuess = async (guess: GuessTypes) => {
    const response = await fetch(`${API_URL}/guesses`, {
      method: "POST",
      body: JSON.stringify({
        user_name: username,
        guess: guess,
      }),
    })

    const newGuess = (await response.json()) as Guess
    setPastGuesses([newGuess, ...pastGuesses])
  }

  return (
    <div className="m-4 flex flex-col">
      <p className="text-center">Wanna guess what is going to happen to the price?</p>
      <div className="flex flex-row p-2">
        <button className="basis-1/2 border-2 border-black rounded-md m-1 p-1" onClick={() => makeGuess(GuessTypes.increase)}>Increase</button>
        <button className="basis-1/2 border-2 border-black rounded-md m-1 p-1" onClick={() => makeGuess(GuessTypes.decrease)}>Decrease</button>
      </div>
    </div>
  )
}
