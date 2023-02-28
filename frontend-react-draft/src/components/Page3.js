import './App.css';
import { Link } from 'react-router-dom';
import React from 'react';

class Page3 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
          <div className="App">
              <header className="App-header">
                <p>
                  Here's your unique link! Share it with your friends.
                </p>

                <form id="form-img-upload" accept="image/png, image/jpeg, image/jpg">
                <input type="image" id="input-img-upload" multiple={false} />
                <label id="label-img-upload" htmlFor="input-img-upload">
                  <div>
                    <p id="form-img-text">https://fraction.com/receipt/1234</p>
                    <Link to="/page4/"><button className="upload-button">Go to itemized receipt</button></Link>
                  </div> 
                </label>
              </form>
              </header>
          </div>
    );
  }
}

export default Page3;
