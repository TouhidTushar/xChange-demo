import firebase from "firebase";
import { initConstants } from "./constants";

export const getCategories = () => {
  return async (dispatch) => {
    var categoryArray = [];
    dispatch({ type: initConstants.GETCAT_REQUEST });
    firebase
      .firestore()
      .collection("categories")
      .get()
      .then((snapshot) => {
        if (snapshot) {
          var count = snapshot.size;
          snapshot.forEach((doc) => {
            categoryArray.push(doc.data());
            count = count - 1;
            if (count == 0) {
              dispatch({
                type: initConstants.GETCAT_SUCCESS,
                categories: categoryArray,
              });
            }
          });
        } else {
          dispatch({
            type: initConstants.GETCAT_FAILURE,
            response: "something went wrong!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: initConstants.GETCAT_FAILURE,
          response: error.message,
        });
      });
  };
};

export const getLocations = () => {
  return async (dispatch) => {
    var locationArray = [];
    dispatch({ type: initConstants.GETLOC_REQUEST });
    firebase
      .firestore()
      .collection("locations")
      .get()
      .then((snapshot) => {
        if (snapshot) {
          var count = snapshot.size;
          snapshot.forEach((doc) => {
            locationArray.push(doc.data());
            count = count - 1;
            if (count == 0) {
              dispatch({
                type: initConstants.GETLOC_SUCCESS,
                locations: locationArray,
              });
            }
          });
        } else {
          dispatch({
            type: initConstants.GETLOC_FAILURE,
            response: "something went wrong!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: initConstants.GETLOC_FAILURE,
          response: error.message,
        });
      });
  };
};
