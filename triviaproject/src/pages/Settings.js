import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loading from '../components/loading';
import { changeSettingsAction, fetchCategories, isFetching } from '../redux/actions';
import './Settings.css';

class Settings extends Component {
  constructor() {
    super();

    this.state = {
      amount: '5',
      type: 'Any type',
      category: 'Any category',
      difficulty: 'Any difficulty',
    };
  }


  async componentDidMount() {
    const { dispatchCategories } = this.props;


    await dispatchCategories();
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value.toLowerCase() });
  }

  verifyQuestions = async () => {
    let keys = Object.entries(this.state);

    let url = `https://opentdb.com/api.php?`;

    keys.forEach((i) => {
      console.log(i)
      if (!i[1].startsWith('any') && !i[1].startsWith('Any')) {
        url += `&${i[0]}=${i[1]}`
      }
    });

    console.log(url);

    const response = await fetch(url);

    const json = await response.json();
    console.log(json);
    if (json.response_code === 1) {
      return false;
    }

    return true;

  }

  sendToRedux = async () => {
    const { dispatchSettings, dispatchIsFetching } = this.props;
    dispatchIsFetching();
    console.log(this.verifyQuestions());
    if (!await this.verifyQuestions()) {
      alert('Could not find this amount of questions!');
      dispatchIsFetching();
      return;
    }

    dispatchSettings(this.state);
    dispatchIsFetching();
    window.alert('Settings were applied!');

    this.setState({
      amount: '5',
      type: 'Any type',
      category: 'Any category',
      difficulty: 'Any difficulty',
    });
  }

  render() {
    const { 
      categories,
      isFetching,
      history,
      
    } = this.props;

    const { amount } = this.state;
    if (isFetching) return <Loading message='Loading...' />
    return (
      <section className='main-section-settings'>
        <h1> Question settings </h1>
        <label htmlFor='categories'> Category:
          <select id='categories' name='category'
            value={ this.state.category }
            onChange={ this.handleChange }
          >
            <option value='Any category'>
              Any category
            </option>
            {categories.map((i) => (
              <option 
                key={ i.id } 
                value={ i.id }
              > 
                { i.name } 
              </option>
            ))}
          </select>
        </label>
        <label htmlFor='difficulty'> Difficulty:
          <select id='difficulty' name='difficulty'
            value={ this.state.difficulty }
            onChange={ this.handleChange }
          >
              <option value='Any difficulty'>
                Any difficulty
              </option>
              <option value='easy'>
                Easy
              </option>
              <option value='medium'>
                Medium
              </option>
              <option value='hard'>
                Hard
              </option>
          </select>
        </label>
        <label htmlFor='type'> Type:
          <select id='type' name='type'
            value={ this.state.type }
            onChange={ this.handleChange }
          >
            <option value='Any type'>
              Any type
            </option>
            <option value='multiple'>
              Multiple choices
            </option>
            <option value='boolean'>
              True/false
            </option>
          </select>
        </label>
        <label htmlFor='amount'> Amount:
            <input
              className='input-settings'
              type='number' 
              id='amount' 
              min='5' 
              max='50' 
              value={ amount }
              name='amount'
              onChange={ this.handleChange }
            />
        </label>
        <section className='section-buttons-settings'>
          <button 
            className='button-settings' 
            type='button' 
            onClick={ this.sendToRedux }> Apply</button>
          <button 
            className='button-settings' 
            type='button' 
            onClick={ () => history.goBack() } 
          > Back </button>
          <span id='alert-message' style={{ display: 'none', color: 'red' }}>
            Could not find this amount of questions!
          </span>
        </section>
      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  categories: state.settingsReducer.categories,
  isFetching: state.fetchReducer.isFetching,
  category: state.settingsReducer.categorieSelected,
  amount: state.settingsReducer.amount,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCategories: () => dispatch(fetchCategories()),
  dispatchSettings: (settings) => dispatch(changeSettingsAction(settings)),
  dispatchIsFetching: () => dispatch(isFetching()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
