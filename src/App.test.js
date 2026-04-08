import { render, screen } from '@testing-library/react';
import App from './App';

test('renders South Asian project landing page', () => {
  render(<App />);

  expect(screen.getByText(/all about south asian countries/i)).toBeInTheDocument();
  expect(screen.getByText(/learn about south asia/i)).toBeInTheDocument();
});
