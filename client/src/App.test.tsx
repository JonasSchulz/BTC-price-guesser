import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';

test('asks the user to enter a username', () => {
  render(<App />);
  
  const greeting = screen.getByText(/Please input your username/i);

  expect(greeting).toBeInTheDocument();
});

test('shows the current bitcoin price when the user identified themselves', async () => {
  const user = userEvent.setup();
  
  render(<App />);

  const usernameInput = screen.getByLabelText(/Please input your username/i);
  await user.type(usernameInput, 'some-username');

  const submitButton = await screen.findByText(/Go/i);
  await user.click(submitButton)

  const userGreeting = await screen.findByText(/Hey some-username/i);
  expect(userGreeting).toBeInTheDocument();
})

