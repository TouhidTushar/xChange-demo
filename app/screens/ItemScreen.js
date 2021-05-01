import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Animated,
  View,
  Text,
  Pressable,
  Dimensions,
  Image,
  Easing,
  Linking,
  TextInput,
} from "react-native";
import colors from "../colors";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import NavigationTab from "../components/NavigationTab";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatch,
  archivePost,
  deletePost,
  removeFromWatch,
  unarchivePost,
  markSold,
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

const ItemScreen = ({ route, navigation, props }) => {
  const { item } = route.params;
  const actionData = { id: item.id, navigation: navigation };
  const value = new Date(item.createdAt);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [imgActive, setImgActive] = useState(0);
  const [postControl, setPostControl] = useState(false);
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
  const [callOptions, setCallOptions] = useState(false);

  useEffect(() => {
    if (auth.watching == false) {
      setLoadingIcon(false);
    }
  }, [auth.watching]);

  const handleImageScroll = ({ nativeEvent }) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );
    if (slide !== imgActive) {
      setImgActive(slide);
    }
  };

  const prepareDate = () => {
    if (value == null || value === "" || value == undefined) {
      return null;
    } else {
      var dd = value.getDate();
      var mm = value.getMonth() + 1;
      var yyyy = value.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      return `${dd}/${mm}/${yyyy}`;
    }
  };

  const handlePostControl = () => {
    if (postControl == true) {
      setPostControl(false);
    } else {
      setPostControl(true);
    }
  };

  const handleAddToWatch = () => {
    dispatch(addToWatch(item.id));
    setLoadingIcon(true);
  };

  const handleRemoveFromWatch = () => {
    dispatch(removeFromWatch(item.id));
    setLoadingIcon(true);
  };

  const handleMessage = () => {
    console.log("message");
  };

  const handleCall = () => {
    Linking.openURL(`tel:${item.postedBy.contact}`);
    setCallOptions(false);
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
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", left: 10, bottom: 8 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color={colors.accent} />
        </Pressable>
        {item.sold == false ? (
          auth.loggedIn ? (
            firebase.auth().currentUser.uid == item.postedBy.userId ? (
              <Pressable
                onPress={handlePostControl}
                style={{ position: "absolute", right: 10, bottom: 8 }}
              >
                <Ionicons
                  name={postControl ? "close" : "ellipsis-vertical"}
                  size={24}
                  color={colors.accent}
                />
              </Pressable>
            ) : null
          ) : null
        ) : null}
        <Text style={styles.headerText}>Item details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleImageScroll}
        >
          {item.images.map((img) => {
            return (
              <Image
                key={img.filename}
                source={{ uri: img.image }}
                style={styles.imageBox}
              />
            );
          })}
        </ScrollView>
        <View style={styles.imgIndicatorBox}>
          {item.images.map((img, index) => {
            return (
              <Text
                key={img.filename + index}
                style={{
                  ...styles.imgIndicators,

                  opacity: index == imgActive ? 1 : 0.4,
                }}
              >
                ⬤
              </Text>
            );
          })}
        </View>

        <Text style={styles.titleText}>{item.itemName}</Text>

        <View style={styles.priceBox}>
          <Ionicons name="pricetag-outline" size={24} color={colors.theme} />
          <Text style={styles.priceText}>Asking price: {item.price} BDT</Text>
        </View>

        {auth.loggedIn ? (
          firebase.auth().currentUser.uid ==
          item.postedBy.userId ? null : item.sold == true ? null : (
            <View style={styles.itemActionBox}>
              {loadingIcon == true ? (
                <LoaderView
                  style={{
                    ...styles.watchIcon,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 125,
                    padding: 8,
                  }}
                >
                  <AntDesign name="loading1" size={22} color={colors.primary} />
                </LoaderView>
              ) : auth.user.watchList == undefined ||
                auth.user.watchList == null ? (
                <Pressable
                  onPress={handleAddToWatch}
                  style={{
                    ...styles.actionIcons,
                    backgroundColor: colors.accent,
                  }}
                >
                  <Ionicons name="eye-outline" size={28} color={colors.theme} />
                  <Text style={{ ...styles.iconText, color: colors.theme }}>
                    add to watchlist
                  </Text>
                </Pressable>
              ) : auth.user.watchList.includes(item.id) ? (
                <Pressable
                  onPress={handleRemoveFromWatch}
                  style={{
                    ...styles.actionIcons,
                    backgroundColor: colors.accent,
                  }}
                >
                  <Ionicons
                    name="eye-outline"
                    size={28}
                    color={colors.contrast}
                  />
                  <Text style={{ ...styles.iconText, color: colors.contrast }}>
                    remove
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleAddToWatch}
                  style={{
                    ...styles.actionIcons,
                    backgroundColor: colors.accent,
                  }}
                >
                  <Ionicons name="eye-outline" size={28} color={colors.theme} />
                  <Text style={{ ...styles.iconText, color: colors.theme }}>
                    add to watchlist
                  </Text>
                </Pressable>
              )}

              <Pressable
                onPress={handleMessage}
                style={{
                  ...styles.actionIcons,
                  backgroundColor: colors.accent,
                }}
              >
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={28}
                  color={colors.theme}
                />
                <Text style={{ ...styles.iconText, color: colors.theme }}>
                  ask seller
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setCallOptions(true)}
                style={{
                  ...styles.actionIcons,
                  backgroundColor: callOptions ? colors.theme : colors.accent,
                }}
              >
                <Ionicons
                  name="call-outline"
                  size={28}
                  color={callOptions ? colors.accent : colors.theme}
                />
                <Text
                  style={{
                    ...styles.iconText,
                    color: callOptions ? colors.accent : colors.theme,
                  }}
                >
                  contact seller
                </Text>
              </Pressable>
            </View>
          )
        ) : (
          <View style={styles.itemActionBox}>
            <Pressable
              onPress={() => setCallOptions(true)}
              style={{
                ...styles.actionIcons,
                backgroundColor: callOptions ? colors.theme : colors.accent,
              }}
            >
              <Ionicons
                name="call-outline"
                size={28}
                color={callOptions ? colors.accent : colors.theme}
              />
              <Text
                style={{
                  ...styles.iconText,
                  color: callOptions ? colors.accent : colors.theme,
                }}
              >
                contact seller
              </Text>
            </Pressable>
          </View>
        )}

        {callOptions ? (
          <View style={styles.callOptionsBox}>
            <Text style={styles.callText} selectable>
              Do you want to call {item.postedBy.contact} for this item?
            </Text>

            <View style={styles.callBtns}>
              <Pressable onPress={handleCall}>
                <Text style={{ ...styles.btnText, color: colors.theme }}>
                  Yes
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setCallOptions(false);
                }}
              >
                <Text style={{ ...styles.btnText, color: "tomato" }}>No</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.fieldsContainer}>
          <View style={styles.fields}>
            <View style={styles.fieldHead}>
              <MaterialIcons name="category" size={24} color={colors.theme} />
              <Text style={styles.fieldName}>Category</Text>
            </View>
            <Text style={styles.fieldText}>{item.category}</Text>
          </View>

          <View style={styles.fields}>
            <View style={styles.fieldHead}>
              <Ionicons name="location" size={24} color={colors.theme} />
              <Text style={styles.fieldName}>Location</Text>
            </View>
            <Text style={styles.fieldText}>{item.location}</Text>
          </View>

          <View style={styles.fields}>
            <View style={styles.fieldHead}>
              <Ionicons name="person" size={24} color={colors.theme} />
              <Text style={styles.fieldName}>Posted by</Text>
            </View>
            <Text style={styles.fieldText}>{item.postedBy.username}</Text>
          </View>

          <View style={styles.fields}>
            <View style={styles.fieldHead}>
              <Ionicons name="calendar" size={24} color={colors.theme} />
              <Text style={styles.fieldName}>Posted on</Text>
            </View>
            <Text style={styles.fieldText}>{prepareDate()}</Text>
          </View>
        </View>

        <View style={styles.aboutBox}>
          <Text style={styles.aboutHead}>About this item:</Text>
          <Text style={styles.aboutText}>{item.description}</Text>
        </View>

        <View style={{ height: 45 }}></View>
      </ScrollView>
      <View style={{ height: 55 }}></View>

      {item.sold == false ? (
        postControl ? (
          <View style={styles.postControlPanel}>
            <Pressable
              onPress={() => {
                navigation.navigate("editPost", {
                  item: { ...item, flag: "post" },
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
            {item.archived == false ? (
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
            ) : (
              <Pressable
                onPress={() => {
                  dispatch(unarchivePost(actionData));
                  setPostControl(false);
                }}
              >
                <View style={styles.postControlBtns}>
                  <MaterialCommunityIcons
                    name="archive-arrow-up-outline"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.controlBtnText}>Unarchive</Text>
                </View>
              </Pressable>
            )}
            {item.archived == false ? (
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
            ) : null}
            <Ionicons
              name="caret-up"
              size={30}
              color={colors.accent}
              style={styles.tooltip}
            />
          </View>
        ) : null
      ) : null}

      {item.sold ? (
        auth.user.soldList.includes(item.id) ? (
          <View style={styles.soldMsg}>
            <Image
              source={require("../assets/sold_out.png")}
              style={{ width: 150, height: 100, alignSelf: "center" }}
            />
            <Text
              style={{ color: colors.contrast, fontSize: 18, marginTop: 10 }}
              selectable
            >
              Buyer reference:{" "}
              {item.soldTo.ref == "user"
                ? item.soldTo.email
                : item.soldTo.contact}
            </Text>
            <Text style={{ color: colors.contrast, fontSize: 18 }}>
              Buyer type: {item.soldTo.ref}
            </Text>
          </View>
        ) : null
      ) : null}

      <NavigationTab data={navigation} />

      {deleteModal ? (
        <>
          <Pressable
            style={styles.ModalWrapper}
            onPress={() => setDeleteModal(false)}
          ></Pressable>
          <View style={styles.ModalContainer}>
            <Text
              style={{ fontSize: 20, marginBottom: 35, color: colors.accent }}
            >
              Are you sure you want to delete this post?
            </Text>
            <Pressable
              style={{ marginBottom: 25 }}
              onPress={() => {
                dispatch(deletePost(actionData));
                setDeleteModal(false);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="trash-outline" size={20} color="tomato" />
                <Text style={{ fontSize: 18, color: "tomato" }}>delete</Text>
              </View>
            </Pressable>
            <Pressable
              style={{ marginBottom: 15 }}
              onPress={() => {
                setDeleteModal(false);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="close-outline" size={20} color={colors.theme} />
                <Text style={{ fontSize: 18, color: colors.theme }}>
                  cancel
                </Text>
              </View>
            </Pressable>
          </View>
        </>
      ) : null}

      {archiveModal ? (
        <>
          <Pressable
            style={styles.ModalWrapper}
            onPress={() => setArchiveModal(false)}
          ></Pressable>
          <View style={styles.ModalContainer}>
            <Text
              style={{ fontSize: 20, marginBottom: 35, color: colors.accent }}
            >
              Archived posts will not be visible on the listings page. You can
              find archived posts in your account options. Do you want to
              archive this post?
            </Text>
            <Pressable
              style={{ marginBottom: 25 }}
              onPress={() => {
                dispatch(archivePost(actionData));
                setArchiveModal(false);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="archive-outline"
                  size={20}
                  color={colors.secondary}
                />
                <Text
                  style={{
                    fontSize: 18,
                    marginLeft: 3,
                    color: colors.secondary,
                  }}
                >
                  archive
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={{ marginBottom: 15 }}
              onPress={() => {
                setArchiveModal(false);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="close-outline" size={20} color={colors.theme} />
                <Text style={{ fontSize: 18, color: colors.theme }}>
                  cancel
                </Text>
              </View>
            </Pressable>
          </View>
        </>
      ) : null}

      {soldModalOne ? (
        <>
          <Pressable
            style={styles.ModalWrapper}
            onPress={() => setSoldModalOne(false)}
          ></Pressable>
          <View style={styles.ModalContainer}>
            <Text
              style={{ fontSize: 20, marginBottom: 35, color: colors.accent }}
            >
              Does the buyer have an account on 'xChange'?
            </Text>
            <Pressable
              style={{ marginBottom: 25 }}
              onPress={() => {
                setSoldModalTwo(true);
                setSoldModalOne(false);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="checkmark-outline"
                  size={20}
                  color={colors.theme}
                />
                <Text
                  style={{
                    fontSize: 18,
                    marginLeft: 3,
                    color: colors.theme,
                  }}
                >
                  yes
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={{ marginBottom: 15 }}
              onPress={() => {
                setSoldModalOne(false);
                setSoldModalThree(true);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="close-outline"
                  size={20}
                  color={colors.secondary}
                />
                <Text style={{ fontSize: 18, color: colors.secondary }}>
                  no
                </Text>
              </View>
            </Pressable>
          </View>
        </>
      ) : null}

      {soldModalTwo ? (
        <>
          <Pressable
            style={styles.ModalWrapper}
            onPress={() => setSoldModalTwo(false)}
          ></Pressable>
          <View style={styles.ModalContainer}>
            <Text
              style={{ fontSize: 20, marginBottom: 35, color: colors.accent }}
            >
              Provide the buyers email associated with 'xChange' account.
            </Text>
            <Pressable
              style={{ marginBottom: 25 }}
              onPress={() => {
                setSoldModalTwo(false);
                setSoldModalOne(true);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="arrow-back-outline"
                  size={20}
                  color={colors.secondary}
                />
                <Text
                  style={{
                    fontSize: 18,
                    marginLeft: 3,
                    color: colors.secondary,
                  }}
                >
                  go back
                </Text>
              </View>
            </Pressable>

            <View>
              <View
                style={
                  focused ? styles.inputContainerFocused : styles.inputContainer
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
                  elevation: 12,
                }}
                onPress={handleSoldToUser}
              >
                <Text style={{ fontSize: 18, textAlign: "center" }}>
                  Submit
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : null}

      {soldModalThree ? (
        <>
          <Pressable
            style={styles.ModalWrapper}
            onPress={() => setSoldModalThree(false)}
          ></Pressable>
          <View style={styles.ModalContainer}>
            <Text
              style={{ fontSize: 20, marginBottom: 35, color: colors.accent }}
            >
              Provide the buyers contact number.
            </Text>
            <Pressable
              style={{ marginBottom: 25 }}
              onPress={() => {
                setSoldModalThree(false);
                setSoldModalOne(true);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="arrow-back-outline"
                  size={20}
                  color={colors.secondary}
                />
                <Text
                  style={{
                    fontSize: 18,
                    marginLeft: 3,
                    color: colors.secondary,
                  }}
                >
                  go back
                </Text>
              </View>
            </Pressable>

            <View>
              <View
                style={
                  focused ? styles.inputContainerFocused : styles.inputContainer
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
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: colors.accent,
  },
  scrollArea: {
    width: Dimensions.get("screen").width,
    alignItems: "center",
  },
  header: {
    backgroundColor: colors.theme,
    width: "100%",
    height: 75,
    alignItems: "center",
    justifyContent: "flex-end",
    elevation: 5,
    paddingBottom: 8,
  },
  headerText: {
    color: colors.accent,
    fontSize: 16,
  },
  postControlPanel: {
    position: "absolute",
    top: 78,
    right: 4,
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
    top: -21,
    right: 3,
  },
  imageBox: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").width * 0.75,
  },
  imgIndicatorBox: {
    position: "absolute",
    flexDirection: "row",
    alignSelf: "center",
    top: Dimensions.get("screen").width * 0.7,
  },
  imgIndicators: {
    color: colors.accent,
    marginHorizontal: 2,
    fontSize: 18,
  },
  titleText: {
    fontSize: 26,
    color: colors.contrast,
    marginTop: 10,
    marginBottom: 8,
    width: "100%",
    textAlign: "center",
  },
  priceBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: {
    fontSize: 20,
    marginLeft: 5,
    color: colors.theme,
  },
  itemActionBox: {
    flexDirection: "row",
    marginTop: 20,
  },
  actionIcons: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    width: 125,
  },
  iconText: {
    fontSize: 16,
  },
  callOptionsBox: {
    width: "92%",
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 25,
    elevation: 3,
    borderRadius: 10,
    marginTop: 30,
  },
  callText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 15,
  },
  callBtns: {
    flexDirection: "row",
    alignSelf: "center",
  },
  btnText: {
    fontSize: 18,
    width: 50,
    height: 50,
    borderRadius: 25,
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 25,
    elevation: 5,
    backgroundColor: colors.accent,
  },
  fieldsContainer: {
    width: "92%",
    marginVertical: 30,
    borderColor: colors.theme,
    borderWidth: 1,
    borderRadius: 5,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  fields: {
    height: 80,
    width: "50%",
    borderColor: colors.theme,
    borderWidth: 1,
    padding: 10,
  },
  fieldHead: { flexDirection: "row", alignItems: "center" },
  fieldName: { fontSize: 20, marginLeft: 3, color: colors.theme },
  fieldText: { fontSize: 18, marginTop: 8 },
  aboutBox: {
    width: "100%",
    paddingHorizontal: 20,
  },
  aboutHead: {
    fontSize: 20,
    color: colors.theme,
  },
  aboutText: {
    fontSize: 18,
    marginTop: 3,
  },
  ModalWrapper: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.contrast,
    opacity: 0.7,
    elevation: 10,
  },
  ModalContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.contrast,
    justifyContent: "space-around",
    padding: 15,
    elevation: 11,
  },
  soldMsg: {
    position: "absolute",
    top: 130,
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 10,
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

export default ItemScreen;
