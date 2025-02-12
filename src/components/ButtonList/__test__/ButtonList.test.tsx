import React from 'react';
import { render, screen } from '@testing-library/react';
import ButtonList from '../ButtonList';

const buttonData = ['bulbasaur', 'charizard', 'jigglypuff'];

describe('ButtonList', () => {
  it('renders the ButtonList component', () => {
    render(<ButtonList options={buttonData} selected={'bulbasaur'} handleChoice={jest.fn()} />); 

    const gameElement = screen.getByText('bulbasaur');
    expect(gameElement).toBeInTheDocument();
  });
});
