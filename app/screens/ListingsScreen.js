import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import colors from "../colors";
import NavigationTab from "../components/NavigationTab";
import PostCard from "../components/PostCard";

const SlideInView = (props) => {
  const dim = Dimensions.get("screen").height;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: -dim + 75,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const ListingScreen = ({ navigation, props }) => {
  const posts = useSelector((state) => state.post.posts);

  return (
    <View style={styles.background}>
      <SlideInView style={styles.header}>
        <Text style={styles.headerText}>Listings</Text>
      </SlideInView>
      <View
        style={{
          height: 75,
        }}
      ></View>
      <ScrollView
        contentContainerStyle={{
          width: Dimensions.get("window").width,
          alignItems: "center",
        }}
      >
        <View style={{ height: 10 }}></View>

        {posts.map((item, index) => {
          return (
            <PostCard key={item.itemName + index} post={item} serial={index} />
          );
        })}

        <View style={{ height: 45 }}></View>
      </ScrollView>
      <View
        style={{
          height: 55,
        }}
      ></View>
      <NavigationTab data={navigation} screen="listings" />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.accent,
    alignItems: "center",
  },
  header: {
    backgroundColor: colors.theme,
    width: "120%",
    height: Dimensions.get("screen").height,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    elevation: 5,
    position: "absolute",
  },
  headerText: {
    color: colors.accent,
    fontSize: 16,
  },
});

export default ListingScreen;
