import React, { Component } from 'react'
import { connect } from 'react-redux';
import Loading from '../components/loading';
import { fetchToken, loginAction } from '../redux/actions';
import './Login.css'
class LoginScreen extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      name: '',
      disabled: true, 
    };
  }

  componentDidMount() {
    const { name, email } = this.props;
    console.log(name, email);
    this.setState({ name, email }, () => {
      const { email, name } = this.state;

      const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (regex.test(email) && name.length) {
        this.setState({ disabled: false });
      } else {
        this.setState({ disabled: true });
      }
    });
  }

  inputChange = ({ target }) => {
    const { value, name } = target;

    this.setState({ [name]: value }, () => {
      const { email, name } = this.state;
      const { loginDispatch } = this.props;
      loginDispatch({name, email});
      const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

      if (regex.test(email) && name.length) {
        this.setState({ disabled: false });
      } else {
        this.setState({ disabled: true });
      };
    })
  }

  playClick = async () => {
    const { loginDispatch, history, fetchToken } = this.props;
    const { email, name } = this.state;
    loginDispatch({ email, name });
    await fetchToken();
    history.push('/game');
  }

  render() {
    const { disabled, email, name } = this.state;
    const { isFetching, history } = this.props;

    if (isFetching) return <Loading message='Loading...' />
    return (
      <section className='main-section-login'>
        <h1> Trivia Game </h1>
        <label htmlFor='name'> Name:
          <input
            className='input'
            type='text' 
            id='name' 
            value={ name } 
            name='name' 
            onChange={ this.inputChange }
            placeholder='Name'
          />
        </label>
        <label htmlFor='email'> E-mail:
          <input 
            className='input'
            type='email' 
            value={ email } 
            id='email' 
            name='email' 
            onChange={ this.inputChange }
            placeholder='E-mail'
          />
        </label>
        <button 
          className='button-login' 
          type='button' onClick={ this.playClick } disabled={ disabled }> Play </button>
        <button 
          className='button-login' 
          type='button' onClick={ () => history.push('/settings') }> Settings </button>
        { disabled && 
          <span
            style={ { color: 'red', fontWeight: '600' } }
          > 
              Valid name and e-mail required!
          </span> }
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.loginReducer.state,
  isFetching: state.fetchReducer.isFetching,
  name: state.loginReducer.name,
  email: state.loginReducer.email,
});

const mapDispatchToProps = (dispatch) => ({
  loginDispatch: (state) => dispatch(loginAction(state)),
  fetchToken: () => dispatch(fetchToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
