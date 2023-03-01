import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { processReceipt } from '../processReceipt.js';
//const processReceipt = require('../processReceipt.js');

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  // Handle the upload of the image from button
  // post it to the axios request
  handleUpload = (e) => {
    e.preventDefault();
    console.log("Upload input", this.uploadInput.files);

    if (this.uploadInput.files.length > 0) {
      const imageUp = new FormData();
      imageUp.append("file", this.uploadInput.files[0]);
      //imageUp.append("stub_photo", server/src/upload/test.png);
      console.log(imageUp);
      //processReceipt(imageUp);
      // processReceipt(imageUp);
      
      axios.post("/api/receipt", imageUp).then(res => {
          console.log("Successful upload", res);
          //this.setState({uploaderOpen: false});
          //window.location.href=`#/photos/${this.props.curUser._id}`;
        }).catch(err => console.log(`POST ERR: ${err.response.error}`));

      /*
      axios.post("/api/receipt", imageUp).then(res => {
          console.log("Successful upload", res);
          //this.setState({uploaderOpen: false});
          //window.location.href=`#/photos/${this.props.curUser._id}`;
        }).catch(err => console.log(`POST ERR: ${err.response.error}`));*/
    }
  };

  render() {
    return (
          <div className="App">
              <header className="App-header">
                <p>
                  Hello! Welcome to Fraction.

                  : )
                </p>

                <form id="form-img-upload" accept="image/png, image/jpeg, image/jpg">
                <input type="image" id="input-img-upload" multiple={false} />
                <label id="label-img-upload" htmlFor="input-img-upload">
                  <div>
                    <p id="form-img-text">Drop your image here or</p>
                    <input id="upload-photo" type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
                    <Link to="/page3/"><button className="upload-button" onClick={this.handleUpload}>Upload</button></Link>
                  </div> 
                </label>
              </form>
              </header>
          </div>
    );
  }
}

export default App;
