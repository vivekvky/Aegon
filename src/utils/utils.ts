const shuffleChoices = (correctName: string, fakeNames: string[]) => {
  return [correctName, ...fakeNames].sort(() => Math.random() - 0.5);
};

const getPokemonByKey = (fakePokemonsList, key) => {
  const fakePokemonNames = fakePokemonsList
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((e) => e[key]);
  return fakePokemonNames;
};

export { shuffleChoices, getPokemonByKey };
