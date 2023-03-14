import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import Page3 from './components/Page3';
import Page4 from './components/Page4';
import Page5 from './components/Page5';
import Page6 from './components/Page6';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function Index() {
  const [username, setUserName] = React.useState('');

  return <BrowserRouter>
    <Routes>
      <Route exact path="/page3/" element={<Page3/>} />
      <Route path="/page5/" element={<Page5/>} />
      <Route path="/page4/:id" element={<Page4 username={username} />} />
      <Route path="/page6/" element={<Page6/>} />
      <Route exact path="/" element={<App username={username} sendBack={setUserName}/>} />
    </Routes>
  </BrowserRouter>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index/>);

