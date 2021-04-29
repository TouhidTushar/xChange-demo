import { postConstants } from "../actions/constants";

const initState = {
  posts: [],
  altPosts: [],
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

    //get ? posts
    case postConstants.GETEXTRAPOST_SUCCESS:
      state = {
        ...state,
        posting: false,
        result: true,
        loading: false,
        altPosts: action.posts,
        message: "posts retrieved",
      };
      break;
    case postConstants.GETEXTRAPOST_FAILURE:
      state = {
        ...state,
        posting: false,
        loading: false,
        result: false,
        message: action.response,
      };
      break;

    //new post
    case postConstants.POST_REQUEST:
      state = {
        ...state,
        posting: true,
      };
      break;
    case postConstants.POST_SUCCESS:
      state = {
        ...state,
        result: true,
        message: "done",
      };
      break;
    case postConstants.POST_FAILURE:
      state = {
        ...state,
        result: false,
        posting: false,
        message: action.response,
      };
      break;
    case postConstants.POST_SHOW_RESULT:
      state = {
        ...state,
        render: true,
      };
      break;
    case postConstants.POST_HIDE_RESULT:
      state = {
        ...state,
        render: false,
      };
      break;
  }
  return state;
};

export default postReducer;
