import React, { Component } from 'react'
import './loading.css';

export default class Loading extends Component {
  render() {
    const { message } = this.props;
    return (
      <section className='main-loading-component'>
        <span>
          { message }
        </span>
        <img src='https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921' alt='Loading gif' width='100px'/>
      </section>
    );
  }
}
