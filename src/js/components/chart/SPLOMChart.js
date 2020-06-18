import React, { Component } from 'react'
var d3 = require('d3');
var _ = require('lodash');
import ScatterPlot from './ScatterPlot';

const get_plot_color = (idx) => {
  if(idx == 0) return "#C99";
  if(idx == 1) return "#9C9";
  if(idx == 2) return "#55A";
  if(idx == 3) return "#CC9";
  if(idx == 4) return "#C9C";
  if(idx == 5) return "#9CC";
}

class SPLOMChart extends Component {
  constructor(props) {
    super(props);

    this.matrix_x = 0;
    this.matrix_y = 1;
    this.state = {
      is_isplt_show: false,
    };

    this.createSPLOM = this.createSPLOM.bind(this)
  }

  componentDidMount() {
    this.createSPLOM()
  }
  componentDidUpdate() {
    this.createSPLOM()
  }

  createSPLOM() {
    const _self = this;
    const node = this.node;

    if (d3.select(node).length != 0) {
      d3.select(node).select("svg").remove();
    }

    this.head = this.props.data.head;
    this.data = this.props.data.data;

    let width = 500,
        height = 500,
        margin = 10,
        cell_size = width / this.head.length;

    let x = d3.scaleLinear().range([0, cell_size]);
    let y = d3.scaleLinear().range([0, cell_size]);
    let max_val = this.data[0][0];
    let min_val = this.data[0][0];
    for(let i=0;i<this.head.length;i++) {
      for(let d=0;d<this.data.length;d++) {
        if(max_val < this.data[d][i]) max_val = this.data[d][i];
        if(min_val > this.data[d][i]) min_val = this.data[d][i];
      }
    }
    x.domain([min_val,max_val]).nice();
    y.domain([max_val,min_val]).nice();

    let svg = d3.select(node)
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRation", "xMinYMin meet")
      .attr("viewBox", "0 0 " + (width + margin * 2) + " " + (height + margin * 2))
      .classed("svg-content-responsive", true);

    let cells_g = svg.append("g");
    let cells = [];
    for(let i=0;i<this.head.length;i++) {
      for(let j=0;j<this.head.length;j++) {
        let cell = cells_g.append("g");
        cell.attr("transform", "translate(" + (i * cell_size) + "," + (j * cell_size) + ")")
        cells.push(cell);
      }
    }

    const clickScatterArea = (i, j) => {
      return () => {
        this.matrix_x = i;
        this.matrix_y = j;
        this.setState({
          is_isplt_show: false,
        });
        setTimeout(() => {
          this.createSPLOM();
          this.setState({
            is_isplt_show: true,
          });
        }, 0);
      }
    }

    for(let i=0;i<this.head.length;i++) {
      for(let j=0;j<this.head.length;j++) {
        cells[j+i*this.head.length]
          .append("rect")
          .attr("fill", (this.matrix_x == i && this.matrix_y == j) ? "#FCC" : "#FFF")
          .attr("stroke", "#aaa")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", cell_size)
          .attr("height", cell_size)
          .on("mousedown", clickScatterArea(i, j));
      }
    }
    for(let i=0;i<this.head.length;i++) {
      for(let j=0;j<this.head.length;j++) {
        cells[j+i*this.head.length]
          .selectAll("circle")
          .data(this.data)
          .enter()
          .append("circle")
          .attr("r", 1)
          .attr("fill", (d, d_idx) => get_plot_color(d_idx < this.props.selected_group.length ? this.props.selected_group[d_idx] : 0))
          .attr("fill-opacity", 0.7)
          .attr("cx", d => x(d[i]))
          .attr("cy", d => y(d[j]));
      }
    }
  }

  render() {
    let splt_dataset = {
      variables: this.props.data.head,
      vartypes: [],
      data: this.props.data.data,
      scatterplot: {e1: this.matrix_x, e2: this.matrix_y},
    };
    for(let i=0;i<this.props.data.head.length;i++) {
      splt_dataset.vartypes.push("num");
    }

    return <div>
      <div ref={node => this.node = node}>
      </div>
      <div>
        {
          this.state.is_isplt_show ?
          <ScatterPlot
            autoload={true}
            dataset={splt_dataset}
            mark={this.props.mark}
            selected_tool={this.props.selected_tool}
            is_manipulating={this.props.is_manipulating}
            selected_group={this.props.selected_group}
            getExecLoopFlg={this.props.getExecLoopFlg}
            handleChangeExecLoop={this.props.handleChangeExecLoop}
            handleChangeSelectedTool={this.props.handleChangeSelectedTool}
            handleChangeIsManipulating={this.props.handleChangeIsManipulating}
            handleChangeSelectedGroup={this.props.handleChangeSelectedGroup}
            handleChangeDataset={this.props.handleChangeDataset}
            handleFilterData={this.props.handleFilterData}
            exec_mode={this.props.exec_mode}/> : null
        }
      </div>
    </div>
  }
}

export default SPLOMChart
