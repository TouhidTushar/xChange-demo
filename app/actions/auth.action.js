import firebase from "firebase";
import { authConstants } from "./constants";

//register action
export const register = (data) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.SIGNUP_REQUEST });
    firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            contact: data.contact,
          })
          .then(() => {
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .get()
              .then((snapshot) => {
                if (snapshot.exists) {
                  dispatch({
                    type: authConstants.SIGNUP_SUCCESS,
                    currentUser: snapshot.data(),
                  });
                } else {
                  console.log(error);
                  dispatch({ type: authConstants.SIGNUP_FAILURE });
                }
              })
              .catch((error) => {
                console.log(error);
                dispatch({ type: authConstants.SIGNUP_FAILURE });
              });
          })
          .catch((error) => {
            console.log(error);
            dispatch({ type: authConstants.SIGNUP_FAILURE });
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: authConstants.SIGNUP_FAILURE });
      });
  };
};

// login action
export const login = (data) => {
  return async (dispatch) => {
    firebase.auth().signInWithEmailAndPassword(data.email, data.password);
  };
};
