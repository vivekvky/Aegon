const shuffleChoices = (correctName: string, fakeNames: string[]) => {
  return [correctName, ...fakeNames].sort(() => Math.random() - 0.5);
};

export { shuffleChoices };
