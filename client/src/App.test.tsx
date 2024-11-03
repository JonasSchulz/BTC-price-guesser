import { render, screen } from "@testing-library/react"
import userEvent, { UserEvent } from "@testing-library/user-event"
import App from "./App"
import { GuessTypes } from "./model/guess"
import { API_URL } from "./constants"

beforeEach(() => {
  fetchMock.resetMocks()
})

const fetchCurrentBtcPriceMock = JSON.stringify({ currentPrice: 0.1234, currency: "EUR" })
const fetchEmptyPastGuessesMock = JSON.stringify([])

const login = async (user: UserEvent) => {
  const usernameInput = screen.getByLabelText(/Please input your username/i)
  await user.type(usernameInput, "some-username")

  const submitButton = await screen.findByText(/Go/i)
  await user.click(submitButton)
}

test("shows the current bitcoin price when the user identified themselves", async () => {
  fetchMock.mockResponses(fetchCurrentBtcPriceMock, fetchEmptyPastGuessesMock)

  const user = userEvent.setup()

  render(<App />)

  await login(user)

  const userGreeting = await screen.findByText(/Welcome some-username/i)
  expect(userGreeting).toBeInTheDocument()

  const bitcoinHeading = await screen.findByText(/The current price for a Bitcoin is:/i)
  expect(bitcoinHeading).toBeInTheDocument()

  const bitcoinPrice = await screen.findByText(/0.1234 EUR/i)
  expect(bitcoinPrice).toBeInTheDocument()
})

test("allows the user to guess if the price is going to go up", async () => {
  const fetchCreateGuessMock = JSON.stringify({ timeStamp: Date.now(), guess: GuessTypes.increase, result: null })
  const fetchPastGuessesMock = JSON.stringify([{ timeStamp: Date.now(), guess: GuessTypes.increase, result: null }])

  fetchMock.mockResponses(
    fetchCurrentBtcPriceMock,
    fetchEmptyPastGuessesMock,
    fetchCreateGuessMock,
    fetchPastGuessesMock,
  )

  const user = userEvent.setup()

  render(<App />)

  await login(user)

  const increaseButton = await screen.findByText(/^increase$/i)
  await user.click(increaseButton)

  const newGuess = await screen.findByText(/You guessed: increase - waiting for result/i)
  expect(newGuess).toBeInTheDocument()

  expect(fetchMock.mock.calls.length).toEqual(4)
  expect(fetchMock.mock.calls[0][0]).toEqual(`${API_URL}/btc/price`)
  expect(fetchMock.mock.calls[1][0]).toEqual(`${API_URL}/guesses?user_name=some-username`)
  expect(fetchMock.mock.calls[2][0]).toEqual(`${API_URL}/guesses`)
  expect(fetchMock.mock.calls[2][1]).toEqual({
    body: '{"user_name":"some-username","guess":"increase"}',
    method: "POST",
  })
  expect(fetchMock.mock.calls[3][0]).toEqual(`${API_URL}/guesses?user_name=some-username`)
})

test("allows the user to guess if the price is going to go down", async () => {
  const fetchCreateGuessMock = JSON.stringify({ timeStamp: Date.now(), guess: GuessTypes.decrease, result: null })
  const fetchPastGuessesMock = JSON.stringify([{ timeStamp: Date.now(), guess: GuessTypes.decrease, result: null }])

  fetchMock.mockResponses(
    fetchCurrentBtcPriceMock,
    fetchEmptyPastGuessesMock,
    fetchCreateGuessMock,
    fetchPastGuessesMock,
  )

  const user = userEvent.setup()

  render(<App />)

  await login(user)

  const decreaseButton = await screen.findByText(/^decrease$/i)
  await user.click(decreaseButton)

  const newGuess = await screen.findByText(/You guessed: decrease - waiting for result/i)
  expect(newGuess).toBeInTheDocument()

  expect(fetchMock.mock.calls.length).toEqual(4)
  expect(fetchMock.mock.calls[0][0]).toEqual(`${API_URL}/btc/price`)
  expect(fetchMock.mock.calls[1][0]).toEqual(`${API_URL}/guesses?user_name=some-username`)
  expect(fetchMock.mock.calls[2][0]).toEqual(`${API_URL}/guesses`)
  expect(fetchMock.mock.calls[2][1]).toEqual({
    body: '{"user_name":"some-username","guess":"decrease"}',
    method: "POST",
  })
  expect(fetchMock.mock.calls[3][0]).toEqual(`${API_URL}/guesses?user_name=some-username`)
})

test("shows the users past guesses", async () => {
  const pastGuessesMock = JSON.stringify([
    {
      user_name: "some-username",
      inserted_at: Date.now().toString(),
      guess: GuessTypes.increase,
      result: -1,
    },
    {
      user_name: "some-username",
      inserted_at: Date.now().toString(),
      guess: GuessTypes.decrease,
      result: 1,
    },
  ])
  fetchMock.mockResponses(fetchCurrentBtcPriceMock, pastGuessesMock)

  const user = userEvent.setup()

  render(<App />)

  await login(user)

  const decreaseGuess = await screen.findByText(/You guessed: decrease - result: \+1/i)
  expect(decreaseGuess).toBeInTheDocument()

  const increaseGuess = await screen.findByText(/You guessed: increase - result: -1/i)
  expect(increaseGuess).toBeInTheDocument()

  expect(fetchMock.mock.calls.length).toEqual(2)
  expect(fetchMock.mock.calls[0][0]).toEqual(`${API_URL}/btc/price`)
  expect(fetchMock.mock.calls[1][0]).toEqual(`${API_URL}/guesses?user_name=some-username`)
})

test("shows the user their current score", async () => {
  const pastGuessesMock = JSON.stringify([
    {
      user_name: "some-username",
      inserted_at: Date.now().toString(),
      guess: GuessTypes.increase,
      result: -1,
    },
    {
      user_name: "some-username",
      inserted_at: Date.now().toString(),
      guess: GuessTypes.decrease,
      result: 1,
    },
    {
      user_name: "some-username",
      inserted_at: Date.now().toString(),
      guess: GuessTypes.decrease,
      result: 1,
    },
    {
      user_name: "some-username",
      inserted_at: Date.now().toString(),
      guess: GuessTypes.decrease,
      result: 1,
    },
  ])
  fetchMock.mockResponses(fetchCurrentBtcPriceMock, pastGuessesMock)
  const user = userEvent.setup()

  render(<App />)

  await login(user)

  const currentScore = await screen.findByText(/Your score: 2/i)
  expect(currentScore).toBeInTheDocument()
})

test("does not allow the user to guess if they have a pending result", async () => {
  const pastGuessesMock = JSON.stringify([
    {
      user_name: "some-username",
      inserted_at: Date.now().toString(),
      guess: GuessTypes.increase,
      result: null,
    },
  ])
  fetchMock.mockResponses(fetchCurrentBtcPriceMock, pastGuessesMock)
  const user = userEvent.setup()

  render(<App />)

  await login(user)

  const guessIncreaseButton = screen.queryByText(/^increase$/i)
  expect(guessIncreaseButton).toBeNull()

  const guessDecreaseButton = screen.queryByText(/^decrease$/i)
  expect(guessDecreaseButton).toBeNull()

  const unableToGuessMessage = await screen.findByText(
    /You have a pending guess\. It needs to be resolved before you can guess again\./i,
  )
  expect(unableToGuessMessage).toBeInTheDocument()
})
