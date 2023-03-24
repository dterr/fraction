import './App.css';
import axios from 'axios';
import React from 'react';
import Confetti from 'react-confetti'
import Content from './WhatIsFraction';

// Page to calculate and display per-person totals
class TotalsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptID: window.location.pathname.substring("/totals/".length),
      receipt: null,
      payersDict: {},
      numUsers: 0,
    }
  }

  componentDidMount() {
    this.fetchData(this.state.receiptID);
  }

  // retrieve the receipt
  fetchData(receiptID) {
    let promise = axios.get('/receipt/listItems/' + JSON.stringify({receiptID: receiptID}));
    promise.then(({data: receipt}) => {
      // calculations to display per-person totals based on the database given receipt ID
      
      // get list of users and number of users for this receipt
      let usersList = [];
      for (let elem of receipt.lineItems) {
        for (let user of elem.payers) {
          if (!usersList.includes(user)) {
            usersList.push(user);
          }
        }
      }
      this.state.numUsers = usersList.length;
      const requestData = {
        receiptID: this.state.receiptID,
        numUsers: this.state.numUsers,
      };
      axios.post('/receipt/countUsers/', requestData);

      // dictionary maps payers to per-person sum, before taxes and tip
      let payers = {}
      let currSubtotal = 0;
      for (let line of receipt.lineItems) {
        let numPayers = line.payers.length;
        if (numPayers === 0) {
          numPayers = usersList.length;
        }
        let eachAmount = 0;
        // some receipts do not specify quantity or price
        if (isNaN(line.qty) || isNaN(line.price) || line.qty === null || line.price === null || line.qty === undefined || line.price === undefined) {
          currSubtotal += line.lineTotal;
          eachAmount = line.lineTotal / numPayers; 
        }
        else {
          currSubtotal += line.qty * line.price;
          eachAmount = (line.qty * line.price) / numPayers;
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
      if (currSubtotal !== receipt.subtotal) {
        receipt.subtotal = currSubtotal;
        let newTax = currSubtotal * (receipt.tax / receipt.subtotal);
        receipt.tax = newTax;
      }

      // add tip and tax to amounts
      let finalTotal = Math.round(((receipt.subtotal + receipt.tip + receipt.tax) + Number.EPSILON) * 100) / 100;
      if (finalTotal !== receipt.total) {
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
    }).catch(err => (err.status + ": Could not retrieve receipt with id: " + receiptID));
  }

  render() {
    const header = "Here's the 💥breakdown⬇️ for your group at ";
    const groupTotal = "The group's total was $";
    let totals = [];
    for (const payer of Object.keys(this.state?.payersDict)) {
      let payerAmount = payer + " : $" + this.state.payersDict[payer].toFixed(2);
      totals.push(<div key={payer}>
        <span>{payerAmount}</span>
        <br/>
      </div>)
    }

    const instruction = "Please Venmo " + this.state.receipt?.creatorName + " (@" + this.state.receipt?.creatorVenmo + ") accordingly. 💸💸💸";
    const thankyou =  "We hope you enjoyed using Fraction! 🤑 Your friends will thank you for making splitting the bill easier (and less awkward 👉👈) than ever before. 🥰"
    return (
          <div className="App">
              <Confetti
                colors={['#009688','#4CAF50','#8BC34A']}
                initialVelocityX={5}
                initialVelocityY={8}
                opacity={.75}
                numberOfPieces={300}
                recycle={0}
              />
              <header className="App-header">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "fit-content", marginTop: 150 }}> 
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
                    {instruction}
                    <br></br>
                    <br></br>
                    {thankyou}
                    <br></br>
                    <p>If you're interested in learning more about our project, check out our wiki <a href="https://github.com/StanfordCS194/win2023-team15/wiki">here!</a> 
                    </p>
                    <p>👩🏻‍💻👨🏼‍💻🧑🏻‍💻👨🏽‍💻🧑🏽‍💻</p>
                    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdnepDIkvs9_bxeAtZTTLcNpAxNNwLYg9Gvd2aQXDGIE1O0fQ/viewform?embedded=true" width="640" height="488" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
                  </header>
                }
                {!this.state.receipt?.isClosed && 
                <header>
                    ERROR: Receipt has not been closed.
                </header>
                }

              </div>    
              </header>
          </div>
      );
    } 
  }

  export default TotalsPage;