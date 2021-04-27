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
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import { useDispatch, useSelector } from "react-redux";
import { addToWatch, removeFromWatch } from "../actions";
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
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [callModal, setCallModal] = useState(false);
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
          <View style={styles.callModalWrapper}>
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

      {postControl ? (
        <View style={styles.postControlPanel}>
          <Pressable>
            <View style={styles.postControlBtns}>
              <Ionicons name="create-outline" size={24} color="black" />
              <Text style={styles.controlBtnText}>Edit</Text>
            </View>
          </Pressable>
          <Pressable>
            <View style={styles.postControlBtns}>
              <Ionicons name="trash-outline" size={24} color="tomato" />
              <Text style={{ ...styles.controlBtnText, color: "tomato" }}>
                Delete
              </Text>
            </View>
          </Pressable>
          <Pressable>
            <View style={styles.postControlBtns}>
              <Ionicons name="archive-outline" size={24} color="black" />
              <Text style={styles.controlBtnText}>Archive</Text>
            </View>
          </Pressable>
          <Pressable>
            <View style={styles.postControlBtns}>
              <Ionicons name="checkmark-done-outline" size={24} color="black" />
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
  callModalWrapper: {
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
});

export default PostCard;
