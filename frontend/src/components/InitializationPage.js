import React, { Component } from 'react';

class InitializationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            syncScheme: 'BAP',
            modelName: 'MNIST28X28',
            trainers: null,
            validators: null,
            period: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    handleSubmit(event) {
        event.preventDefault();
        let trainers = parseInt(this.state.trainers);
        let validators = parseInt(this.state.validators);
        let syncScheme = this.state.syncScheme;
        let period = parseInt(this.state.period);
        
        // Validating that trainers and validators numbers are greater than 1
        if (trainers < 1 || validators < 1 || Number.isNaN(trainers) || Number.isNaN(validators)) {
            alert("Trainers and Validators must be a number greater than or equal to 1");
            return;
        }

        // Validating that for BSP and SSP the period is not 0
        if ((syncScheme === "BSP" || syncScheme === "SSP") && (Number.isNaN(period) || period < 1)){
            alert("Period must be a number greater than 0 for " + syncScheme);
            return;
        }

        // Reporting that provided period will not be used for BAP
        if (syncScheme === "BAP" && (!Number.isNaN(period) || period > 0)){
            alert("Period will not be used for BAP");
        }
        
        // let command = "bash ../../../scripts/spawn/spawn.sh -b -j -c -l -n " + validators + " -t " + trainers + " -s " + syncScheme + " -d " + period;
        const options={method:"GET"};
        fetch(`http://localhost:24587/runSpawn?trainers=${trainers}&validators=${validators}&sync=${syncScheme}&period=${period}`, options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
        alert("System spawning in progress");
        // change page
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
            <label>
                Model Name:
                <select name="modelName" value={this.state.modelName} onChange={this.handleChange}>
                    <option selected value="MNIST28X28">MNIST28X28</option>
                    <option value="MNIST20X20">MNIST20X20</option>
                </select>
            </label>
            <br />
            <label>
                Synchronization Scheme:
                <select name="syncScheme" value={this.state.syncScheme} onChange={this.handleChange}>
                    <option selected value="BAP">BAP</option>
                    <option value="BSP">BSP</option>
                    <option value="SSP">SSP</option>
                </select>
            </label>
            <label>
                Period:
                <input type="number" name="period" onChange={this.handleChange} />
            </label>
            <br />
            <label>
                Number of Trainers:
                <input type="number" name="trainers" onChange={this.handleChange} />
            </label>
            <br />
            <label>
                Number of Validators:
                <input type="number" name="validators" onChange={this.handleChange} />
            </label>
            <br />
            <input type="submit" value="Submit" />
            </form>
        );
    }
      
}

export default InitializationPage;
