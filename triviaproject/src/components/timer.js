import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeTimerAction, resetTimerAction } from '../redux/actions';

class Timer extends Component {
  componentDidMount() {
    this.startTimer();
  }

  componentDidUpdate() {
    this.verifyTimer();
  }

  startTimer = () => {
    this.interval = setInterval(() => {
      const { changeTimer } = this.props;
      console.log('vc é gay');
      changeTimer();
      this.verifyTimer();
    }, 1000);
  }

  verifyTimer = () => {
    const { timer, disableButtons, enableNextButton } = this.props;

    if (timer === 0) {
      disableButtons();
      enableNextButton();
      clearInterval(this.interval);
    }

    if (timer === 30) {
      clearInterval(this.interval);
      this.startTimer();
    }

    if (window.location.pathname === '/feedback') clearInterval(this.interval);
  }
  render() {
    const { timer } = this.props;
    return (
      <section>
        {`Tempo restante: ${timer}`}
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  timer: state.gameReducer.timer,
  current: state.gameReducer.currentQuestion,
});

const mapDispatchToProps = (dispatch) => ({
  changeTimer: () => dispatch(changeTimerAction()),
  resetTimer: () => dispatch(resetTimerAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
