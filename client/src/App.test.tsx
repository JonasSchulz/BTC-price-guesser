import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';

test('shows the current bitcoin price when the user identified themselves', async () => {
  const user = userEvent.setup();
  
  render(<App />);

  const usernameInput = screen.getByLabelText(/Please input your username/i);
  await user.type(usernameInput, 'some-username');

  const submitButton = await screen.findByText(/Go/i);
  await user.click(submitButton)

  const userGreeting = await screen.findByText(/Hey some-username/i);
  expect(userGreeting).toBeInTheDocument();

  const bitcoinHeading = await screen.findByText(/The current BTC Price is:/i)
  expect(bitcoinHeading).toBeInTheDocument();

  const bitcoinPrice = await screen.findByText(/(\d*.\d*) EUR/i)
  expect(bitcoinPrice).toBeInTheDocument();
})
