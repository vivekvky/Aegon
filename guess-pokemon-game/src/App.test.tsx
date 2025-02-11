import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the Game component to isolate the App component test
jest.mock("./components/Game", () => () => <div>Mocked Game Component</div>);

describe("App", () => {
  it("renders the Game component", () => {
    // Render the App component
    render(<App />); // Use App as a value, not a type

    // Check if the mocked Game component is rendered
    const gameElement = screen.getByText("Mocked Game Component");
    expect(gameElement).toBeInTheDocument();
  });
});
