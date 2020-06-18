import {connect} from 'react-redux'
import Designer from '../components/designer/Designer'

import {codeLoadCharts} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    charts: state.charts,
  }
}

const mapDispatchToProps = dispatch => ({
  handleLoadCharts: (charts) => {
    dispatch(codeLoadCharts(charts));
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Designer)
