import './App.css';
import { Link, redirect } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
const Receipt = require('../schema/receipt.js')

class Page4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      username: '',
      allItems: '',
      receiptID: '63ff96c42670dc6a57886bc0'
     
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.handleItemsSubmit = this.handleItemsSubmit.bind(this);
  }

  toggleCheckBoxChange = () => {
    const{handleCheckboxChange, label} = this.props;

    this.setState(({isChecked}) => (
      {
        isChecked: !isChecked,
      }
    ));

    handleCheckboxChange(label);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleNameSubmit(event) {
    alert('Name: ' + this.state.username);
    this.setState({username: event.state.username});

  }

  renderItem(item) {
    const{label} = this.props;
    return <div className="checkbox">
              <label>
                <input type="checkbox" id={item.desc} name={item.desc} value={label} checked={true} onChange={this.toggleCheckboxChange}/>
                {label}
                <label htmlFor="item">{item.name}</label>
              </label>
            </div>
  }

  renderItems() {
    if (this.state.allItems === "") { //&& this.state.receiptID !== "") {
      var allItems = axios.get("http://localhost:5000/receipt/listItems/" + this.state.receiptID);
      allItems.then(response => {
        console.log("This is the response" + JSON.stringify(response.data[0]));
        this.setState({allItems: response.data[0].lineItems})
      }).catch(err => (err.status + ": Unable to get list items from receipt with id: " + this.state.receiptID));
    } else {
      console.log(this.state.allItems);
      return this.state.allItems.map(item => this.renderItem(item));
    }
  }
    /*const{label} = this.props;
    const{isChecked} = this.state;
    return <div>
            {this.renderItems}
              if (this.state.items.Empty) {
                <label>
                Uh-Oh.
                </label>
              }
              for (item in this.state.items) {
                <div className="checkbox">
                <label>
                <input type="checkbox" id="item" name="item" value={label} checked={isChecked} onChange={this.toggleCheckboxChange}/>
                {label}
                <label htmlFor="item">item</label>
                </label>
                </div>
              }
          </div>*/

  // renderCheckboxes() {
  //   var checked = axios.get(/*TODO*/);
  //   checked.then(response => {
  //     this.setState({checked: /*TODO*/});
  //   }).catch(err => (err.status + "Failed"));
  // }

  finishItemsSubmit(response) {
    alert("Received " + JSON.stringify(response));
    return <redirect to="/page6/" />
  }

  //Assuming all items are stored in this.state.items
  handleItemsSubmit(event) {
    if (this.state.username === "") {
      alert('No username found');
    } else {
      var submit = axios.post('/receipt/claimItems', {receiptID: this.state.receiptID, items: this.state.allItems, user: this.state.username});
      submit.then(response => this.finishItemsSubmit(response)).catch(err => alert(err));
    }
  }

  render() {
    //const{label} = this.props;
    //const{isChecked} = this.state;
    return (
          <div className="App">
              <header className="App-header">
                <p>
                  What items did you order? Select them below.
                </p>
                <form onSubmit={this.handleNameSubmit}>
                  <label>
                    Name:
                    <input type="text" value={this.state.username} onChange= {this.handleChange} />
                  </label>
                  <input type="submit" value="Submit" />
                 
                {this.renderItems()}
               
                <div>
                  <button onClick={this.handleItemsSubmit()}>Submit</button>
                </div>

    </form>
              </header>
          </div>
    );
  }
}

export default Page4;