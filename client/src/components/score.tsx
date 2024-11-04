import { useEffect, useState } from "react"
import { Guess } from "../model/guess"

type ScoreProps = {
  pastGuesses: Array<Guess>
}

export const Score = (props: ScoreProps) => {
  const { pastGuesses } = props

  const [score, setScore] = useState(0)

  useEffect(() => {
    const currentScore = pastGuesses
      .filter((pastGuess) => pastGuess.score !== null)
      .reduce((acc, pastGuess) => acc + pastGuess.score!, 0)

    setScore(currentScore)
  }, [pastGuesses])

  return <p className="text-center pt-2">{`Your score: ${score}`}</p>
}
