import React, { Component } from 'react';

class Button extends Component {
    click() {
        alert("Hello! Nice mouse.")
    }

    render() {
        return (
            <p onClick={this.click}> Click here if you're a FDMMLS member </p>

        )
    }
}

export default Button; // Don’t forget to use export default!