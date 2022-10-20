import React, { Component } from 'react'
import './Ranking.css';

export default class Ranking extends Component {
  resetRanking = () => {
    document.querySelector('dialog').close();
    localStorage.removeItem('ranking');
    window.location.reload();
    window.alert('Ranking reseted successfully!')
  }

  render() {
    
    return (
      <section className='main-section-ranking'>
        <h1> Ranking </h1>
        <form action='/'>
          <button type='submit'> Back to beginning </button>
          <button
            
            type='button' 
            onClick={() => document.querySelector('dialog').showModal()}> Reset ranking </button>
        </form>
        <dialog>
          <h1>
            Are you sure? This will reset the entire ranking!
          </h1>
          <button
            style={{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}
            type='button' onClick={ this.resetRanking }> Yes </button>
          <button
            style={{ backgroundColor: 'green', borderColor: 'green', color: 'white'}}
            type='button' 
            onClick={() => document.querySelector('dialog').close()}
          > 
            No 
          </button>
        </dialog>
        {localStorage.getItem('ranking')
          ? (
            <section>
              {JSON.parse(localStorage.getItem('ranking')).sort((a, b) => {
                if (a.score > b.score) return -1;
                if (a.score < b.score) return 1;
                return 0;
              }).map((i) => (
                <section className='info-ranks'> 
                  <img src={ i.img } alt='Foto de perfil' width='50px' />
                  <h2> Name: { i.name } </h2>
                  <h2> Score: { i.score } </h2>
                  <h2> Assertions: { i.assertions } </h2>
                  <h2> Total questions: { i.totalQuestions } </h2>
                </section>
              ))}
            </section>
          ) : <h1> No ranking yet ;-; </h1>}
      </section>
    )
  }
}
