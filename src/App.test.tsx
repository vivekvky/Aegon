import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Game component to isolate the App component test
jest.mock('./components/Game/Game', () => () => <div>Mocked Game Component</div>);

describe('App', () => {
  test('renders the Game component', () => {
    render(<App />);

    const gameElement = screen.getByText('Mocked Game Component');
    expect(gameElement).toBeInTheDocument();
  });
});
