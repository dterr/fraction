import './App.css';
import { Link, redirect } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
const Receipt = require('../schema/receipt.js')

class Page4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameboxValue: '',
      username: '',
      allItems: '',
      receiptID: '63ff96c42670dc6a57886bc0'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({nameboxValue: event.target.value});
  }

  handleNameSubmit(event) {
    event.preventDefault();
    this.setState({username: this.state.nameboxValue});
  }

  toggleCheckBoxChange(itemName) {
    const{handleCheckboxChange, label} = this.props;
    var newAllItems = this.state.allItems;
    for (var i = 0; i < this.state.allItems.length; i++) {
      if (this.state.allItems[i].desc === itemName) {
        newAllItems[i].isChecked = !newAllItems[i].isChecked;
      }
    }
    this.setState({allItems: newAllItems});

  }

  renderItem(item) {
    const{label} = this.props;
    return  <div className="checkbox" key={item.desc}>
              <label>
                <input type="checkbox" id={item.desc} name={item.desc} value={label} checked={item.isChecked} 
                        onChange={() => this.toggleCheckBoxChange(item.desc)} />
                {label}
                <label htmlFor="item">{item.desc}</label>
              </label>
            </div>
  }

  renderItems() {
    if (this.state.allItems === "") { //&& this.state.receiptID !== "") {
      var allItems = axios.get("http://localhost:5000/receipt/listItems/" + JSON.stringify({receiptID: this.state.receiptID, user: this.state.username}));
      allItems.then(response => {
        this.setState({allItems: response.data.lineItems})
      }).catch(err => (err.status + ": Unable to get list items from receipt with id: " + this.state.receiptID));
    } else {
      return <div>
                <p>Hello {this.state.username}, what items did you order? Select them below.</p>
                {this.state.allItems.map(item => this.renderItem(item))}
                <div>
                  <button onClick={() => this.handleItemsSubmit()}>Submit</button>
                </div>
             </div>
    }
  }

  finishItemsSubmit(response) {
    //alert("Received " + JSON.stringify(response));
    return <redirect to="/page6/" />
  }

  //Assuming all items are stored in this.state.items
  handleItemsSubmit(event) {
    if (this.state.username === "") {
      alert('No username found');
    } else {
      alert("Submitting request with json: " + JSON.stringify({receiptID: this.state.receiptID, items: this.state.allItems, user: this.state.username}))
      //var submit = axios.post('http://localhost:5000/receipt/claimItems/' + JSON.stringify({receiptID: this.state.receiptID, items: this.state.allItems, user: this.state.username}));
      //submit.then(response => this.finishItemsSubmit(response)).catch(err => console.log(err));
    }
  }

  renderNameEntryBox() {
    return <form onSubmit={this.handleNameSubmit}>
              <label>
                Name:
                <input type="text" value={this.state.nameboxValue} onChange={this.handleChange} />
                </label>
              <input type="submit" value="Submit" />
           </form>
  }

  renderPage4() {
    if (this.state.username === "") {
      return this.renderNameEntryBox();
    } else {
      return this.renderItems();
    }
  }

  render() {
    const{label} = this.props;
    const{isChecked} = this.state;
    return (
          <div className="App">
              <header className="App-header">
                {this.renderPage4()}
              </header>
          </div>
    );
  }
}

export default Page4;