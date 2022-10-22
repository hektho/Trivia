import store from '../store';

export const loginAction = ({ name, email }) => ({ type: 'LOGIN_ACTION', email, name });

export const isFetching = () => ({ type: 'IS_FETCHING' });

export const questionsAction = (questions) => ({ type: 'GAME_ACTION', questions });

export const currentQuestion = () => ({ type: 'CURRENT_ACTION'});

export const changeTimerAction = () => ({ type: 'TIMER_ACTION' });

export const resetTimerAction = () => ({ type: 'RESET_TIMER' });

export const changeScoreAction = (score) => ({ type: 'SCORE_ACTION', score });

export const assertionAction = () => ({ type: 'ASSERTION_ACTION' });

export const categoriesAction = (categories) => ({ type: 'CATEGORIES', categories });

export const changeSettingsAction = (settings) => ({ type: 'CHANGE_SETTINGS', settings });


export const fetchQuestions = (history) => {
  const { settingsReducer } = store.getState();

  let keys = Object.entries(settingsReducer);

  keys.shift();

  let url = `https://opentdb.com/api.php?`;

  keys.forEach((i) => {
    console.log(i)
    if (!i[1].startsWith('any') && !i[1].startsWith('Any') ) {
      url += `&${i[0]}=${i[1]}`
    }
  });
  
  console.log(url);
  return async (dispatch) => {
    dispatch(isFetching());
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${url}&token=${token}`);
      const questions = await response.json();
      console.log(questions);
      if (questions.response_code === 3) {
        localStorage.setItem('token', '');
        dispatch(isFetching());
        return history.push('/expired');
      }

      if (questions.response_code === 4) {
        const response = await fetch(`
          https://opentdb.com/api_token.php?command=reset&token=${localStorage.getItem('token')}
        `);
        const json = await response.json();
        
        console.log(json);
      }
      dispatch(questionsAction(questions.results));
      return dispatch(isFetching());
    } catch(error) {
      console.log(error);
      dispatch(isFetching());
    }
  }
}

export const fetchToken = () => {
	return async (dispatch) => {
		dispatch(isFetching());
		try {
			const result_1 = await fetch('https://opentdb.com/api_token.php?command=request');
			const { token } = await result_1.json();
			localStorage.setItem('token', token.toString());
			dispatch(isFetching());
		} catch (error) {
			console.log(error);
			dispatch(isFetching());
		}
	};
}

export const fetchCategories = () => {
  return async (dispatch) => {
    dispatch(isFetching());
    try {
      const response = await fetch('https://opentdb.com/api_category.php');
      const { trivia_categories } = await response.json();
      dispatch(categoriesAction(trivia_categories));
      dispatch(isFetching());
    } catch (error) {
      dispatch(isFetching());
      console.log(error);
    }
  } 
}