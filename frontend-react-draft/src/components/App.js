import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DragDropFile from './dragUploader/DragImgUpload';
import namePrompter from './namePrompter/namePrompter';
import { Route, Routes } from 'react-router-dom';
//const processReceipt = require('../processReceipt.js');

class App extends React.Component {
  
  constructor(props) {
    super(props);
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
                  Hello! Welcome to Fraction.

                  : )
                </p>     
                <div>
                <DragDropFile onUpload={this.uponUpload}/>
                </div>      
                  {this.state.uploadSuccess &&
                    <Link path="/Page4"/>
                  }
                  
              </header>
          </div>
    );
  }
}

export default App;
