const INITIAL_STATE = {
  categories: [],
  category: 'Any category',
  type: 'Any type',
  difficulty: 'Any difficulty',
  amount: '5',
};

const settingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CATEGORIES':
      return { ...state, categories: action.categories };
    case 'CHANGE_SETTINGS':
      return { ...state, ...action.settings }
    default:
      return state;
  };
}

export default settingsReducer;