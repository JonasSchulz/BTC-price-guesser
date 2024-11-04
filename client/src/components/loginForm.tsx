import { useEffect, useState } from "react"

type LoginFormProps = {
  setLoginData: (username: string) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [username, setUsername] = useState("")

  const { setLoginData } = props

  const login = () => {
    localStorage.setItem("username", username)
    setLoginData(username)
  }

  useEffect(() => {
    const username = localStorage.getItem("username")

    if (username) setLoginData(username)
  })

  return (
    <form>
      <label className="flex flex-col block mb-2 font-medium">
        Please input your username:
        <div className="flex flex-row mt-2">
          <input
            name="username"
            onChange={(e) => setUsername(e.currentTarget.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-blue-500 mr-2"
          />
          <button className="border-2 border-black rounded-md p-1" type="submit" onClick={() => login()}>
            Go
          </button>
        </div>
      </label>
    </form>
  )
}
