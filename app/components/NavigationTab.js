import React, { useState, useEffect } from "react";
import colors from "../colors";
import firebase from "firebase";
import { Animated, StyleSheet, Text, View, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const NavigationTab = (props) => {
  const navigation = props.data;
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Pressable
          style={styles.tabs}
          onPress={() => navigation.navigate("listings")}
        >
          <FontAwesome5 name="clipboard-list" size={26} color={colors.accent} />
          <Text style={styles.linkText}>listings</Text>
        </Pressable>
        <Pressable
          style={styles.tabs}
          onPress={() => {
            loggedIn == true
              ? navigation.navigate("profile")
              : navigation.navigate("login");
          }}
        >
          <FontAwesome5 name="user-alt" size={26} color={colors.accent} />
          <Text style={styles.linkText}>
            {loggedIn == true ? "profile" : "account"}
          </Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.mainButtonWrapper}
        onPress={() => {
          loggedIn == true
            ? navigation.navigate("posting")
            : navigation.navigate("login");
        }}
      >
        <View style={styles.mainButton}>
          <FontAwesome5 name="plus" size={24} color={colors.theme} />
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.theme,
    position: "absolute",
    width: "100%",
    height: 60,
    bottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabs: {
    width: "30%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: colors.accent,
    fontSize: 14,
  },
  mainButtonWrapper: {
    backgroundColor: colors.theme,
    height: 80,
    width: 80,
    borderRadius: 50,
    borderColor: colors.accent,
    borderWidth: 5,
    position: "absolute",
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
    // elevation: 7,
  },
  mainButton: {
    backgroundColor: colors.accent,
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NavigationTab;
