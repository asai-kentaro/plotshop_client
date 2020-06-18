import React from 'react';

import ForceDiagram from '../chart/ForceDiagram'
import ScatterPlot from '../chart/ScatterPlot'
import SankeyDiagram from '../chart/SankeyDiagram'
import Treemap from '../chart/Treemap'

import { Row, Col, Button } from 'react-bootstrap';

const $ = require('jquery');
const moment = require('moment');


class Analyzer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    this.scplot.createScatterPlot();
    this.scplot.setPlotData();
  }

  downloadCSV(csv_str, idx) {
    var blob = new Blob([csv_str], {
      type: "text/csv;charaset=utf-16;"
    });

    var file_name = moment().format('L') + "_" + idx;
    var downloadLink = $('<a></a>');
    downloadLink.attr('href', window.URL.createObjectURL(blob));
    downloadLink.attr('download', file_name);
    downloadLink.attr('target', '_blank');

    $('body').append(downloadLink);
    downloadLink[0].click();
    downloadLink.remove();
  }

  handleDownloadData() {
    var str = "";
    for(var i=0;i<this.props.dataset.variables.length;i++) {
      str += this.props.dataset.variables[i] + (i != (this.props.dataset.variables.length - 1) ? "," : "");
    }
    str += "\n";

    for(var i=0;i<this.props.dataset.data.length;i++) {
      for(var s=0;s<this.props.dataset.data[i].length;s++) {
        str += this.props.dataset.data[i][s] + (s != (this.props.dataset.data[i].length - 1) ? ", " : "");
      }
      str += "\n";
    }

    this.downloadCSV(str, 0);
  }

  render() {
    var i=0;
    const dim_list = this.props.dataset.variables.map((d, s) => {
      if(this.props.dataset.vartypes[s] == "num") {
        return (<li className="elm-variable-num" key={i++}>{d}</li>)
      } else {
        return (<li className="elm-variable" key={i++}>{d}</li>)
      }
    });
    var newdata = [];
    for(var i=0;i<this.props.dataset.data.length;i++) {
      newdata.push(0);
    }
    return (
      <div>
        <div className="container-fluid">
          <Row>
            <Col xs={3} sm={3} md={2}>
              <li className="nav-item nav-title font-subicon">
                Variables
                <i className="fa fa-cog" id="nav-dim-cog" data-toggle='popover'></i>
              </li>
              { dim_list }
              <Button onClick={() => {this.props.handleAddColData("NEW", newdata)}}>{'Add New Dim'}</Button>
              <Button onClick={() => {this.handleDownloadData()}}>{'Download Data'}</Button>
            </Col>
            <Col xs={9} sm={9} md={10}>
              <main role="main">
                <div className="row">
                  <Col xs={6} sm={6} md={6}>
                    <ForceDiagram
                      handleChangeScatterplot={this.props.handleChangeScatterplot}
                      handleAddColData={this.props.handleAddColData}
                      dataset={this.props.dataset} />
                  </Col>
                  <Col xs={6} sm={6} md={6}>
                    <ScatterPlot
                      ref = {scplot => { this.scplot = scplot }}
                      dataset={this.props.dataset}
                      handleChangeDataset={this.props.handleChangeDataset} />
                  </Col>
                </div>
              </main>
              <SankeyDiagram />
              <Treemap />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Analyzer;
