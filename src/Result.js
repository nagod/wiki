import React, { Component } from 'react'

export default class Result extends Component {
    render() {
        return (
            <div className="resultCard">
                <h1>{this.props.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: this.props.snippet }} />             
         <a href={this.props.url}>{this.props.url}</a>
            </div>
        )
    }
}
