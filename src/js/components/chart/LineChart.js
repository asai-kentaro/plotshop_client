import React, { Component } from 'react'
const d3 = require('d3');
const _ = require('lodash');

class LineChart extends Component {
  constructor(props){
    super(props)
    this.createLineChart = this.createLineChart.bind(this)
  }

  componentDidMount() {
    this.createLineChart()
  }
  componentDidUpdate() {
    this.createLineChart()
  }

  createLineChart() {
    const _self = this;
    const node = this.node;

    if (d3.select(node).length != 0) {
      d3.select(node).select("svg").remove();
    }

    let width = 250,
        height = 200,
        margin = 25,
        x = d3.scaleLinear()
            .range([margin, width - margin]),
        y = d3.scaleLinear()
            .range([height - margin, margin]);

    let data = _self.props.data.data;
    if(!isNaN(data[0][0])) {
      for(let i=0;i<data.length;i++) {
        for(let s=0;s<data[i].length;s++) {
          data[i][s] = {
            x: s,
            y: data[i][s],
          };
        }
      }
    }

    let minX, maxX, minY, maxY;
    minX = _.minBy(data[0], (d) => { return d.x }).x;
    maxX = _.maxBy(data[0], (d) => { return d.x }).x;
    minY = _.minBy(data[0], (d) => { return d.y }).y;
    maxY = _.maxBy(data[0], (d) => { return d.y }).y;

    for(let i=1;i<data.length;i++) {
      minX = _.min([minX, _.minBy(data[i], (d) => { return d.x }).x]);
      maxX = _.max([maxX, _.maxBy(data[i], (d) => { return d.x }).x]);
      minY = _.min([minY, _.minBy(data[i], (d) => { return d.y }).y]);
      maxY = _.max([maxY, _.maxBy(data[i], (d) => { return d.y }).y]);
    }

    x.domain([minX, maxX]);
    y.domain([minY, maxY]);

    let line = d3.line()
      .x((d) => {return x(d.x);})
      .y((d) => {return y(d.y);});

    let svg = d3.select(node)
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRation", "xMinYMin meet")
      .attr("viewBox", "0 0 " + (width + margin * 2) + " " + (height + margin * 2))
      .classed("svg-content-responsive", true);

    svg.selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("class", (d, i) => { return "line-" + (i % 5 + 1) })
        .attr("d", (d) => {return line(d);});

    const renderAxes= (svg) => {
        let xAxis = d3.axisBottom()
                .scale(x.range([0, (width - 2 * margin)]))
                .scale(x)
                //.tickFormat(d3.format("d"));;

        let yAxis = d3.axisLeft()
                .scale(y.range([height - 2 * margin, 0]))
                .scale(y);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", () => {
                return "translate(" + margin
                    + "," + (height - margin) + ")";
            })
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", () => {
                return "translate(" + margin
                    + "," + margin + ")";
            })
            .call(yAxis);
    }

    renderAxes(svg);
  }

  render() {
    return <div ref={node => this.node = node}>
    </div>
  }
}

export default LineChart
