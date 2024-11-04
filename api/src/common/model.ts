export type SandboxBtcMarketData = {
  data: {
    bitcoin: {
      quote: {
        USD: {
          price: number
        }
      }
    }
  }
}

export type BtcMarketData = {
  data: {
    "1": {
      quote: {
        USD: {
          price: number
        }
      }
    }
  }
}

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
  user_name: string
  inserted_at: string
  guess: GuessTypes
  price: number
  score: Scores
}
