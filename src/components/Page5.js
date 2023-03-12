import './App.css';
import React from 'react';
import axios from 'axios';

class Page5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receipt: null,
      buttonText: "",
      timerID: null,
      username: ""
    }
  }

  componentDidMount() {
    const url = new URL(window.location.href);
    const urlSearch = new URLSearchParams(url.search);
    const username = urlSearch.get("username");
    this.setState({ username: username })
    this.fetchData(username);
    const timerID = setInterval(() => {
      this.fetchData(username);
    }, 5000)
    this.setState({timerID:timerID});
  }

  componentWillUnmount(){
    clearInterval(this.state.timerID);
  }

  fetchData(username) {
    let promise = axios.get('http://localhost:5000/receipt/listItems/' + JSON.stringify({receiptID: "63ff96c42670dc6a57886bc0"}));
    promise.then(({data: receipt}) => {
      let usersList = [];
      for (var elem of receipt.lineItems) {
        for (var person of elem.payers) {
          if (!usersList.includes(person)) {
            usersList.push(person);
          }
        }
      }
      let text = '';
      if (receipt.creatorName === username) {
        text = "Click this button once everyone has finished selecting their orders.";
      } else if (!usersList.includes(username)) {
        text = "error: name not recognized";
      }

      this.setState({receipt:receipt});
      this.setState({buttonText:text});

      if(receipt.isClosed){
        clearInterval(this.state.timerID);
        window.location.assign("/page6");
      }
    });
  }
  
  render() {
    const thanks = "Thanks for selecting your order!";
    const instruction = "Please wait while your friends finish selecting their orders.";

    return (
          <div className="App">
              <header className="App-header">
                {thanks}
                <br></br>
                <br></br>
                {instruction}
                <br></br>
                <br></br>
                {this.state.username === this.state.receipt?.creatorName && !this.state.receipt?.isClosed && 
                <header>
                    <button onClick={() => {
                      axios.post('http://localhost:5000/receipt/status/' + JSON.stringify({receiptID: "63ff96c42670dc6a57886bc0", isClosed: true}));
                    }}>{this.state.buttonText}</button>
                </header>
                }
                {this.state.username !== this.state.receipt?.creatorName && !this.state.receipt?.isClosed && 
                <header>
                    {this.state.buttonText}
                </header>
                }
              </header>
          </div>
    );
  }
}

export default Page5;
