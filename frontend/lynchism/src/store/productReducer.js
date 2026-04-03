const defaultState = {
  products: [],
  loading: false
}


export const productReducer = (state = defaultState, action) => {
  switch (action.type){
    case "SET_PRODUCTS":
      return {...state,products: action.payload,loading: false}
    case "FETCH_PRODUCTS_LOADING":
      return { ...state, loading: true }
    default:
      return state
  }
}