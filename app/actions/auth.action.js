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
                  dispatch({
                    type: authConstants.SIGNUP_FAILURE,
                    response: "something went wrong!",
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

//check logged in user
export const loggedInState = () => {
  return async (dispatch) => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
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
      } else {
        dispatch({
          type: authConstants.LOGIN_FAILURE,
          response: "session expired!",
        });
      }
    });
  };
};

//logout action
export const logOut = () => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGOUT_REQUEST });
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: authConstants.LOGOUT_SUCCESS });
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

//----other user actions----

//add to watchlist
export const addToWatch = (data) => {
  var watchArray = [];
  return async (dispatch) => {
    dispatch({ type: authConstants.WATCH_REQUEST });
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          if (snapshot.data().watchList) {
            watchArray = snapshot.data().watchList;
            watchArray.push(data);
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .update({
                watchList: watchArray,
              })
              .then(() => {
                dispatch({
                  type: authConstants.WATCH_SUCCESS,
                  watchlist: watchArray,
                  response: "item added to watchlist",
                });
              })
              .catch((error) => {
                console.log(error);
                dispatch({
                  type: authConstants.WATCH_FAILURE,
                  response: error.message,
                });
              });
          } else {
            watchArray.push(data);
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .update({
                watchList: watchArray,
              })
              .then(() => {
                dispatch({
                  type: authConstants.WATCH_SUCCESS,
                  watchlist: watchArray,
                  response: "item added to watchlist",
                });
              })
              .catch((error) => {
                console.log(error);
                dispatch({
                  type: authConstants.WATCH_FAILURE,
                  response: error.message,
                });
              });
          }
        } else {
          dispatch({
            type: authConstants.WATCH_FAILURE,
            response: "something went wrong!",
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: authConstants.WATCH_FAILURE,
          response: error.message,
        });
      });
  };
};

//remove from watchlist
export const removeFromWatch = (data) => {
  var watchArray = [];
  return async (dispatch) => {
    dispatch({ type: authConstants.WATCH_REQUEST });
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          if (snapshot.data().watchList.length > 0) {
            watchArray = snapshot.data().watchList;
            var index = watchArray.indexOf(data);
            watchArray.splice(index, 1);
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .update({
                watchList: watchArray,
              })
              .then(() => {
                dispatch({
                  type: authConstants.WATCH_SUCCESS,
                  watchlist: watchArray,
                  response: "item removed from watchlist",
                });
              })
              .catch((error) => {
                console.log(error);
                dispatch({
                  type: authConstants.WATCH_FAILURE,
                  response: error.message,
                });
              });
          } else {
            dispatch({
              type: authConstants.WATCH_FAILURE,
              response: "something went wrong!",
            });
          }
        } else {
          dispatch({
            type: authConstants.WATCH_FAILURE,
            response: "something went wrong!",
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: authConstants.WATCH_FAILURE,
          response: error.message,
        });
      });
  };
};
