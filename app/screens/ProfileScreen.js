import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, Text, View, Pressable } from "react-native";
import { useDispatch } from "react-redux";
import { logOut } from "../actions";
import colors from "../colors";
import NavigationTab from "../components/NavigationTab";

const ProfileScreen = ({ navigation, props }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <View style={styles.background}>
      <View>
        <Text style={{ fontSize: 32 }}>Profile</Text>
        <Pressable onPress={handleLogout}>
          <Text style={{ fontSize: 28, marginTop: 25 }}>logout</Text>
        </Pressable>
      </View>
      <NavigationTab data={navigation} screen="account" />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
