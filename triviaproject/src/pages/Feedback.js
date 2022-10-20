import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from '../components/header'
import md5 from 'crypto-js/md5';
import './Feedback.css';
import caetano from '../audiosAndImages/caetano-veloso.mp3';
import parabains from '../audiosAndImages/muitos-parabains.mp3';

class Feedback extends Component {
  componentDidMount() {
    const { name, email, score, assertions, questions } = this.props;
    
    const audio = assertions >= (questions.length / 2) ? 
      new Audio(parabains) 
      : new Audio(caetano);
  
    audio.play();

    const hash = md5(email).toString();

    if (localStorage.getItem('ranking')) {
      const rankingStorage = JSON.parse(localStorage.getItem('ranking'));
      return localStorage.setItem(
        'ranking', 
        JSON.stringify([...rankingStorage, 
          { name, 
            img: `https://www.gravatar.com/avatar/${hash}`, 
            score, 
            assertions, 
            totalQuestions: questions.length 
          }])
      );
    }

    return localStorage.setItem(
      'ranking', 
      JSON.stringify([{ name, 
        img: `https://www.gravatar.com/avatar/${hash}`, 
        score, 
        assertions, 
        totalQuestions: questions.length 
      }])
    );


  }

  render() {
    const { assertions, history, questions } = this.props;
    return (
      <section>
        <Header />
        <section className='main-feedback'>
          {assertions >= (questions.length / 2) ? 
          <h1 className='h1-feedback'> Congratulations!!!! </h1> : 
          <h1 className='h1-feedback'> Could be better... </h1>}

          <h2 
            className='assertions'
          > 
            Total assertions: 
              <span style={ { color: 'red' } }> 
                { assertions } 
              </span> </h2>
          <form className='form-feedback' data-testid='form' action='/'>
            <button type='submit'> Play again </button>
            <button type='button' onClick={ () => history.push('/ranking') }> Ranking </button>
          </form>
        </section>
      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  assertions: state.gameReducer.assertions,
  name: state.loginReducer.name,
  score: state.loginReducer.score,
  email: state.loginReducer.email,
  questions: state.gameReducer.questions
});

export default connect(mapStateToProps, null)(Feedback);
