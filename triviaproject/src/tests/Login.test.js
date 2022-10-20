import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from '../helpers/renderWithRouterAndRedux';
import App from '../App';

describe('Verifica a tela de login', () => {
  afterEach(() => jest.clearAllMocks);
  it('Verifica se existe um input do tipo text na tela', () => {
    renderWithRouterAndRedux(<App />);

    const inputText = screen.getByLabelText('Name:');

    expect(inputText).toBeInTheDocument();
    expect(inputText).toHaveAttribute('type', 'text');
    expect(inputText).toHaveValue('');

    userEvent.type(inputText, 'Heitor');

    expect(inputText).toHaveValue('Heitor');
  });

  it('Verifica o input de email', () => {
    renderWithRouterAndRedux(<App />);

    const inputEmail = screen.getByLabelText('E-mail:');

    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail).toHaveAttribute('type', 'email');
    expect(inputEmail).toHaveValue('');

    userEvent.type(inputEmail, 'email@email.com');

    expect(inputEmail).toHaveValue('email@email.com');
  });

  it('Verfica se há 2 botões', () => {
    renderWithRouterAndRedux(<App />);

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(2);
  });

  it('Verifica o botão de "play"', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const fetchToken = {
      response_code: 0,
      response_message: 'Token Generated Succesfully',
      token: 'token_fake'
    };

    global.fetch = jest.fn(async () => ({
      json: async () => fetchToken
    }));

    const inputEmail = screen.getByLabelText('E-mail:');
    const inputText = screen.getByLabelText('Name:');
    const playButton = screen.getByRole('button', { name: 'Play' });
    let loading = screen.queryByText('Loading...');
    expect(playButton).toBeInTheDocument();
    expect(playButton).toHaveAttribute('type', 'button');
    expect(playButton).toBeDisabled();

    userEvent.type(inputText, 'Mercy');
    userEvent.type(inputEmail, 'mercy@mercy.com');

    expect(playButton).toBeEnabled();
    expect(loading).toBeNull();

    userEvent.click(playButton);

    loading = screen.getByText('Loading...');
    
    expect(loading).toBeInTheDocument();
    await waitFor(() => expect(localStorage.getItem('token')).toBe('token_fake'));
    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch).toBeCalledWith('https://opentdb.com/api_token.php?command=request');
    expect(history.location.pathname).toBe('/game');
  });

  it('Verifica o botão de configurações', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const settingsButton = screen.getByRole('button', { name: 'Settings' });
    expect(settingsButton).toBeInTheDocument();
    expect(settingsButton).toHaveAttribute('type', 'button');
    expect(settingsButton).toBeEnabled();

    expect(history.location.pathname).toBe('/');

    userEvent.click(settingsButton);

    expect(history.location.pathname).toBe('/settings');
  });

  it ('Verifica a mensagem de alerta', () => {
    renderWithRouterAndRedux(<App />);

    const alertMessage = screen.getByText('É necessário nome e senha válidos!');
    const inputEmail = screen.getByLabelText('E-mail:');
    const inputText = screen.getByLabelText('Name:');

    expect(alertMessage).toBeInTheDocument();

    userEvent.type(inputText, 'Mei');
    userEvent.type(inputEmail, 'mei@mei.com');

    expect(alertMessage).not.toBeInTheDocument();
  })
})
