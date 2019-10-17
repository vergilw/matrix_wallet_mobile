const mnemonicGenerate = (state = { isLoading: false }, action) => {
  console.log('reducers', action);
  switch (action.type) {
    case 'UPDATE_LOADING':
        console.log('UPDATE_LOADING');
      return {
        ...state,
        isLoading: action.boolean,
      }
    default:
      return state
  }
}

export default mnemonicGenerate