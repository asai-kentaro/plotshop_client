import React, { Component } from 'react'
import { Row, Col, ControlLabel, Button, Glyphicon, FormControl, FormGroup } from 'react-bootstrap';

const d3 = require('d3');
const $ = require('jquery');

import ana_api from '../../api/analysis.js';

/*
=format=
data = [A(1), A(2), ...]
- A : {name: セクション名, value: [ターゲット値,セクション値]}
*/
class ScatterPlot extends Component {
  constructor(props){
    super(props);

    this.draw_color = 2;
    this.def_color = 0;
    this.eph_color = 4;
    this.no_color = 99;

    let cursorType = "search";
    if(this.props.selected_tool) {
      cursorType = this.props.selected_tool;
    }

    this.state = {
      cursorType: cursorType,
      bboxclicking: false,
      e1lock: false,
      e2lock: false,
      edit_dist: 'norm',
      edit_size: 10,
    }

    this._data = [];

    this.createScatterPlot = this.createScatterPlot.bind(this);
    this.isPointSelected = this.isPointSelected.bind(this);
    this.handleCursorChange = this.handleCursorChange.bind(this);
    this.handleSwitchExecLoop = this.handleSwitchExecLoop.bind(this);
    this.setPlotData = this.setPlotData.bind(this);
    this.drawbbox = this.drawbbox.bind(this);
    this.handleE1ToggleLock = this.handleE1ToggleLock.bind(this);
    this.handleE2ToggleLock = this.handleE2ToggleLock.bind(this);
    this.handleEditDistSelect = this.handleEditDistSelect.bind(this);
    this.handleEditSizeText = this.handleEditSizeText.bind(this);
    this.handleChangePDRange = this.handleChangePDRange.bind(this);
  }

  componentDidMount() {
    this.setPlotData()
  }

  setPlotData() {
    var data = [];
    var group = [];
    var dataset = this.props.dataset;
    var e1 = this.props.dataset.scatterplot.e1;
    var e2 = this.props.dataset.scatterplot.e2;
    for(var i=0;i<dataset.data.length;i++) {
      data.push([Number(dataset.data[i][e1]), Number(dataset.data[i][e2])]);
    }
    this._data = data;

    if(this.props.mark && this.props.mark.valueVar) {
      var valueVarIdx = _.findIndex(dataset.variables, (o) => {return o == this.props.mark.valueVar});
      valueVarIdx = valueVarIdx == -1 ? 1 : valueVarIdx;

      var group = [];
      for(var i=0;i<dataset.data.length;i++) {
        group.push(Number(dataset.data[i][valueVarIdx]));
      }
      this._group = group;
    } else {
      if(data.length == this.props.selected_group.length) {
        var group = [];
        for(var i=0;i<this.props.selected_group.length;i++) {
          group.push(this.props.selected_group[i]);
        }
        this._group = group;
      } else {
        this.eraseGroup();
      }
    }
    this.createScatterPlot();
  }

  eraseGroup() {
    var group = [];
    for(var i=0;i<this._data.length;i++) {
      group.push(0);
    }
    this._group = group;
  }

  isPointSelected() {
    var flg = false;
    for(var i=0;i<this._group.length;i++) {
      flg = flg || this._group[i] != 0;
    }
    return flg;
  }

  getSelectBoundbox() {
    var selplots = [];

    for(var i=0;i<this.plotDots._groups[0].length;i++) {
      if(this._group[i] == this.draw_color) {
        var d = d3.select(this.plotDots._groups[0][i]);
        var cx = Number(d.attr("cx"));
        var cy = Number(d.attr("cy"));
        selplots.push([cx, cy]);
      }
    }

    if(!selplots[0]) return;

    var res = [
      selplots[0][0], selplots[0][0], selplots[0][1], selplots[0][1]
    ];
    for(var i=0;i<selplots.length;i++) {
      if(res[0] > selplots[i][0]) {
        res[0] = selplots[i][0];
      }
      if(res[1] > selplots[i][1]) {
        res[1] = selplots[i][1];
      }
      if(res[2] < selplots[i][0]) {
        res[2] = selplots[i][0];
      }
      if(res[3] < selplots[i][1]) {
        res[3] = selplots[i][1];
      }
    }

    return res;
  }

  drawbbox() {
    const bbox = this.bbox;

    if(!bbox) return;

    this.selectRect
      .attr("x", bbox[0])
      .attr("y", bbox[1])
      .attr("width", (bbox[2] - bbox[0]))
      .attr("height", (bbox[3] - bbox[1]));

    this.bboxRectL.attr("x", bbox[0] - 5).attr("y", (bbox[3] + bbox[1])/2 - 5);
    this.bboxRectR.attr("x", bbox[2] - 5).attr("y", (bbox[3] + bbox[1])/2 - 5);
    this.bboxRectT.attr("x", (bbox[2] + bbox[0])/2 - 5).attr("y", bbox[1] - 5);
    this.bboxRectB.attr("x", (bbox[2] + bbox[0])/2 - 5).attr("y", bbox[3] - 5);
    this.selCenterCircle
      .attr("cx", (bbox[2] + bbox[0])/2)
      .attr("cy", (bbox[3] + bbox[1])/2);
  }

  createScatterPlot() {
    const _self = this;
    const node = this.node;

    if (d3.select(node).length != 0) {
      d3.select(node).select("svg").remove();
    }

    var height = 400,
      width = 400,
      margin = 35;

    var prev_cursor = [0, 0];

    var svg = d3.select(node)
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRation", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("svg-content-responsive", true);

    var x = d3.scaleLinear().range([margin, width-margin]);
    var y = d3.scaleLinear().range([height-margin, margin]);

    var axisX = d3.axisBottom().scale(x);
    var axisY = d3.axisLeft().scale(y);


    if(this._data.length <= 1) {
      var x_val = [0,100];
      var y_val = [0,100];
    } else {
      var x_val = d3.extent(this._data, (d) => { return d[0]; });
      var y_val = d3.extent(this._data, (d) => { return d[1]; });
    }

    if(Math.abs(x_val[1] - x_val[0]) < 0.001) {
      x_val[1] = x_val[0] + 100;
    }
    if(Math.abs(y_val[1] - y_val[0]) < 0.001) {
      y_val[1] = y_val[0] + 100;
    }

    x.domain(x_val).nice();
    y.domain(y_val).nice();

    var plotArea = svg.append("g");
    var graphArea = plotArea
      .append("rect")
      .attr("width", width - margin * 2)
      .attr("height", height - margin * 2)
      .attr("fill", "#fff")
      .attr("transform", "translate(" + margin +"," + margin + ")");

    this.plotDots = plotArea
      .selectAll(".dot")
      .data(this._data)
      .enter()
      .append("circle");
    this.plotDots
      .attr("id", (d,i) => { return "plot-data-" + i })
      .attr("class", (d,i) => { return "plot-point area-" + (_self._group[i] + 1)})
      .attr("pointer-events", "none")
      .attr("r", 2)
      .attr("cx", (d) => { return x(d[0]); })
      .attr("cy", (d) => { return y(d[1]); })

    var x_axis = plotArea.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + 0 + "," + (height - margin) + ")")
      .call(axisX)

    plotArea
      .append("text")
      .attr("class", "label")
      .attr("x", width - margin)
      .attr("y", height)
      .attr("pointer-events", "none")
      .style("text-anchor", "end")
      .style("font-size", 10)
      .text(this.props.dataset.variables[this.props.dataset.scatterplot.e1]);

    var y_axis = plotArea.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin + "," + 0 + ")")
      .call(axisY)

    plotArea
      .append("text")
      .attr("class", "label")
      .attr("x", margin + 10)
      .attr("y", margin - 10)
      .attr("pointer-events", "none")
      .style("text-anchor", "end")
      .style("font-size", 10)
      .text(this.props.dataset.variables[this.props.dataset.scatterplot.e2]);

    this.plotCircle = plotArea
      .append("circle")
    this.plotCircle
      .attr("class", "brush-circle")
      .attr("r", 10)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("display", "none");

    //
    //= select boundary box
    //
    this.selectRect = plotArea
      .append("rect");
    this.selectRect
      .attr("class", "select-rect")
      .attr("x", -100)
      .attr("y", -100)
      .attr("width", 0)
      .attr("height", 0);
    this.bboxRectL = plotArea
      .append("rect");
    this.bboxRectL
      .attr("class", "select-rect-handle")
      .attr("x", -100)
      .attr("y", -100)
      .attr("width", 10)
      .attr("height", 10);
    this.bboxRectR = plotArea
      .append("rect");
    this.bboxRectR
      .attr("class", "select-rect-handle")
      .attr("x", -100)
      .attr("y", -100)
      .attr("width", 10)
      .attr("height", 10);
    this.bboxRectT = plotArea
      .append("rect");
    this.bboxRectT
      .attr("class", "select-rect-handle")
      .attr("x", -100)
      .attr("y", -100)
      .attr("width", 10)
      .attr("height", 10);
    this.bboxRectB = plotArea
      .append("rect");
    this.bboxRectB
      .attr("class", "select-rect-handle")
      .attr("x", -100)
      .attr("y", -100)
      .attr("width", 10)
      .attr("height", 10);
    this.selCenterCircle = plotArea
      .append("circle")
    this.selCenterCircle
      .attr("class", "brush-circle-handle")
      .attr("r", 7)
      .attr("cx", -100)
      .attr("cy", -100);

    var infoPanel = plotArea
      .append("g")
    infoPanel.attr("transform", "translate(-1000, 0)");
    infoPanel.append("rect")
      .attr("class", "scat-info-panel")
      .attr("width", "100px")
      .attr("height", "38px");
    var infoTextAvg = infoPanel.append("text");
    infoTextAvg
      .text("avg:(0,0)")
      .attr("transform", "translate(5, 15)");
    var infoTextVar = infoPanel.append("text");
    infoTextVar
      .text("var:(0,0)")
      .attr("transform", "translate(5, 30)");

    //
    //= initiation
    //
    d3.select(this.pdrange_d).attr("value", 100);

    //
    //= brushing manipulation
    //
    const selectPlot = (point) => {
      var newgroup = [];
      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        if(_self._group[i] == _self.def_color) {
          var d = d3.select(_self.plotDots._groups[0][i]);
          var cx = Number(d.attr("cx"));
          var cy = Number(d.attr("cy"));

          var dis2 = (point[0] - cx) * (point[0] - cx) + (point[1] - cy) * (point[1] - cy);
          if(dis2 < 10 * 10) {
            newgroup.push(_self.draw_color);
          } else {
            newgroup.push(_self.def_color);
          }
        } else {
          newgroup.push(_self._group[i]);
        }
      }

      return newgroup;
    }

    const nearestPlotIdx = (point) => {
      var idx = 0;
      var d = d3.select(_self.plotDots._groups[0][0]);
      var cx = Number(d.attr("cx"));
      var cy = Number(d.attr("cy"));
      var mindist = (point[0] - cx) * (point[0] - cx) + (point[1] - cy) * (point[1] - cy);
      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        var d = d3.select(_self.plotDots._groups[0][i]);
        var cx = Number(d.attr("cx"));
        var cy = Number(d.attr("cy"));

        var dis2 = (point[0] - cx) * (point[0] - cx) + (point[1] - cy) * (point[1] - cy);
        if(dis2 < mindist) {
          idx = i;
          mindist = dis2;
        }
      }

      return idx;
    }

    const getSelectedPlotIdx = () => {
      var res = [];
      for(var i=0;i<_self._group.length;i++) {
        if(_self._group[i] == _self.draw_color) {
          res.push(i);
        }
      }

      return res;
    }

    const unselectPlot = (point) => {
      var newgroup = [];
      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        if(_self._group[i] == 0) {
          newgroup.push(_self._group[i]);
        } else {
          var d = d3.select(_self.plotDots._groups[0][i]);
          var cx = Number(d.attr("cx"));
          var cy = Number(d.attr("cy"));

          var dis2 = (point[0] - cx) * (point[0] - cx) + (point[1] - cy) * (point[1] - cy);
          if(dis2 < 10 * 10) {
            newgroup.push(0);
          } else {
            newgroup.push(_self._group[i]);
          }
        }
      }

      return newgroup;
    }

    const erasePlot = (point) => {
      var newgroup = [];
      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        var d = d3.select(_self.plotDots._groups[0][i]);
        var cx = Number(d.attr("cx"));
        var cy = Number(d.attr("cy"));

        var dis2 = (point[0] - cx) * (point[0] - cx) + (point[1] - cy) * (point[1] - cy);
        if(dis2 < 10 * 10) {
          newgroup.push(_self.no_color);
        } else {
          newgroup.push(_self._group[i]);
        }
      }

      return newgroup;
    }

    const extractbbox = () => {
      this.selectRect
        .attr("x", -100)
        .attr("y", -100)
        .attr("width", 0)
        .attr("height", 0);
      this.bboxRectL.attr("x", -100);
      this.bboxRectR.attr("x", -100);
      this.bboxRectT.attr("x", -100);
      this.bboxRectB.attr("x", -100);
      this.selCenterCircle
        .attr("cx", -100)
        .attr("cy", -100);
    }

    const movePlotBBox = () => {
      const bbox = _self.bbox;
      const p_bbox = _self.prev_bbox;

      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        var d = d3.select(_self.plotDots._groups[0][i]);

        if(d.classed("area-" + (_self.draw_color + 1))) {
          if(!_self.state.e1lock) {
            var cx_inner_dom = d3.scaleLinear().domain([p_bbox[0], p_bbox[2]]).range([bbox[0], bbox[2]]);
            var new_cx = cx_inner_dom(_self.pxy_origins[i][0]);
            d.attr("cx", new_cx);
          }
          if(!_self.state.e2lock) {
            var cy_inner_dom = d3.scaleLinear().domain([p_bbox[1], p_bbox[3]]).range([bbox[1], bbox[3]]);
            var new_cy = cy_inner_dom(_self.pxy_origins[i][1]);
            d.attr("cy", new_cy);
          }
        }
      }

    }

    const setOriginPos = () => {
      _self.mxy_origin = d3.mouse(plotArea.node());
      _self.pxy_origins = [];
      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        var d = d3.select(_self.plotDots._groups[0][i]);
        var cx = Number(d.attr("cx"));
        var cy = Number(d.attr("cy"));
        _self.pxy_origins.push([cx, cy]);
      }
    }

    this.getCenter = () => {
      var gcenter = [0, 0];
      var cnt = 0;
      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        var d = d3.select(_self.plotDots._groups[0][i]);

        if(d.classed("area-" + (_self.draw_color + 1))) {
          cnt++;
          var cx = Number(d.attr("cx"));
          var cy = Number(d.attr("cy"));
          gcenter[0] += cx;
          gcenter[1] += cy;
        }
      }
      gcenter[0] = gcenter[0] / cnt;
      gcenter[1] = gcenter[1] / cnt;

      return gcenter;
    }

    this.filterVisible = () => {
      for(var i=0;i<_self._group.length;i++) {
        if(_self._group[i] == _self.no_color) {
          _self._data[i] = [NaN, NaN];//[0,0];
        }
      }
    }

    this.plotToData = () => {
      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        var d = d3.select(_self.plotDots._groups[0][i]);

        if(d.classed("area-" + (_self.draw_color + 1))) {
          _self._data[i] = [x.invert(Number(d.attr("cx"))), y.invert(Number(d.attr("cy")))];
        }
      }
    }

    const getSelectedDataStats = () => {
      var targetPoint = [];

      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        var d = d3.select(_self.plotDots._groups[0][i]);

        if(d.classed("area-" + (_self.draw_color + 1))) {
          targetPoint.push([x.invert(Number(d.attr("cx"))), y.invert(Number(d.attr("cy")))]);
        }
      }

      if(targetPoint.length == 0) {
        return { avg: [NaN, NaN], var: [NaN, NaN] };
      }

      var res = {
        avg: [0,0],
        var: [0,0],
      };

      for(var i=0;i<targetPoint.length;i++) {
        res.avg[0] += targetPoint[i][0];
        res.avg[1] += targetPoint[i][1];
      }
      res.avg[0] = res.avg[0] / targetPoint.length;
      res.avg[1] = res.avg[1] / targetPoint.length;

      for(var i=0;i<targetPoint.length;i++) {
        res.var[0] += (targetPoint[i][0] - res.avg[0]) * (targetPoint[i][0] - res.avg[0]);
        res.var[1] += (targetPoint[i][1] - res.avg[1]) * (targetPoint[i][1] - res.avg[1]);
      }
      res.var[0] = res.var[0] / targetPoint.length;
      res.var[1] = res.var[1] / targetPoint.length;

      return res;
    }

    const scatPlots = () => {
      const stats = getSelectedDataStats();
      const scale = 2;

      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        var d = d3.select(_self.plotDots._groups[0][i]);

        if(d.classed("area-" + (_self.draw_color + 1))) {
          var dis = [(Math.random() - 0.5) * scale, (Math.random() - 0.5) * scale];
          _self.pxy_origins[i][0] = _self.pxy_origins[i][0] + dis[0];
          _self.pxy_origins[i][1] = _self.pxy_origins[i][1] + dis[1];
          d.attr("cx", _self.pxy_origins[i][0]);
          d.attr("cy", _self.pxy_origins[i][1]);
        }
      }
    }

    const rotatePlots = (angle) => {
      const radian = angle / 360 * Math.PI * 2;
      const gcenter = _self.getCenter();

      for(var i=0;i<_self.plotDots._groups[0].length;i++) {
        var d = d3.select(_self.plotDots._groups[0][i]);

        if(d.classed("area-" + (_self.draw_color + 1))) {
          var rx = _self.pxy_origins[i][0] - gcenter[0];
          var ry = _self.pxy_origins[i][1] - gcenter[1];
          _self.pxy_origins[i][0] = rx * Math.cos(radian) - ry * Math.sin(radian) + gcenter[0];
          _self.pxy_origins[i][1] = rx * Math.sin(radian) + ry * Math.cos(radian) + gcenter[1];
          d.attr("cx", _self.pxy_origins[i][0]);
          d.attr("cy", _self.pxy_origins[i][1]);
        }
      }
    }

    const moveInfoPanel = (point) => {
      var stats = getSelectedDataStats();
      const avg_text = "avg:(" + stats.avg[0].toFixed(1) + "," + stats.avg[1].toFixed(1) + ")";
      const var_text = "var:(" + stats.var[0].toFixed(1) + "," + stats.var[1].toFixed(1) + ")";
      infoTextAvg.text(avg_text);
      infoTextVar.text(var_text);
      infoPanel.attr("transform", "translate(" + (point[0] + 10) + "," + (point[1] + 10) + ")");
    }


    this.getSelIdxNumber = () => {
      const getDist = (p1, p2) => {
        var tmp1 = p1[0] - p2[0];
        var tmp2 = p1[1] - p2[1];

        return Math.sqrt(tmp1 * tmp1 + tmp2 * tmp2);
      }

      const getNorm = (dom) =>  {
        return Math.abs(Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random())) * dom;
      }

      let sel_count = 0;
      let dist_ary = [];
      let idx_ary = [];
      let center = _self.getCenter();
      center = [x.invert(center[0]), y.invert(center[1])];

      for(var i=0;i<_self._group.length;i++) {
        if(_self._group[i] == _self.draw_color) {
          sel_count++;
          dist_ary.push(getDist(center, _self._data[i]));
        } else {
          dist_ary.push(-1);
        }
        idx_ary.push(-1);
      }

      let counter = 0;
      const dom = d3.max(dist_ary);
      for(var i=0;i<sel_count;i++) {
        var norm = getNorm(dom);
        var min_idx = -1;
        var min_dist = dom * 10000000;
        for(var t=0;t<dist_ary.length;t++) {
          if(dist_ary[t] != - 1 && Math.abs(norm - dist_ary[t]) < min_dist) {
            min_idx = t;
            min_dist = Math.abs(norm - dist_ary[t]);
          }
        }
        idx_ary[min_idx] = counter++;
        dist_ary[min_idx] = -1;
      }

      return idx_ary;
    }

    this.PDPlot = (pd_ratio) => {
      pd_ratio = pd_ratio/100;

      const erase_eph_plots = () => {
        var newdata = [];
        var newgroup = [];

        for(var i=0;i<_self.plotDots._groups[0].length;i++) {
          var d = d3.select(_self.plotDots._groups[0][i]);
          if(!d.classed("area-" + (_self.eph_color + 1))) {
            newdata.push(_self._data[i]);
            newgroup.push(_self._group[i])
          }
        }

        _self._data = newdata;
        _self._group = newgroup;
      }

      const reset_no_color = () => {
        var newgroup = [];

        for(var i=0;i<_self._group.length;i++) {
          if(_self._group[i] == _self.no_color) {
            newgroup.push(_self.draw_color);
          } else {
            newgroup.push(_self._group[i]);
          }
        }

        _self._group = newgroup;
      }

      const bbox = this.getSelectBoundbox();
      let mu = this.getCenter();
      mu = [x.invert(mu[0]), y.invert(mu[1])];
      let dum = [[x.invert(0), x.invert(1)], [y.invert(0), y.invert(1)]];
      dum[0] = (dum[0][1] - dum[0][0]) * (bbox[2] - bbox[0]) * 0.2;
      dum[1] = (dum[1][1] - dum[1][0]) * (bbox[3] - bbox[1]) * 0.2;

      var cnt = 0;
      for(var i=0;i<_self._group.length;i++) {
        if(_self._group[i] == _self.draw_color || _self._group[i] == _self.no_color) {
          cnt++;
        }
      }

      erase_eph_plots();
      reset_no_color();
      if(pd_ratio > 1) {
        for(var i=0;i<pd_ratio * cnt;i++) {
          _self._data.push(getNormDist2(mu, dum));
          _self._group.push(_self.eph_color);
        }
      } else {
        const idxlist = _self.getSelIdxNumber();
        const upper = (1 - pd_ratio) * cnt - 1;
        for(var i=0;i<upper;i++) {
          for(var t=0;t<idxlist.length;t++) {
            if(idxlist[t] == i) {
              _self._group[t] = _self.no_color;
            }
          }
        }
      }
      _self.createScatterPlot();
    }

    const reset_color = () => {
      var newgroup = [];

      for(var i=0;i<_self._group.length;i++) {
        newgroup.push(_self.def_color);
      }

      _self._group = newgroup;
    }

    // Box Muller
    const getNormDist2 = (mu, sigma) => {
      const rnd1 = Math.random();
      const rnd2 = Math.random();
      const z1 = Math.sqrt(-2.0 * Math.log(rnd1)) * Math.cos(2.0 * Math.PI * rnd2) * sigma[0] + mu[0];
      const z2 = Math.sqrt(-2.0 * Math.log(rnd1)) * Math.sin(2.0 * Math.PI * rnd2) * sigma[1] + mu[1];

      return [z1, z2];
    }

    const getUniDist2 = (mu, size) => {
      const rnd1 = Math.random();
      const rnd2 = Math.random();
      const z1 = rnd1 * size[0] * Math.cos(2.0 * Math.PI * rnd2) + mu[0];
      const z2 = rnd1 * size[1] + Math.sin(2.0 * Math.PI * rnd2) + mu[1];

      return [z1, z2];
    }
    //
    //=
    //

    graphArea
      .on("mouseover", () => {
        _self.plotCircle.attr("display", "inline");
      })
      .on("mouseout", () => {
        _self.plotCircle.attr("display", "none");
        infoPanel.attr("transform", "translate(-1000, 0)")
      })
      .on("mousemove", () => {
        var pointer = d3.mouse(plotArea.node());
        _self.plotCircle
          .attr("cx", pointer[0])
          .attr("cy", pointer[1]);
        if(_self.props.is_manipulating && _self.state.cursorType == "edit") {
          const mu = [x.invert(pointer[0]), y.invert(pointer[1])];
          let plt = mu;
          let dum = [[x.invert(0), x.invert(1)], [y.invert(0), y.invert(1)]];
          dum[0] = (dum[0][1] - dum[0][0]) * _self.state.edit_size;
          dum[1] = (dum[1][1] - dum[1][0]) * _self.state.edit_size;
          if(_self.state.edit_dist == 'norm') {
            plt = getNormDist2(mu, dum);
          } else {
            plt = getUniDist2(mu, dum);
          }
          _self._data.push(plt);
          _self._group.push(_self.draw_color);
          _self.createScatterPlot();
        } else if(_self.props.is_manipulating && (_self.state.cursorType == "brush" || _self.state.cursorType == "filter")) {
          _self._group = selectPlot(pointer);
          _self.plotDots.attr("class", (d,i) => { return "plot-point area-" + (_self._group[i] + 1);});
          moveInfoPanel(pointer);
        } else if(_self.props.is_manipulating && _self.state.cursorType == "eraser") {
          //_self._group = unselectPlot(pointer);
          _self._group = erasePlot(pointer);
          _self.plotDots.attr("class", (d,i) => { return "plot-point area-" + (_self._group[i] + 1);})
          moveInfoPanel(pointer);
        } else if(_self.props.is_manipulating && _self.state.cursorType == "scat") {
          scatPlots();
          moveInfoPanel(pointer);
        } else if(_self.state.cursorType == "search") {
          moveInfoPanel(pointer);
        } else if(_self.props.is_manipulating && _self.state.cursorType == "rotate") {
          var pointer = d3.mouse(plotArea.node());
          var dy = _self.mxy_origin[1] - pointer[1];
          var rot = 0;
          var center = [(_self.bbox[0] + _self.bbox[2])/2, (_self.bbox[1] + _self.bbox[3])/2]
          if(pointer[0] < center[0]) {
            if(dy > 0) rot = 2 * dy;
            if(dy <= 0) rot = 2 * dy;
          } else {
            if(dy > 0) rot = -2 * dy;
            if(dy <= 0) rot = -2 * dy;
          }
          rotatePlots(rot);
          setOriginPos();
        }
      })
      .on("mouseup", () => {
        if(_self.props.is_manipulating && _self.state.cursorType == "brush") {
          _self.bbox = this.getSelectBoundbox();
          this.drawbbox();
          this.props.handleChangeSelectedGroup(_self._group);
        } else if(_self.props.is_manipulating && _self.state.cursorType == "edit") {
          //_self.props.handleChangeDataset(_self.props.dataset, _self._data);
          _self.eraseGroup()    // initialize new plots color
        } else if(_self.props.is_manipulating && _self.state.cursorType == "scat") {
          _self.plotToData();
          //_self.props.handleChangeDataset(_self.props.dataset, _self._data);
        } else if(_self.props.is_manipulating && _self.state.cursorType == "filter") {
          _self.props.handleFilterData(getSelectedPlotIdx());
        } else if(_self.props.is_manipulating && _self.state.cursorType == "rotate") {
          setOriginPos();
          _self.bbox = this.getSelectBoundbox();
          this.drawbbox();
        } else if(_self.props.is_manipulating && _self.state.cursorType == "eraser") {
          _self.filterVisible();
          _self.plotToData();
          //_self.props.handleChangeDataset(_self.props.dataset, _self._data);
        }

        _self.props.handleChangeIsManipulating(false);
      })
      .on("mousedown", () => {
        if(_self.state.cursorType == "search") {
          console.log(getSelectedDataStats());
        } else if(_self.state.cursorType == "scat") {
          setOriginPos();
        } else if(_self.state.cursorType == "rotate") {
          setOriginPos();
          extractbbox();
        } else if(_self.state.cursorType == 'bucket') {

          reset_color();
          var pointer = d3.mouse(plotArea.node());

          const drawWithClusters = (res) => {
            const sel_idx = nearestPlotIdx(pointer);
            const sel_group = res.labels[sel_idx];
            for(var i=0;i<_self._group.length;i++) {
              if(res.labels[i] == sel_group) {
                _self._group[i] = _self.draw_color;
              }
            }
            _self.plotDots.attr("class", (d,i) => { return "plot-point area-" + (_self._group[i] + 1);});
            _self.bbox = this.getSelectBoundbox();
            this.drawbbox();
          }

          switch($(_self.clustering_method_sel).val()) {
            case "kmeans":
              var clu_num = Number($(_self.kmeans_clu_num).val());
              ana_api.cluster_kmeans(_self._data, clu_num, drawWithClusters);
              break;
            case "dbscan":
              var eps = Number($(_self.dbscan_eps).val());
              ana_api.cluster_dbscan(_self._data, eps, drawWithClusters);
              break;
          }
        }

        _self.props.handleChangeIsManipulating(true);
      });

    //
    //= bbox handling
    //
    this.bboxRectL
      .on("mousedown", () => {
        _self.prev_bbox = [_self.bbox[0], _self.bbox[1], _self.bbox[2], _self.bbox[3]];
        setOriginPos();

        _self.props.handleChangeIsManipulating(true);
        _self.setState({
          bboxclicking: true,
        });
      })
      .on("mousemove", () => {
        var pointer = d3.mouse(plotArea.node());
        if(_self.state.bboxclicking) {
          _self.bbox[0] = pointer[0];
          movePlotBBox();
          this.drawbbox();
        }
      })
      .on("mouseup", () => {
        _self.plotToData();
        //_self.props.handleChangeDataset(this.props.dataset, this._data, {});
        _self.props.handleChangeIsManipulating(false);
        _self.setState({
          bboxclicking: false,
        });
      });
    this.bboxRectR
      .on("mousedown", () => {
        _self.prev_bbox = [_self.bbox[0], _self.bbox[1], _self.bbox[2], _self.bbox[3]];
        setOriginPos();

        _self.props.handleChangeIsManipulating(true);
        _self.setState({
          bboxclicking: true,
        });
      })
      .on("mousemove", () => {
        var pointer = d3.mouse(plotArea.node());
        if(_self.state.bboxclicking) {
          _self.bbox[2] = pointer[0];
          movePlotBBox();
          this.drawbbox();
        }
      })
      .on("mouseup", () => {
        _self.plotToData();

        //_self.props.handleChangeDataset(this.props.dataset, this._data, {});
        _self.props.handleChangeIsManipulating(false);
        _self.setState({
          bboxclicking: false,
        });
      });
    this.bboxRectT
      .on("mousedown", () => {
        _self.prev_bbox = [_self.bbox[0], _self.bbox[1], _self.bbox[2], _self.bbox[3]];
        setOriginPos();

        _self.props.handleChangeIsManipulating(true);
        _self.setState({
          bboxclicking: true,
        });
      })
      .on("mousemove", () => {
        var pointer = d3.mouse(plotArea.node());
        if(_self.state.bboxclicking) {
          _self.bbox[1] = pointer[1];
          movePlotBBox();
          this.drawbbox();
        }
      })
      .on("mouseup", () => {
        _self.plotToData();
        //_self.props.handleChangeDataset(this.props.dataset, this._data, {});
        _self.props.handleChangeIsManipulating(false);
        _self.setState({
          bboxclicking: false,
        });
      });
    this.bboxRectB
      .on("mousedown", () => {
        _self.prev_bbox = [_self.bbox[0], _self.bbox[1], _self.bbox[2], _self.bbox[3]];
        setOriginPos();

        _self.props.handleChangeIsManipulating(true);
        _self.setState({
          bboxclicking: true,
        });
      })
      .on("mousemove", () => {
        var pointer = d3.mouse(plotArea.node());
        if(_self.state.bboxclicking) {
          _self.bbox[3] = pointer[1];
          movePlotBBox();
          this.drawbbox();
        }
      })
      .on("mouseup", () => {
        _self.plotToData();
        //_self.props.handleChangeDataset(this.props.dataset, this._data, {});
        _self.props.handleChangeIsManipulating(false);
        _self.setState({
          bboxclicking: false,
        });
      });
    this.selCenterCircle
      .on("mousedown", () => {
        _self.prev_bbox = [_self.bbox[0], _self.bbox[1], _self.bbox[2], _self.bbox[3]];
        setOriginPos();

        _self.props.handleChangeIsManipulating(true);
        _self.setState({
          bboxclicking: true,
        });
      })
      .on("mousemove", () => {
        var pointer = d3.mouse(plotArea.node());

        if(_self.state.bboxclicking) {
          const width = _self.prev_bbox[2] - _self.prev_bbox[0];
          const height = _self.prev_bbox[3] - _self.prev_bbox[1];
          _self.bbox[0] = pointer[0] - width / 2;
          _self.bbox[1] = pointer[1] - height / 2;
          _self.bbox[2] = pointer[0] + width / 2;
          _self.bbox[3] = pointer[1] + height / 2;

          movePlotBBox();
          this.drawbbox();
        }
      })
      .on("mouseup", () => {
        _self.plotToData();
        //_self.props.handleChangeDataset(this.props.dataset, this._data, {});
        _self.props.handleChangeIsManipulating(false);
        _self.setState({
          bboxclicking: false,
        });
      });

    if(this.props.mark.selecting) {
      if(this.isPointSelected()) {
        this.bbox = this.getSelectBoundbox();
        this.drawbbox();
      }
    }

    /*
    if(!this.props.getExecLoopFlg() && this.props.exec_mode == "continuous") {
      this.handleSwitchExecLoop();
    }
    */
  }

  handleCursorChange(type) {
    this.props.handleChangeSelectedTool(type);
    this.setState({
      cursorType: type
    });
  }

  handleSwitchExecLoop() {
    if(this.props.exec_mode != "continuous") {
      this.filterVisible();
      this.plotToData();
      this.props.handleChangeDataset(this.props.dataset, this._data);
      return;
    }

    var _self = this;
    const execLoop = (exec_loop = this.props.getExecLoopFlg()) => {
      if(!exec_loop) {
        return;
      }

      this.filterVisible();
      this.plotToData();
      this.props.handleChangeDataset(this.props.dataset, this._data);

      setTimeout(() => {
        execLoop();
      }, 1000);
    };

    let exec_loop = !this.props.getExecLoopFlg();
    this.props.handleChangeExecLoop(exec_loop);
    if(exec_loop) {
      execLoop(exec_loop);
    }
  }

  handleE1ToggleLock() {
    this.setState({
      e1lock: !this.state.e1lock,
    });
  }

  handleE2ToggleLock() {
    this.setState({
      e2lock: !this.state.e2lock,
    });
  }

  handleEditDistSelect(e) {
    this.setState({
      'edit_dist': e.target.value
    });
  }

  handleEditSizeText(e) {
    const size = Number(e.target.value);
    this.setState({
      'edit_size': size
    });
    this.plotCircle.attr("r", size);
  }

  handleChangePDRange(e) {
    const pd_ratio = Number(e.target.value);
    this.PDPlot(pd_ratio);
  }

  render() {
    const e1lock = {
      position: "absolute",
      bottom: 50,
      right: 5,
      fontSize: 20,
      cursor: "pointer",
    }

    const e2lock = {
      position: "absolute",
      top: 15,
      left: 25,
      fontSize: 20,
      cursor: "pointer",
    }

    const svgWrap = {
      position: "relative",
      top: 0,
      left: 0,
    }

    const toolbox = {
      marginLeft: "40px",
    };

    return (
      <div style={svgWrap}>
        <div ref={node => this.node = node}></div>
        <div style={toolbox}>
          <Button
            bsStyle={this.state.cursorType == "search" ? "primary" : "default"}
            onClick={() => {this.handleCursorChange("search")}}>
            <Glyphicon glyph="search" />
          </Button>
          <Button
            bsStyle={this.state.cursorType == "edit" ? "primary" : "default"}
            onClick={() => {this.handleCursorChange("edit")}}>
            <i className="fa fa-pencil"></i>
          </Button>
          <Button
            bsStyle={this.state.cursorType == "brush" ? "primary" : "default"}
            onClick={() => {this.handleCursorChange("brush")}}>
            <i className="fa fa-paint-brush"></i>
          </Button>
          <Button
            bsStyle={this.state.cursorType == "eraser" ? "primary" : "default"}
            onClick={() => {this.handleCursorChange("eraser")}}>
            <i className="fa fa-eraser"></i>
          </Button>
          <Button
            bsStyle={this.state.cursorType == "rotate" ? "primary" : "default"}
            onClick={() => {this.handleCursorChange("rotate")}}>
            <Glyphicon glyph="refresh" />
          </Button>
          <Button
            bsStyle={this.state.cursorType == "bucket" ? "primary" : "default"}
            onClick={() => {this.handleCursorChange("bucket")}}>
            <Glyphicon glyph="tint" />
          </Button>
          <Button
            bsStyle={this.state.cursorType == "scat" ? "primary" : "default"}
            onClick={() => {this.handleCursorChange("scat")}}>
            <i className="fa fa-certificate"></i>
          </Button>
          <Button
            bsStyle={this.state.cursorType == "filter" ? "primary" : "default"}
            onClick={() => {this.handleCursorChange("filter")}}>
            <Glyphicon glyph="filter" />
          </Button>
          <Button
            bsStyle={this.state.cursorType == "signal" ? "primary" : "default"}
            onClick={() => {this.handleCursorChange("signal")}}>
            <Glyphicon glyph="signal" />
          </Button>
          <Button
            bsStyle={this.props.getExecLoopFlg() ? "primary" : "default"}
            onClick={() => {this.handleSwitchExecLoop();}}>
            <Glyphicon glyph="ok" />
          </Button>
          <div className="edit-panel">
            <Row>
              <Col xs={12} sm={6} md={6} lg={6} style={{display: this.state.cursorType == 'edit' ? 'inline' : 'none'}}>
                <FormGroup>
                  <ControlLabel>Distribution</ControlLabel>
                  <FormControl
                    componentClass="select"
                    value={this.state.edit_dist}
                    onChange={this.handleEditDistSelect}>
                    <option value="norm">Normal Distribution</option>
                    <option value="uni">Uniform Distribution</option>
                  </FormControl>
                </FormGroup>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}
                style={{display: (this.state.cursorType == 'edit' || this.state.cursorType == 'scat') ? 'inline' : 'none'}}>
                <FormGroup>
                  <ControlLabel>Brush Size</ControlLabel>
                  <FormControl
                    type="text"
                    value={this.state.edit_size}
                    onChange={this.handleEditSizeText}>
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>
          </div>
          <div className="signal-panel">
            <Row>
              <Col xs={12} sm={6} md={6} lg={6} style={{display: this.state.cursorType == 'signal' ? 'inline' : 'none'}}>
                <div><b>Populate/Decrease</b></div>
                <input ref={ran => this.pdrange_d = ran} type="range" step="1" max="500" min="0" onChange={this.handleChangePDRange} />
                <b id={"range-text"}>100</b>
              </Col>
            </Row>
          </div>
          <div className="bucket-panel">
            <Row>
              <Col xs={12} sm={6} md={6} lg={6} style={{display: this.state.cursorType == 'bucket' ? 'inline' : 'none'}}>
                <select ref={sel => this.clustering_method_sel = sel}>
                  <option value="kmeans">K-means</option>
                  <option value="dbscan">DBSCAN</option>
                </select>
                <div><b>Kmeans cluster number</b></div>
                <input ref={ran => this.kmeans_clu_num = ran} type="text" />
                <div><b>DBSCAN eps</b></div>
                <input ref={ran => this.dbscan_eps = ran} type="text" />
              </Col>
            </Row>
          </div>
        </div>

        <i
          className={this.state.e1lock ? "fa fa-lock" : "fa fa-unlock"}
          style={e1lock}
          onClick={this.handleE1ToggleLock} />
        <i
          className={this.state.e2lock ? "fa fa-lock" : "fa fa-unlock"}
          style={e2lock}
          onClick={this.handleE2ToggleLock} />
      </div>
    )
  }
}

export default ScatterPlot
