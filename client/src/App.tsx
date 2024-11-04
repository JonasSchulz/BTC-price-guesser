import { useState } from "react"
import "./App.css"
import { LoginForm } from "./components/loginForm"
import { CurrentBtcPrice } from "./components/currentBtcPrice"
import { GuessForm } from "./components/guessForm"
import { GuessList } from "./components/guessList"
import { Guess } from "./model/guess"
import logo from "./assets/logo.png"
import { Score } from "./components/score"

const App = () => {
  const [username, setUsername] = useState("")
  const [pageRefreshes, setPageRefreshes] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [pastGuesses, setPastGuesses] = useState<Array<Guess>>([])

  const logout = () => {
    localStorage.removeItem("username")
    setUsername("")
  }

  return (
    <div className="flex items-center justify-center h-screen text-3xl bg-teal-700">
      {username ? (
        <div>
          <p className="m-4 flex justify-center font-bold underline">{`Welcome ${username}!`}</p>
          <div className="flex justify-center">
            <button className="text-xl underline" onClick={logout}>
              Logout
            </button>
          </div>
          <div className="flex justify-center pt-8 pb-8">
            <img className="size-60" src={logo} alt="Logo" />
          </div>
          <CurrentBtcPrice setCurrentPrice={setCurrentPrice} />
          <GuessForm
            username={username}
            currentPrice={currentPrice}
            pageRefreshes={pageRefreshes}
            setPageRefreshes={setPageRefreshes}
            pastGuesses={pastGuesses}
          />
          <Score pastGuesses={pastGuesses} />
          <GuessList
            username={username}
            pageRefreshes={pageRefreshes}
            pastGuesses={pastGuesses}
            setPastGuesses={setPastGuesses}
          />
        </div>
      ) : (
        <LoginForm setLoginData={setUsername} />
      )}
    </div>
  )
}

export default App
