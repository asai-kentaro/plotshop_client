import React from 'react';
import { Row, Col, Button, FormControl, FormGroup, Glyphicon, ControlLabel } from 'react-bootstrap';

import api_exec from "../../api/code";

const $ = require('jquery');

/*
 * Coding panel (Left side in main area)
 */
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.marks = [];

    this.state = {
      mode: "none",
      continuous_looping: true,
    };

    this.handleCodeSubmitBtn = this.handleCodeSubmitBtn.bind(this);
    this.assembleCodeContinuous = this.assembleCodeContinuous.bind(this);
  }

  componentDidMount() {
    this.pyEditor = CodeMirror.fromTextArea(document.getElementById('editor_py'), {
      mode: "python",
      lineNumbers: true,
      indentUnit: 4,
    });

    api_exec.load_code(CODE_ID, (res) => {
      this.pyEditor.setValue(res.code);
    });
  }

  findBindCommand(line) {
    let res = null;
    let line_len = line.length;
    if(line_len >= 5) {
      if(line.substring(0, 5) == "#bind") {
        let end_punc = line.indexOf(")");
        let punc_string = line.substring(6, end_punc);
        let end_var = punc_string.indexOf(",");
        if(end_var >= 0) {
          let var_string = punc_string.substring(0, end_var);
          let meta_string = punc_string.substring(end_var+1);
          let meta = JSON.parse(meta_string);
          res = {
            var_name: var_string,
            meta: meta,
          }
        } else {
          res = {
            var_name: punc_string,
            meta: {},
          }
        }
      }
    }
    return res;
  }

  findEditCommand(line) {
    let res = null;
    let line_len = line.length;
    if(line_len >= 5) {
      if(line.substring(0, 5) == "#edit") {
        let end_punc = line.indexOf(")");
        let punc_string = line.substring(6, end_punc);
        let end_var = punc_string.indexOf(",");
        if(end_var >= 0) {
          let var_string = punc_string.substring(0, end_var);
          let meta_string = punc_string.substring(end_var+1);
          let meta = JSON.parse(meta_string);
          res = {
            var_name: var_string,
            meta: meta,
          }
        } else {
          res = {
            var_name: punc_string,
            meta: {},
          }
        }
      }
    }
    return res;
  }

  assembleCodeContinuous() {
    this.marks = [];

    const addMark = (var_name, meta) => {
      let mark = {
        type: "scatter",
        val: var_name,
        valueVar: "",
        labelVar: "",
      };

      if(meta.color) {
        mark.valueVar = meta.color;
        mark.labelVar = meta.color;
      }
      if(meta.title) {
        mark.panelTitle = meta.title;
      }
      if(meta.line) {
        mark.line = meta.line;
      }
      if(meta.selecting) {
        mark.selecting = meta.selecting;
      }
      if(meta.mode == "splom") {
        mark.type = "splom";
      }

      this.marks.push(mark);
    }

    let codeparts = [""];
    let keyChain = {};
    let line = "";
    let command = null;
    for(let i=0;i<this.pyEditor.lineCount();i++) {
      line = this.pyEditor.getLine(i);
      codeparts[codeparts.length-1] += line + '\n';

      // #edit
      command = null;
      command = this.findEditCommand(line);
      if(command != null) {
        let var_name = command.var_name;
        let meta = command.meta;

        codeparts[codeparts.length-1] += "___loadDataChank('" + var_name + "')\n";
      }
      // #bind
      command = null;
      command = this.findBindCommand(line);
      if(command != null) {
        let var_name = command.var_name;
        let meta = command.meta;
        meta.line = i;

        codeparts[codeparts.length-1] += "___setOutputTargetVar('" + var_name + "')\n";
        codeparts.push("");
        addMark(var_name, meta);
      }
    }

    return codeparts;
  }

  assembleCodeBreakout() {
    this.marks = [];

    const addMark = (var_name, meta) => {
      let mark = {
        type: "scatter",
        val: var_name,
        valueVar: "",
        labelVar: "",
      };

      if(meta.color) {
        mark.valueVar = meta.color;
        mark.labelVar = meta.color;
      }
      if(meta.title) {
        mark.panelTitle = meta.title;
      }
      if(meta.line) {
        mark.line = meta.line;
      }
      if(meta.selecting) {
        mark.selecting = meta.selecting;
      }
      if(meta.mode == "splom") {
        mark.type = "splom";
      }

      this.marks.push(mark);
    }

    let codeparts = [""];
    let keyChain = {};
    let line = "";
    let command = null;
    for(let i=0;i<this.pyEditor.lineCount();i++) {
      line = this.pyEditor.getLine(i);
      codeparts[codeparts.length-1] += line + '\n';

      // #edit
      command = null;
      command = this.findEditCommand(line);
      if(command != null) {
        let var_name = command.var_name;
        let meta = command.meta;
        meta.line = i;

        codeparts[codeparts.length-1] += "___clearDataChank('" + var_name + "')\n";
        codeparts[codeparts.length-1] += "___loadDataChank('" + var_name + "')\n";
        codeparts[codeparts.length-1] += "___setOutputTargetVar('" + var_name + "')\n";
        codeparts.push("");
        addMark(var_name, meta);
      }
    }

    return codeparts;
  }

  handleCodeSubmitBtn() {
    let mks = this.pyEditor.getAllMarks();
    for(let i=0;i<mks.length;i++) {
      mks[i].clear();
    }

    const highlightLine = (line, className="mark-var-red") => {
      this.pyEditor.markText({line: line, ch: 0},{line: line+1, ch: 0},{className});
    }

    const outputResSet = (resp) => {
      let res = resp.response;
      if(res.status == "executed") {
        this.props.setConsoleOutput(res.res.val);

        this.props.setChartEmpty();
        let marks = this.marks;
        for(let i=0;i<marks.length;i++) {
          if(res.res.out_vars[marks[i].val]) {
            if(res.res.breakout) {
              if(i == res.res.breakout.index - 1) {
                if(marks[i].line) {
                  highlightLine(marks[i].line);
                }
                this.props.handleCodeLocalVal(marks[i].panelTitle, marks[i], res.res.out_vars[marks[i].val])
              }
            } else {
              if(marks[i].line) {
                highlightLine(marks[i].line, "mark-var-yellow");
              }
              this.props.handleCodeLocalVal(marks[i].panelTitle, marks[i], res.res.out_vars[marks[i].val])
            }
          }
        }
      }
      if(res.status == "executed_ended") {
        this.props.changeExecMode("continuous")
        this.setState({mode: "continuous"});
        setTimeout(() => {
          this.handleCodeSubmitBtn();
        }, 0);
      }
    };

    if(this.state.mode == "none") {
      const codes = this.assembleCodeBreakout();
      this.props.changeExecMode("breakout")
      this.setState({mode: "breakout"});
      api_exec.exec_breakout("code_set", codes, (res) => {
        if(res.error == "") {
          this.handleCodeSubmitBtn();
        }
      });
    } else if(this.state.mode == "breakout") {
      api_exec.exec_breakout("progress_breakout", [], outputResSet);
    } else if(this.state.mode == "continuous") {
      const codes = this.assembleCodeContinuous();
      const filename = this.props.loadedDataset.name;

      api_exec.exec_local(codes, filename, outputResSet);
    }
  }

  render() {
    const editor_style = {marginBottom: "30px"};

    return (
      <div style={editor_style}>
        <h3>Code</h3>
        <textarea
          id="editor_py"
          style={{width: "100%", resize: "none"}}
          rows="50">
        </textarea>

        <Button
          className="btn-primary"
          onClick={this.handleCodeSubmitBtn}>
          {'Run'}
        </Button>
        {
          this.state.mode == "continuous" ?
          <span style={{marginLeft: 10, fontSize: 20}}>
            <input type="checkbox" style={{marginRight: 5}} value={this.state.continuous_looping} onClick={() => {this.setState({continuous_looping: !this.state.continuous_looping})}} />
            continuous mode
          </span> :
          null
        }
      </div>
    );
  }
}

export default CodeEditor;
