import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import SelectionsPage from './components/SelectionsPage';
import WaitingPage from './components/WaitingPage';
import TotalsPage from './components/TotalsPage';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function Index() {
  const [username, setUserName] = React.useState('');

  return <BrowserRouter>
    <Routes>
      <Route path="/waiting/:id" element={<WaitingPage username={username}/>} />
      <Route path="/selections/:id" element={<SelectionsPage username={username} />} />
      <Route path="/totals/:id" element={<TotalsPage/>} />
      <Route exact path="/" element={<App username={username} sendBack={setUserName}/>} />
    </Routes>
  </BrowserRouter>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index/>);