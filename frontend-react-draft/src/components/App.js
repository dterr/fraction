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

  // Handle the upload of the image from button
  // post it to the axios request
  // handleUpload = (e) => {
  //   e.preventDefault();
  //   console.log("Upload input", this.uploadInput.files);

  //   if (this.uploadInput.files.length > 0) {
  //     const imageUp = new FormData();
  //     imageUp.append("file", this.uploadInput.files[0]);
  //     //imageUp.append("stub_photo", server/src/upload/test.png);
  //     console.log(imageUp);
  //     //processReceipt(imageUp);
  //     // processReceipt(imageUp);
      
  //     axios.post("/api/receipt", imageUp).then(res => {
  //         console.log("Successful upload", res);
  //         //this.setState({uploaderOpen: false});
  //         //window.location.href=`#/photos/${this.props.curUser._id}`;
  //       }).catch(err => console.log(`POST ERR: ${err.response.error}`));

  //     /*
  //     axios.post("/api/receipt", imageUp).then(res => {
  //         console.log("Successful upload", res);
  //         //this.setState({uploaderOpen: false});
  //         //window.location.href=`#/photos/${this.props.curUser._id}`;
  //       }).catch(err => console.log(`POST ERR: ${err.response.error}`));*/
  //   }
  // };

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
