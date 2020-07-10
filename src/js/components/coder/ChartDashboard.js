import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';

import api_data from "../../api/data";

import LineChart from '../chart/LineChart';
import PieChart from '../chart/PieChart';
import BarChart from '../chart/BarChart';
import ScatterPlot from '../chart/ScatterPlot';
import SPLOMChart from '../chart/SPLOMChart';
import DataTable from '../table/table';

/*
 * Charts display panel (Right side in main area)
 */
class ChartDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_tool: null,
      exec_loop: false,
      is_manipulating: false,
      selected_group: [],
    };

    this.prev_man = false;
    this.counter = 0;

    this.handleChangeExecLoop = this.handleChangeExecLoop.bind(this);
    this.handleChangeDataset = this.handleChangeDataset.bind(this);
    this.handleChangeSelectedTool = this.handleChangeSelectedTool.bind(this);
    this.handleChangeIsManipulating = this.handleChangeIsManipulating.bind(this);
    this.handleChangeSelectedGroup = this.handleChangeSelectedGroup.bind(this);
  }

  handleChangeDataset(dataset, newdata, meta) {
    const getNormalRandom = () => {
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    };

    let generation_mode = "specified"; //= "specified";
    let mark = meta.mark;
    let selected_tool = meta.selected_tool;
    let exec_loop = meta.exec_loop;
    if(selected_tool) {
      this.setState({selected_tool});
    }
    if(exec_loop !== undefined && exec_loop !== null) {
      this.setState({exec_loop});
    }

    let _dataset_data = [];
    for(let i=0;i<newdata.length;i++) {
      _dataset_data.push([]);
    }
    let value_range = [];
    let first_idx = -1;
    if(generation_mode == "specified") {
      for(let i=0;i<this.state.selected_group.length;i++) {
        if(this.state.selected_group[i] != 0) {
          first_idx = i;
          break;
        }
      }
      if(first_idx == -1) {
        generation_mode = "overall";
      } else {
        for(let s=0;s<dataset.variables.length;s++) {
          let max = dataset.data[first_idx][s];
          let min = dataset.data[first_idx][s];
          for(let i=first_idx;i<dataset.data.length;i++) {
            if(this.state.selected_group[i] != 0) {
              if(max < dataset.data[i][s]) max = dataset.data[i][s];
              if(min > dataset.data[i][s]) min = dataset.data[i][s];
            }
          }
          value_range.push([min, max]);
        }
      }
    }
    if(generation_mode == "overall") {
      for(let s=0;s<dataset.variables.length;s++) {
        let max = dataset.data[0][s];
        let min = dataset.data[0][s];
        for(let i=0;i<dataset.data.length;i++) {
          if(max < dataset.data[i][s]) max = dataset.data[i][s];
          if(min > dataset.data[i][s]) min = dataset.data[i][s];
        }
        value_range.push([min, max]);
      }
    }
    for(let i=0;i<_dataset_data.length;i++) {
      for(let s=0;s<dataset.variables.length;s++) {
        if(s == dataset.scatterplot.e1) {
          _dataset_data[i].push(newdata[i][0]);
        } else if(s == dataset.scatterplot.e2) {
          _dataset_data[i].push(newdata[i][1]);
        } else {
          if(i < dataset.data.length) {
            _dataset_data[i].push(dataset.data[i][s]);
          } else {
            //
            // generate new value
            //
            let new_value = 0;
            // normal distribution
            new_value = (getNormalRandom() * (value_range[s][1] - value_range[s][0]) * 0.5) + (value_range[s][1] + value_range[s][0])/2;
            _dataset_data[i].push(new_value);
          }
        }
      }
    }
    dataset.data = _dataset_data;

    const datafilename = mark.val + "_dc";
    const dfdata = {
      head: dataset.variables,
      data: dataset.data,
    }
    const jdata = {
      filename: datafilename,
      data: dfdata,
    };
    let manipulation = {
      chartVar: mark.val,
      datafile: datafilename,
      dims: [dataset.variables[dataset.scatterplot.e1], dataset.variables[dataset.scatterplot.e2]],
      value: dataset,
      type: "datasetchange",
      color_idx: 0,
    };

    api_data.update_data(jdata, () => {
      if(this.prev_man && !this.state.is_manipulating) {
        this.prev_man = this.state.is_manipulating;
        return;
      }
      this.prev_man = this.state.is_manipulating;

      if(!this.state.is_manipulating) {
        this.props.handleChangeChartData(mark.val, manipulation);
        if(this.props.exec_mode == "continuous") {
          this.props.handleCodeSubmit();
        }
      }
    })
  }

  handleChangeExecLoop(exec_loop) {
    this.setState({exec_loop});
  }
  handleChangeSelectedTool(selected_tool) {
    this.setState({selected_tool});
  }
  handleChangeIsManipulating(is_manipulating) {
    this.setState({is_manipulating});
  }
  handleChangeSelectedGroup(selected_group) {
    this.setState({selected_group});
  }

  render() {
    let key = 1;

    const colStyle = {
      padding: "2px",
    }
    const panelStyle = {
      border: "1px solid #ccc",
      padding: "2px",
    }
    const tableStyle = {
      border: "1px solid #ccc",
      padding: "2px",
      boxShadow: "1px 1px 1px #aaa",
      maxHeight: "400px",
      overflowY: "scroll",
      overflowX: "scroll",
    }

    return (
      <Row>
      {
        this.props.charts.map((chart) => {
          switch(chart.chart_type) {
            case "pie":
              return (
                <Col xs={6} sm={6} md={6} lg={4} style={colStyle} key={key++}>
                  <div style={panelStyle}>
                    <h5>{chart.title}</h5>
                    <PieChart
                      data={chart.value}
                      mark={chart.mark}
                      handleClickChartData={this.props.handleClickChartData} />
                  </div>
                </Col>
              )
              break;
            case "line":
              return (
                <Col xs={6} sm={6} md={6} lg={4} style={colStyle} key={key++}>
                  <div style={panelStyle}>
                    <h5>{chart.title}</h5>
                    <LineChart
                      data={chart.value}
                      mark={chart.mark}
                      handleClickChartData={this.props.handleClickChartData} />
                  </div>
                </Col>
              )
              break;
            case "bar":
              return (
                <Col xs={6} sm={6} md={6} lg={4} style={colStyle} key={key++}>
                  <div style={panelStyle}>
                    <h5>{chart.title}</h5>
                    <BarChart
                      data={chart.value}
                      mark={chart.mark}
                      handleClickChartData={this.props.handleClickChartData} />
                  </div>
                </Col>
              )
              break;
            case "splom":
              return (
                <Col xs={12} sm={12} md={12} lg={12} style={colStyle} key={key++}>
                  <div style={panelStyle}>
                    <h5>{chart.title}</h5>
                    <SPLOMChart
                      data={chart.value}
                      mark={chart.mark}
                      selected_tool={this.state.selected_tool}
                      is_manipulating={this.state.is_manipulating}
                      selected_group={this.state.selected_group}
                      getExecLoopFlg={(() => {return this.state.exec_loop}).bind(this)}
                      handleChangeExecLoop={this.handleChangeExecLoop}
                      handleChangeSelectedTool={this.handleChangeSelectedTool}
                      handleChangeIsManipulating={this.handleChangeIsManipulating}
                      handleChangeSelectedGroup={this.handleChangeSelectedGroup}
                      handleChangeDataset={(dataset, dim2data, meta) => {
                        if(!meta) {
                          meta = {};
                        }
                        meta.mark = chart.mark;
                        this.handleChangeDataset(dataset, dim2data, meta);}}
                      handleFilterData={(idx) => {this.props.handleFilterData(idx);}}
                      exec_mode={this.props.exec_mode} />
                  </div>
                </Col>
              )
              break;
            case "scatter":
              return (
                <Col xs={12} sm={12} md={6} lg={6} style={colStyle} key={key++}>
                  <div style={panelStyle}>
                    <h5>{chart.title}</h5>
                    <ScatterPlot
                      ref = {scplot => { this.scplot = scplot }}
                      autoload={true}
                      dataset={chart.value}
                      mark={chart.mark}
                      selected_tool={this.state.selected_tool}
                      is_manipulating={this.state.is_manipulating}
                      selected_group={this.state.selected_group}
                      getExecLoopFlg={(() => {return this.state.exec_loop}).bind(this)}
                      handleChangeExecLoop={this.handleChangeExecLoop}
                      handleChangeSelectedTool={this.handleChangeSelectedTool}
                      handleChangeIsManipulating={this.handleChangeIsManipulating}
                      handleChangeSelectedGroup={this.handleChangeSelectedGroup}
                      handleChangeDataset={(dataset, dim2data, meta) => {
                        if(!meta) {
                          meta = {};
                        }
                        meta.mark = chart.mark;
                        this.handleChangeDataset(dataset, dim2data, meta);}}
                      handleFilterData={(idx) => {this.props.handleFilterData(idx);}}
                      exec_mode={this.props.exec_mode}/>
                  </div>
                </Col>
              )
              break;
            case "table":
              return (
                <Col xs={12} sm={12} md={12} lg={12} style={tableStyle} key={key++}>
                  <h5>{chart.title}</h5>
                  <DataTable
                    data={chart.value}
                    mark={chart.mark} />
                </Col>
              )
              break;
          }
        })
      }
      </Row>
    );
  }
}

export default ChartDashboard;
