import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions";
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
  const postState = useSelector((state) => state.post);
  const posts = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);

  const handleReload = () => {
    setIsFetching(true);
    dispatch(getPosts());
  };

  useEffect(() => {
    if (postState.loading == false) {
      setIsFetching(false);
    }
  }, [postState.loading]);

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
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} nav={navigation} />}
        keyExtractor={(item) => item.id}
        refreshing={isFetching}
        onRefresh={handleReload}
        contentContainerStyle={{
          width: Dimensions.get("window").width,
          alignItems: "center",
          paddingTop: 10,
          paddingBottom: 45,
        }}
      />
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
