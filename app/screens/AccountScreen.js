import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../actions";
import colors from "../colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import NavigationTab from "../components/NavigationTab";
import { ScrollView } from "react-native-gesture-handler";
import firebase from "firebase";
import MiniCard from "../components/MiniCard";

const AccountScreen = ({ navigation, props }) => {
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useState("");
  const posts = useSelector((state) => state.post.posts);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logOut());
  };

  const myListings = () => {
    var myArray = [];
    posts.map((item) => {
      if (item.postedBy.userId == firebase.auth().currentUser.uid) {
        myArray.push(item);
      }
    });
    return myArray;
  };

  const myWatchlist = () => {
    var myArray = [];
    posts.map((item) => {
      if (user.watchList.includes(item.id)) {
        myArray.push(item);
      }
    });
    return myArray;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        {currentView == "" ? (
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", left: 10, bottom: 8 }}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={colors.accent}
            />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setCurrentView("")}
            style={{ position: "absolute", right: 10, bottom: 8 }}
          >
            <Ionicons name="close" size={24} color={colors.accent} />
          </Pressable>
        )}
        <Text style={styles.headerText}>
          {currentView == "" ? "Account" : currentView}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View style={styles.menuWrapper}>
          {/* my-listings */}
          <Pressable
            style={styles.menuBox}
            onPress={() => setCurrentView("my-listings")}
          >
            <Ionicons
              name="list-circle-outline"
              size={28}
              color={colors.accent}
            />
            <Text style={styles.menuText}>my listings</Text>
          </Pressable>

          <Pressable style={styles.menuBox}>
            <Ionicons
              name="chatbox-ellipses-outline"
              size={28}
              color={colors.accent}
            />
            <Text style={styles.menuText}>inbox</Text>
          </Pressable>

          <Pressable
            style={styles.menuBox}
            onPress={() => setCurrentView("watchlist")}
          >
            <Ionicons name="eye-outline" size={28} color={colors.accent} />
            <Text style={styles.menuText}>watchlist</Text>
          </Pressable>

          <Pressable style={styles.menuBox}>
            <Ionicons name="bookmark-outline" size={28} color={colors.accent} />
            <Text style={styles.menuText}>drafts</Text>
          </Pressable>

          <Pressable style={styles.menuBox}>
            <MaterialCommunityIcons
              name="history"
              size={28}
              color={colors.accent}
            />
            <Text style={styles.menuText}>history</Text>
          </Pressable>

          <Pressable style={styles.menuBox}>
            <Ionicons name="archive-outline" size={28} color={colors.accent} />
            <Text style={styles.menuText}>archive</Text>
          </Pressable>

          <View style={styles.menuBox}></View>

          <View
            style={{
              ...styles.menuBox,
              backgroundColor: colors.accent,
              elevation: 0,
            }}
          ></View>
          <Pressable onPress={handleLogout} style={styles.logOutBtn}>
            <Ionicons name="exit-outline" size={40} color="tomato" />
            <Text style={{ fontSize: 18, marginLeft: 8 }}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ---------- dynamic views ----------*/}

      {/* my-listings */}
      {currentView == "my-listings" ? (
        <View style={styles.menuOverlay}>
          <ScrollView contentContainerStyle={styles.scrollArea}>
            <View style={{ height: 8 }}></View>
            {myListings().length > 0 ? (
              myListings().map((item, index) => {
                return (
                  <MiniCard
                    key={item.id}
                    data={item}
                    serial={index}
                    nav={navigation}
                  />
                );
              })
            ) : (
              <Text style={{ fontSize: 18 }}>No items in my listings</Text>
            )}
            <View style={{ height: 45 }}></View>
          </ScrollView>
        </View>
      ) : null}

      {currentView == "watchlist" ? (
        <View style={styles.menuOverlay}>
          <ScrollView contentContainerStyle={styles.scrollArea}>
            <View style={{ height: 8 }}></View>
            {myWatchlist().length > 0 ? (
              myWatchlist().map((item, index) => {
                return (
                  <MiniCard
                    key={item.id}
                    data={item}
                    serial={index}
                    nav={navigation}
                  />
                );
              })
            ) : (
              <Text style={{ fontSize: 18 }}>No items in watchlist</Text>
            )}
            <View style={{ height: 45 }}></View>
          </ScrollView>
        </View>
      ) : null}

      <NavigationTab data={navigation} screen="account" />
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
  header: {
    backgroundColor: colors.theme,
    width: "100%",
    height: 75,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    elevation: 5,
  },
  headerText: {
    color: colors.accent,
    fontSize: 16,
  },
  scrollArea: {
    width: Dimensions.get("screen").width,
    alignItems: "center",
  },
  menuWrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingBottom: 100,
  },
  menuBox: {
    width: "40%",
    height: 100,
    elevation: 5,
    marginTop: 25,
    borderRadius: 10,
    backgroundColor: colors.primary,
    padding: 10,
  },
  menuText: {
    fontSize: 18,
    color: colors.accent,
    paddingLeft: 8,
    paddingVertical: 5,
  },
  logOutBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.primary,
    borderTopWidth: 2,
    marginTop: 25,
    paddingLeft: 10,
  },
  menuOverlay: {
    position: "absolute",
    backgroundColor: colors.accent,
    // justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingBottom: 115,
    top: 75,
    left: 0,
  },
});

export default AccountScreen;