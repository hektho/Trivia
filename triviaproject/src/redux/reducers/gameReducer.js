const INITIAL_STATE = {
  questions: [],
  timer: 30,
  assertions: 0,
};

const gameReducer = (state = INITIAL_STATE, action) => {
  const { questions } = action;
  switch(action.type) {
    case 'GAME_ACTION':
      return {
        ...state, questions
      };
    case 'CURRENT_ACTION':
      return {
        ...state, currentQuestion: state.currentQuestion + 1,
      }
    case 'TIMER_ACTION':
      return {
        ...state, timer: state.timer - 1
      }
    case 'RESET_TIMER':
        return {
          ...state, timer: 30,
        }
    case 'ASSERTION_ACTION':
      return {
        ...state, assertions: state.assertions + 1,
      }
    default:
      return state;
  }
}

export default gameReducer;