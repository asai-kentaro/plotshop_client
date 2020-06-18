const initialState = {
  filename: "",
  variables: ["No data"],
  vartypes: [],
  data: [],
  group: [],
  scatterplot: {
    e1: -1,
    e2: -1,
  },
}

const varTypeSelect = (data) => {
  var res = [];

  for(var i=0;i<data.length;i++) {
    if(!isNaN(Number(data[i]))) {
      res.push("num");
    } else {
      res.push("no");
    }
  }

  return res;
}

const dataset = (state = initialState, action) => {
  const datamax = 1000;

  switch(action.type) {
    case "DATASET_LOAD":
      var vars = action.data[0];
      var data = action.data.slice(1, datamax);
      var varts = varTypeSelect(data[0]);

      state.scatterplot.e1 = -1;
      state.scatterplot.e2 = -1;
      for(var i=0;i<varts.length;i++) {
        if(varts[i] == "num") {
          if(state.scatterplot.e1 == -1) {
            state.scatterplot.e1 = i;
          } else {
            state.scatterplot.e2 = i;
            break;
          }
        }
      }
      var group = [];
      for(var i=0;i<data.length;i++) {
        group.push(0);
      }
      return {
        filename: action.filename,
        variables: action.data[0],
        vartypes: varts,
        data: data,
        group: group,
        scatterplot: state.scatterplot,
      }
      break;
    case "DATASET_ELM_SEL":
      var newstate = {
        filename: state.filename,
        variables: state.variables,
        vartypes: state.vartypes,
        data: state.data,
        group: state.group,
        scatterplot: {
          e1: action.e1,
          e2: action.e2,
        },
      }
      return newstate;
      break;
    case "CHANGE_DATASET":
      return Object.assign({}, action.dataset);
      break;
    case "ADD_COL_DATA":
      state = Object.assign({}, state);
      for(var i=0;i<action.data.length;i++) {
        state.data[i][state.variables.length] = action.data[i];
      }
      state.variables.push(action.name);
      state.vartypes.push("num");
      return state;
      break;
    case "FILTER_DATA":
      console.log(action);
      return state;
      break;
  }

  return state;
}

export default dataset;
