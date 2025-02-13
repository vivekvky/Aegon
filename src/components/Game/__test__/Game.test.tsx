/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import Game from '../Game';
import * as utils from '../../../utils/utils';

// Mock the shuffleChoices function
jest.mock('../../../utils/utils', () => ({
  ...jest.requireActual('../../../utils/utils'),
  shuffleChoices: jest.fn(),
}));

// set global.fetch to a jest mock function
global.fetch = jest.fn();

describe('Game Component', () => {
  const mockFakePokemons = [
    { name: 'bulbasaur' },
    { name: 'charizard' },
    { name: 'jigglypuff' },
  ];
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: mockFakePokemons }),
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          sprites: {
            other: {
              'official-artwork': { front_default: 'pikachu_image_url' },
            },
          },
          name: 'pikachu',
        }),
    });

    (utils.shuffleChoices as jest.Mock).mockImplementation(
      (correct, fakeNames) => [correct, ...fakeNames],
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders loading state initially', () => {
    act(() => {
      render(<Game />);
    });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  test('should fetch Pokémon data and display image', async () => {
    act(() => {
      render(<Game />);
    });

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole('img')).toBeVisible());
    expect(screen.getByText(/Who's That Pokémon?/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  test('should render the game and display score as 0', async () => {
    act(() => {
      render(<Game />);
    });

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await screen.findByText('Score: 0');
  });

  test('should display an error message if no Pokémon data is available', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    act(() => {
      render(<Game />);
    });

    expect(
      await screen.findByText(/No Pokémon available. Please try again later./i),
    ).toBeVisible();
  });

  test('should update the score when selecting the correct option', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: mockFakePokemons }),
    });
    (utils.shuffleChoices as jest.Mock).mockImplementation(
      (correct, fakeNames) => [correct, ...fakeNames],
    );
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          sprites: {
            other: {
              'official-artwork': { front_default: 'charizard_image_url' },
            },
          },
          name: 'charizard',
        }),
    });

    act(() => {
      render(<Game />);
    });

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole('img')).toBeVisible());

    act(async () => {
      const correctOption = screen.getByText('charizard');
      fireEvent.click(correctOption);

      // After selecting the correct answer, it should update the score
      await screen.findByText('Score: 1');

      // Check for "Correct!" message
      expect(screen.getByText(/Correct!/i)).toBeInTheDocument();
    });
  });
});
