import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import tabs from "./app/components/tabs";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="tabs" component={tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
