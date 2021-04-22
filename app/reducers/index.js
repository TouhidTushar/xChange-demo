import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import initialReducer from "./initial.reducer";
import postReducer from "./post.reducer";
// import cartReducer from "./cart.reducer";
// import orderReducer from "./order.reducer";
// import inventoryReducer from "./inventory.reducers";

const rootReducer = combineReducers({
  auth: authReducer,
  general: initialReducer,
  post: postReducer,
  //   inventory: inventoryReducer,
  //   cart: cartReducer,
  //   order: orderReducer,
});

export default rootReducer;
