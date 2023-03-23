import './App.css';
import axios from 'axios';
import React from 'react';

// Page to calculate and display per-person totals
class Page6 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptID: window.location.pathname.substring("/page6/".length),
      receipt: null,
      payersDict: {},
    }
  }

  componentDidMount() {
    this.fetchData(this.state.receiptID);
  }

  fetchData(receiptID) {
    let promise = axios.get('/receipt/listItems/' + JSON.stringify({receiptID: receiptID}));
    promise.then(({data: receipt}) => {
      // calculations to display per-person totals based on the database given receipt ID
      // dictionary maps payers to per-person sum, before taxes and tip
      var payers = {}
      for (var line of receipt.lineItems) {
        var numPayers = line.payers.length;
        var eachAmount = 0;
        if (numPayers > 0) {
          eachAmount = line.lineTotal / numPayers; 
        } 
        for (var person of line.payers) {
          if (person in payers) {
            payers[person] += eachAmount;
          }
          else {
            payers[person] = eachAmount;
          }
        }
      }

      // add tip and tax to amounts
      for (const payer of Object.keys(payers)) {
        var taxTipAmount = (payers[payer] / receipt.subtotal) * (receipt.tip + receipt.tax);
        payers[payer] += taxTipAmount;
        payers[payer] = Math.round((payers[payer] + Number.EPSILON) * 100) / 100;
      }
      
      // TODO: check for rounding errors when sum of per-person totals != receipt.total

      this.setState({payersDict:payers, receipt:receipt});
    });
  }

  render() {
    const header = "Here's the breakdown for your group at ";
    const groupTotal = "The group's total was $";
    var totals = [];
    for (const payer of Object.keys(this.state?.payersDict)) {
      var payerAmount = payer + " : $" + this.state.payersDict[payer];
      totals.push(<div key={payer}>
        <span>{payerAmount}</span>
        <br/>
      </div>)
    }

    //const receipt = "View Receipt";
    const instruction = "Please Venmo " + this.state.receipt?.creatorName + " accordingly. Their Venmo account handle is " + this.state.receipt?.creatorVenmo;
    const thankyou = "We hope you enjoyed using Fraction! Your friends will thank you for making splitting the bill easier (and less awkward) than ever before."
    
    return (
          <div className="App">
              <header className="App-header">
                {this.state.receipt?.isClosed && 
                  <header>
                    <div>
                      {header}
                      {this.state.receipt.establishment}
                      {":"}
                    </div>
                    <br></br>
                    {totals}
                    <br></br>
                    <div>
                      {groupTotal}
                      {this.state.receipt.total}
                      {", including a tip of $"}
                      {this.state.receipt.tip}
                      {"."}
                    </div>
                    <br></br>
                    <br></br>
                    {instruction}
                    <br></br>
                    <br></br>
                    {thankyou}
                    <br></br>
                    <p>If you're interested in learning more about our project, check out our wiki <a href="https://github.com/StanfordCS194/win2023-team15/wiki">here!</a>

                    </p>

                  </header>
                }
                {!this.state.receipt?.isClosed && 
                <header>
                    ERROR: Receipt has not been closed.
                </header>
                }

                  
              </header>
          </div>
    );
  }
}

  export default Page6;