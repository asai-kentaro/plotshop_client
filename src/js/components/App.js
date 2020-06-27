import React from 'react';
import { Grid, Row, Col, Button, Modal, FormGroup, FormControl } from 'react-bootstrap';

import AppNavbar from './AppNavbar';
import CoderStudio from '../containers/CoderStudio';

const $ = require('jquery');

import api_data from "../api/data";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleDataUpload = this.handleDataUpload.bind(this);
  }

  componentDidMount() {
  }

  handleDataUpload() {
    var form = $("#upload-form")[0];
    var formData = new FormData(form);

    api_data.upload(formData);
  }

  render() {

    const nowtab = (() => {switch(this.props.tab.tabname) {
      case "code":
        return (
          <CoderStudio
            modal={this.props.modal}
            handleModalShow={this.props.handleModalShow}
            handleModalHide={this.props.handleModalHide}
            loadedDataset={this.props.loadedDataset}/>
        );
        break;
    }})()

    return (
      <div>
        <AppNavbar
          modalShow={this.props.handleModalShow}
          handleLoadDataset={this.props.handleLoadDataset}
          loadedDataset={this.props.loadedDataset}
          handleChangeTab={this.props.handleChangeTab}
          tab={this.props.tab}/>
        {nowtab}
        <div className="static-modal">
          <Modal show={this.props.modal.show} onHide={this.props.handleModalHide}>
            <Modal.Header>
              <Modal.Title>{this.props.modal.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              { this.props.modal.body }
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.handleModalHide}>Close</Button>
              <Button bsStyle="primary"　onClick={this.handleDataUpload}>アップロード</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
