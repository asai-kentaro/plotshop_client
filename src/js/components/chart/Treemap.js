import * as d3 from 'd3';
import React, { Component } from 'react';

class Treemap extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let data = {
      name: "A",
      children: [
        {
          name: "B",
          children: [
            {name: "C", size: 500},
            {name: "D", size: 250},
            {name: "E", size: 250},
            {name: "F", size: 200},
            {name: "G", size: 100},
            {name: "H", size: 70},
            {name: "I", size: 70},
          ]
        },
      ]
    };

    const width = 500;
    const height = 300;
    const margin = 30;
    const fader = (color) => { return d3.interpolateRgb(color, "#fff")(0.2); };
    const color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

    this._field = d3.select(this.dom)
      .classed("svg-container", true)
      .append("svg")
      .attr("id", "fg-box")
      .attr("preserveAspectRation", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("svg-content-responsive", true)
      .append("g")
      .attr("transform", "translate(" + (margin/2) + "," + (margin/2) + ")");

    this.treemap = d3.treemap()
      .size([width - margin, height - margin])
      .padding(1)
      .round(true);

    const rootdata = d3.hierarchy(data)
      .eachBefore((d) => { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
      .sum((d) => { return d.size; })
      .sort((a, b) => { return b.height - a.height || b.value - a.value; });

    this.treemap(rootdata);

    this.cell = this._field
      .selectAll("g")
      .data(rootdata.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => { return "translate(" + d.x0 + ", " + d.y0 + ")"; })

    this.cell.append("rect")
      .attr("id", (d) => { return d.data.id; })
      .attr("width", (d) => { return d.x1 - d.x0; })
      .attr("height", (d) => { return d.y1 - d.y0; })
      .attr("fill", (d, i) => { return color(i); })

    this.cell.append("text")
      .attr("x", 4)
      .attr("y", 12)
      .attr("font-size", 10)
      .text((d) => { return d.data.name; })
  }

  render() {
    return <div ref={dom => this.dom = dom}></div>;
  }
};

export default Treemap
