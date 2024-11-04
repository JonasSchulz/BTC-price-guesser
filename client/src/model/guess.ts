export enum GuessTypes {
  increase = "increase",
  decrease = "decrease",
}

export enum Scores {
  correct = 1,
  incorrect = -1,
  unresolved = 0,
}

export type Guess = {
  timeStamp: string
  guess: GuessTypes
  score: Scores
}
