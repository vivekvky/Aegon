import { shuffleChoices } from '../utils';

describe('shuffleChoices', () => {
  test('should return an array containing the correctName and fakeNames in a shuffled order', () => {
    const correctName = 'Correct Name';
    const fakeNames = ['Fake Name 1', 'Fake Name 2', 'Fake Name 3'];

    const result = shuffleChoices(correctName, fakeNames);

    expect(result).toContain(correctName);
    fakeNames.forEach((name) => {
      expect(result).toContain(name);
    });

    expect(result).toHaveLength(fakeNames.length + 1);
  });
});
