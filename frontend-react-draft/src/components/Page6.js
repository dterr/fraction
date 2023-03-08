import './App.css';
//import { Link } from 'react-router-dom';
import React from 'react';
//import { lookupService } from 'dns/promises';

// Page to calculate and display per-person totals
class Page6 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // mock database for receipt information - this is the data we would have at the end of Page 3
    const foods = [{lineTotal: 15, desc: "Tacos", qty: 3, price: 5, unit: "taco", payers:["Paul", "Douglas", "Louis"]},
            {lineTotal: 24, desc: "Burritos", qty: 2, price: 12, unit: "burrito", payers:["Louis", "Paul"]},
            {lineTotal: 6, desc: "Horchata", qty: 1, price: 6, unit: "cup", payers:["Douglas"]}];
    const test_bill = {creatorName: "Paul", establishment:"Chilis", total: 53, subtotal: 45, cash: 0, change: 0, tax: 0, tip: 8, currency: "USD", lineItems: foods};
    
    // calculations to display per-person totals based on the above database
    // dictionary maps payers to per-person sum and adds the tip
    var payers = {}
    for (var line of foods) {
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
    // add tip to amounts
    for (const payer of Object.keys(payers)) {
      var tipAmount = (payers[payer] / test_bill.subtotal) * test_bill.tip;
      payers[payer] += tipAmount;
      payers[payer] = Math.round((payers[payer] + Number.EPSILON) * 100) / 100;
    }

    // POSSIBLE TODO: check and correct for any rounding errors

    // display the page
    //var name = "NAME";
    //const greeting = "Hey " + name + "!";
    const header = "Here's the breakdown for your group at ";
    const groupTotal = "The group's total was $";
    var totals = [];
    for (const payer of Object.keys(payers)) {
      var payerAmount = payer + " : $" + payers[payer];
      totals.push(payerAmount);
      totals.push(<br></br>);
    }
    //const receipt = "View Receipt";
    const instruction = "Please Venmo " + test_bill.creatorName + " accordingly. Thanks for using Fraction!";


    return (
          <div className="App">
              <header className="App-header">
                <div>
                  {header}
                  {test_bill.establishment}
                  {":"}
                </div>
                <br></br>
                {totals}
                <br></br>
                <div>
                  {groupTotal}
                  {test_bill.total}
                  {", including a tip of $"}
                  {test_bill.tip}
                  {"."}
                </div>
                <br></br>
                <br></br>
                {instruction}
              </header>
          </div>
    );
  }
}

  export default Page6;