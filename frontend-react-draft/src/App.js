import './App.css';
import ThankYouPage from './thankYouPage';
import TotalBreakdownPage from './totalBreakdownPage';

function App() {
  //pages 5 and 6 are displayed together for this draft
  return (
    <div className="App">
      <header className="App-header">
        <ThankYouPage /> 
        <br></br>
        -----------------------------------------------------
        <br></br>
        <br></br>
        <TotalBreakdownPage />
      </header>
    </div>
  );
}

export default App;
