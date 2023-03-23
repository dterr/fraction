import './App.css';
import React from 'react';
import axios from 'axios';

class Page5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptID: window.location.pathname.substring("/page5/".length), //Gets receipt ID from url
      receipt: null,
      buttonText: "",
      timerID: null,
      username: "",
      numUnselected: 0
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
    let promise = axios.get('/receipt/listItems/' + JSON.stringify({receiptID: this.state.receiptID, user: this.state.username}));
    promise.then(({data: receipt}) => {
      let usersList = [];
      let currUnselected = 0;
      for (let elem of receipt.lineItems) {
        if (elem.payers.length === 0) {
          currUnselected++;
        }
        for (let person of elem.payers) {
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

      console.log(this.state.numUnselected);
      console.log(currUnselected);

      this.setState({numUnselected:currUnselected});

      if(receipt.isClosed){
        clearInterval(this.state.timerID);
        window.location.assign("/page6/" + this.state.receiptID);
      }
    });
  }
  
  render() {
    const thanks = "Thanks for selecting your order!";
    const instruction = "Please wait while your friends finish selecting their orders.";
    const warning = "Warning: Not all items have been selected yet. Any unselected items will be split evenly among the group."

    return (
          <div className="App">
              <header className="App-header">
                {thanks}
                <br></br>
                <br></br>
                {instruction}
                {this.state.numUnselected > 0 && 
                <header>
                    <br></br>
                    <br></br>
                    {warning}
                </header>
                }
                <br></br>
                <br></br>
                {this.state.username === this.state.receipt?.creatorName && !this.state.receipt?.isClosed && 
                <header>
                    <button onClick={() => {
                      axios.post('/receipt/status/' + JSON.stringify({receiptID: this.state.receiptID, isClosed: true}));
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
