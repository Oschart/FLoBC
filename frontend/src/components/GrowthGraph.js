import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: "rgba(255,255,255,0.85)",
                borderRadius: 20, paddingBottom: 2, paddingTop: 2,
                paddingLeft: 10, paddingRight: 10,
                border: '1px solid rgba(0, 0, 0, 0.5)'
            }}>
                <p style={{ color: 'black' }}>{`Iteration : ${label}`}</p>
                <p style={{ color: 'black' }}>{`Accuracy : ${payload[0].value}%`}</p>
            </div>
        );
    }

    return null;
};
class GrowthGraph extends Component {

    static defaultProps = {
        accuracies: [],
        maxIterations: 30,
        lineColor: 'blue',
    }

    render() {
        let data = this.props.accuracies.map((acc, ind) => ({ Accuracy: Math.round(acc * 10000) / 100, Iteration: ind + 1 }));
        while (data.length < this.props.maxIterations) {
            data.push({ Iteration: data.length + 1 });
        }

        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 40,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="Iteration" label={{ value: "Iteration Number", position: 'bottom', dy: 5 }} />
                    <YAxis label={{ value: "Model Accuracy(%)", angle: -90, dx: -25 }} />
                    <Tooltip cursor={true} content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="Accuracy" stroke={this.props.lineColor} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default GrowthGraph;
