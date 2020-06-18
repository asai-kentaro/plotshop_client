import {connect} from 'react-redux'
import App from '../components/App'
import {
  modalShow,
  modalHide,
  datasetLoad,
  changeTab,
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    modal:state.modal,
    loadedDataset: state.dataset,
    tab: state.tab,
  }
}

const mapDispatchToProps = dispatch => ({
  handleModalHide: () => {
    dispatch(modalHide());
  },
  handleModalShow: (title, body) => {
    dispatch(modalShow(title, body));
  },
  handleLoadDataset: (filename, data) => {
    dispatch(datasetLoad(filename, data));
  },
  handleChangeTab: (tabname) => {
    dispatch(changeTab(tabname));
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
