import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import colors from "./app/colors";
import firebase from "firebase";
import store from "./app/store";
import { Provider } from "react-redux";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import ListingsScreen from "./app/screens/ListingsScreen";
import PostingScreen from "./app/screens/PostingScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import RegistrationScreen from "./app/screens/RegistrationScreen";
import LoginScreen from "./app/screens/LoginScreen";

//firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxv1htxrWgbyMXdDJiLoDvo5yoCYHSvt4",
  authDomain: "xchange-demo.firebaseapp.com",
  projectId: "xchange-demo",
  storageBucket: "xchange-demo.appspot.com",
  messagingSenderId: "896138425289",
  appId: "1:896138425289:web:c45398ce96186deffdee18",
  measurementId: "G-ZZX2QQ299C",
};
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

//navigation setup
window.store = store;
const Stack = createStackNavigator();
const navigatorOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: colors.accent },
  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: "clamp",
      }),
    },
  }),
  //   cardStyle: {
  //     transform: [
  //       {
  //         translateX: current.progress.interpolate({
  //           inputRange: [0, 1],
  //           outputRange: [layouts.screen.width, 0],
  //         }),
  //       },
  //       {
  //         rotate: current.progress.interpolate({
  //           inputRange: [0, 1],
  //           outputRange: [1, 0],
  //         }),
  //       },
  //       {
  //         scale: next
  //           ? next.progress.interpolate({
  //               inputRange: [0, 1],
  //               outputRange: [1, 0.9],
  //             })
  //           : 1,
  //       },
  //     ],
  //   },
  //   overlayStyle: {
  //     opacity: current.progress.interpolate({
  //       inputRange: [0, 1],
  //       outputRange: [0, 0.5],
  //     }),
  //   },
  // }),
  // animationEnabled: false,
};

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoaded(true);
        setLoggedIn(false);
      } else {
        setLoaded(true);
        setLoggedIn(true);
      }
    });
  }, []);

  if (loaded == false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading</Text>
      </View>
    );
  } else {
    if (loggedIn == false) {
      return (
        <Provider store={store}>
          <NavigationContainer theme={DarkTheme} initialRouteName="welcome">
            <Stack.Navigator screenOptions={navigatorOptions} mode="modal">
              <Stack.Screen name="welcome" component={WelcomeScreen} />
              <Stack.Screen name="login" component={LoginScreen} />
              <Stack.Screen name="register" component={RegistrationScreen} />
              <Stack.Screen name="listings" component={ListingsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      );
    } else {
      return (
        <Provider store={store}>
          <NavigationContainer theme={DarkTheme} initialRouteName="listings">
            <Stack.Navigator screenOptions={navigatorOptions} mode="modal">
              <Stack.Screen name="listings" component={ListingsScreen} />
              <Stack.Screen name="posting" component={PostingScreen} />
              <Stack.Screen name="profile" component={ProfileScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      );
    }
  }
};

export default App;
