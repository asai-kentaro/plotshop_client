import React, { Component } from 'react'
const d3 = require('d3');

class ForceDiagram extends Component {
  constructor(props){
    super(props)
    this.createForceDiagram = this.createForceDiagram.bind(this)
  }

  componentDidMount() {
    this.createForceDiagram();
  }
  componentDidUpdate() {
    this.createForceDiagram();
  }

  makeNodes(variables, vartypes) {
    let nodes = [];

    for(let i=0;i<variables.length;i++) {
      if(vartypes[i] == "num") {
        nodes.push({
          id: i,
          x: 0,
          y: 0,
          value: variables[i],
          r: 5,
        });
      }
    }
    return nodes;
  }

  makeLinks(nodes) {
    let links = [];

    for(let i=0;i<nodes.length-1;i++) {
      for(let t=i+1;t<nodes.length;t++) {
        links.push({
          source: i,
          target: t,
          l: 200,
        })
      }
    }
    return links;
  }

  numvar2varIdx(vartypes) {
    let vs = [];
    for(let i=0;i<vartypes.length;i++) {
      if(vartypes[i] == "num") {
        vs.push(i);
      }
    }
    return vs;
  }

  var2numvarIdx(vartypes) {
    let numvs = [];

    let idx = 0;
    for(let i=0;i<vartypes.length;i++) {
      if(vartypes[i] == "num") {
        numvs.push(idx++);
      } else {
        numvs.push(-1);
      }
    }
    return numvs;
  }

  createForceDiagram() {
    const _self = this;
    const dom = this.dom;

    if (d3.select(dom).length != 0) {
      d3.select(dom).select("svg").remove();
    }

    let height = 500,
      width = 500,
      initPlace= [width/2, height/2];

    let nodes = this.makeNodes(this.props.dataset.variables, this.props.dataset.vartypes);
    let links = this.makeLinks(nodes);

    this._field = d3.select(dom)
      .classed("svg-container", true)
      .append("svg")
      .attr("id", "fg-box")
      .attr("preserveAspectRation", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("svg-content-responsive", true);

    const ticked = () => {
      link
        .attr("x1", (d) => { return d.source.x; })
        .attr("y1", (d) => { return d.source.y; })
        .attr("x2", (d) => { return d.target.x; })
        .attr("y2", (d) => { return d.target.y; });

      node
        .attr("transform", (d) => { return "translate(" + d.x + "," + d.y + ")"});
    }

    const dragstarted = (d) => {
      if(!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    const dragended = (d) => {
      if(!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    let link = this._field
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("class", (d) => {
        const nv = this.var2numvarIdx(this.props.dataset.vartypes);
        if(d.source == nv[_self.props.dataset.scatterplot.e1]
          && d.target == nv[_self.props.dataset.scatterplot.e2]) {
          return "graph-link-v";
        } else {
          return "graph-link";
        }
      })
      .on("click", (d) => {
        _self.props.handleChangeScatterplot(d.source.id, d.target.id);
      });

    let node = this._field
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    node.append("circle")
      .attr("r", (d) => { return d.r; })
      .attr("class", "graph-node")
    node.append("text")
      .attr("x", 10)
      .attr("y", 10)
      .attr("pointer-events", "none")
      .attr("font-size", 14)
      .text((d) => {
        return d.value;
      })

    // 3. forceSimulation設定
    let simulation = d3.forceSimulation()
      .force("link", d3.forceLink()
        .distance((d) => { return d.l; })
        .strength(0.03)
        .iterations(16))
      .force("collide",
        d3.forceCollide()
        .radius((d) => { return 10 })
        .strength(1.0)
        .iterations(16))
      .force("charge", d3.forceManyBody().strength(5))
      .force("x", d3.forceX().strength(0.1).x(initPlace[0]))
      .force("y", d3.forceY().strength(0.1).y(initPlace[1]))
      //.force("center", d3.forceCenter(300, 200))

    simulation
      .nodes(nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(links)
      .id((d) => { return d.index; });
  }

  make_nodes(nodes, edges) {
    let _self = this;
    let interval = 700 / nodes.length;

    let cnt = 0;
    func_node = (node) => {
      _self._nodes.push(nodes[cnt]);
      cnt += 1;
      _self.restart();
      if(cnt < nodes.length) {
        setTimeout(func_node, interval);
      } else {
        setTimeout(() => {
          for(let i = 0; i< edges.length;i++){
            let s_node, t_node;
            _self._nodes.forEach((d) => {
              if(d.id == edges[i].source) {
                s_node = d;
              }
              if(d.id == edges[i].target) {
                t_node = d;
              }
            });

            edges[i].source = s_node;
            edges[i].target = t_node;
            _self._links.push(edges[i]);
          }
          _self.restart();
        }, 400);
      }
    }

    setTimeout(func_node, interval);
  }

  render() {
    return <div ref={dom => this.dom = dom}>
    </div>
  }
}

export default ForceDiagram
