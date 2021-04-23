import React, { useState, useEffect } from "react";
import colors from "../colors";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useSelector } from "react-redux";

const NavigationTab = (props) => {
  const navigation = props.data;
  const currScreen = props.screen;
  const discardModal = props.action;
  const auth = useSelector((state) => state.auth);

  return (
    <>
      <View style={styles.navContainer}>
        <Pressable
          style={styles.tabs}
          onPress={
            currScreen === "postingAlt"
              ? discardModal
              : () => navigation.navigate("listings")
          }
        >
          <Ionicons
            name="home-outline"
            size={20}
            color={currScreen === "listings" ? colors.theme : colors.contrast}
          />
          <Text
            style={{
              ...styles.linkText,
              color: currScreen === "listings" ? colors.theme : colors.contrast,
            }}
          >
            listings
          </Text>
        </Pressable>

        <Pressable
          style={styles.tabs}
          // onPress={currScreen==="postingAlt"? discardModal : () => {}}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={currScreen === "search" ? colors.theme : colors.contrast}
          />
          <Text
            style={{
              ...styles.linkText,
              color: currScreen === "search" ? colors.theme : colors.contrast,
            }}
          >
            search
          </Text>
        </Pressable>

        <Pressable style={styles.tabs}></Pressable>

        <Pressable
          style={styles.tabs}
          onPress={
            currScreen === "postingAlt"
              ? discardModal
              : () => {
                  auth.loggedIn == true
                    ? navigation.navigate("account")
                    : navigation.navigate("login");
                }
          }
        >
          <Ionicons
            name="md-person-outline"
            size={20}
            color={currScreen === "account" ? colors.theme : colors.contrast}
          />
          <Text
            style={{
              ...styles.linkText,
              color: currScreen === "account" ? colors.theme : colors.contrast,
            }}
          >
            account
          </Text>
        </Pressable>

        <Pressable
          style={styles.tabs}
          // onPress={currScreen==="postingAlt"? discardModal:() => {}}
        >
          <Ionicons
            name="settings-outline"
            size={20}
            color={currScreen === "settings" ? colors.theme : colors.contrast}
          />
          <Text
            style={{
              ...styles.linkText,
              color: currScreen === "settings" ? colors.theme : colors.contrast,
            }}
          >
            settings
          </Text>
        </Pressable>
      </View>

      <Text
        style={
          currScreen == "posting" || currScreen == "postingAlt"
            ? styles.mainButtonTextUP
            : styles.mainButtonText
        }
      >
        post
      </Text>

      <Pressable
        style={styles.mainButton}
        onPress={() => {
          auth.loggedIn == true
            ? navigation.navigate("posting")
            : navigation.navigate("login");
        }}
      >
        <FontAwesome5 name="plus" size={24} color={colors.accent} />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: "absolute",
    paddingTop: 5,
    width: "100%",
    height: 55,
    bottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#cccccc",
    backgroundColor: colors.accent,
    borderTopWidth: 0.7,
    elevation: 2,
  },
  tabs: {
    height: "100%",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: colors.contrast,
    fontSize: 14,
  },
  mainButtonText: {
    position: "absolute",
    bottom: 2,
    fontSize: 16,
    color: colors.contrast,
    opacity: 0.4,
    elevation: 3,
  },
  mainButtonTextUP: {
    position: "absolute",
    bottom: 2,
    fontSize: 16,
    color: colors.theme,
    opacity: 1,
    elevation: 3,
  },
  mainButton: {
    position: "absolute",
    bottom: 22.5,
    backgroundColor: colors.theme,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
});

export default NavigationTab;
