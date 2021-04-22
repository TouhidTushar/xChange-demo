import firebase from "firebase";
import { postConstants } from "./constants";

// getting all posts
export const getPosts = () => {
  return async (dispatch) => {
    var postArray = [];
    dispatch({ type: postConstants.GETPOST_REQUEST });
    firebase
      .firestore()
      .collection("listings")
      .get()
      .then((snapshot) => {
        if (snapshot) {
          var count = snapshot.size;
          snapshot.forEach((doc) => {
            firebase
              .firestore()
              .collection("users")
              .doc(doc.data().postedBy)
              .get()
              .then((snapshot) => {
                var user = false;
                if (snapshot.exists) {
                  const _postUser = {
                    userId: doc.data().postedBy,
                    username: snapshot.data().username,
                    contact: snapshot.data().contact,
                  };
                  user = true;
                  if (user == true) {
                    var postObj = {
                      itemName: doc.data().itemName,
                      category: doc.data().category,
                      location: doc.data().location,
                      description: doc.data().description,
                      images: doc.data().images,
                      price: doc.data().price,
                      createdAt: doc.data().createdAt,
                      postedBy: _postUser,
                    };
                    postArray.push(postObj);
                    count = count - 1;
                    if (count == 0) {
                      dispatch({
                        type: postConstants.GETPOST_SUCCESS,
                        posts: postArray,
                      });
                    }
                  }
                } else {
                  dispatch({
                    type: postConstants.GETPOST_FAILURE,
                    response: "something went wrong!",
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                dispatch({
                  type: postConstants.GETPOST_FAILURE,
                  response: error.message,
                });
              });
          });
        } else {
          dispatch({
            type: postConstants.GETPOST_FAILURE,
            response: "something went wrong!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: postConstants.GETPOST_FAILURE,
          response: error.message,
        });
      });
  };
};

//creating new post
export const newPost = (data) => {
  return async (dispatch) => {
    var imageArray = [];
    let count = data.images.length;

    //uploading files
    for (let c = 0; c < data.images.length; c++) {
      const response = await fetch(data.images[c].image);
      const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref()
        .child(`images/${data.images[c].filename}`);

      //put image from blob
      ref.put(blob).then(() => {
        ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            var imgObj = {
              image: url,
              filename: data.images[c].filename,
            };
            imageArray.push(imgObj);
            count = count - 1;
            if (count == 0) {
              createPostDoc();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }

    //creating post doc
    const createPostDoc = () => {
      firebase
        .firestore()
        .collection("listings")
        .doc()
        .set({
          itemName: data.itemName,
          category: data.category,
          price: data.price,
          description: data.description,
          location: data.location,
          images: imageArray,
          postedBy: firebase.auth().currentUser.uid,
          createdAt: Date.now(),
        })
        .then(() => {
          getPosts();
          data.navigation.navigate("listings");
        })
        .catch((error) => {
          console.log(error);
        });
    };
  };
};