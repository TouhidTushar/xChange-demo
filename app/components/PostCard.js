import React from "react";
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

const PostCard = (props) => {
  const data = props.post;
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
    justifyContent: "flex-end",
    marginTop: 10,
  },
  postfields: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  mainText: {
    fontSize: 22,
    color: colors.contrast,
    marginLeft: 8,
  },
  subText: {
    fontSize: 18,
    color: colors.theme,
  },
});

export default PostCard;
