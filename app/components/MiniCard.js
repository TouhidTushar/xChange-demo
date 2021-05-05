import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWatch, unarchivePost } from "../actions";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import { LinearGradient } from "expo-linear-gradient";

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

const MiniCard = (props) => {
  const data = props.data;
  const navigation = props.nav;
  const actionData = { id: data.id, navigation: navigation };
  const dispatch = useDispatch();
  const value = new Date(data.createdAt);
  const auth = useSelector((state) => state.auth);
  const [loadingIcon, setLoadingIcon] = useState(false);

  useEffect(() => {
    if (auth.watching == false) {
      setLoadingIcon(false);
    }
  }, [auth.watching]);

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

  const handleRemoveFromWatchlist = () => {
    dispatch(removeFromWatch(data.id));
    setLoadingIcon(true);
  };

  const handleRemoveFromArchive = () => {
    dispatch(unarchivePost(actionData));
    setLoadingIcon(true);
  };

  return (
    <View style={styles.cardWrapper}>
      <Pressable
        onPress={() => navigation.navigate("itemDetails", { item: data })}
        style={styles.card}
      >
        <Image source={{ uri: data.images[0].image }} style={styles.imageBox} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.imageCover}
        />
        <View style={styles.detailsBox}>
          <Text style={styles.mainText}>{data.itemName}</Text>
          <Text style={styles.subText}>{prepareDate()}</Text>
        </View>
      </Pressable>

      {props.removeButton ? (
        loadingIcon ? (
          <LoaderView
            style={{
              position: "absolute",
              elevation: 3,
              bottom: 10,
              right: 10,
            }}
          >
            <AntDesign name="loading1" size={18} color={colors.theme} />
          </LoaderView>
        ) : (
          <Pressable style={styles.rmvBtn} onPress={handleRemoveFromWatchlist}>
            <Text style={styles.btnText}>Remove</Text>
          </Pressable>
        )
      ) : null}

      {props.unarchiveButton ? (
        <Pressable style={styles.rmvBtn} onPress={handleRemoveFromArchive}>
          <Text style={styles.btnText}>Unarchive</Text>
        </Pressable>
      ) : null}

      {props.historyFlag ? (
        <View style={styles.rmvBtn}>
          <Text
            style={{
              ...styles.btnText,
              color: props.historyFlag == "sold" ? "tomato" : colors.theme,
            }}
          >
            {props.historyFlag}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    height: 100,
    width: "92%",
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.accent,
    elevation: 3,
  },
  card: {
    height: 100,
    width: "100%",
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.accent,
    elevation: 3,
  },
  imageBox: {
    height: 100,
    width: "100%",
    borderRadius: 10,
  },
  imageCover: {
    position: "absolute",
    left: Dimensions.get("screen").width * 0.46 - 50,
    width: 100,
    height: Dimensions.get("screen").width * 0.92,
    transform: [{ rotateZ: "90deg" }],
    borderRadius: 10,
  },
  detailsBox: {
    position: "absolute",
    height: 70,
    marginLeft: 8,
  },
  mainText: {
    fontSize: 22,
    color: colors.theme,
    marginBottom: 3,
  },
  subText: {
    fontSize: 18,
    color: colors.accent,
  },
  rmvBtn: {
    position: "absolute",
    backgroundColor: "tomato",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    elevation: 3,
    bottom: 10,
    right: 10,
  },
  btnText: {
    color: colors.accent,
    fontSize: 16,
  },
});

export default MiniCard;
