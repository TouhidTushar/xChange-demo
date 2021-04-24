import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../colors";
import { useSelector } from "react-redux";

const PostCard = (props) => {
  const data = props.post;
  const navigation = props.nav;
  const auth = useSelector((state) => state.auth);
  const [callModal, setCallModal] = useState(false);
  const [watchModal, setWatchModal] = useState(false);
  const [watching, setWatching] = useState(false);

  const handleWatch = () => {
    if (watchModal == false) {
      setWatchModal(true);
      setTimeout(() => {
        setWatchModal(false);
      }, 2000);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: data.images[0].image }} style={styles.imageBox} />
      <View style={styles.overlay}>
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
      </View>
      {watching ? (
        <Pressable
          disabled={callModal == true ? true : false}
          onPress={
            auth.loggedIn
              ? () => {
                  handleWatch();
                  setWatching(false);
                }
              : () => navigation.navigate("login")
          }
          style={{ ...styles.watchIcon, backgroundColor: colors.accent }}
        >
          <Ionicons name="eye-outline" size={24} color={colors.primary} />
        </Pressable>
      ) : (
        <Pressable
          style={styles.watchIcon}
          disabled={callModal == true ? true : false}
          onPress={
            auth.loggedIn
              ? () => {
                  handleWatch();
                  setWatching(true);
                }
              : () => navigation.navigate("login")
          }
        >
          <Ionicons name="eye-outline" size={24} color={colors.accent} />
        </Pressable>
      )}
      {callModal ? null : (
        <Pressable
          disabled={watchModal == true ? true : false}
          style={styles.callIcon}
          onPress={() => setCallModal(true)}
        >
          <Ionicons name="call-outline" size={24} color={colors.accent} />
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
              <Pressable
              // onPress={() => {
              //   setCallModal(false);
              // }}
              >
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

      {watchModal ? (
        <>
          <View style={styles.modalBG}></View>
          <View style={styles.callModalWrapper}>
            {watching ? (
              <Text style={{ fontSize: 18, color: colors.accent }}>
                item added to watchlist
              </Text>
            ) : (
              <Text style={{ fontSize: 18, color: colors.accent }}>
                item removed from watchlist
              </Text>
            )}
          </View>
        </>
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
    backgroundColor: colors.theme,
    position: "absolute",
    bottom: 8,
    right: 8,
    padding: 5,
    borderRadius: 10,
  },
  watchIcon: {
    backgroundColor: colors.theme,
    position: "absolute",
    bottom: 8,
    right: 50,
    padding: 5,
    borderRadius: 10,
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
    marginTop: 20,
    flexDirection: "row",
    width: 180,
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    width: 70,
    textAlign: "center",
    borderRadius: 5,
    paddingVertical: 8,
    backgroundColor: colors.accent,
  },
});

export default PostCard;
