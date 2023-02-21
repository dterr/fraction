import './App.css';

function App() {
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
            <button className="upload-button">Upload</button>
          </div> 
        </label>
      </form>
      </header>
    </div>
  );
}

export default App;
