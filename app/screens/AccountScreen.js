import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { archivePost, logOut, removeFromWatch } from "../actions";
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
  const archivedPosts = useSelector((state) => state.post.archivedPosts);
  const soldPosts = useSelector((state) => state.post.soldPosts);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setCurrentView("");
  }, []);

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
      if (user.watchList != undefined && user.watchList != null) {
        if (user.watchList.includes(item.id)) {
          myArray.push(item);
        }
      }
    });
    return myArray;
  };

  const myArchives = () => {
    var myArray = [];
    {
      archivePost
        ? archivedPosts.map((item) => {
            if (user.archiveList != undefined && user.archiveList != null) {
              if (user.archiveList.includes(item.id)) {
                myArray.push(item);
              }
            }
          })
        : null;
    }
    return myArray;
  };

  const myHistory = () => {
    var myArray = [];
    {
      soldPosts
        ? soldPosts.map((item) => {
            if (user.soldList != undefined && user.soldList != null) {
              if (user.soldList.includes(item.id)) {
                var object = { ...item, flag: "sold" };
                myArray.push(object);
              }
            }
            if (user.boughtList != undefined && user.boughtList != null) {
              if (user.boughtList.includes(item.id)) {
                var object_ = { ...item, flag: "bought" };
                myArray.push(object_);
              }
            }
          })
        : null;
    }
    return myArray;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            currentView == "" ? navigation.goBack() : setCurrentView("");
          }}
          style={{ position: "absolute", left: 10, bottom: 8 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color={colors.accent} />
        </Pressable>
        <Text style={styles.headerText}>
          {currentView == ""
            ? user.username
              ? user.username
              : "Account"
            : currentView}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
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

          {/* my-inbox */}
          <Pressable
            style={styles.menuBox}
            onPress={() => setCurrentView("inbox")}
          >
            <Ionicons
              name="chatbox-ellipses-outline"
              size={28}
              color={colors.accent}
            />
            <Text style={styles.menuText}>inbox</Text>
          </Pressable>

          {/* my-watchlist */}
          <Pressable
            style={styles.menuBox}
            onPress={() => setCurrentView("watchlist")}
          >
            <Ionicons name="eye-outline" size={28} color={colors.accent} />
            <Text style={styles.menuText}>watchlist</Text>
          </Pressable>

          {/* my drafts */}
          <Pressable
            style={styles.menuBox}
            onPress={() => setCurrentView("drafts")}
          >
            <Ionicons name="bookmark-outline" size={28} color={colors.accent} />
            <Text style={styles.menuText}>drafts</Text>
          </Pressable>

          {/* my-history */}
          <Pressable
            style={styles.menuBox}
            onPress={() => setCurrentView("history")}
          >
            <MaterialCommunityIcons
              name="history"
              size={28}
              color={colors.accent}
            />
            <Text style={styles.menuText}>history</Text>
          </Pressable>

          {/* my-archives */}
          <Pressable
            style={styles.menuBox}
            onPress={() => setCurrentView("archive")}
          >
            <Ionicons name="archive-outline" size={28} color={colors.accent} />
            <Text style={styles.menuText}>archive</Text>
          </Pressable>

          {/* my-user-status */}
          <Pressable
            style={styles.menuBox}
            onPress={() => setCurrentView("user status")}
          >
            <Ionicons name="ribbon-outline" size={28} color={colors.accent} />
            <Text style={{ fontSize: 18, marginLeft: 8, color: colors.accent }}>
              status
            </Text>
          </Pressable>

          {/* blank */}
          <View
            style={{
              ...styles.menuBox,
              backgroundColor: colors.accent,
              elevation: 0,
            }}
          ></View>

          <Pressable style={styles.userActionBtn}>
            <Ionicons
              name="person-circle-outline"
              size={40}
              color={colors.theme}
            />
            <Text style={{ fontSize: 18, marginLeft: 8 }}>Edit profile</Text>
          </Pressable>

          <Pressable onPress={handleLogout} style={styles.userActionBtn}>
            <Ionicons name="exit-outline" size={40} color="tomato" />
            <Text style={{ fontSize: 18, marginLeft: 8 }}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ---------- dynamic views ----------*/}

      {/* listings */}
      {currentView == "my-listings" ? (
        <View style={styles.menuOverlay}>
          <ScrollView
            contentContainerStyle={styles.scrollArea}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ height: 8 }}></View>
            {myListings().length > 0 ? (
              myListings().map((item) => {
                return <MiniCard key={item.id} data={item} nav={navigation} />;
              })
            ) : (
              <Text style={{ fontSize: 18 }}>No items in my listings</Text>
            )}
            <View style={{ height: 45 }}></View>
          </ScrollView>
        </View>
      ) : null}

      {/* inbox */}
      {currentView == "inbox" ? (
        <View style={styles.menuOverlay}>
          <ScrollView
            contentContainerStyle={styles.scrollArea}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ height: 8 }}></View>

            <Text style={{ fontSize: 18 }}>
              "this screen is currently in development stage"
            </Text>

            <View style={{ height: 45 }}></View>
          </ScrollView>
        </View>
      ) : null}

      {/* watchlist */}
      {currentView == "watchlist" ? (
        <View style={styles.menuOverlay}>
          <ScrollView
            contentContainerStyle={styles.scrollArea}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ height: 8 }}></View>
            {myWatchlist().length > 0 ? (
              myWatchlist().map((item) => {
                return (
                  <MiniCard
                    key={item.id}
                    data={item}
                    nav={navigation}
                    removeButton={true}
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

      {/* drafts */}
      {currentView == "drafts" ? (
        <View style={styles.menuOverlay}>
          <ScrollView
            contentContainerStyle={styles.scrollArea}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ height: 8 }}></View>

            <Text style={{ fontSize: 18 }}>
              "this screen is currently in development stage"
            </Text>

            <View style={{ height: 45 }}></View>
          </ScrollView>
        </View>
      ) : null}

      {/* history */}
      {currentView == "history" ? (
        <View style={styles.menuOverlay}>
          <ScrollView
            contentContainerStyle={styles.scrollArea}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ height: 8 }}></View>
            {myHistory().length > 0 ? (
              myHistory().map((item) => {
                return (
                  <MiniCard
                    key={item.id}
                    data={item}
                    nav={navigation}
                    historyFlag={item.flag}
                  />
                );
              })
            ) : (
              <Text style={{ fontSize: 18 }}>No items in history</Text>
            )}
            <View style={{ height: 45 }}></View>
          </ScrollView>
        </View>
      ) : null}

      {/* archives */}
      {currentView == "archive" ? (
        <View style={styles.menuOverlay}>
          <ScrollView
            contentContainerStyle={styles.scrollArea}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ height: 8 }}></View>
            {myArchives().length > 0 ? (
              myArchives().map((item) => {
                return (
                  <MiniCard
                    key={item.id}
                    data={item}
                    nav={navigation}
                    unarchiveButton={true}
                  />
                );
              })
            ) : (
              <Text style={{ fontSize: 18 }}>No items in archive</Text>
            )}
            <View style={{ height: 45 }}></View>
          </ScrollView>
        </View>
      ) : null}

      {/* user status */}
      {currentView == "user status" ? (
        <View style={styles.menuOverlay}>
          <ScrollView
            contentContainerStyle={styles.scrollArea}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ height: 8 }}></View>

            <Text style={{ fontSize: 18 }}>
              "this screen is currently in development stage"
            </Text>

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
  userActionBtn: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    borderRadius: 50,
    justifyContent: "center",
    elevation: 3,
    backgroundColor: colors.accent,
  },
  menuOverlay: {
    position: "absolute",
    backgroundColor: colors.accent,
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingBottom: 115,
    top: 75,
    left: 0,
  },
});

export default AccountScreen;
