import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
// import cartReducer from "./cart.reducer";
// import orderReducer from "./order.reducer";
// import inventoryReducer from "./inventory.reducers";

const rootReducer = combineReducers({
  auth: authReducer,
  //   inventory: inventoryReducer,
  //   cart: cartReducer,
  //   order: orderReducer,
});

export default rootReducer;
