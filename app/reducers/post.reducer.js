import { postConstants } from "../actions/constants";

const initState = {
  posts: [],
  loading: false,
  result: false,
  message: "",
};

const postReducer = (state = initState, action) => {
  switch (action.type) {
    //get all posts
    case postConstants.GETPOST_REQUEST:
      state = {
        ...initState,
        loading: true,
      };
      break;
    case postConstants.GETPOST_SUCCESS:
      state = {
        ...state,
        result: true,
        loading: false,
        posts: action.posts,
        message: "posts retrieved",
      };
      break;
    case postConstants.GETPOST_FAILURE:
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

export default postReducer;
