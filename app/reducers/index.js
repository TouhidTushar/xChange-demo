import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import initialReducer from "./initial.reducer";
// import cartReducer from "./cart.reducer";
// import orderReducer from "./order.reducer";
// import inventoryReducer from "./inventory.reducers";

const rootReducer = combineReducers({
  auth: authReducer,
  general: initialReducer,
  //   inventory: inventoryReducer,
  //   cart: cartReducer,
  //   order: orderReducer,
});

export default rootReducer;
