import {connect} from 'react-redux'
import CoderStudio from '../components/coder/CoderStudio'
import {
  codeExecRes,
  codeExecEmpty,
  codeExecPieChart,
  codeExecLineChart,
  codeExecBarChart,
  codeExecScatterPlot,
  codeExecSPLOM,
  codeExecTable,
  chartSelectData,
  emptyManipulation,
  modalShow,
  modalHide,
  datasetLoad,
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    output: state.codeConsole.text,
    charts: state.charts,
    chartManipulations: state.chartManipulations,
  }
}

const mapDispatchToProps = dispatch => ({
  handleCodeOutput: (text) => {
    dispatch(codeExecRes(text));
  },
  handleChartEmpty: () => {
    dispatch(codeExecEmpty());
  },
  handleManipulationEmpty: () => {
    dispatch(emptyManipulation());
  },
  handleCodeLocalVal: (title, mark, val) => {
    switch(mark.type) {
      case "pie":
        dispatch(codeExecPieChart(title, mark, val));
        break;
      case "line":
        dispatch(codeExecLineChart(title, mark, val));
        break;
      case "bar":
        dispatch(codeExecBarChart(title, mark, val));
        break;
      case "scatter":
        dispatch(codeExecScatterPlot(title, mark, val));
        break;
      case "splom":
        dispatch(codeExecSPLOM(title, mark, val));
        break;
      case "table":
        dispatch(codeExecTable(title, mark, val));
        break;
      }
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoderStudio)
