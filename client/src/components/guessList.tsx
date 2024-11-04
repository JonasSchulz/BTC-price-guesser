import { useEffect } from "react"
import { Guess, Scores } from "../model/guess"
import { API_URL } from "../constants"

type GuessListProps = {
  username: string
  pageRefreshes: number
  pastGuesses: Array<Guess>
  setPastGuesses: (pastGuesses: Array<Guess>) => void
}

const buildScoreString = (score: Scores) => {
  switch (score) {
    case Scores.correct: {
      return "score: +1"
    }
    case Scores.incorrect: {
      return "score: -1"
    }
    case Scores.unresolved: {
      return "waiting for score"
    }
  }
}

export const GuessList = (props: GuessListProps) => {
  const { pageRefreshes, username, pastGuesses, setPastGuesses } = props

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
  }, [pageRefreshes, username, setPastGuesses])

  return (
    <div className="m-4">
      <p className="text-center underline font-bold mb-2">Your guesses</p>
      <ul className="flex flex-col">
        {pastGuesses.map((pastGuess) => {
          const score = buildScoreString(pastGuess.score)

          return <li className="space-y-1 list-disc list-inside p-1">{`You guessed: ${pastGuess.guess} - ${score}`}</li>
        })}
      </ul>
    </div>
  )
}
