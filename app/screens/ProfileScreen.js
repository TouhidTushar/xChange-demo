import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import { useDispatch } from "react-redux";
import { logOut } from "../actions";
import colors from "../colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import NavigationTab from "../components/NavigationTab";
import { ScrollView } from "react-native-gesture-handler";

const ProfileScreen = ({ navigation, props }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
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
        <Text style={styles.headerText}>Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View style={styles.menuWrapper}>
          <Pressable style={styles.menuBox}>
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

          <Pressable style={styles.menuBox}>
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
          <View style={styles.menuBox}></View>
          <View style={styles.menuBox}></View>
          <View style={styles.menuBox}></View>
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
});

export default ProfileScreen;
