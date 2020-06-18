const initialState = {
  show: false,
  title: "",
  body: "",
};

const modal = (state = initialState, action) => {
  switch(action.type) {
    case 'SHOW_MODAL':
      return {
        show: true,
        title: action.title,
        body: action.body,
      }
      break;
    case 'HIDE_MODAL':
      return {
        show: false,
        title: state.title,
        body: state.body
      }
      break;
  }

  return state;
}

export default modal;
