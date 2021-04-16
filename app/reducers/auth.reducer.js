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
        message: "Something went wrong!",
      };
      break;
  }
  return state;
};

export default authReducer;
