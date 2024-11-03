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
    <div>
      <p>Wanna guess what is going to happen to the price?</p>
      <button onClick={() => makeGuess(GuessTypes.increase)}>Increase</button>
      <button onClick={() => makeGuess(GuessTypes.decrease)}>Decrease</button>
    </div>
  )
}
