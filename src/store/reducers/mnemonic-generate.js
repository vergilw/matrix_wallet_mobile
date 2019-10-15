const mnemonicGenerate = (state = {actionDisabled: false}, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {actionDisabled: action.boolean}
    default:
      return state
  }
}

export default mnemonicGenerate