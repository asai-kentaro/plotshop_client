const _ = require('lodash');

const initialState = [];

// manipulations to the same variable is filtered except for the last manipulation
const uniqueVariableFilter = (state) => {
  let res = [];

  let varlist = _.groupBy(state, (s) => { return s.chartVar; })
  for(let k in varlist) {
    if(varlist[k].length == 1) {
      res.push(varlist[k][0]);
    } else {
      res.push(varlist[k][varlist[k].length - 1]);
    }
  }

  return res;
}

const chartManipulations = (state = initialState, action) => {
  let _state;
  switch(action.type) {
    case "EMPTY_MANIPULATION":
      return [];
      break;
    case "SELECT_DATA_FROM_CHART":
      _state = uniqueVariableFilter([...state, action.manipulation]);
      return _state;
      break;
    case "CHANGE_DATASET_BY_PLOT":
      _state = uniqueVariableFilter([...state, action.manipulation]);
      return _state;
      break;
  }

  return state;
}

export default chartManipulations;
