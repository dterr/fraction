import './App.css';
import React from 'react';
import axios from 'axios';

class WaitingPage extends React.Component {
  // initialize variables used
  constructor(props) {
    super(props);
    this.state = {
      receiptID: window.location.pathname.substring("/waiting/".length), //Gets receipt ID from url
      receipt: null,
      buttonText: "",
      selectingText: "",
      timerID: null,
      username: "",
      numUnselected: 0
    }
  }

  // find primary username, check database every 5 seconds
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

  // retrieve receipt
  fetchData(username) {
    let promise = axios.get('/receipt/listItems/' + JSON.stringify({receiptID: this.state.receiptID, user: this.state.username}));
    promise.then(({data: receipt}) => {

      // find all primary and secondary users and count the number of items that are unselected
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
        text = "Calculate!";
      } else if (!usersList.includes(username)) {
        text = "error: name not recognized";
      }

      let selecting_text = "";

      if (receipt.creatorName === username) {
        selecting_text = "Click 👇below👇 when all participants are done selecting their orders.";
      }

      this.setState({receipt:receipt});
      this.setState({buttonText:text});
      this.setState({selectingText:selecting_text});

      this.setState({numUnselected:currUnselected});

      // if receipt is closed, automatically load the next page
      if(receipt.isClosed){
        clearInterval(this.state.timerID);
        window.location.assign("/totals/" + this.state.receiptID);
      }
    });
  }
  
  render() {
    const thanks = "🙏 Thanks for selecting your order! 🙏";
    const instruction = "⌛ Please wait while your friends finish selecting their orders. ⌛";
    const warning = "😱 Warning: Not all items have been selected yet. Any unselected items will be split evenly among the group. 🧮🧮🧮"

    return (
          <div className="App">
              <header className="App-header">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 550 }}>
                {thanks}
                <br></br>
                <br></br>
                {instruction}
                {this.state.numUnselected > 0 && 
                <header>
                    <br></br>
                    {warning}
                </header>
                }
                <br></br>
                {this.state.username === this.state.receipt?.creatorName && !this.state.receipt?.isClosed && 
                <header>
                    {this.state.selectingText}
                    <br></br>
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
                </div>
              </header>
          </div>
    );
  }
}

export default WaitingPage;
