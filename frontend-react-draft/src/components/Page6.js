import './App.css';
import { Link } from 'react-router-dom';
import React from 'react';

class Page6 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
          <div className="App">
              <header className="App-header">
                <p>
                  Hello! Welcome to Page 6.

                  : )
                </p>

                <form id="form-img-upload" accept="image/png, image/jpeg, image/jpg">
                <input type="image" id="input-img-upload" multiple={false} />
                <label id="label-img-upload" htmlFor="input-img-upload">
                  <div>
                    <p id="form-img-text">Drop your image here or</p>
                    <Link to="/"><button className="upload-button">Upload</button></Link>
                  </div> 
                </label>
              </form>
              </header>
          </div>
    );
  }
}

export default Page6;