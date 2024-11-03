import { useState } from "react"
import "./App.css"
import { LoginForm } from "./components/loginForm"
import { CurrentBtcPrice } from "./components/currentBtcPrice"
import { GuessForm } from "./components/guessForm"
import { GuessList } from "./components/guessList"
import { Guess } from "./model/guess"
import logo from "./assets/logo.png"

const App = () => {
  const [username, setUsername] = useState("")
  const [pastGuesses, setPastGuesses] = useState<Array<Guess>>([])

  return (
    <div className="flex items-center justify-center h-screen text-3xl bg-teal-700">
      {username ? (
        <div>
          <p className="m-4 flex justify-center font-bold underline">{`Welcome ${username}!`}</p>
          <div className="flex justify-center pt-8 pb-8">
            <img className="size-60" src={logo} alt="Logo" />
          </div>
          <CurrentBtcPrice />
          <GuessForm username={username} pastGuesses={pastGuesses} setPastGuesses={setPastGuesses} />
          <GuessList pastGuesses={pastGuesses} />
        </div>
      ) : (
        <LoginForm setLoginData={setUsername} />
      )}
    </div>
  )
}

export default App
