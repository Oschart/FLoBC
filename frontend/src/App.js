import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './Button';
import InitializationPage from './components/InitializationPage';
import { retrieveStatusInfo } from './components/Utils';

class App extends Component {
  constructor(){
    super(); 
    this.state = {
      accuracies: [0.5, 0.2, 0.3, 0.2, 0.1, 0.5, 0.2, 0.3, 0.2, 0.1],
      modelName: null,
      validatorsNum: null,
      trainersNum: null,
      syncPolicy: null,
      currentModelIndex: null,
      currentNodelScore: null,
      targetVersion: null,
      isRunning: false,
    }
  }

  async statusUpdate(){
    if(!this.state.isRunning) return;
    let statusInfo = await retrieveStatusInfo();
    this.setState({
      currentModelIndex: statusInfo[0],
      currentNodelScore: statusInfo[1]
    })
  }

  componentDidMount() {
    this.timer = setInterval(()=> this.statusUpdate(), 5000);
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
          <div className="Main-div">
            <InitializationPage
              startPolling={(modelName, syncPolicy, validatorsNum, trainersNum, targetVersion) => this.setState({
                isRunning: true,
                modelName,
                syncPolicy,
                validatorsNum,
                trainersNum,
                targetVersion
              })}
            />
            <div>
              <p>Model Name: {this.state.modelName}</p>
              <p>Sync Policy: {this.state.syncPolicy}</p>
              <p>Validators Number: {this.state.validatorsNum}</p>
              <p>Trainers Number: {this.state.trainersNum}</p>
              <p>Current Model: {this.state.currentModelIndex}</p>
              <p>Current Model Score: {this.state.currentNodelScore}</p>
            </div>

          </div>
        </header>
      </div>
    );
  }
}

export default App;
