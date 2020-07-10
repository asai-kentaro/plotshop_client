import React from 'react';
import { Grid, Row, Col, Button, FormGroup, FormControl, Alert } from 'react-bootstrap';

import CodeConsole from './CodeConsole';
import CodeEditor from './CodeEditor';
import ChartDashboard from '../../containers/ChartDashboard';

const $ = require('jquery');

import api_data from "../../api/data";

/*
 * (Structure)
 * CoderStudio
 * + CodeEditor
 * + ChartDashboard
 * + CodeConsole
 *
 */
class CoderStudio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exec_mode: "none",
    };

    this.changeExecMode = this.changeExecMode.bind(this);
    this.handleDataUpload = this.handleDataUpload.bind(this);
    this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
  }

  componentDidMount() {
  }

  handleDataUpload() {
    let form = $("#upload-form")[0];
    let formData = new FormData(form);

    api_data.upload(formData);
  }

  handleCodeSubmit() {
    this.editor.handleCodeSubmitBtn();
  }

  changeExecMode(exec_mode) {
    this.setState({exec_mode});
  }

  render() {

    return (
      <div>
        <div className="container">
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
            {
              this.state.exec_mode == "breakout" ?
              <Alert bsStyle={"danger"}>Breakout mode</Alert> :
              null
            }
            {
              this.state.exec_mode == "continuous" ?
              <Alert bsStyle={"warning"}>Continuous mode</Alert> :
              null
            }
            </Col>
          </Row>
          <Row>
            <Col xs={6} sm={6} md={6}>
              <CodeEditor
                ref={editor => this.editor = editor}
                charts={this.props.charts}
                setConsoleOutput={this.props.handleCodeOutput}
                setChartEmpty={this.props.handleChartEmpty}
                handleCodeLocalVal={this.props.handleCodeLocalVal}
                loadedDataset = {this.props.loadedDataset}
                chartManipulations = {this.props.chartManipulations}
                handleManipulationEmpty = {this.props.handleManipulationEmpty}
                changeExecMode = {this.changeExecMode}
                />
            </Col>
            <Col xs={6} sm={6} md={6}>
              <ChartDashboard
                exec_mode={this.state.exec_mode}
                handleCodeSubmit={this.handleCodeSubmit}
                />
            </Col>
          </Row>
        </div>
        <CodeConsole
          output={this.props.output} />
      </div>
    );
  }
}

export default CoderStudio;
