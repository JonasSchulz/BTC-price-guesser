import { Guess, GuessTypes } from "../model/guess"

type GuessFormProps = {
  pastGuesses: Array<Guess>
  setPastGuesses: (guesses: Array<Guess>) => void
}

export const GuessForm = (props: GuessFormProps) => {
  const { pastGuesses, setPastGuesses } = props

  const makeGuess = async (guess: GuessTypes) => {
    const response = await fetch("some-url", {
      method: "POST",
      body: JSON.stringify({
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
