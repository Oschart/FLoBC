import React, { Component } from 'react';
import GrowthGraph from './GrowthGraph'
import { chartColors } from './colors'
import classNames from "classnames";
// react plugin used to create charts
import { Pie } from "react-chartjs-2";
// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
    FormGroup,
    Input,
    Table,
    Row,
    Col,
    UncontrolledTooltip,
    Badge
} from "reactstrap";

import { ThemeContext, themes } from "contexts/ThemeContext";

let chart1_2_options = {
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
    },
    responsive: true,
    scales: {
        yAxes: [
            {
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: "rgba(29,140,248,0.0)",
                    zeroLineColor: "transparent",
                },
                ticks: {
                    suggestedMin: 60,
                    suggestedMax: 125,
                    padding: 20,
                    fontColor: "#9a9a9a",
                },
            },
        ],
        xAxes: [
            {
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: "rgba(29,140,248,0.1)",
                    zeroLineColor: "transparent",
                },
                ticks: {
                    padding: 20,
                    fontColor: "#9a9a9a",
                },
            },
        ],
    },
};


class StatusPage extends Component {
    constructor(props) {
        super(props);
        this.trainerInfoEntries = this.trainerInfoEntries.bind(this)
        this.statusIcon = this.statusIcon.bind(this)
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

    statusIcon(hasSubmitted) {
        let colorClass = hasSubmitted ? "green" : "yellow"
        let statusStr = hasSubmitted ? "SUBMITTED" : "TRAINING"
        return (
            <>
                <h1 style={{ color: colorClass, fontFamily: 'inherit', fontSize: 15, textAlign: 'center' }}>{statusStr}</h1>
            </>
        )
    }

    trainerInfoEntries() {
        let entries = []
        let { trainersStatus } = this.props
        let trainerLabels = [], trainerScores = []
        let n = Object.keys(trainersStatus).length
        for (let i = 0; i < n; ++i) {
            let trainerInfo = trainersStatus[i + 1]
            if (trainerInfo != undefined){
                let name = `Trainer ${i + 1}`
                let hasSubmitted = trainerInfo[1] == 1
                let status = this.statusIcon(hasSubmitted)
                let row = (
                    <tr style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <td>{name}</td>
                        <td className="text-center">{status}</td>
                        <td className="text-center">{trainerInfo[0]}</td>
                    </tr>
                )

                entries.push(row)
                trainerLabels.push(name)
                trainerScores.push(trainerInfo[0])
            }
        }

        return {entries, trainerLabels, trainerScores}
    }

    render() {

        let {entries, trainerLabels, trainerScores} = this.trainerInfoEntries()

        return (
            <>
                <div className="content">
                    <Row>
                        <Col xs="12">
                            <GrowthGraph maxIterations={this.props.maxIterations} accuracies={this.props.scoresArray} />
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Trainer Status</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table className="tablesorter" responsive style={{ height: 200 }}>
                                        <thead className="text-primary">
                                            <tr>
                                                <th>Trainer ID</th>
                                                <th className="text-center">Round Status</th>
                                                <th className="text-center">Trust Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col >
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Trainer Scores</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Pie data={{
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        labels: trainerLabels,
                                        datasets: [
                                            {
                                                data: trainerScores,
                                                backgroundColor: chartColors,
                                                hoverBackgroundColor: chartColors
                                            }
                                        ]
                                    }} />
                                </CardBody>
                            </Card>
                        </Col>


                    </Row>

                </div>
            </>
        );
    }

}

export default StatusPage;
