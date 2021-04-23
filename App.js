import "react-native-gesture-handler";
import React, { useState, useEffect, useRef } from "react";
import colors from "./app/colors";
import firebase from "firebase";
import store from "./app/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Animated, Dimensions } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import ListingsScreen from "./app/screens/ListingsScreen";
import PostingScreen from "./app/screens/PostingScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import RegistrationScreen from "./app/screens/RegistrationScreen";
import LoginScreen from "./app/screens/LoginScreen";
import { loggedInState } from "./app/actions/auth.action";
import { getCategories, getLocations, getPosts } from "./app/actions";
import { postConstants } from "./app/actions/constants";

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
  animationEnabled: false,
  // cardStyle: { backgroundColor: colors.accent },
  // cardStyleInterpolator: ({ current: { progress } }) => ({
  //   cardStyle: {
  //     opacity: progress.interpolate({
  //       inputRange: [0, 1],
  //       outputRange: [0, 1],
  //     }),
  //   },
  //   overlayStyle: {
  //     opacity: progress.interpolate({
  //       inputRange: [0, 1],
  //       outputRange: [0, 0.5],
  //       extrapolate: "clamp",
  //     }),
  //   },
  // }),
};

const Bubbles = (props) => {
  const jumpAnim = useRef(new Animated.Value(0.1)).current;
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(1);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(jumpAnim, {
          toValue: 1,
          duration: 800,
          delay: count == 0 ? props.delay : 0,
          useNativeDriver: true,
        }),
        Animated.timing(jumpAnim, {
          toValue: 0.1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [jumpAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: jumpAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [postDone, setPostDone] = useState(false);
  const auth = useSelector((state) => state.auth);
  const post = useSelector((state) => state.post);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      dispatch(loggedInState());
      dispatch(getPosts());
      dispatch(getCategories());
      dispatch(getLocations());
    }
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (auth.loading == true || post.loading == true) {
        setLoaded(false);
      } else {
        setLoaded(true);
      }
    }
    return () => (mounted = false);
  }, [auth.loading, post.loading]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (loaded == true && post.render == true) {
        setPostDone(true);
        setTimeout(() => {
          dispatch({ type: postConstants.NEWPOST_HIDE_RESULT });
        }, 2000);
      } else {
        setPostDone(false);
      }
    }
    return () => (mounted = false);
  }, [post.render, loaded]);

  if (auth.loggedIn == false) {
    return (
      <>
        {loaded == false ? (
          <View style={styles.loader}>
            <View style={styles.bubblesBox}>
              <Bubbles style={styles.bubbles} delay={100}></Bubbles>
              <Bubbles style={styles.bubbles} delay={200}></Bubbles>
              <Bubbles style={styles.bubbles} delay={300}></Bubbles>
              <Bubbles style={styles.bubbles} delay={400}></Bubbles>
            </View>
          </View>
        ) : null}
        <NavigationContainer>
          <Stack.Navigator
            // initialRouteName="welcome"
            screenOptions={navigatorOptions}
          >
            <Stack.Screen name="welcome" component={WelcomeScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="register" component={RegistrationScreen} />
            <Stack.Screen name="listings" component={ListingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  } else {
    return (
      <>
        {loaded == false ? (
          <View style={styles.loader}>
            <View style={styles.bubblesBox}>
              <Bubbles style={styles.bubbles} delay={100}></Bubbles>
              <Bubbles style={styles.bubbles} delay={200}></Bubbles>
              <Bubbles style={styles.bubbles} delay={300}></Bubbles>
              <Bubbles style={styles.bubbles} delay={400}></Bubbles>
            </View>
          </View>
        ) : null}
        {postDone == true ? (
          <View style={styles.loader}>
            <Text style={styles.loaderText}>DONE!</Text>
          </View>
        ) : null}
        <NavigationContainer>
          <Stack.Navigator
            // initialRouteName="listings"
            screenOptions={navigatorOptions}
          >
            <Stack.Screen name="listings" component={ListingsScreen} />
            <Stack.Screen name="posting" component={PostingScreen} />
            <Stack.Screen name="account" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
};

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    elevation: 10,
    height: "100%",
    width: "100%",
    backgroundColor: colors.theme,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    fontSize: 28,
    color: colors.accent,
  },
  bubblesBox: {
    flexDirection: "row",
    marginTop: 5,
  },
  bubbles: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: colors.accent,
  },
});

//redux provider
const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;
