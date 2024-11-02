import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App"
import { timeStamp } from "console"
import { GuessTypes } from "./model/guess"

beforeEach(() => {
  fetchMock.resetMocks()
})

test("shows the current bitcoin price when the user identified themselves", async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ currentPrice: 0.1234, currency: "EUR" }))

  const user = userEvent.setup()

  render(<App />)

  const usernameInput = screen.getByLabelText(/Please input your username/i)
  await user.type(usernameInput, "some-username")

  const submitButton = await screen.findByText(/Go/i)
  await user.click(submitButton)

  const userGreeting = await screen.findByText(/Hey some-username/i)
  expect(userGreeting).toBeInTheDocument()

  const bitcoinHeading = await screen.findByText(/The current BTC Price is:/i)
  expect(bitcoinHeading).toBeInTheDocument()

  const bitcoinPrice = await screen.findByText(/(\d*.\d*) EUR/i)
  expect(bitcoinPrice).toBeInTheDocument()
})

test("allows the user to guess if the price is going to go up", async () => {
  fetchMock.mockResponses(
    JSON.stringify({ currentPrice: 0.1234, currency: "EUR" }),
    JSON.stringify({ timeStamp: Date.now(), guess: GuessTypes.increase, result: null }),
  )

  const user = userEvent.setup()

  render(<App />)

  const usernameInput = screen.getByLabelText(/Please input your username/i)
  await user.type(usernameInput, "some-username")

  const submitButton = await screen.findByText(/Go/i)
  await user.click(submitButton)

  const increaseButton = await screen.findByText(/increase/i)
  await user.click(increaseButton)

  await screen.findByText(/Guess: increase - waiting for result/i)
})

test("allows the user to guess if the price is going to go down", async () => {
  fetchMock.mockResponses(
    JSON.stringify({ currentPrice: 0.1234, currency: "EUR" }),
    JSON.stringify({ timeStamp: Date.now(), guess: GuessTypes.decrease, result: null }),
  )

  const user = userEvent.setup()

  render(<App />)

  const usernameInput = screen.getByLabelText(/Please input your username/i)
  await user.type(usernameInput, "some-username")

  const submitButton = await screen.findByText(/Go/i)
  await user.click(submitButton)

  const decreaseButton = await screen.findByText(/decrease/i)
  await user.click(decreaseButton)

  await screen.findByText(/Guess: decrease - waiting for result/i)
})