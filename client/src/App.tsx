import { useState } from "react"
import "./App.css"
import { LoginForm } from "./components/loginForm"
import { CurrentBtcPrice } from "./components/currentBtcPrice"
import { GuessForm } from "./components/guessForm"
import { GuessList } from "./components/guessList"
import { Guess } from "./model/guess"

const App = () => {
  const [username, setUsername] = useState("")
  const [pastGuesses, setPastGuesses] = useState<Array<Guess>>([])

  return (
    <div className="flex items-center justify-center h-screen text-3xl font-bold underline bg-teal-700">
      {username ? (
        <div>
          <p>{"Hey " + username}</p>
          <p> The current BTC Price is:</p>
          <CurrentBtcPrice />
          <GuessForm pastGuesses={pastGuesses} setPastGuesses={setPastGuesses} />
          <GuessList pastGuesses={pastGuesses} />
        </div>
      ) : (
        <LoginForm setLoginData={setUsername} />
      )}
    </div>
  )
}

export default App
