import React, { useRef, useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import {
  useFonts,
  KaushanScript_400Regular,
} from "@expo-google-fonts/kaushan-script";
import { Play_400Regular } from "@expo-google-fonts/play";
import colors from "../colors";

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const SlideInView = (props) => {
  const slideAnim = useRef(new Animated.Value(props.alt ? 100 : -100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      delay: 1200,
      duration: 800,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeAnim, {
      toValue: 1,
      delay: 1200,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, fadeAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{ translateX: slideAnim }],
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
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

const WelcomeScreen = ({ navigation, props }) => {
  let [fontsLoaded] = useFonts({
    KaushanScript_400Regular,
    Play_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <View style={styles.bubblesBox}>
          <Bubbles style={styles.bubbles} delay={100}></Bubbles>
          <Bubbles style={styles.bubbles} delay={200}></Bubbles>
          <Bubbles style={styles.bubbles} delay={300}></Bubbles>
          <Bubbles style={styles.bubbles} delay={400}></Bubbles>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.background}>
        <FadeInView style={styles.logoContainer}>
          <Text style={styles.logo}>xChange</Text>
          <Text style={styles.slogan}>...a place for used goods</Text>
        </FadeInView>

        <SlideInView style={styles.listingButton} alt>
          <Text
            style={{ ...styles.buttonText, color: colors.contrast }}
            onPress={() => navigation.navigate("listings")}
          >
            view listings
          </Text>
        </SlideInView>

        <SlideInView style={styles.loginButton}>
          <Text
            style={styles.buttonText}
            onPress={() => navigation.navigate("login")}
          >
            login
          </Text>
        </SlideInView>
      </View>
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
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.theme,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
  },
  logoContainer: {
    position: "absolute",
    top: 180,
  },
  logo: {
    fontSize: 70,
    color: colors.accent,
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
    backgroundColor: colors.secondary,
    borderRadius: 100,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  loginButton: {
    width: "60%",
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  buttonText: {
    color: colors.accent,
    fontSize: 22,
    height: "100%",
    width: "100%",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

export default WelcomeScreen;
