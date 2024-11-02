import { Guess } from "../model/guess"

type GuessListProps = {
  pastGuesses: Array<Guess>
}

export const GuessList = (props: GuessListProps) => {
  const { pastGuesses } = props
  return (
    <div>
      <p>Past guesses</p>
      <ul>
        {pastGuesses.map((pastGuess) => {
          const result = pastGuess.result !== null ? pastGuess.result : "waiting for result"
          
          return <li>{`Guess: ${pastGuess.guess} - ${result}`}</li>
        })}
      </ul>
    </div>
  )
}
