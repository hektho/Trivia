const INITIAL_STATE = {
  email: '',
  name: '',
  score: 0,
};

const loginReducer = (state = INITIAL_STATE, action) => {
  const { name, email } = action;
  switch (action.type) {
    case 'LOGIN_ACTION':
      return { ...state, email, name };
    case 'SCORE_ACTION':
      return { ...state, score: state.score + action.score };
    default:
      return state;
  };
}

export default loginReducer;