export enum GuessTypes {
  increase = "increase",
  decrease = "decrease",
}

export enum ResultScores {
  correct = 1,
  incorrect = -1,
}

export type Guess = {
  timeStamp: string
  guess: GuessTypes
  result: null | ResultScores
}
