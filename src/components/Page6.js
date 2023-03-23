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

      let usersList = [];
      for (var elem of receipt.lineItems) {
        for (var user of elem.payers) {
          if (!usersList.includes(user)) {
            usersList.push(user);
          }
        }
      }

      var payers = {}
      console.log(receipt);
      for (var line of receipt.lineItems) {
        var numPayers = line.payers.length;
        if (numPayers === 0) {
          numPayers = usersList.length;
        }
        console.log(numPayers);
        var eachAmount = 0;
        if (line.qty > 1) {
          eachAmount = (line.qty * line.price) / numPayers; 
        } 
        else {
          eachAmount = line.lineTotal / numPayers; 
        }
        if (numPayers === usersList.length) {
          for (var u of usersList) {
            if (u in payers) {
              payers[u] += eachAmount;
            }
            else {
              payers[u] = eachAmount;
            }
          }
        }
        else {
          for (var person of line.payers) {
            if (person in payers) {
              payers[person] += eachAmount;
            }
            else {
              payers[person] = eachAmount;
            }
          }
        }
      }

      console.log(payers);

      // add tip and tax to amounts
      let finalTotal = receipt.subtotal + receipt.tip + receipt.tax;
      let currTotal = 0;
      for (const payer of Object.keys(payers)) {
        var taxTipAmount = (payers[payer] / receipt.subtotal) * (receipt.tip + receipt.tax);
        // account for +/- $0.01 differences from the final total due to rounding
        if (currTotal + taxTipAmount > finalTotal) {
          taxTipAmount = finalTotal - currTotal
        }
        payers[payer] += taxTipAmount;
        payers[payer] = Math.round((payers[payer] + Number.EPSILON) * 100) / 100;
      }
      this.setState({payersDict:payers, receipt:receipt});
    });
  }

  render() {
    const header = "Here's the breakdown for your group at ";
    const groupTotal = "The group's total was $";
    var totals = [];
    for (const payer of Object.keys(this.state?.payersDict)) {
      var payerAmount = payer + " : $" + this.state.payersDict[payer].toFixed(2);
      totals.push(<div key={payer}>
        <span>{payerAmount}</span>
        <br/>
      </div>)
    }

    //const receipt = "View Receipt";
    const instruction = "Please Venmo " + this.state.receipt?.creatorName + " accordingly. Thanks for using Fraction!";

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