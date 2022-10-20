const INITIAL_STATE = {
  isFetching: false,
};

const fetchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'IS_FETCHING':
      return { ...state, isFetching: !state.isFetching };
    default:
      return state;
  };
}

export default fetchReducer;