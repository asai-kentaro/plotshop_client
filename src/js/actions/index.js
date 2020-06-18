
export const codeExecRes = (text) => {
  return { type: 'CODE_EXEC_RES', text: text };
}

export const codeExecEmpty = () => {
  return { type: 'EMPTY_CHART' };
}

export const codeLoadCharts = (charts) => {
  return {
    type: 'LOAD_CHARTS',
    charts: charts,
  }
}

export const codeExecPieChart = (title, mark, value) => {
  return { type: 'DRAW_CHART_PIE', value: value, title: title, mark: mark, };
}

export const codeExecLineChart = (title, mark, value) => {
  return { type: 'DRAW_CHART_LINE', value: value, title: title, mark: mark, };
}

export const codeExecBarChart = (title, mark, value) => {
  return { type: 'DRAW_CHART_BAR', value: value, title: title, mark: mark, };
}

export const codeExecScatterPlot = (title, mark, value) => {
  return { type: 'DRAW_PLOT_SCATTER', value: value, title: title, mark: mark, };
}

export const codeExecSPLOM = (title, mark, value) => {
  return { type: 'DRAW_SPLOM', value: value, title: title, mark: mark, };
}

export const codeExecTable = (title, mark, value) => {
  return { type: 'DRAW_TABLE', value: value, title: title, mark: mark, };
}

export const chartSelectData = (var_name, manipulation) => {
  return { type: 'SELECT_DATA_FROM_CHART', var_name: var_name, manipulation: manipulation};
}

export const chartChangeDataset = (var_name, manipulation) => {
  return { type: 'CHANGE_DATASET_BY_PLOT', var_name: var_name, manipulation: manipulation};
}

export const modalShow = (title, body) => {
  return { type: 'SHOW_MODAL', title: title, body: body };
}

export const modalHide = () => {
  return { type: 'HIDE_MODAL' };
}

export const datasetLoad = (filename, data) => {
  return { type: 'DATASET_LOAD',  filename: filename, data: data };
}

export const changeTab = (tabname) => {
  return { type: 'CHANGE_TAB', tabname: tabname };
}

export const changeScatterplotElm = (e1, e2) => {
  return { type: 'DATASET_ELM_SEL', e1: e1, e2: e2 };
}

export const addVariable = (col_name, col_data) => {
  return { type: 'ADD_COL_DATA', name: col_name, data: col_data, }
}

export const emptyManipulation = () => {
  return { type: "EMPTY_MANIPULATION"};
}

export const changeDataset = (dataset) => {
  return { type: 'CHANGE_DATASET', dataset: dataset, };
}

export const filterData = (idx) => {
  return { type: 'FILTER_DATA', idx: idx};
}
