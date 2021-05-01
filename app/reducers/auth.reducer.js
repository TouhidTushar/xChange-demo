import { authConstants } from "../actions/constants";

const initState = {
  user: null,
  loading: false,
  watching: false,
  loggedIn: false,
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
        loggedIn: true,
        user: action.currentUser,
        message: "Registration successful",
      };
      break;
    case authConstants.SIGNUP_FAILURE:
      state = {
        ...state,
        result: false,
        loggedIn: false,
        user: null,
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
        loggedIn: true,
        user: action.currentUser,
        message: "Login successful",
      };
      break;
    case authConstants.LOGIN_FAILURE:
      state = {
        ...state,
        result: false,
        loading: false,
        loggedIn: false,
        user: null,
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
        ...state,
        result: true,
        loading: false,
        loggedIn: false,
        user: null,
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

    //watchlist
    case authConstants.WATCH_REQUEST:
      state = {
        ...state,
        watching: true,
      };
      break;
    case authConstants.WATCH_SUCCESS:
      state = {
        ...state,
        watching: false,
        user: { ...state.user, watchList: action.watchlist },
        message: action.response,
      };
      break;
    case authConstants.WATCH_FAILURE:
      state = {
        ...state,
        watching: false,
        message: action.response,
      };
      break;

    //archivelist
    case authConstants.ARCHIVE_SUCCESS:
      state = {
        ...state,
        user: { ...state.user, archiveList: action.archives },
      };
      break;

    //soldlist
    case authConstants.SOLD_SUCCESS:
      state = {
        ...state,
        user: { ...state.user, soldList: action.soldList },
      };
      break;
  }
  return state;
};

export default authReducer;
