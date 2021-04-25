import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import colors from "../colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import NavigationTab from "../components/NavigationTab";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import firebase from "firebase";

const ItemScreen = ({ route, navigation, props }) => {
  const { item } = route.params;
  const value = new Date(item.createdAt);
  const auth = useSelector((state) => state.auth);
  const [imgActive, setImgActive] = useState(0);
  const [postControl, setPostControl] = useState(false);

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
            {/* <Text style={{ color: colors.accent }}></Text> */}
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
    marginBottom: 20,
    textShadowColor: colors.primary,
    textShadowOffset: {
      height: 1,
      width: 0.5,
    },
    textShadowRadius: 1,
    width: "100%",
    textAlign: "center",
  },
  priceText: {
    fontSize: 20,
    marginLeft: 5,
    color: colors.theme,
  },
  priceBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    borderColor: colors.theme,
    borderWidth: 2,
    padding: 10,
    justifyContent: "center",
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
