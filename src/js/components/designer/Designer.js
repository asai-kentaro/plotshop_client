import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import ChartDashboard from '../../containers/ChartDashboard';
import CodeStudio from '../coder/CoderStudio';

import api_code from "../../api/code";

class Designer extends React.Component {
  constructor(props) {
    super(props);

    this.handleDesignSubmitBtn = this.handleDesignSubmitBtn.bind(this);
    this.handleLoadMetaBtn = this.handleLoadMetaBtn.bind(this);
  }

  handleDesignSubmitBtn() {
    var charts = Object.assign({}, this.props.charts);

    var charts = Object.keys(charts).map((key) => { return charts[key]; })

    const stripNumber = (text) => {
      var myexp = /(\w+)[0-9]+/;
      return text.match(myexp);
    }

    for(var i=0;i<charts.length;i++) {
      var strn = stripNumber(charts[i].mark.val);
      if(strn != null) {
        charts[i].mark.val = strn[1];
      }
    }
    
    api_code.post_meta(CODE_ID, charts, (res) => {
      console.log(res);
    });
  }

  handleLoadMetaBtn() {
    api_code.load_meta(CODE_ID, (res) => {
      var meta_data = JSON.parse(res.data);
      this.props.handleLoadCharts(meta_data);
    });
  }

  render() {
    return (<div className="container">
      <Row>
        <Col xs={12} sm={12} md={12}>
          <ChartDashboard />
        </Col>
      </Row>
      <Row>
        <Button
          className="btn-primary"
          onClick={this.handleDesignSubmitBtn}>
          {'Save Design'}
        </Button>
        <Button
          onClick={this.handleLoadMetaBtn}>
          {'Load Dashboard'}
        </Button>
      </Row>
    </div>);
  }
}

export default Designer;
