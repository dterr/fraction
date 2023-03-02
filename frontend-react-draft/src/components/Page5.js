import './App.css';
//import { Link } from 'react-router-dom';
import React from 'react';
//import Page6 from './Page6';

class Page5 extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const thanks = "Thanks for selecting your order!";
    const instruction = "Please wait while your friends finish selecting their orders.";
    // TODO: only show this button for the primary user
    const buttonText = "Click this button once everyone has finished selecting their orders."
    return (
          <div className="App">
              <header className="App-header">
                {thanks}
                <br></br>
                <br></br>
                {instruction}
                <br></br>
                <br></br>
                <a href="/page6/">
                    <button>{buttonText}</button>
                </a>
              </header>
          </div>
    );
  }
}

export default Page5;
