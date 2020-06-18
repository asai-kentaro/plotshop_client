const initialState = {
  tabname: "code"
};

const tab = (state = initialState, action) => {
  switch(action.type) {
    case "CHANGE_TAB":
      return {
        tabname: action.tabname
      };
      break;
  }

  return state;
}

export default tab;
