import React, { useEffect, useState, useCallback } from 'react';
import './Game.css';
import { shuffleChoices, getPokemonByKey } from '../../utils/utils';
import ButtonList from '../ButtonList/ButtonList';

const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon/';
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
  const [fakePokemonsList, setFakePokemonsList] = useState<string[]>([]);

  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  /* API call to fetch respone based on url */
  const fetchPokemonData = async (url: string) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    } catch (error) {
      setCorrectPokemon(null);
      throw error;
    }
  };

  /* fetch fake pokemon */
  const fetchFakePokemon = useCallback(async () => {
    const response = await fetchPokemonData(Random_PokemonNames_URL);
    setFakePokemonsList(response['results']);
  }, []);

  /* fetch correct pokemon and setup the data for the game */
  const fetchNewPokemon = useCallback(async () => {
    setLoading(true);
    try {
      const correctId = Math.floor(Math.random() * MAX_POKEMON) + 1;
      const correctData = await fetchPokemonData(`${POKEAPI_URL}${correctId}`);

      const correctImage =
        correctData?.sprites?.other['official-artwork']?.front_default;

      /* filter by name get array of fake Pokemon Names */
      const fakePokemonNames = getPokemonByKey(fakePokemonsList, 'name');

      /* Generate shuffled choices */
      const choices = shuffleChoices(correctData.name, fakePokemonNames);

      /* Update and save state of correct pokemon */
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

  /* set the selected pokemon and update the score */
  const handleChoice = (choice: string) => {
    setSelected(choice);
    if (choice === correctPokemon?.name) {
      setScore((prev) => prev + 1);
    }
  };

  /* fetch the fake pokemons */
  useEffect(() => {
    fetchFakePokemon();
  }, [fetchFakePokemon]);

  /* fetch the correct pokemon after we get the list */
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
            className={selected ? 'revealed' : 'silhouette'}
            width={200}
          />
          <ButtonList
            options={options}
            handleChoice={handleChoice}
            selected={selected}
          />
          {selected && (
            <div>
              <h2>{`${
                selected === correctPokemon.name ? 'Correct!' : 'Wrong!'
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
