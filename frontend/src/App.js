import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InitializationPage from './components/InitializationPage';
import { retrieveStatusInfo } from './components/Utils';

class App extends Component {
  constructor(){
    super(); 
    this.keyToNum = {}
    this.lastIndex = 0
    this.state = {
      modelName: null,
      validatorsNum: null,
      trainersNum: null,
      syncPolicy: null,
      currentModelIndex: null,
      currentNodelScore: null,
      scoresArray: [],
      targetVersion: null,
      trainersStatus: {},
      isRunning: false,
    }
  }

  async statusUpdate(){
    if(!this.state.isRunning) return;
    let statusInfo = await retrieveStatusInfo();
    let updatedTrainersStatus = {};
    let currentModelIndex = statusInfo[0];
    let currentNodelScore = statusInfo[1];
    let updatedScoresArray = this.state.scoresArray;

    if(currentModelIndex > this.lastIndex){
      this.lastIndex = currentModelIndex;
      updatedScoresArray = [...updatedScoresArray, currentNodelScore]
    }


    let shuffledTrainerStatus = statusInfo[2];
    
    //updates trainers' status object
    for (const [key, value] of Object.entries(this.keyToNum)) {
      updatedTrainersStatus[this.keyToNum[key]] = shuffledTrainerStatus[key]
    }

    //in the case that the trainers' status object is not complete 
    if(Object.keys(updatedTrainersStatus).length < Object.keys(shuffledTrainerStatus).length){
      for (const [key, value] of Object.entries(shuffledTrainerStatus)) {
        if(!(key in this.keyToNum)){
          this.keyToNum[key] = Object.keys(this.keyToNum).length + 1
          updatedTrainersStatus[this.keyToNum[key]] = value
        }
      }
    }
    
    this.setState({
      currentModelIndex,
      currentNodelScore,
      scoresArray: updatedScoresArray,
      trainersStatus: updatedTrainersStatus
    })
  }

  componentDidMount() {
    this.timer = setInterval(()=> this.statusUpdate(), 20000);
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
