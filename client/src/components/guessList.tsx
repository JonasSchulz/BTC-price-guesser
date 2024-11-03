import { Guess } from "../model/guess"

type GuessListProps = {
  pastGuesses: Array<Guess>
}

export const GuessList = (props: GuessListProps) => {
  const { pastGuesses } = props
  return (
    <div className="m-4">
      <p className="text-center underline font-bold mb-2">Past guesses</p>
      <ul className="flex flex-col">
        {pastGuesses.map((pastGuess) => {
          const result = pastGuess.result !== null ? pastGuess.result : "waiting for result"

          return (
            <li className="space-y-1 list-disc list-inside p-1">
              {`You guessed: ${pastGuess.guess} - ${result}`}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
