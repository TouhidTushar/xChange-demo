import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  Easing,
  Animated,
  Linking,
  TextInput,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatch,
  archivePost,
  deletePost,
  markSold,
  removeFromWatch,
} from "../actions";
import firebase from "firebase";

const LoaderView = (props) => {
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const rotation = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(loadingAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [loadingAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{ rotateZ: rotation }],
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const PostCard = (props) => {
  const data = props.post;
  const navigation = props.nav;
  const actionData = { id: data.id, navigation: navigation };
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [callModal, setCallModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [soldModalOne, setSoldModalOne] = useState(false);
  const [soldModalTwo, setSoldModalTwo] = useState(false);
  const [soldModalThree, setSoldModalThree] = useState(false);
  const [focused, setFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState("");
  const [validContact, setValidContact] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [postControl, setPostControl] = useState(false);

  useEffect(() => {
    if (auth.watching == false) {
      setLoadingIcon(false);
    }
  }, [auth.watching]);

  const handleAddToWatchlist = () => {
    dispatch(addToWatch(data.id));
    setLoadingIcon(true);
  };

  const handleRemoveFromWatchlist = () => {
    dispatch(removeFromWatch(data.id));
    setLoadingIcon(true);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${data.postedBy.contact}`);
    setCallModal(false);
  };

  const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      setValidEmail(false);
      setEmailError("please enter a valid email");
    } else {
      setValidEmail(true);
    }
  };

  const validateContact = (text) => {
    let reg = /^(?:\+?88|0088)?01[15-9]\d{8}$/;
    if (reg.test(text) === false) {
      setValidContact(false);
      setContactError("please enter a valid phone number");
    } else {
      setValidContact(true);
    }
  };

  const handleSoldToUser = () => {
    const warning = "this field is required!";
    if (email != "" && validEmail == true && email != auth.user.email) {
      var soldData = { ...actionData, flag: "user", email: email };
      dispatch(markSold(soldData));
      setSoldModalTwo(false);
      setEmail("");
    } else {
      if (validEmail == false) {
        if (email === "") {
          setEmailError(warning);
        } else {
          setEmailError("please enter a valid email");
        }
      }
      if (email == auth.user.email) {
        setEmailError("buyer's email can not be same as your email");
      }
    }
  };

  const handleSoldToGuest = () => {
    const warning = "this field is required!";
    if (contact != "" && validContact == true && contact != auth.user.contact) {
      var soldData = { ...actionData, flag: "guest", contact: contact };
      dispatch(markSold(soldData));
    } else {
      if (validContact == false) {
        if (contact === "") {
          setContactError(warning);
        } else {
          setContactError("please enter a valid phone number");
        }
      }
      if (contact == auth.user.contact) {
        setContactError("buyer's contact can not be same as your contact");
      }
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* image section */}
      <Pressable
        onPress={() => navigation.navigate("itemDetails", { item: data })}
      >
        <Image source={{ uri: data.images[0].image }} style={styles.imageBox} />
      </Pressable>

      {/* other fields */}
      <Pressable
        onPress={() => navigation.navigate("itemDetails", { item: data })}
        style={styles.overlay}
      >
        <Text style={styles.mainText}>{data.itemName}</Text>
        <View style={styles.fieldsBox}>
          <View style={styles.postfields}>
            <Ionicons name="location-outline" size={18} color={colors.theme} />
            <Text style={styles.subText}>{data.location}</Text>
          </View>
          <View style={styles.postfields}>
            <Ionicons name="pricetag-outline" size={18} color={colors.theme} />
            <Text style={styles.subText}>{data.price} BDT</Text>
          </View>
        </View>
      </Pressable>

      {/* action buttons */}
      {auth.loggedIn ? (
        firebase.auth().currentUser.uid == data.postedBy.userId ? (
          deleteModal ||
          archiveModal ||
          soldModalOne ||
          soldModalTwo ||
          soldModalThree ? null : data.sold == false ? (
            postControl ? (
              <Pressable
                style={styles.callIcon}
                onPress={() => setPostControl(false)}
              >
                <Ionicons name="close" size={24} color={colors.primary} />
              </Pressable>
            ) : (
              <Pressable
                style={styles.callIcon}
                onPress={() => setPostControl(true)}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={24}
                  color={colors.theme}
                />
              </Pressable>
            )
          ) : null
        ) : (
          <>
            {loadingIcon == true ? (
              <LoaderView style={styles.watchIcon}>
                <AntDesign name="loading1" size={24} color={colors.primary} />
              </LoaderView>
            ) : auth.user.watchList == undefined ||
              auth.user.watchList == null ? (
              <Pressable
                style={styles.watchIcon}
                disabled={callModal == true ? true : false}
                onPress={handleAddToWatchlist}
              >
                <Ionicons name="eye" size={24} color={colors.theme} />
              </Pressable>
            ) : auth.user.watchList.includes(data.id) ? (
              <Pressable
                disabled={callModal == true ? true : false}
                onPress={handleRemoveFromWatchlist}
                style={styles.watchIcon}
              >
                <Ionicons name="eye" size={24} color={colors.primary} />
              </Pressable>
            ) : (
              <Pressable
                style={styles.watchIcon}
                disabled={callModal == true ? true : false}
                onPress={handleAddToWatchlist}
              >
                <Ionicons name="eye" size={24} color={colors.theme} />
              </Pressable>
            )}
            {callModal ? null : (
              <Pressable
                style={styles.callIcon}
                onPress={() => setCallModal(true)}
              >
                <Ionicons name="call" size={24} color={colors.theme} />
              </Pressable>
            )}
          </>
        )
      ) : callModal ? null : (
        <Pressable style={styles.callIcon} onPress={() => setCallModal(true)}>
          <Ionicons name="call" size={24} color={colors.theme} />
        </Pressable>
      )}

      {callModal ? (
        <>
          <View style={styles.modalBG}></View>
          <View style={styles.modalWrapper}>
            <Text style={styles.modalText}>
              Do you want to call {data.postedBy.contact} for this item?
            </Text>
            <View style={styles.modalBtns}>
              <Pressable onPress={handleCall}>
                <Text style={{ ...styles.btnText, color: colors.theme }}>
                  Yes
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setCallModal(false);
                }}
              >
                <Text style={{ ...styles.btnText, color: "tomato" }}>No</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : null}

      {deleteModal ? (
        <>
          <View style={styles.modalBG}></View>
          <View style={styles.modalWrapper}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this post?
            </Text>
            <View style={styles.modalBtns}>
              <Pressable
                onPress={() => {
                  dispatch(deletePost(actionData));
                  setDeleteModal(false);
                }}
              >
                <Text style={{ ...styles.btnText, color: "tomato" }}>Yes</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setDeleteModal(false);
                }}
              >
                <Text style={{ ...styles.btnText, color: colors.theme }}>
                  No
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : null}

      {archiveModal ? (
        <>
          <View style={styles.modalBG}></View>
          <View style={styles.modalWrapper}>
            <Text style={styles.modalText}>
              Archived posts will not be visible on the listings page. You can
              find archived posts in your account options. Do you want to
              archive this post?
            </Text>
            <View style={styles.modalBtns}>
              <Pressable
                onPress={() => {
                  dispatch(archivePost(actionData));
                  setArchiveModal(false);
                }}
              >
                <Text style={{ ...styles.btnText, color: "tomato" }}>Yes</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setArchiveModal(false);
                }}
              >
                <Text style={{ ...styles.btnText, color: colors.theme }}>
                  No
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : null}

      {soldModalOne || soldModalTwo || soldModalThree ? (
        <>
          <View style={styles.modalBG}></View>
          {soldModalOne ? (
            <View style={styles.modalWrapper}>
              <Text style={styles.modalText}>
                Does the buyer have an account on 'xChange'?
              </Text>
              <View style={styles.modalBtns}>
                <Pressable
                  onPress={() => {
                    setSoldModalOne(false);
                    setSoldModalTwo(true);
                  }}
                >
                  <Text style={{ ...styles.btnText, color: colors.theme }}>
                    Yes
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setSoldModalOne(false);
                    setSoldModalThree(true);
                  }}
                >
                  <Text style={{ ...styles.btnText, color: colors.primary }}>
                    No
                  </Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => setSoldModalOne(false)}
                style={{ position: "absolute", top: 3, right: 3 }}
              >
                <Ionicons name="close" size={24} color="tomato" />
              </Pressable>
            </View>
          ) : null}

          {soldModalTwo ? (
            <View style={styles.modalWrapper}>
              <Text style={styles.modalText}>
                Provide the buyers email associated with 'xChange' account.
              </Text>

              <View>
                <View
                  style={
                    focused
                      ? styles.inputContainerFocused
                      : styles.inputContainer
                  }
                >
                  <Ionicons
                    name="mail-outline"
                    size={24}
                    color={focused ? colors.theme : colors.accent}
                  />
                  <TextInput
                    placeholder="email"
                    placeholderTextColor={colors.accent}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    autoCorrect={false}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={focused ? styles.inputBoxFocused : styles.inputBox}
                    onChangeText={(e) => {
                      setEmail(e);
                      if (e != "") {
                        setEmailError("");
                      }
                      validateEmail(e);
                    }}
                  />
                </View>
                {emailError === "" ? null : (
                  <Text style={{ fontSize: 16, color: colors.accent }}>
                    {emailError}
                  </Text>
                )}
                <Pressable
                  style={{
                    backgroundColor: colors.theme,
                    paddingVertical: 7,
                    marginTop: 20,
                    borderRadius: 5,
                  }}
                  onPress={handleSoldToUser}
                >
                  <Text style={{ fontSize: 18, textAlign: "center" }}>
                    Submit
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() => {
                  setSoldModalTwo(false);
                  setEmail("");
                }}
                style={{ position: "absolute", top: 3, right: 3 }}
              >
                <Ionicons name="close" size={24} color="tomato" />
              </Pressable>
              <Pressable
                onPress={() => {
                  setSoldModalTwo(false);
                  setSoldModalOne(true);
                  setEmail("");
                }}
                style={{ position: "absolute", top: 3, left: 3 }}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={24}
                  color={colors.theme}
                />
              </Pressable>
            </View>
          ) : null}

          {soldModalThree ? (
            <View style={styles.modalWrapper}>
              <Text style={styles.modalText}>
                Provide the buyers contact number.
              </Text>

              <View>
                <View
                  style={
                    focused
                      ? styles.inputContainerFocused
                      : styles.inputContainer
                  }
                >
                  <Ionicons
                    name="call-outline"
                    size={24}
                    color={focused ? colors.theme : colors.accent}
                  />
                  <TextInput
                    placeholder="contact"
                    autoCapitalize="none"
                    placeholderTextColor={colors.accent}
                    autoCorrect={false}
                    keyboardType="phone-pad"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={focused ? styles.inputBoxFocused : styles.inputBox}
                    onChangeText={(e) => {
                      setContact(e);
                      if (e != "") {
                        setContactError("");
                      }
                      validateContact(e);
                    }}
                  />
                </View>
                {contactError === "" ? null : (
                  <Text style={{ fontSize: 16, color: colors.accent }}>
                    {contactError}
                  </Text>
                )}
                <Pressable
                  style={{
                    backgroundColor: colors.theme,
                    paddingVertical: 7,
                    marginTop: 20,
                    borderRadius: 5,
                  }}
                  onPress={handleSoldToGuest}
                >
                  <Text style={{ fontSize: 18, textAlign: "center" }}>
                    Submit
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() => {
                  setSoldModalThree(false);
                  setContact("");
                }}
                style={{ position: "absolute", top: 3, right: 3 }}
              >
                <Ionicons name="close" size={24} color="tomato" />
              </Pressable>
              <Pressable
                onPress={() => {
                  setSoldModalThree(false);
                  setSoldModalOne(true);
                  setContact("");
                }}
                style={{ position: "absolute", top: 3, left: 3 }}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={24}
                  color={colors.theme}
                />
              </Pressable>
            </View>
          ) : null}
        </>
      ) : null}

      {data.sold == false ? (
        postControl ? (
          <View style={styles.postControlPanel}>
            <Pressable
              onPress={() => {
                navigation.navigate("editPost", {
                  item: { ...data, flag: "post" },
                });
                setPostControl(false);
              }}
            >
              <View style={styles.postControlBtns}>
                <Ionicons name="create-outline" size={24} color="black" />
                <Text style={styles.controlBtnText}>Edit</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setDeleteModal(true);
                setPostControl(false);
              }}
            >
              <View style={styles.postControlBtns}>
                <Ionicons name="trash-outline" size={24} color="tomato" />
                <Text style={{ ...styles.controlBtnText, color: "tomato" }}>
                  Delete
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setArchiveModal(true);
                setPostControl(false);
              }}
            >
              <View style={styles.postControlBtns}>
                <Ionicons name="archive-outline" size={24} color="black" />
                <Text style={styles.controlBtnText}>Archive</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setSoldModalOne(true);
                setPostControl(false);
              }}
            >
              <View style={styles.postControlBtns}>
                <Ionicons
                  name="checkmark-done-outline"
                  size={24}
                  color="black"
                />
                <Text style={styles.controlBtnText}>Mark as sold</Text>
              </View>
            </Pressable>
            <Ionicons
              name="caret-down"
              size={30}
              color={colors.accent}
              style={styles.tooltip}
            />
          </View>
        ) : null
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: Dimensions.get("window").width * 0.9,
    elevation: 5,
    alignItems: "center",
    marginVertical: 15,
    padding: 8,
    borderRadius: 10,
    backgroundColor: colors.accent,
  },
  imageBox: {
    width: Dimensions.get("window").width * 0.9 - 16,
    height: Dimensions.get("window").width * 0.8 * 0.75,
    borderRadius: 10,
  },
  overlay: {
    width: "100%",
    paddingTop: 10,
  },
  fieldsBox: {
    flexDirection: "row",
    marginTop: 5,
  },
  postfields: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  mainText: {
    fontSize: 20,
    color: colors.contrast,
    marginLeft: 5,
  },
  subText: {
    fontSize: 18,
    color: colors.theme,
  },
  callIcon: {
    backgroundColor: colors.accent,
    position: "absolute",
    bottom: 8,
    right: 8,
    padding: 5,
  },
  watchIcon: {
    backgroundColor: colors.accent,
    position: "absolute",
    bottom: 8,
    right: 50,
    padding: 5,
  },
  modalBG: {
    width: Dimensions.get("window").width * 0.9 - 16,
    height: Dimensions.get("window").width * 0.8 * 0.75,
    borderRadius: 10,
    position: "absolute",
    backgroundColor: colors.contrast,
    opacity: 0.7,
    top: 8,
    left: 8,
  },
  modalWrapper: {
    width: Dimensions.get("window").width * 0.9 - 16,
    height: Dimensions.get("window").width * 0.8 * 0.75,
    borderRadius: 10,
    position: "absolute",
    top: 8,
    left: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    color: colors.accent,
  },
  modalBtns: {
    marginTop: 25,
    flexDirection: "row",
    width: 150,
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    width: 50,
    height: 50,
    textAlignVertical: "center",
    textAlign: "center",
    borderRadius: 25,
    backgroundColor: colors.accent,
  },
  postControlPanel: {
    position: "absolute",
    bottom: 55,
    right: -10,
    width: 128,
    padding: 8,
    backgroundColor: colors.accent,
    borderRadius: 5,
    elevation: 5,
  },
  postControlBtns: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  controlBtnText: {
    fontSize: 16,
    marginLeft: 3,
  },
  tooltip: {
    position: "absolute",
    bottom: -21,
    right: 21,
    textShadowColor: "#DDD",
    textShadowOffset: {
      height: 2,
      width: 0,
    },
    textShadowRadius: 1,
  },
  inputContainer: {
    marginTop: 20,
    paddingLeft: 5,
    height: 40,
    width: "85%",
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainerFocused: {
    marginTop: 20,
    paddingLeft: 5,
    height: 40,
    width: "85%",
    borderColor: colors.theme,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  inputBox: {
    width: "89%",
    marginLeft: 5,
    borderColor: colors.accent,
    borderLeftWidth: 1,
    fontSize: 18,
    paddingLeft: 5,
    color: colors.accent,
  },
  inputBoxFocused: {
    width: "89%",
    marginLeft: 5,
    borderColor: colors.theme,
    borderLeftWidth: 1,
    fontSize: 18,
    paddingLeft: 5,
    color: colors.accent,
  },
});

export default PostCard;
