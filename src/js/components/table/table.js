import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

class Table extends Component {
  constructor(props){
    super(props);
    this.createTable = this.createTable.bind(this);
  }

  createTable() {

  }

  render() {
    console.log(this.props)
    let i = 0;
    const th = (
      <tr>
      {this.props.data.head.map((d) => {
        return (
          <th key={i++}>
            {d}
          </th>
        )
        })
      }
      </tr>
    );
    const tb = this.props.data.data.map((d) => {
      return (
        <tr key={i++}>
          { d.map((d) => {
            return (<td key={i++}>{d}</td>);
          }) }
        </tr>
      )
    })



    return (
      <table className="table">
        <thead>
          {th}
        </thead>
        <tbody>
          {tb}
        </tbody>
      </table>
    )
  }
}

export default Table;
