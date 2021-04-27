import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWatch } from "../actions";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";

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

  return (
    <View style={styles.cardWrapper}>
      <Pressable
        onPress={() => navigation.navigate("itemDetails", { item: data })}
        style={styles.card}
      >
        <Image source={{ uri: data.images[0].image }} style={styles.imageBox} />
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
              elevation: 4,
              bottom: 5,
              right: 5,
            }}
          >
            <AntDesign name="loading1" size={18} color={colors.primary} />
          </LoaderView>
        ) : (
          <Pressable style={styles.rmvBtn} onPress={handleRemoveFromWatchlist}>
            <Text style={styles.btnText}>Remove</Text>
          </Pressable>
        )
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    height: 80,
    width: "92%",
    marginVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.accent,
    elevation: 3,
  },
  card: {
    height: 80,
    width: "100%",
    marginVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    padding: 5,
    flexDirection: "row",
    backgroundColor: colors.accent,
    elevation: 3,
  },
  imageBox: {
    height: 69,
    width: 92,
    borderRadius: 5,
  },
  detailsBox: {
    height: 70,
    marginLeft: 8,
  },
  mainText: {
    fontSize: 22,
    color: colors.theme,
    marginBottom: 3,
  },
  subText: {
    fontSize: 16,
    color: colors.contrast,
  },
  rmvBtn: {
    position: "absolute",
    elevation: 4,
    bottom: 5,
    right: 10,
  },
  btnText: {
    color: "tomato",
    fontSize: 16,
  },
});

export default MiniCard;
