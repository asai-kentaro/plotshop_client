import {connect} from 'react-redux'
import Analyzer from '../components/analyzer/Analyzer'
import { changeScatterplotElm, addVariable, changeDataset } from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    dataset: state.dataset,
  }
}

const mapDispatchToProps = dispatch => ({
  handleChangeScatterplot: (e1, e2) => {
    dispatch(changeScatterplotElm(e1, e2));
  },
  handleAddColData: (name, data) => {
    dispatch(addVariable(name, data));
  },
  handleChangeDataset: (dataset, data_2dim) => {

    var prev_datalen = dataset.data.length;
    var dataset2dim = [];
    var new2dim = [];

    //cut [NaN, NaN]
    for(var i=0;i<data_2dim.length;i++) {
      if(!(isNaN(data_2dim[i][0]) && isNaN(data_2dim[i][1]))) {
        dataset2dim.push(dataset.data[i]);
        new2dim.push(data_2dim[i]);
      }
    }
    dataset.data = dataset2dim;
    data_2dim = new2dim;

    // add multi-dimensional data
    for(var i=prev_datalen;i<data_2dim.length;i++) {
      var tmp = [];
      for(var s=0;s<dataset.variables.length;s++) {
        if(s == dataset.scatterplot.e1) {
          tmp[s] = data_2dim[i][0];
        } else if(s == dataset.scatterplot.e2) {
          tmp[s] = data_2dim[i][1];
        } else {
          tmp[s] = 0;
        }
      }
      dataset.data[i] = tmp;
    }

    // change data of the 2 dimensions
    for(var i=0;i<dataset.data.length;i++) {
      dataset.data[i][dataset.scatterplot.e1] = data_2dim[i][0];
      dataset.data[i][dataset.scatterplot.e2] = data_2dim[i][1];
    }

    dispatch(changeDataset(dataset));
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Analyzer)
