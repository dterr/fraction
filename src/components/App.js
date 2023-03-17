import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import DominicForm from './Form/form'; 

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.sendToParent = this.props.sendBack;
    this.state = {
      uploadSuccess: false
    };
  }

  uponUpload = () => {
    this.setState({ uploadSuccess: true }, () => {
      console.log(this.state)
    });
  }

  render() {
    return (
          <div className="App">
              <header className="App-header">
                <p>
                  Hello! Welcome to Fraction 🧾
                </p>     
                <div>
                  <DominicForm sendBack={this.sendToParent} />
                  
                </div>   
                {console.log(this.state.username)}
                  {this.state.uploadSuccess &&
                    <Link path="/Page4"/>
                  }
                  
              </header>
          </div>
    );
  }
}

export default App;
