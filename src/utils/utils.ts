import IPokemon from '../interface/Pokemon';

/* concat and shuffle pokemons */
const shuffleChoices = (correctName: string, fakeNames: string[]) => {
  return [correctName, ...fakeNames].sort(() => Math.random() - 0.5);
};

/* returns array of pokemon names by filtering pokemon list with key passed as params */
const getPokemonByKey = (fakePokemonsList: IPokemon[], key: string) => {
  const fakePokemonNames = fakePokemonsList
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((e) => e[key]);
  return fakePokemonNames;
};

export { shuffleChoices, getPokemonByKey };
