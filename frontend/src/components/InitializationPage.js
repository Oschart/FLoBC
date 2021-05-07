import React, { Component } from 'react';
// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Col,
} from "reactstrap";


class InitializationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            syncScheme: 'BAP',
            modelName: 'MNIST28X28',
            trainers: null,
            validators: null,
            period: null,
            version: null,
            noise: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let nam = event.target.name;
        let val = event.target.value;
        if (nam == "modelName")
            val = event.target.files[0].webkitRelativePath.split("/")[0]
        this.setState({ [nam]: val });
    }

    handleSubmit(event) {
        event.preventDefault();
        let trainers = parseInt(this.state.trainers);
        let validators = parseInt(this.state.validators);
        let syncScheme = this.state.syncScheme;
        let period = parseInt(this.state.period);
        let version = parseInt(this.state.version);
        let noise = parseFloat(this.state.noise);
        // Validating that trainers and validators numbers are greater than 1
        if (trainers < 1 || validators < 1 || Number.isNaN(trainers) || Number.isNaN(validators)) {
            alert("Trainers and Validators must be a number greater than or equal to 1");
            return;
        }

        // Validating that for BSP and SSP the period is not 0
        if ((syncScheme === "BSP" || syncScheme === "SSP") && (Number.isNaN(period) || period < 1)) {
            alert("Period must be a number greater than 0 for " + syncScheme);
            return;
        }

        // Reporting that provided period will not be used for BAP
        if (syncScheme === "BAP" && (!Number.isNaN(period) || period > 0)) {
            alert("Period will not be used for BAP");
        }

        if (version == 0 || Number.isNaN(version)) {
            alert("Must input stopping version");
            return;
        }



        let url = `http://localhost:24587/runSpawn?trainers=${trainers}&validators=${validators}&sync=${syncScheme}&period=${period}&version=${version}`;
        let message = "System spawning in progress";

        if (Number.isNaN(noise) == false) {
            url += `&noise=${noise}`;
        }

        const options = { method: "GET" };
        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                alert(data)
            })
        alert(message);
        this.props.startPolling(this.state.modelName, this.state.syncScheme, this.state.validators, this.state.trainers, this.state.version);
    }

    render() {
        return (
            <>
                <div className="content" >
                    <Col sm={{ size: 5, order: 2, offset: 3 }}>
                        <Card style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <CardHeader>
                                <CardTitle tag="h4">System Specs</CardTitle>
                            </CardHeader>
                            <CardBody style={{ alignItems: 'center', justifyContent: 'space-around' }}>
                                <form onSubmit={this.handleSubmit}>
                                    <label>
                                        Training Scripts Directory:
                <input type="file" name="modelName" directory = "" webkitdirectory="" onChange={this.handleChange} />
                                    </label>
                                    <br />
                                    <label>
                                        Validation Scripts Directory:
                <input type="file" name="modelName" directory = "" webkitdirectory="" onChange={this.handleChange} />
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
                                    <label>
                                        Stop at Version:
                <input type="number" name="version" onChange={this.handleChange} />
                                    </label>
                                    <br />
                                    <label>
                                        Noise Step:
                <input type="number" step="0.01" name="noise" onChange={this.handleChange} />
                                    </label>
                                    <br />

                                    <input type="submit" value="Start" style={{ marginLeft: '37.5%', marginTop: '8%', width: '25%' }} />
                                </form>
                            </CardBody>

                        </Card>
                    </Col>
                </div>
            </>

        );
    }

}

export default InitializationPage;
