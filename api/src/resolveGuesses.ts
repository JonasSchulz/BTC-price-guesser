import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ScanCommand, ScanCommandInput, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import type { Handler } from "aws-lambda"
import { BtcMarketData, Guess, GuessTypes } from "./common/model"
import { getBtcPrice } from "./common/btcPriceFetcher"

const client = new DynamoDBClient({})
const dbClient = DynamoDBDocumentClient.from(client)

export const handler: Handler = async (): Promise<void> => {
  const guessesToResolve = await getGuessesToResolve()

  // we need to filter out guesses that are not old enough to be resolved
  const oneMinuteAgo = Date.now() - 1 * 60 * 1000
  const guessOlderThanOneMinute = guessesToResolve.filter((guess) => Number(guess.inserted_at) < oneMinuteAgo)

  if (guessOlderThanOneMinute.length === 0) return

  const currentPrice = await getBtcPrice()

  for (const guessToResolve of guessOlderThanOneMinute) {
    const score = calculateScore(guessToResolve.guess, guessToResolve.price, currentPrice);

    await updateScore(guessToResolve, score, currentPrice);
  }

  return
}

const calculateScore = (guess: GuessTypes, initialPrice: number, currentPrice: number) => {
  switch (guess) {
    case GuessTypes.increase: {
      return initialPrice < currentPrice ? 1 : -1
    }
    case GuessTypes.decrease: {
      return initialPrice > currentPrice ? 1 : -1
    }
  }
}

const updateScore = async (guess: Guess, score: number, currentPrice: number) => {
  const command = new UpdateCommand({
    TableName: "GuessesTable",
    Key: {
      user_name: guess.user_name,
      inserted_at: guess.inserted_at,
    },
    UpdateExpression: "set score = :score, resolved_price = :resolved_price",
    ExpressionAttributeValues: {
      ":score": score,
      ":resolved_price": currentPrice,
    },
  })

  await dbClient.send(command)
}

const getGuessesToResolve = async () => {
  // if the score is 0 the guess is unresolved
  const input: ScanCommandInput = {
    TableName: "GuessesTable",
    FilterExpression: "score = :score",
    ExpressionAttributeValues: {
      ":score": 0,
    },
  }
  const command = new ScanCommand(input)
  const dbResponse = await dbClient.send(command)

  return dbResponse.Items as Guess[]
}
