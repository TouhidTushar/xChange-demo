import firebase from "firebase";
import { authConstants } from "./constants";

//register action
export const register = (data) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.SIGNUP_REQUEST });
    firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            username: data.username,
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
                  dispatch({
                    type: authConstants.SIGNUP_FAILURE,
                    response: error.message,
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                dispatch({
                  type: authConstants.SIGNUP_FAILURE,
                  response: error.message,
                });
              });
          })
          .catch((error) => {
            console.log(error);
            dispatch({
              type: authConstants.SIGNUP_FAILURE,
              response: error.message,
            });
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: authConstants.SIGNUP_FAILURE,
          response: error.message,
        });
      });
  };
};

// login action
export const login = (data) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });
    firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              dispatch({
                type: authConstants.LOGIN_SUCCESS,
                currentUser: snapshot.data(),
              });
            } else {
              console.log(error);
              dispatch({
                type: authConstants.LOGIN_FAILURE,
                response: error.message,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            dispatch({
              type: authConstants.LOGIN_FAILURE,
              response: error.message,
            });
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: authConstants.LOGIN_FAILURE,
          response: error.message,
        });
      });
  };
};

export const loggedInState = () => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({
            type: authConstants.LOGIN_SUCCESS,
            currentUser: snapshot.data(),
          });
        } else {
          console.log(error);
          dispatch({
            type: authConstants.LOGIN_FAILURE,
            response: error.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: authConstants.LOGIN_FAILURE,
          response: error.message,
        });
      });
  };
};

export const logOut = (navigation) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGOUT_REQUEST });
    firebase
      .auth()
      .signOut()
      .then(() => {
        setTimeout(() => {
          dispatch({ type: authConstants.LOGOUT_SUCCESS });
          navigation.navigate("welcome");
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: authConstants.LOGOUT_FAILURE,
          response: error.message,
        });
      });
  };
};