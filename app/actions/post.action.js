import firebase from "firebase";
import { authConstants, postConstants } from "./constants";

// getting all posts
export const getPosts = () => {
  return async (dispatch) => {
    dispatch({ type: postConstants.GETPOST_REQUEST });
    var postArray = [];
    firebase
      .firestore()
      .collection("listings")
      .where("archived", "==", false)
      .where("sold", "==", false)
      .orderBy("createdAt", "desc")
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
                      id: doc.id,
                      itemName: doc.data().itemName,
                      category: doc.data().category,
                      location: doc.data().location,
                      description: doc.data().description,
                      images: doc.data().images,
                      price: doc.data().price,
                      sold: doc.data().sold,
                      archived: doc.data().archived,
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
    if (firebase.auth().currentUser != null) {
      getExtraPosts(dispatch);
    }
  };
};

const getExtraPosts = (dispatch) => {
  var postArray = [];
  firebase
    .firestore()
    .collection("listings")
    .where("archived", "==", true)
    .orderBy("createdAt", "desc")
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
                    id: doc.id,
                    itemName: doc.data().itemName,
                    category: doc.data().category,
                    location: doc.data().location,
                    description: doc.data().description,
                    images: doc.data().images,
                    price: doc.data().price,
                    sold: doc.data().sold,
                    archived: doc.data().archived,
                    createdAt: doc.data().createdAt,
                    postedBy: _postUser,
                  };
                  postArray.push(postObj);
                  count = count - 1;
                  if (count == 0) {
                    dispatch({
                      type: postConstants.GETEXTRAPOST_SUCCESS,
                      posts: postArray,
                    });
                  }
                }
              } else {
                dispatch({
                  type: postConstants.GETEXTRAPOST_FAILURE,
                  response: "something went wrong!",
                });
              }
            })
            .catch((error) => {
              console.log(error);
              dispatch({
                type: postConstants.GETEXTRAPOST_FAILURE,
                response: error.message,
              });
            });
        });
      } else {
        dispatch({
          type: postConstants.GETEXTRAPOST_FAILURE,
          response: "something went wrong!",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: postConstants.GETEXTRAPOST_FAILURE,
        response: error.message,
      });
    });
};

//creating new post
export const newPost = (data) => {
  return async (dispatch) => {
    dispatch({ type: postConstants.POST_REQUEST });
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
            dispatch({
              type: postConstants.POST_FAILURE,
              response: error.message,
            });
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
          sold: false,
          archived: false,
          postedBy: firebase.auth().currentUser.uid,
          createdAt: Date.now(),
        })
        .then(() => {
          dispatch({
            type: postConstants.POST_SUCCESS,
          });
          dispatch({
            type: postConstants.POST_SHOW_RESULT,
          });
          dispatch(getPosts());
          data.navigation.navigate("listings");
        })
        .catch((error) => {
          console.log(error);
          dispatch({
            type: postConstants.POST_FAILURE,
            response: error.message,
          });
        });
    };
  };
};

//updating post
export const updatePost = (data) => {
  return async (dispatch) => {
    dispatch({ type: postConstants.POST_REQUEST });
    var commonFiles = [];

    // get previous doc
    firebase
      .firestore()
      .collection("listings")
      .doc(data.id)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          const retData = snapshot.data();
          const imageArray = retData.images;
          var count = retData.images.length;

          //checking files
          data.tempImages.map((obj, index) => {
            retData.images.map((img, serial) => {
              if (obj.image == img.image) {
                commonFiles.push(obj.image);
                count = count - 1;
              }

              //updating files (if any?);
              if (
                index == data.tempImages.length - 1 &&
                serial == retData.images.length - 1
              ) {
                //deleting
                retData.images.map((Item) => {
                  if (commonFiles.includes(Item.image)) {
                    console.log("keep file");
                  } else {
                    firebase
                      .storage()
                      .ref()
                      .child(`images/${Item.filename}`)
                      .delete()
                      .then(() => {
                        console.log("deleted");
                        imageArray.map((img_, index_) => {
                          if (Item.image == img_.image) {
                            imageArray.splice(index_, 1);
                            count = count - 1;
                            if (count == 0) {
                              uploadFiles();
                            }
                          }
                        });
                      })
                      .catch((error) => {
                        console.log(error);
                        dispatch({
                          type: postConstants.POST_FAILURE,
                          response: error.message,
                        });
                      });
                  }
                });

                //uploading
                const uploadFiles = async () => {
                  count = data.tempImages.length - commonFiles.length;
                  for (let c = 0; c < data.tempImages.length; c++) {
                    if (commonFiles.includes(data.tempImages[c].image)) {
                      console.log("file exists");
                    } else {
                      const response = await fetch(data.tempImages[c].image);
                      const blob = await response.blob();
                      const ref = firebase
                        .storage()
                        .ref()
                        .child(`images/${data.tempImages[c].filename}`);
                      //put image from blob
                      ref.put(blob).then(() => {
                        ref
                          .getDownloadURL()
                          .then((url) => {
                            console.log(url);
                            var imgObj = {
                              image: url,
                              filename: data.tempImages[c].filename,
                            };
                            imageArray.push(imgObj);
                            count = count - 1;
                            if (count == 0) {
                              updatePostDoc(imageArray);
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                            dispatch({
                              type: postConstants.POST_FAILURE,
                              response: error.message,
                            });
                          });
                      });
                    }
                  }
                };
              }
            });
          });
        } else {
          dispatch({
            type: postConstants.POST_FAILURE,
            response: "something went wrong!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: postConstants.POST_FAILURE,
          response: error.message,
        });
      });

    //updating post doc
    const updatePostDoc = (dataArray) => {
      firebase
        .firestore()
        .collection("listings")
        .doc(data.id)
        .update({
          itemName: data.itemName,
          category: data.category,
          price: data.price,
          description: data.description,
          location: data.location,
          images: dataArray,
          updatedAt: Date.now(),
        })
        .then(() => {
          console.log("edit success");
          dispatch({
            type: postConstants.POST_SUCCESS,
          });
          dispatch({
            type: postConstants.POST_SHOW_RESULT,
          });
          dispatch(getPosts());
          data.navigation.navigate("listings");
        })
        .catch((error) => {
          console.log(error);
          dispatch({
            type: postConstants.POST_FAILURE,
            response: error.message,
          });
        });
    };
  };
};

//deleting post
export const deletePost = (data) => {
  return async (dispatch) => {
    dispatch({ type: postConstants.POST_REQUEST });

    // get required doc
    firebase
      .firestore()
      .collection("listings")
      .doc(data.id)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          const retData = snapshot.data();
          const imageArray = retData.images;
          var count = retData.images.length;

          //deletinging files
          imageArray.map((item) => {
            firebase
              .storage()
              .ref()
              .child(`images/${item.filename}`)
              .delete()
              .then(() => {
                console.log("deleted");
                count = count - 1;
                if (count == 0) {
                  deletePostDoc();
                }
              })
              .catch((error) => {
                console.log(error);
                dispatch({
                  type: postConstants.POST_FAILURE,
                  response: error.message,
                });
              });
          });
        } else {
          dispatch({
            type: postConstants.POST_FAILURE,
            response: "something went wrong!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: postConstants.POST_FAILURE,
          response: error.message,
        });
      });

    //deleting post doc
    const deletePostDoc = () => {
      firebase
        .firestore()
        .collection("listings")
        .doc(data.id)
        .delete()
        .then(() => {
          console.log("delete success");
          dispatch({
            type: postConstants.POST_SUCCESS,
          });
          dispatch({
            type: postConstants.POST_SHOW_RESULT,
          });
          dispatch(getPosts());
          data.navigation.navigate("listings");
        })
        .catch((error) => {
          console.log(error);
          dispatch({
            type: postConstants.POST_FAILURE,
            response: error.message,
          });
        });
    };
  };
};

//archiving post
export const archivePost = (data) => {
  return async (dispatch) => {
    dispatch({ type: postConstants.POST_REQUEST });
    var archiveArray = [];

    //archiving post doc
    firebase
      .firestore()
      .collection("listings")
      .doc(data.id)
      .update({
        archived: true,
      })
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((snapshot) => {
            if (snapshot) {
              if (snapshot.data().archiveList) {
                archiveArray = snapshot.data().archiveList;
                archiveArray.push(data.id);
                firebase
                  .firestore()
                  .collection("users")
                  .doc(firebase.auth().currentUser.uid)
                  .update({
                    archiveList: archiveArray,
                  })
                  .then(() => {
                    dispatch({
                      type: authConstants.ARCHIVE_SUCCESS,
                      archives: archiveArray,
                    });
                    dispatch(getPosts());
                  })
                  .catch((error) => {
                    console.log(error);
                    dispatch({
                      type: postConstants.POST_FAILURE,
                      response: error.message,
                    });
                  });
              } else {
                archiveArray.push(data.id);
                firebase
                  .firestore()
                  .collection("users")
                  .doc(firebase.auth().currentUser.uid)
                  .update({
                    archiveList: archiveArray,
                  })
                  .then(() => {
                    dispatch({
                      type: authConstants.ARCHIVE_SUCCESS,
                      archives: archiveArray,
                    });
                    dispatch(getPosts());
                  })
                  .catch((error) => {
                    console.log(error);
                    dispatch({
                      type: postConstants.POST_FAILURE,
                      response: error.message,
                    });
                  });
              }
            }
          })
          .catch((error) => {
            console.log(error);
            dispatch({
              type: postConstants.POST_FAILURE,
              response: error.message,
            });
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: postConstants.POST_FAILURE,
          response: error.message,
        });
      });
  };
};
