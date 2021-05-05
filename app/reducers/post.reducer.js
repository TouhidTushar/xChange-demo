import { postConstants } from "../actions/constants";

const initState = {
  posts: [],
  archivedPosts: [],
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
        message: "",
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

    //get archived posts
    case postConstants.GETARCHIVEDPOST_SUCCESS:
      state = {
        ...state,
        posting: false,
        result: true,
        loading: false,
        archivedPosts: action.posts,
        message: "",
      };
      break;
    case postConstants.GETARCHIVEDPOST_FAILURE:
      state = {
        ...state,
        posting: false,
        loading: false,
        result: false,
        message: action.response,
      };
      break;

    //get sold posts
    case postConstants.GETSOLDPOST_SUCCESS:
      state = {
        ...state,
        posting: false,
        result: true,
        loading: false,
        soldPosts: action.posts,
        message: "",
      };
      break;
    case postConstants.GETSOLDPOST_FAILURE:
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
        message: "",
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
