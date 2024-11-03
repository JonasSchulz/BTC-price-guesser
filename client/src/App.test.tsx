import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App"
import { GuessTypes } from "./model/guess"
import { API_URL } from "./constants"

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

  const userGreeting = await screen.findByText(/Welcome some-username/i)
  expect(userGreeting).toBeInTheDocument()

  const bitcoinHeading = await screen.findByText(/The current price for a Bitcoin is:/i)
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

  await screen.findByText(/You guessed: increase - waiting for result/i)

  expect(fetchMock.mock.calls.length).toEqual(2)
  expect(fetchMock.mock.calls[0][0]).toEqual(`${API_URL}/btc/price`)
  expect(fetchMock.mock.calls[1][0]).toEqual(`${API_URL}/guesses`)
  expect(fetchMock.mock.calls[1][1]).toEqual({
    body: '{"user_name":"some-username","guess":"increase"}',
    method: "POST",
  })
})

test("allows the user to guess if the price is going to go down", async () => {
  fetchMock.mockResponses(
    JSON.stringify({ currentPrice: 0.1234, currency: "EUR" }),
    JSON.stringify({
      user_name: "some-username",
      inserted_at: Date.now().toString(),
      guess: GuessTypes.decrease,
      result: null,
    }),
  )

  const user = userEvent.setup()

  render(<App />)

  const usernameInput = screen.getByLabelText(/Please input your username/i)
  await user.type(usernameInput, "some-username")

  const submitButton = await screen.findByText(/Go/i)
  await user.click(submitButton)

  const decreaseButton = await screen.findByText(/decrease/i)
  await user.click(decreaseButton)

  await screen.findByText(/You guessed: decrease - waiting for result/i)

  expect(fetchMock.mock.calls.length).toEqual(2)
  expect(fetchMock.mock.calls[0][0]).toEqual(`${API_URL}/btc/price`)
  expect(fetchMock.mock.calls[1][0]).toEqual(`${API_URL}/guesses`)
  expect(fetchMock.mock.calls[1][1]).toEqual({
    body: '{"user_name":"some-username","guess":"decrease"}',
    method: "POST",
  })
})
