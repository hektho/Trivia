import React, { Component } from 'react'
import { connect } from 'react-redux'
import md5 from 'crypto-js/md5';
import './header.css';

class Header extends Component {
  render() {
    const { playerName, score, email } = this.props;
    const hash = md5(email).toString();
    return (
      <header data-testid='header'>
        <img 
          className='img-player' 
          src={`https://www.gravatar.com/avatar/${hash}`} 
          alt='Imagem do perfil'
        />
        <section className='name-score'>
          <h3>
              { playerName || 'User' }
          </h3>
          <h2>
              Score: { score }
          </h2>
        </section>
      </header>
    )
  }
}

const mapStateToProps = (state) => ({
  playerName: state.loginReducer.name,
  score: state.loginReducer.score,
  email: state.loginReducer.email,
});

export default connect(mapStateToProps, null)(Header);

