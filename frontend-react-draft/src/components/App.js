import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  handleUpload = (e) => {
    e.preventDefault();
    console.log("Upload input", this.uploadInput.files);
    if (this.uploadInput.files.length > 0) {
      const imageUp = new FormData();
      imageUp.append("uploadedphoto", this.uploadInput.files[0]);

      axios.post("/photos/new", imageUp).then(res => {
          console.log("Successful upload", res);
          this.setState({uploaderOpen: false});
          window.location.href=`#/photos/${this.props.curUser._id}`;
        }).catch(err => console.log(`POST ERR: ${err}`));
    }
    this.props.newAct();
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
                    <Link to="/page3/"><button className="upload-button" onClick={() => this.handleUpload()}>Upload</button></Link>
                  </div> 
                </label>
              </form>
              </header>
          </div>
    );
  }
}

export default App;
