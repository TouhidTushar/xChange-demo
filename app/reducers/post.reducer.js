import { postConstants } from "../actions/constants";

const initState = {
  posts: [],
  loading: false,
  posting: false,
  result: false,
  render: false,
  message: "",
};

const postReducer = (state = initState, action) => {
  switch (action.type) {
    //get all posts
    case postConstants.GETPOST_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case postConstants.GETPOST_SUCCESS:
      state = {
        ...state,
        result: true,
        loading: false,
        posting: false,
        posts: action.posts,
        message: "posts retrieved",
      };
      break;
    case postConstants.GETPOST_FAILURE:
      state = {
        ...state,
        result: false,
        loading: false,
        posting: false,
        message: action.response,
      };
      break;

    //new post
    case postConstants.NEWPOST_REQUEST:
      state = {
        ...state,
        posting: true,
      };
      break;
    case postConstants.NEWPOST_SUCCESS:
      state = {
        ...state,
        result: true,
        message: "done",
      };
      break;
    case postConstants.NEWPOST_FAILURE:
      state = {
        ...state,
        result: false,
        posting: false,
        message: action.response,
      };
      break;
    case postConstants.NEWPOST_SHOW_RESULT:
      state = {
        ...state,
        render: true,
      };
      break;
    case postConstants.NEWPOST_HIDE_RESULT:
      state = {
        ...state,
        render: false,
      };
      break;
  }
  return state;
};

export default postReducer;
