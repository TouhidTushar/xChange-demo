import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import AppLoading from "expo-app-loading";
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
      duration: 1500,
      useNativeDriver: true,
    }).start();
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500,
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
      duration: 1500,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
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

const WelcomeScreen = ({ navigation, props }) => {
  let [fontsLoaded] = useFonts({
    KaushanScript_400Regular,
    Play_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.background}>
        <FadeInView style={styles.logoContainer}>
          <Text style={styles.logo}>xChange</Text>
          <Text style={styles.slogan}>...a place for used goods</Text>
        </FadeInView>

        <SlideInView style={styles.listingButtonWrapper} alt>
          <Text
            style={{ ...styles.buttonText, color: colors.contrast }}
            onPress={() => navigation.navigate("listings")}
          >
            view listings
          </Text>
        </SlideInView>

        <SlideInView style={styles.loginButtonWrapper}>
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
  listingButtonWrapper: {
    width: "60%",
    height: 50,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.contrast,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  loginButtonWrapper: {
    width: "60%",
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.contrast,
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
    height: "100%",
    width: "100%",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

export default WelcomeScreen;
