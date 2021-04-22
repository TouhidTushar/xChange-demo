import { initConstants } from "../actions/constants";

const initState = {
  categories: [],
  locations: [],
  loading: false,
  result: false,
  message: "",
};

const initialReducer = (state = initState, action) => {
  switch (action.type) {
    //get categories
    case initConstants.GETCAT_REQUEST:
      state = {
        ...initState,
        loading: true,
      };
      break;
    case initConstants.GETCAT_SUCCESS:
      state = {
        ...state,
        result: true,
        loading: false,
        categories: action.categories,
        message: "categories retrieved",
      };
      break;
    case initConstants.GETCAT_FAILURE:
      state = {
        ...state,
        result: false,
        loading: false,
        message: action.response,
      };
      break;

    //get locations
    case initConstants.GETLOC_REQUEST:
      state = {
        ...initState,
        loading: true,
      };
      break;
    case initConstants.GETLOC_SUCCESS:
      state = {
        ...state,
        result: true,
        loading: false,
        locations: action.locations,
        message: "locations retrieved",
      };
      break;
    case initConstants.GETLOC_FAILURE:
      state = {
        ...state,
        result: false,
        loading: false,
        message: action.response,
      };
      break;
  }
  return state;
};

export default initialReducer;
