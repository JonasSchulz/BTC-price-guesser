import { useState } from "react"
import "./App.css"
import { LoginForm } from "./components/loginForm"
import { CurrentBtcPrice } from "./components/currentBtcPrice"

const App = () => {
  const [username, setUsername] = useState("")

  return (
    <div className="flex items-center justify-center h-screen text-3xl font-bold underline bg-teal-700">
      {username ? (
        <div>
          <p>{'Hey ' + username}</p> 
          <p> The current BTC Price is:</p>
          <CurrentBtcPrice/>
        </div>
      ) : (
        <LoginForm setLoginData={setUsername}/>
      )}
    </div>
  )
}

export default App
