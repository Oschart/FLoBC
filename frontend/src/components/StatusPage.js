import React, { Component } from 'react';
import GrowthGraph from './GrowthGraph'

class StatusPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            syncScheme: 'BAP',
            modelName: 'MNIST28X28',
            trainers: null,
            validators: null,
            period: null,
            version: null,
        };

    }

    handleChange(event) {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }



    render() {
        return (
            <>
                <GrowthGraph />
            </>
        );
    }

}

export default StatusPage;
