import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  KaushanScript_400Regular,
} from "@expo-google-fonts/kaushan-script";
import { Play_400Regular } from "@expo-google-fonts/play";
import colors from "../colors";
import NavigationTab from "../components/NavigationTab";

const ProfileScreen = ({ navigation, props }) => {
  let [fontsLoaded] = useFonts({
    KaushanScript_400Regular,
    Play_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.background}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Profile</Text>
        </View>
        <NavigationTab data={navigation} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.accent,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    top: 180,
  },
  logo: {
    fontSize: 70,
    color: colors.primary,
    fontFamily: "KaushanScript_400Regular",
  },
  slogan: {
    fontFamily: "Play_400Regular",
    fontSize: 14.5,
    color: colors.accent,
    position: "absolute",
    bottom: 0,
    paddingLeft: 5,
  },
  listingButton: {
    width: "60%",
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  loginButton: {
    width: "60%",
    height: 50,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: colors.accent,
    fontSize: 22,
    fontFamily: "Play_400Regular",
  },
});

export default ProfileScreen;
