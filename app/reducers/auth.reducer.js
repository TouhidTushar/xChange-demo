import { authConstants } from "../actions/constants";

const initState = {
  user: null,
  loading: false,
  result: false,
  message: "",
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    //signup
    case authConstants.SIGNUP_REQUEST:
      state = {
        ...initState,
        loading: true,
      };
      break;
    case authConstants.SIGNUP_SUCCESS:
      state = {
        ...state,
        result: true,
        loading: false,
        user: action.currentUser,
        message: "Registration successful",
      };
      break;
    case authConstants.SIGNUP_FAILURE:
      state = {
        ...state,
        result: false,
        loading: false,
        message: action.response,
      };
      break;

    //login
    case authConstants.LOGIN_REQUEST:
      state = {
        ...initState,
        loading: true,
      };
      break;
    case authConstants.LOGIN_SUCCESS:
      state = {
        ...state,
        result: true,
        loading: false,
        user: action.currentUser,
        message: "Login successful",
      };
      break;
    case authConstants.LOGIN_FAILURE:
      state = {
        ...state,
        result: false,
        loading: false,
        message: action.response,
      };
      break;

    //logout
    case authConstants.LOGOUT_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case authConstants.LOGOUT_SUCCESS:
      state = {
        ...initState,
        result: true,
        loading: false,
        message: "Logout successful",
      };
      break;
    case authConstants.LOGOUT_FAILURE:
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

export default authReducer;
