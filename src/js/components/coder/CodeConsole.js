import React from 'react';

class CodeConsole extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posTop: "-250px",
      codeinput: ">",
    }

    this.switchConsole = this.switchConsole.bind(this);
    this.handleCodeInputChange = this.handleCodeInputChange.bind(this);
  }

  componentDidMount() {
  }

  switchConsole() {
    if(this.state.posTop == "0") {
      this.setState({
        posTop: "-250px"
      })
    } else {
      this.setState({
        posTop: "0"
      })
    }
  }

  handleCodeInputChange(e) {
    var str = e.target.value;
    if(str.length < 1) {
      str = ">";
    }

    this.setState({
      codeinput: str,
    });
  }

  render() {
    const consoleStyle = {
      position: "fixed",
      bottom: this.state.posTop,
      left: 0,
      width: "100%",
      zIndex: 10,
    };

    const consoleHeadStyle = {
      height: "20px",
      display: "block",
      color: "#eee",
      background: "#6e9bc5",
      borderTop: "1px solid #aaa",
      cursor: "pointer",
      fontWeight: "bold",
      paddingLeft: "5px"
    }

    const codeArea = {
      height: "250px",
      width: "100%",
      display: "block",
      background: "#000",
      color: "#fff",
    }

    const codeInput = {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      background: "#000",
      color: "white",
    }

    return (
      <div style={consoleStyle}>
        <div style={consoleHeadStyle} onClick={this.switchConsole}>
          Console
        </div>
        <textarea style={codeArea} value={this.props.output} readOnly>
        </textarea>
        <input style={codeInput} value={this.state.codeinput}
          onChange={this.handleCodeInputChange} />
      </div>
    );
  }
}

export default CodeConsole;
