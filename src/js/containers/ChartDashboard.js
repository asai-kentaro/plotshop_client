import {connect} from 'react-redux'
import ChartDashboard from '../components/coder/ChartDashboard'
import {codeExecPieChart, chartSelectData, chartChangeDataset, filterData } from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    charts: state.charts,
  }
}

const mapDispatchToProps = dispatch => ({
  handlePieChartBtn: (value) => {
    dispatch(codeExecPieChart("pie chart by click", value));
  },
  handleClickChartData: (var_name, manipulation) => {
    dispatch(chartSelectData(var_name, manipulation));
  },
  handleChangeChartData: (var_name, manipulation) => {
    dispatch(chartChangeDataset(var_name, manipulation));
  },
  handleFilterData: (idx) => {
    dispatch(filterData(idx));
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartDashboard)
