const initialState = {
  text: "[pending]",
  res: "pending",
}

const codeConsole = (state = initialState, action) => {
    switch(action.type) {
      case "CODE_EXEC_RES":
        return {
          text: action.text,
          res: "succeeded"
        }
  }

  return state;
}

export default codeConsole;
