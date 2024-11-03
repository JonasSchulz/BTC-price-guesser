import { useEffect, useState } from "react"
import { Guess, ResultScores } from "../model/guess"
import { API_URL } from "../constants"

type GuessListProps = {
  username: string
  newGuess: Guess | undefined
}

const buildResultString = (result: ResultScores | null) => {
  if (result === null) return "waiting for result"

  switch (result) {
    case ResultScores.correct: {
      return "result: +1"
    }
    case ResultScores.incorrect: {
      return "result: -1"
    }
  }
}

export const GuessList = (props: GuessListProps) => {
  const { newGuess, username } = props

  const [pastGuesses, setPastGuesses] = useState<Array<Guess>>([])

  useEffect(() => {
    const fetchPastGuesses = async () => {
      const query_params = new URLSearchParams({
        user_name: username,
      }).toString()

      const response = await fetch(`${API_URL}/guesses?${query_params.toString()}`)
      const json = (await response.json()) as Array<Guess>

      setPastGuesses(json)
    }

    fetchPastGuesses()
  }, [newGuess, username])

  return (
    <div className="m-4">
      <p className="text-center underline font-bold mb-2">Past guesses</p>
      <ul className="flex flex-col">
        {pastGuesses.map((pastGuess) => {
          const result = buildResultString(pastGuess.result)

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
