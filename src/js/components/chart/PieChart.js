import React, { Component } from 'react'
var d3 = require('d3');

/*
=format=
data = [A(1), A(2), ...]
- A : {name: セクション名, value: [ターゲット値,セクション値]}
*/
class PieChart extends Component {
  constructor(props){
    super(props)
    this.createPieChart = this.createPieChart.bind(this);

    this.state = {
      selected: -1,
    }
  }

  componentDidMount() {
    this.createPieChart()
  }
  componentDidUpdate() {
    this.createPieChart()
  }

  createPieChart() {
    const _self = this;
    const node = this.node;

    if (d3.select(node).length != 0) {
      d3.select(node).select("svg").remove();
    }

    var height = 250,
      width = 250,
      outerRadius = 100,
      innerRadius = 30;

    var data = this.props.data.data;
    if(!data[0].value) {
      for(var i=0;i<data.length;i++) {
        data[i] = {
          label: i,
          value: data[i],
        };
      }
    }

    var valueVarIdx = _.findIndex(this.props.data.head, (o) => {return o == this.props.mark.valueVar});
    valueVarIdx = valueVarIdx == -1 ? 0 : valueVarIdx;
    var labelVarIdx = _.findIndex(this.props.data.head, (o) => {return o == this.props.mark.labelVar});
    labelVarIdx = labelVarIdx == -1 ? 1 : labelVarIdx;

    var arc = d3.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    var pie = d3.pie()
      .value((d) => { return d.value[valueVarIdx]; });

    var svg = d3.select(node)
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRation", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("svg-content-responsive", true);

    var sections = svg.selectAll("g")
      .data(pie(data))
      .enter()
      .append("g");
    var secDOM = sections.append("path")
      .attr("d", arc)
      .attr("class", (d,i) => {
        if(this.state.selected == -1) {
          return " area-" + (i % 5 + 1);
        } else {
          if(i == this.state.selected) {
            return " area-" + (i % 5 + 1) + "-v";
          } else {
            return " area-" + (i % 5 + 1) + "-p";
          }
        }
      })
      .attr("transform", "translate("+ (width  / 2) + "," + (height / 2) + ")");

    secDOM.on("click", (d, i) => {
      console.log("=[click] pie=");
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

    this._labels = sections
      .append("g")
      .attr("transform", function(d, i){
        var angle = (d.startAngle + d.endAngle)/2;
        var posX = width/2 + (outerRadius - 30) * Math.sin(angle);
        var posY = height/2 + (outerRadius - 30) * (-Math.cos(angle));
        return "translate(" + posX + "," + posY + ")";
      })
      .append("text")
      .attr("pointer-events", "none")
      .text(function(d){ return d.data.value[labelVarIdx]; });
  }

  render() {
    return <div ref={node => this.node = node}>
    </div>
  }
}

export default PieChart
