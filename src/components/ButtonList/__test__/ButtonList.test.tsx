import React from 'react';
import { render, screen } from '@testing-library/react';
import ButtonList from '../ButtonList';

const buttonData = ['bulbasaur', 'charizard', 'jigglypuff'];

describe('ButtonList', () => {
  test('renders the ButtonList component with pokemon names', () => {
    render(
      <ButtonList
        options={buttonData}
        selected={'bulbasaur'}
        handleChoice={jest.fn()}
      />,
    );

    const bulbasaurElement = screen.getByText('bulbasaur');
    const charizardElement = screen.getByText('charizard');
    const jigglypuffElement = screen.getByText('jigglypuff');
    expect(bulbasaurElement).toBeInTheDocument();
    expect(charizardElement).toBeInTheDocument();
    expect(jigglypuffElement).toBeInTheDocument();
  });
});
