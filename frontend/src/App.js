import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InitializationPage from './components/InitializationPage';
import StatusPage from './components/StatusPage';
import { retrieveStatusInfo, getScoreByIndex } from './components/Utils';

import "assets/scss/black-dashboard-react.scss";
import "assets/css/nucleo-icons.css";
import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";

import AdminNavbar from "components/Navbars/AdminNavbar.js";


import AdminLayout from './layouts/Admin/Admin';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

class App extends Component {
  constructor() {
    super();

    this.keyToNum = {}
    this.lastIndex = 0
    this.state = {
      modelName: null,
      validatorsNum: null,
      trainersNum: null,
      syncPolicy: null,
      currentModelIndex: null,
      currentModelScore: null,
      scoresArray: [],
      targetVersion: null,
      trainersStatus: {},
      isRunning: false,
    }
  }

  async statusUpdate() {
    if (!this.state.isRunning) return;
    let statusInfo = await retrieveStatusInfo();
    let updatedTrainersStatus = {};
    let currentModelIndex = statusInfo[0];
    let currentModelScore = statusInfo[1];
    let updatedScoresArray = this.state.scoresArray;

    if (currentModelIndex > this.lastIndex) {
      while(this.lastIndex + 1 < currentModelIndex){
        this.lastIndex++;
        let inBetweenScore = await getScoreByIndex(this.lastIndex);
        updatedScoresArray = [...updatedScoresArray, inBetweenScore]
      }
      this.lastIndex = currentModelIndex;
      updatedScoresArray = [...updatedScoresArray, currentModelScore]
    }


    let shuffledTrainerStatus = statusInfo[2];

    //updates trainers' status object
    for (const [key, value] of Object.entries(this.keyToNum)) {
      updatedTrainersStatus[this.keyToNum[key]] = shuffledTrainerStatus[key]
    }

    //in the case that the trainers' status object is not complete 
    if (Object.keys(updatedTrainersStatus).length < Object.keys(shuffledTrainerStatus).length) {
      for (const [key, value] of Object.entries(shuffledTrainerStatus)) {
        if (!(key in this.keyToNum)) {
          this.keyToNum[key] = Object.keys(this.keyToNum).length + 1
          updatedTrainersStatus[this.keyToNum[key]] = value
        }
      }
    }

    this.setState({
      currentModelIndex,
      currentModelScore,
      scoresArray: updatedScoresArray,
      trainersStatus: updatedTrainersStatus,
    })
  }

  componentDidMount() {
    this.timer = setInterval(() => this.statusUpdate(), 20000);
  }

  pollingCallback = (modelName, syncPolicy, validatorsNum, trainersNum, targetVersion) => this.setState({
    isRunning: true,
    modelName,
    syncPolicy,
    validatorsNum,
    trainersNum,
    targetVersion,
    currentModelIndex: null,
    currentModelScore: null,
    scoresArray: [],
    trainersStatus: {},
  })

  terminationCallback = () => this.setState({ isRunning: false })


  render() {
    return (
      <ThemeContextWrapper>
        <BackgroundColorWrapper>
          <BrowserRouter>
            <Switch>
              <Route path="/admin" render={(props) => <AdminLayout {...{ ...this.state, startPolling: this.pollingCallback, terminationCallback: this.terminationCallback }} />} />
              <Redirect from="/" to="/admin/spawn" />
            </Switch>
          </BrowserRouter>
        </BackgroundColorWrapper>

      </ThemeContextWrapper>
    );
  }
}

export default App;
