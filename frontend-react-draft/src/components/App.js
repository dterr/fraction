import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { processReceipt } from '../processReceipt.js';
import DragDropFile from './dragUploader/DragImgUpload';
//const processReceipt = require('../processReceipt.js');

class App extends React.Component {
  constructor(props) {
    super(props);
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
                    <DragDropFile></DragDropFile>
                  </div> 
              </header>
          </div>
    );
  }
}

export default App;
