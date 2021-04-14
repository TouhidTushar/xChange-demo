// import "react-native-gesture-handler";
import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import ListingScreen from "../screens/ListingsScreen";

const Tab = createMaterialBottomTabNavigator();

function tabs(props) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="listings" component={ListingScreen} />
    </Tab.Navigator>
  );
}

export default tabs;
