import React, { Component } from 'react'
import { connect } from 'react-redux';
import Header from '../components/header'
import Loading from '../components/loading';
import Timer from '../components/timer';
import { assertionAction, changeScoreAction, currentQuestion, fetchQuestions, resetTimerAction } from '../redux/actions'
import './Game.css';
import acertou from '../audiosAndImages/acertou.mp3';
import errou from '../audiosAndImages/errou-faustao.mp3';
class Game extends Component {
  constructor() {
    super();

    this.state = {
      disabled: false,
      answersShuffled: [],
      nextButton: false,
      currentQuestion: 0,
    };
  }

  componentWillUnmount() {
    const { resetTimer } = this.props;

    resetTimer();
  }

  async componentDidMount() {
    const { history, fetchQuestions } = this.props;
    await fetchQuestions(history);

    const shuffled = this.shuffleAnswers(this.props.questions, this.state.currentQuestion);
    this.setState({ answersShuffled: shuffled });
  }

  disableButtons = () => {
    this.setState({ disabled: true });
  }

  enableButtons = () => {
    this.setState({ disabled: false });
  }

  enableNextButton = () => {
    this.setState({ nextButton: true });
  }

  disableNextButton = () => {
    this.setState({ nextButton: false });
  }

  clearBorderButtons = () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((i) => i.classList.remove('border-color-red', 'border-color-green'));
  }

  changeCurrentQuestion = () => {
    const { resetTimer, history, questions } = this.props;
    if (this.state.currentQuestion === questions.length - 1) return history.push('/feedback');
    this.setState((prev) => ({
      currentQuestion: prev.currentQuestion + 1,
    }), () => {
      resetTimer();
      this.clearBorderButtons();
      console.log(this.state.currentQuestion);
      const shuffled = this.shuffleAnswers(this.props.questions, this.state.currentQuestion);
      
      this.setState({ answersShuffled: shuffled });
      this.disableNextButton();
      this.enableButtons();
    });

  }

  shuffleAnswers = (questions, curr) => {
    const allQuestions = [...questions[curr].incorrect_answers, questions[curr].correct_answer];
    if (allQuestions.length > 0) {
      for(let i = allQuestions.length-1; i > 0; i -= 1) {
        let j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]]
      }
      
      return allQuestions;
    }
    return allQuestions
  } 

  changeScore = () => {
    const { questions, timer, changeScore } = this.props;
    const { currentQuestion } = this.state;

    const points = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    const calculation = 10 + (timer * points[questions[currentQuestion].difficulty]);
    changeScore(calculation);
  }

  render() {
    const { questions, isFetching, dispatchAssertion } = this.props;
    const { disabled, answersShuffled, nextButton, currentQuestion } = this.state;
    if (isFetching) return <Loading message='Loading...' />
    return (
      <div>
        <Header />

        {questions.length 
          &&  (
            <section className='main-section-game'>
              <Timer
                disableButtons={ this.disableButtons }
                enableNextButton={ this.enableNextButton }
              />
              <h3> Category: {questions[currentQuestion].category}</h3>
              <h2 className=''> 
                { currentQuestion + 1 }. 
                { `(${questions[currentQuestion].difficulty})` } 
                { questions[currentQuestion].question } 
              </h2>
              <section>
                {answersShuffled.map((i, index) => {
                  if (questions[currentQuestion].correct_answer === i) {
                    return <button 
                      key={ i }
                      disabled={ disabled }
                      type='button' 
                      id='correct' 
                      onClick={ 
                        ({ target }) => {
                          document.getElementById(target.id)
                            .classList.add('border-color-green');
                          this.changeScore();
                          this.enableNextButton();
                          this.disableButtons();
                          dispatchAssertion();
                          const audio = new Audio(acertou);
                          audio.play();
                        }}
                    > 
                      { i } 
                    </button>
                  }
                  return <button
                    key={ i }
                    disabled={ disabled }
                    type='button' 
                    id={`incorrect-${index}`}
                    onClick={ ({ target }) => {
                      document.getElementById(target.id)
                        .classList.add('border-color-red');
                      this.enableNextButton();
                      this.disableButtons();
                      const audio = new Audio(errou);
                      audio.play();
                    } }
                  > 
                    { i } 
                  </button>
                })} 
              </section>
              { nextButton && <button type='button' onClick={ this.changeCurrentQuestion }> Next </button>}
            </section>
          )}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchQuestions: (history) => dispatch(fetchQuestions(history)),
  changeScore: (score) => dispatch(changeScoreAction(score)),
  changeCurrent: () => dispatch(currentQuestion()),
  resetTimer: () => dispatch(resetTimerAction()),
  dispatchAssertion: () => dispatch(assertionAction()),
});

const mapStateToProps = (state) => ({
  questions: state.gameReducer.questions,
  isFetching: state.fetchReducer.isFetching,
  timer: state.gameReducer.timer,
  categoriesSelected: state.settingsReducer.categorieSelected,
  type: state.settingsReducer.type,
  difficulty: state.settingsReducer.difficulty,
  amount: state.settingsReducer.amount,
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
