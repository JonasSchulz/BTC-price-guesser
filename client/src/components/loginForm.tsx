import { useState } from "react"

type LoginFormProps = {
  setLoginData: (username: string) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [username, setUsername] = useState('')

  const {setLoginData} = props

  const login = () => {
    setLoginData(username)
  }

  return (
    <form>
      <label>
        Please input your username:
        <input name="username" onChange={(e) => setUsername(e.currentTarget.value)} />
      </label>
      <button type="submit" onClick={() => login()}>
        Go
      </button>
    </form>
  )
}
