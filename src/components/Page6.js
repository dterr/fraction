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
      for (let elem of receipt.lineItems) {
        for (let user of elem.payers) {
          if (!usersList.includes(user)) {
            usersList.push(user);
          }
        }
      }

      let currSubtotal = 0;
      let payers = {}
      for (let line of receipt.lineItems) {
        let numPayers = line.payers.length;
        if (numPayers === 0) {
          numPayers = usersList.length;
        }
        let eachAmount = 0;
        if (line.qty > 1) {
          currSubtotal += line.qty * line.price;
          eachAmount = (line.qty * line.price) / numPayers; 
        } 
        else {
          currSubtotal += line.lineTotal;
          eachAmount = line.lineTotal / numPayers; 
        }
        if (numPayers === usersList.length) {
          for (let u of usersList) {
            if (u in payers) {
              payers[u] += eachAmount;
            }
            else {
              payers[u] = eachAmount;
            }
          }
        }
        else {
          for (let person of line.payers) {
            if (person in payers) {
              payers[person] += eachAmount;
            }
            else {
              payers[person] = eachAmount;
            }
          }
        }
      }

      // correct any errors with subtotal and tax
      if (currSubtotal != receipt.subtotal) {
        receipt.subtotal = currSubtotal;
        let newTax = currSubtotal * (receipt.tax / receipt.subtotal);
        receipt.tax = newTax;
      }

      // add tip and tax to amounts
      let finalTotal = receipt.subtotal + receipt.tip + receipt.tax;
      if (finalTotal != receipt.total) {
        receipt.total = finalTotal;
      }
      let currTotal = 0;
      for (const payer of Object.keys(payers)) {
        currTotal += payers[payer];
        let taxTipAmount = (payers[payer] / receipt.subtotal) * (receipt.tip + receipt.tax);
        // account for +/- $0.01 differences from the final total due to rounding
        if (currTotal + taxTipAmount > finalTotal) {
          taxTipAmount = finalTotal - currTotal
        }
        currTotal += taxTipAmount;
        payers[payer] += taxTipAmount;
        let payerTotal = Math.round((payers[payer] + Number.EPSILON) * 100) / 100
        payers[payer] = payerTotal;
      }
      this.setState({payersDict:payers, receipt:receipt});
    });
  }

  render() {
    const header = "Here's the breakdown for your group at ";
    const groupTotal = "The group's total was $";
    let totals = [];
    for (const payer of Object.keys(this.state?.payersDict)) {
      let payerAmount = payer + " : $" + this.state.payersDict[payer].toFixed(2);
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