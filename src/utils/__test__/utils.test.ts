import { shuffleChoices, getPokemonByKey } from '../utils';

const mockFakePokemons = [
  { name: 'bulbasaur' },
  { name: 'charizard' },
  { name: 'jigglypuff' },
];

const correctName = 'Correct Name';
const fakeNames = ['bulbasaur', 'jigglypuff', 'charizard'];

describe('shuffleChoices', () => {
  test('should return an array containing the correctName and fakeNames in a shuffled order', () => {
    const result = shuffleChoices(correctName, fakeNames);

    expect(result).toContain(correctName);
    fakeNames.forEach((name) => {
      expect(result).toContain(name);
    });

    expect(result).toHaveLength(fakeNames.length + 1);
  });

  test('should return an array of pokemon names', () => {
    const result = getPokemonByKey(mockFakePokemons, 'name');

    result.forEach((name) => {
      expect(result).toContain(name);
    });

    expect(result).toHaveLength(3);
  });
});
