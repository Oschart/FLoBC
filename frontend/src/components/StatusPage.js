import React, { Component } from 'react';
import GrowthGraph from './GrowthGraph'

import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
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

import {
    chartExample1,
    chartExample2,
    chartExample3,
    chartExample4,
} from "../variables/charts.js";

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

let bigChartData = "data1"

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
                <h1 style={{ color: colorClass, fontFamily: 'inherit', fontSize: 15, textAlign: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>{statusStr}</h1>
            </>
        )
    }

    trainerInfoEntries() {
        let entries = []
        let { scoresArray, trainersStatus } = this.props
        scoresArray = [1, 2, 3]
        trainersStatus = {
            1: 1,
            2: 0,
            3: 1
        }
        for (let i = 0; i < scoresArray.length; ++i) {
            let name = `Trainer ${i + 1}`
            let hasSubmitted = trainersStatus[i + 1] == 1
            let status = this.statusIcon(hasSubmitted)
            let row = (
                <tr style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <td>{name}</td>
                    <td className="text-center">{status}</td>
                    <td className="text-center">{scoresArray[i]}</td>
                </tr>
            )

            entries.push(row)
        }
        return entries
    }

    render() {

        return (
            <>
                <div className="content">
                    <Row>
                        <Col xs="12">
                            <GrowthGraph accuracies={[0.1, 0.5, 0.99]} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Trainer Status</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table className="tablesorter" responsive>
                                        <thead className="text-primary">
                                            <tr>
                                                <th>Trainer</th>
                                                <th className="text-center">Round Status</th>
                                                <th className="text-center">Trust Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.trainerInfoEntries()}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg="4">
                            <Card className="card-chart">
                                <CardHeader>
                                    <h5 className="card-category">Completed Tasks</h5>
                                    <CardTitle tag="h3">
                                        <i className="tim-icons icon-send text-success" /> 12,100K
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div className="chart-area">
                                        <Line
                                            data={[1, 2, 3, 4]}
                                            options={chart1_2_options}
                                        />
                                    </div>
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
