import React, { Component } from 'react';
import * as d3 from 'd3';
import {sankey, sankeyLeft, sankeyLinkHorizontal} from 'd3-sankey';

class SankeyDiagram extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var _data = {
      nodes: [
        {id: 0, title: "morning"},
        {id: 1, title: "noon"},
        {id: 2, title: "night"},
        {id: 3, title: "sun"},
      ],
      links: [
        {source: 1, target: 2, value: 1},
        {source: 1, target: 0, value: 1},
        {source: 0, target: 3, value: 1},
      ],
    };

    const width = 500;
    const height = 300;
    const margin = 30;
    const fader = (color) => { return d3.interpolateRgb(color, "#fff")(0.2); };
    const color = d3.scaleOrdinal(d3.schemeCategory20);

    var graph = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .nodeAlign(sankeyLeft)
      .size([width - margin, height - margin]);

    this.data = graph(_data);

    this._field = d3.select(this.dom)
      .classed("svg-container", true)
      .append("svg")
      .attr("id", "fg-box")
      .attr("preserveAspectRation", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("svg-content-responsive", true)
      .append("g")
      .attr("transform", "translate(" + (margin/2) + "," + (margin/2) + ")");

    this.link = this._field
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.15)
      .selectAll("path")
    this.link = this.link
      .data(this.data.links)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke-width", (d) => { return d.width; });

    var node = this._field.append('g')
      .attr('class', 'nodes')
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll('g')
    node = node
      .data(this.data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node');
    node.append('rect')
      .attr('x', (d) => { return d.x0; })
      .attr('y', (d) => { return d.y0; })
      .attr('height', (d) => { return d.y1 - d.y0})
      .attr('width', (d) => { return d.x1 - d.x0})
      .attr("fill", (d, i) => { return color(d.id); })
      .attr("stroke-width", 0.5)
      .attr('stroke', '#000');
    node.append("text")
      .attr('x', d => d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .text(d => d.title)
      .filter(d => d.x0 < width / 2)
      .attr('x', d => d.x1 + 6)
      .attr('text-anchor', 'start')
  }

  render() {
    return <div ref={dom => this.dom = dom}></div>;
  }
};

export default SankeyDiagram;
