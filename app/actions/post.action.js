import firebase from "firebase";
import { authConstants } from "./constants";

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
          images: imageArray,
          postedBy: firebase.auth().currentUser.uid,
          createdAt: Date.now(),
        })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  };
};
