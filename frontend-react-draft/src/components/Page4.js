import './App.css';
import { Link, Redirect } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

class Page4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      username: '',
      items: '',
      receiptID: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.handleItemsSubmit = this.handleItemsSubmit.bind(this);
  }

  state = {
    isChecked: false,
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

  renderItems() {
    var allItems = axios.get("/receipt/claimItems" + this.state.items);
    allItems.then(response => {
      this.setState({allItems: this.state.items, isChecked:false})
    }).catch(err => (err.status + " Failed"));
    const{label} = this.props;
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
          </div>
  }

  // renderCheckboxes() {
  //   var checked = axios.get(/*TODO*/);
  //   checked.then(response => {
  //     this.setState({checked: /*TODO*/});
  //   }).catch(err => (err.status + "Failed"));
  // }

  finishItemsSubmit(response) {
    alert("Received " + JSON.stringify(response));
    return <Redirect to="/page6/" />
  }

  //Assuming all items are stored in this.state.items
  handleItemsSubmit(event) {
    if (this.state.username === "") {
      alert('No username found');
    } else {
      var submit = axios.post('/receipt/claimItems', {receiptID: this.state.receiptID, items: this.state.items});
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
                  
                  

                  {/* for (item in allItems) {
                    <div className="checkbox">
                    <label>
                      <input type="checkbox" id="item" name="item" value={label} checked={isChecked} onChange={this.toggleCheckboxChange}/>
                      {label}
                      <label htmlFor="item">item</label>
                    </label>
                  </div>
                  } */}
          
                {/* <div className="checkbox">
                  <label>
                    <input type="checkbox" id="salmon_tartar" name="salmon_tartar" value={label} checked={isChecked} onChange={this.toggleCheckboxChange}/>
                    {label}
                    <label htmlFor="salmon_tartar">Salmon Tartar</label>
                  </label>
                </div>

                <div className="checkbox">
                  <label>
                    <input type="checkbox" id="oysters" name="oysters" value={label} checked={isChecked} onChange={this.toggleCheckboxChange}/>
                    {label}
                    <label htmlFor="oysters">Oysters</label>
                  </label>
                </div>

                <div className="checkbox">
                  <label>
                    <input type="checkbox" id="grey_goose" name="grey_goose" value={label} checked={isChecked} onChange={this.toggleCheckboxChange}/>
                    {label}
                    <label htmlFor="grey_goose">Grey Goose Lime</label>
                  </label>
                </div> */}
                
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