import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Game from "../Game";
import * as utils from "../../utils/utils";

// Mocking the shuffleChoices function
jest.mock("../../utils/utils", () => ({
  ...jest.requireActual("../../utils/utils"),
  shuffleChoices: jest.fn(),
}));

// Cast global.fetch to a jest mock function
global.fetch = jest.fn();

describe("Game Component", () => {
  const mockFakePokemons = [
    { name: "bulbasaur" },
    { name: "charizard" },
    { name: "jigglypuff" },
  ];
  beforeEach(() => {
    // Mock the fetch responses
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: mockFakePokemons }),
    });
    (utils.shuffleChoices as jest.Mock).mockImplementation(
      (correct, fakeNames) => [correct, ...fakeNames]
    );
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          sprites: {
            other: {
              "official-artwork": { front_default: "pikachu_image_url" },
            },
          },
          name: "pikachu",
        }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders loading state initially", () => {
    render(<Game />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  it("should render the game and fetch Pokémon data", async () => {
    render(<Game />);

    // Wait for the API to return fake Pokémon data
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole("img")).toBeVisible());
    expect(screen.getByText(/Who's That Pokémon?/i)).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("pikachu")).toBeInTheDocument();
  });

  it("should render the game and handle button", async () => {
    render(<Game />);

    // Wait for the API to return fake Pokémon data
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole("img")).toBeVisible());
    await screen.findByText("Score: 0");
  });

  it.skip("should show Pokémon image and options after loading", async () => {
    render(<Game />);

    // Wait for fetch and state updates
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole("img")).toBeVisible());
    // Check that the correct Pokémon image is shown
    expect(screen.getByRole("img")).toHaveAttribute("src", "pikachu_image_url");

    // Check that the options have been rendered
    expect(screen.getByText("mewtwo")).toBeInTheDocument();
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("charizard")).toBeInTheDocument();
  });

  it.skip("should update the score when selecting the correct option", async () => {
    render(<Game />);

    // Wait for fetch and state updates
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole("img")).toBeVisible());

    const correctOption = screen.getByText("pikachu");
    fireEvent.click(correctOption);

    // After selecting the correct answer, it should update the score
    await screen.findByText("Score: 1");

    // Check for "Correct!" message
    expect(screen.getByText(/Correct!/i)).toBeInTheDocument();
  });

  it.skip('should show the next question after clicking "Next" button', async () => {
    render(<Game />);

    // Wait for fetch and state updates
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole("img")).toBeVisible());

    const correctOption = screen.getByText("pikachu");
    fireEvent.click(correctOption);

    // Click "Next" to get the next question
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    // Wait for the next Pokemon to appear
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));

    // Check that the options for the next question are loaded
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it.skip("should display an error message if no Pokémon data is available", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    render(<Game />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Check that an error message is displayed
    expect(
      screen.getByText(/No Pokémon available. Please try again later./i)
    ).toBeInTheDocument();
  });
});
