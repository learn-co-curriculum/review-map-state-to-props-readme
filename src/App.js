import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';

class App extends Component {
  handleOnClickItems(){
    this.props.store.dispatch({type: 'GET_COUNT_OF_ITEMS'})
  }
  handleOnClickUsers(){
    this.props.store.dispatch({type: 'GET_COUNT_OF_USERS'})
  }
  render() {
    debugger;
    return (
      <div className="App">
          <button onClick={this.handleOnClickItems.bind(this)}>Click to change items count</button>
          <button onClick={this.handleOnClickUsers.bind(this)}>Click to change user count</button>
          <p> {this.props.items.length}</p>
      </div>
    );
  }
}

const connectedComponent = connect(mapStateToProps)(App)

function mapStateToProps(state){
  debugger;
  return {items: state.items}
}

export default connectedComponent;
