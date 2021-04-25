import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import colors from "../colors";

const MiniCard = (props) => {
  const data = props.data;
  const index = props.serial;
  const navigation = props.nav;
  const value = new Date(data.createdAt);

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

  return (
    <Pressable
      onPress={() => navigation.navigate("itemDetails", { item: data })}
      style={styles.cardWrapper}
    >
      <Image source={{ uri: data.images[0].image }} style={styles.imageBox} />
      <View style={styles.detailsBox}>
        <Text style={styles.mainText}>{data.itemName}</Text>
        <Text style={styles.subText}>{prepareDate()}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    height: 80,
    width: "92%",
    marginVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    padding: 5,
    flexDirection: "row",
    backgroundColor: colors.accent,
    elevation: 5,
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
});

export default MiniCard;
