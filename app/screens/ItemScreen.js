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
} from "react-native";
import colors from "../colors";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import NavigationTab from "../components/NavigationTab";
import { ScrollView } from "react-native-gesture-handler";
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

const ItemScreen = ({ route, navigation, props }) => {
  const { item } = route.params;
  const value = new Date(item.createdAt);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [imgActive, setImgActive] = useState(0);
  const [postControl, setPostControl] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);

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
    console.log("call");
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
        {auth.loggedIn ? (
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
        ) : null}
        <Text style={styles.headerText}>Item details</Text>
        {postControl ? (
          <View style={styles.postControlPanel}>
            <Text style={{ color: colors.accent }}>Edit</Text>
            <Text style={{ color: colors.accent }}>Delete</Text>
            <Text style={{ color: colors.accent }}>Archive</Text>
            <Text style={{ color: colors.accent }}>Mark as sold</Text>
          </View>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
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
          firebase.auth().currentUser.uid == item.postedBy.userId ? null : (
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
                onPress={handleCall}
                style={{
                  ...styles.actionIcons,
                  backgroundColor: colors.accent,
                }}
              >
                <Ionicons name="call-outline" size={28} color={colors.theme} />
                <Text style={{ ...styles.iconText, color: colors.theme }}>
                  contact seller
                </Text>
              </Pressable>
            </View>
          )
        ) : (
          <View style={styles.itemActionBox}></View>
        )}

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
      <NavigationTab data={navigation} />
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
    top: 75,
    right: 0,
    width: 150,
    height: 200,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 10,
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
    fontSize: 28,
    color: colors.contrast,
    marginTop: 10,
    marginBottom: 8,
    textShadowColor: colors.primary,
    textShadowOffset: {
      height: 1,
      width: 0.5,
    },
    textShadowRadius: 1,
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
});

export default ItemScreen;
