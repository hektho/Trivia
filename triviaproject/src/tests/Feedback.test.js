import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from '../helpers/renderWithRouterAndRedux';
import App from '../App';
import md5 from 'crypto-js/md5';

const INITIAL_STATE = { 
  loginReducer: { name: 'Jorge', email: 'email@email.com' }, 
  gameReducer: { assertions: 3 } 
};


describe('Verifica a tela de Feedback', () => {
  it('Verifica se o Header tem os componentes necessários', () => {

    const { history } = renderWithRouterAndRedux(
      <App />, INITIAL_STATE, '/feedback'
    );

    expect(history.location.pathname).toBe('/feedback');

    const header = screen.getByTestId('header');
    const userImg = screen.getByRole('img', { name: 'Imagem do perfil'});
    const userName = screen.getByRole('heading', {name: 'Jorge', level: 2 });
    const score = screen.getByRole('heading', {name: 'Score:', level: 2 });

    const headerInfo = [userImg, userName, score];
    
    expect(header).toBeInTheDocument();
    headerInfo.forEach((i) => {
      expect(i).toBeInTheDocument();
      expect(header).toContainElement(i);
    });

    const hash = md5(INITIAL_STATE.loginReducer.email).toString();
    expect(userImg).toHaveAttribute('src', `https://www.gravatar.com/avatar/${hash}`);
  });

  it('Verifica se o jogador tiver mais de 2 acertos aparece uma mensagem específica', () => {
    renderWithRouterAndRedux(
      <App />, INITIAL_STATE, '/feedback'
    );

    const assertion = screen.getByRole('heading', { name: 'Congratulations!!!!', level: 1 });
    expect(assertion).toBeInTheDocument();
  });

  it('Verifica se o jogador tiver menos de 3 acertos aparece uma mensagem específica', () => {
    const GAME_STATE = { gameReducer: { assertions: 1 }};
    renderWithRouterAndRedux(
      <App />, GAME_STATE, '/feedback'
    );

    const assertion = screen.getByRole('heading', { name: 'Could be better...', level: 1 });
    expect(assertion).toBeInTheDocument();
  });

  it('Verifica se há o total de acertos', () => {
    const GAME_STATE = { gameReducer: { assertions: 1 }};
    renderWithRouterAndRedux(
      <App />, GAME_STATE, '/feedback'
    );

    const assertionMessage = screen.getByRole('heading', { 
      name: 'Total assertions: 1', level: 2 
    });
    expect(assertionMessage).toBeInTheDocument();
  });
  
  
  it('Verifica os botões', async () => {
    const GAME_STATE = { gameReducer: { assertions: 1 }};
    const { history } = renderWithRouterAndRedux(
      <App />, GAME_STATE, '/feedback'
    );

    const form = screen.getByTestId('form');
    const playAgainBtn = screen.getByRole('button', { name: /Play Again/i });
    const rankingBtn = screen.getByRole('button', { name: 'Ranking'});

    expect(form).toBeInTheDocument();

    expect(rankingBtn).toBeInTheDocument();
    expect(playAgainBtn).toBeInTheDocument();

    expect(rankingBtn).toHaveAttribute('type', 'button');
    expect(playAgainBtn).toHaveAttribute('type', 'submit');

    expect(form).toContainElement(playAgainBtn);
    expect(form).toContainElement(rankingBtn);

    userEvent.click(rankingBtn);

    expect(history.location.pathname).toBe('/ranking');
  })
});