import React, { Component } from 'react'
import './Expired.css';

export default class Expired extends Component {
  render() {
    const { history } = this.props;
    return (
      <section className='main-section-expired'>
        <h1>
          Sessão expirada! D:
          Faça o login novamente!
        </h1>
        <button type='button' onClick={ () => history.push('/') }>
          Login
        </button>
      </section>
    )
  }
}
