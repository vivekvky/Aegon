import React, { useEffect, useState, useCallback } from "react";
import "./Game.css";
import { shuffleChoices } from "../utils/utils";

const POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";
const Random_PokemonNames_URL = `${POKEAPI_URL}?limit=50&offset=0`;
const MAX_POKEMON = 50;

interface Pokemon {
  name: string;
  image: string;
}

const Game: React.FC = () => {
  const [correctPokemon, setCorrectPokemon] = useState<Pokemon | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [fakePokemonsList, setFakePokemons] = useState<string[]>([]);

  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPokemonData = async (url: string) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      return response.json();
    } catch (error) {
      setCorrectPokemon(null);
      throw error;
    }
  };

  const fetchFakePokemon = useCallback(async () => {
    const response = await fetchPokemonData(Random_PokemonNames_URL);
    setFakePokemons(response["results"]);
  }, []);

  const fetchNewPokemon = useCallback(async () => {
    setLoading(true);
    try {
      const correctId = Math.floor(Math.random() * MAX_POKEMON) + 1;
      const correctData = await fetchPokemonData(`${POKEAPI_URL}${correctId}`);

      const correctImage =
        correctData?.sprites?.other["official-artwork"]?.front_default;

      // Shuffle and select fake Pokemon names efficiently
      const fakePokemonNames = fakePokemonsList
        .slice() // Create a shallow copy to avoid mutating the original list
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((e) => e["name"]);

      // Generate shuffled choices
      const choices = shuffleChoices(correctData.name, fakePokemonNames);

      // Update state in a single batch to reduce re-renders
      setCorrectPokemon({ name: correctData.name, image: correctImage });
      setOptions(choices);
      setSelected(null);
    } catch (error) {
      setCorrectPokemon(null);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [fakePokemonsList]);

  const handleChoice = (choice: string) => {
    setSelected(choice);
    if (choice === correctPokemon?.name) {
      setScore((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchFakePokemon();
  }, [fetchFakePokemon]);

  useEffect(() => {
    fetchNewPokemon();
  }, [fakePokemonsList, fetchNewPokemon]);

  return (
    <div className="game-container">
      <h1>Who's That Pokémon?</h1>
      {loading ? (
        <p>Loading...</p>
      ) : correctPokemon ? (
        <>
          <img
            src={correctPokemon.image}
            alt="Pokemon silhouette"
            className={selected ? "revealed" : "silhouette"}
            width={200}
          />
          <div>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleChoice(option)}
                disabled={!!selected}
              >
                {option}
              </button>
            ))}
          </div>
          {selected && (
            <div>
              <h2>{`${
                selected === correctPokemon.name ? "Correct!" : "Wrong!"
              } It's ${correctPokemon.name}.`}</h2>
              <button onClick={fetchNewPokemon}>Next</button>
            </div>
          )}
        </>
      ) : (
        <p>No Pokémon available. Please try again later.</p>
      )}
      <h2>Score: {score}</h2>
    </div>
  );
};

export default Game;
