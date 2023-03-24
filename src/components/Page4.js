import './App.css';
import React from 'react';
import axios from 'axios';
import Content from "./WhatIsFraction.js"

class Page4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameboxValue: '',
      username: props.username,
      allItems: '',
      receiptID: window.location.pathname.substring("/page4/".length) //Gets receipt ID from url
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.handleItemsSubmit = this.handleItemsSubmit.bind(this);
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
    let newAllItems = this.state.allItems;
    for (let i = 0; i < this.state.allItems.length; i++) {
      if (this.state.allItems[i].desc === itemName) {
        newAllItems[i].isChecked = !newAllItems[i].isChecked;
      }
    }
    this.setState({allItems: newAllItems});

  }

  renderItem(item) {
    const { label } = this.props;
    let itemNameWithQuantity = item.qty < 2 ? item.desc : "(" + item.qty + "x) " + item.desc;
    return (
      <div className="checkbox-item" key={item.desc} >
        <input
          type="checkbox"
          id={item.desc}
          name={item.desc}
          value={label}
          checked={item.isChecked}
          onChange={() => this.toggleCheckBoxChange(item.desc)}
        />
        <label htmlFor={itemNameWithQuantity}>{itemNameWithQuantity}</label>
      </div>
    );
  }

  renderItems() {
    if (this.state.receiptID === '') {
      alert('No receipt ID found, did you paste the correct URL?');
    } else if (this.state.allItems === "") {
      let allItems = axios.get("/receipt/listItems/" + JSON.stringify({receiptID: this.state.receiptID, user: this.state.username}));
      allItems.then(response => {
        this.setState({allItems: response.data.lineItems})
      }).catch(err => (err.status + ": Unable to get list items from receipt with id: " + this.state.receiptID));
    } else {
      return (
        <div>
          <p>😳😳 Hello {this.state.username}! Thanks for using Fraction to make splitting the bill easy! 🥹</p>
          <p>What items did you order? 🤔 Select them below.</p>
          <div className="checkbox-grid">
            {this.state.allItems.map((item) => this.renderItem(item))}
          </div>
          <div className="button-container">
            <button onClick={() => this.handleItemsSubmit()}>Submit</button>
          </div>
        </div>
      );
    }
  }

  finishItemsSubmit(response) {
    window.location.assign("/waiting/" + this.state.receiptID + "?username=" + this.state.username);
  }

  handleItemsSubmit(event) {
    if (this.state.username === "") {
      alert('No username found');
    } else {
      const requestData = {
        receiptID: this.state.receiptID,
        items: this.state.allItems,
        user: this.state.username,
        venmo: this.state.venmo
      };
      axios.post('/receipt/claimItems/', requestData).then(
        (response) => this.finishItemsSubmit(response)
      ).catch(
        (err) => console.log(err)
      );
    }
  }

  renderNameEntryBox() {
    return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 550 }}>
          <p>👋 Sign in here to select the items that you ordered! ☑️ <br></br> Use a name that is unique from anyone else's in your group.</p>
          <form onSubmit={this.handleNameSubmit}>
              <label>
                Name:
                <input type="text" value={this.state.nameboxValue} onChange={this.handleChange} />
                </label>
              <input type="submit" value="Submit" />
           </form>
          </div>
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
                <br></br>
                <Content />
              </header>
          </div>
    );
  }
}

export default Page4;