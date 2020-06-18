/*
const initialState = [
  {
    chart_type: "line",
    title: "default line",
    mark: {var_name: "",},
    ephem: true,
    value: {
      head: ["A", "B"],
      data: [
        [
          {x: 0, y: 6},{x: 1, y: 9},{x: 2, y: 6},
          {x: 3, y: 5},{x: 4, y: 2},{x: 6, y: 4},
          {x: 7, y: 2},{x: 8, y: 5},{x: 9, y: 2}
        ],
        [
          {x: 0, y: 1},{x: 1, y: 7},{x: 2, y: 4},
          {x: 3, y: 9},{x: 4, y: 3},{x: 6, y: 3},
          {x: 7, y: 8},{x: 8, y: 5},{x: 9, y: 8}
        ]
      ]
    }
  },
  {
    chart_type: "bar",
    title: "default bar",
    mark: {var_name: "",},
    ephem: true,
    value: {
      head: ["A", "B", "C"],
      data: [
        {label: "A", value: [4]},
        {label: "B", value: [5]},
        {label: "C", value: [2]}
      ]
    },
  },
  {
    chart_type: "pie",
    title: "default pie",
    mark: {var_name: "",},
    ephem: true,
    value: {
        head: ["A", "B", "C"],
        data: [
          {label: "A", value: [1,1]},
          {label: "B", value: [1,3]},
          {label: "C", value: [2,2]},
        ],
    }
  },
]
*/

const initialState = [];

const ephemFilter = (state) => {
  var res = [];

  for(var i=0;i<state.length;i++) {
    if(!state[i].ephem) {
      res.push(state[i]);
    }
  }

  return res;
}

const selectOneDataGroup = (state, var_name, value) => {
  var newstate = [];
  for(var i=0;i<state.length;i++) {
    if(state[i].var_name == var_name) {
      state[i].value = [value];
    }
    newstate.push(state[i]);
  }

  return newstate;
}

const varTypeSelect = (data) => {
  var res = [];

  for(var i=0;i<data[0].length;i++) {
    if(!isNaN(Number(data[0][i]))) {
      res.push("num");
    } else {
      res.push("no");
    }
  }

  return res;
}

const charts = (state = initialState, action) => {
  switch(action.type) {
    case "EMPTY_CHART":
      return [];
    case "LOAD_CHARTS":
      return action.charts;
    case "DRAW_CHART_PIE":
      return [
        ...state,
        {
          chart_type: "pie",
          title: action.title,
          value: action.value,
          mark: action.mark,
        }
      ]
      break;
    case "DRAW_CHART_LINE":
      return [
        ...state,
        {
          chart_type: "line",
          title: action.title,
          value: action.value,
          mark: action.mark,
        }
      ]
      break;
    case "DRAW_CHART_BAR":
      return [
        ...state,
        {
          chart_type: "bar",
          title: action.title,
          value: action.value,
          mark: action.mark,
        }
      ]
      break;
    case "DRAW_PLOT_SCATTER":
      var dataset = {
        filename: "",
        variables: action.value.head,
        vartypes: varTypeSelect(action.value.data),
        data: action.value.data,
        scatterplot: {
          e1: 0,
          e2: 1,
        },
      }
      return [
        ...state,
        {
          chart_type: "scatter",
          title: action.title,
          value: dataset,
          mark: action.mark,
        }
      ]
      break;
    case "DRAW_SPLOM":
      return [
        ...state,
        {
          chart_type: "splom",
          title: action.title,
          value: action.value,
          mark: action.mark,
        }
      ]
      break;
    case "DRAW_TABLE":
      return [
        ...state,
        {
          chart_type: "table",
          title: action.title,
          value: action.value,
          mark: action.mark,
        }
      ]
      break;
    case "SELECT_DATA_ON_CHART":
      state = selectOneDataGroup(state, action.var_name, action.value);
      return state
      break;
  }

  return state;
}

export default charts;
