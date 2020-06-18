import React, { Component } from 'react'
var d3 = require('d3');
var _ = require('lodash');

class BarChart extends Component {
  constructor(props){
    super(props);
    this.createBarChart = this.createBarChart.bind(this)
  }

  componentDidMount() {
    this.createBarChart()
  }
  componentDidUpdate() {
    this.createBarChart()
  }

  createBarChart() {
    const _self = this;
    const node = this.node;

    if (d3.select(node).length != 0) {
      d3.select(node).select("svg").remove();
    }

    var width = 250,
        height = 200,
        margin = 25,
        x = d3.scaleBand()
          .rangeRound([margin, width - margin])
          .padding(0.1),
        y = d3.scaleLinear()
          .range([height - margin, margin]);

    var data = this.props.data.data;

    if(data[0].value === undefined) {
      for(var i=0;i<data.length;i++) {
        data[i] = {
          label: i,
          value: data[i],
        };
      }
    }

    var cols = data[0].value.length;

    x.domain(data.map((d) => { return d.label; }));
    var max = data[0].value[0];
    for(var i=0;i<data.length;i++) {
      var tmp = _.maxBy(data[i].value);
      if(max < tmp) {
        max = tmp;
      }
    }
    y.domain([0, max]);
    var svg = d3.select(node)
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRation", "xMinYMin meet")
      .attr("viewBox", "0 0 " + (width + margin * 2) + " " + (height + margin * 2))
      .classed("svg-content-responsive", true);

    var sections = svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.label) + ",0)"; });

    var bars = sections.selectAll("rect")
      .data((d) => { return d.value; })
      .enter()
      .append("rect")
      .attr("class", (d,i) => { return " area-" + (i % 5 + 1)})
      .attr("width", x.bandwidth() / cols)
      .attr("height", function(d) { return height - margin - y(d); })
      .attr("x", function(d, i) { return x.bandwidth() / cols * i; })
      .attr("y", function(d) { return y(d); })

    bars.on("click", (d, i) => {
      console.log("=[click] bar=");
      console.log(d);
      console.log("==");
      //this.props.selectDataClick(this.props.var_name, d.parent);  // ここでデータをフィルタしてサーバーに投げる
    });
    bars.on("click", (d, i) => {
      console.log("=[click] bar=");
      var code = this.props.mark.eventTemplateClick;
      code = code.replace(/\^(.+)\^/, d.data.value[labelVarIdx]);
      var manipulation = {
        chartVar: this.props.mark.val,
        code: code,
        type: "execute",
        color_idx: i,
      }
      console.log(manipulation);
      console.log("======");
      this.setState({selected: i});
      this.props.handleClickChartData(this.props.mark.val, manipulation);  // ここでデータをフィルタしてサーバーに投げる
    });

    const renderAxes = (svg) => {
      var xAxis = d3.axisBottom()
              .scale(x.range([0, (width - 2 * margin)]))
              .scale(x);

      var yAxis = d3.axisLeft()
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

export default BarChart
