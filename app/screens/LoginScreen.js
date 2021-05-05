import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/auth.action";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import colors from "../colors";
import { ScrollView } from "react-native-gesture-handler";

const ScaleInView = (props) => {
  const scaleAnim = useRef(new Animated.Value(1.5)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 0.78,
      // toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{ scale: scaleAnim }],
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const LoginScreen = ({ navigation, props }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [didMount, setDidMount] = useState(false);
  const [response, setResponse] = useState(false);
  const [focused, setFocused] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const userData = { email, password };

  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, []);

  useEffect(() => {
    if (didMount == true) {
      if (
        auth.message != null &&
        auth.message != "session expired!" &&
        auth.result == false
      ) {
        setResponse(true);
      }
      setTimeout(() => {
        setResponse(false);
      }, 4000);
    }
  }, [auth.message, didMount]);

  const handleLogin = () => {
    const warning = "this field is required!";
    if (email != "" && password.length != "") {
      dispatch(login(userData));
    } else {
      if (email === "") {
        setEmailError(warning);
      }
      if (password === "") {
        setPasswordError(warning);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScaleInView style={styles.upperCircle}></ScaleInView>
      <ScrollView
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>LOG IN</Text>

        <View
          style={
            focused == 1 ? styles.inputContainerFocused : styles.inputContainer
          }
        >
          <Ionicons
            name="mail-outline"
            size={24}
            color={focused == 1 ? colors.primary : colors.theme}
          />
          <TextInput
            placeholder="email"
            autoCapitalize="none"
            autoCompleteType="email"
            autoCorrect={false}
            onFocus={() => setFocused(1)}
            onBlur={() => setFocused(0)}
            style={focused == 1 ? styles.inputBoxFocused : styles.inputBox}
            onChangeText={(e) => {
              setEmail(e);
              if (e != "") {
                setEmailError("");
              }
            }}
          />
        </View>

        {emailError === "" ? null : (
          <Text style={styles.inputMsg}>{emailError}</Text>
        )}

        <View
          style={
            focused == 2 ? styles.inputContainerFocused : styles.inputContainer
          }
        >
          <Ionicons
            name="key-outline"
            size={24}
            color={focused == 2 ? colors.primary : colors.theme}
          />
          <TextInput
            placeholder="password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onFocus={() => setFocused(2)}
            onBlur={() => setFocused(0)}
            style={focused == 2 ? styles.inputBoxFocused : styles.inputBox}
            onChangeText={(e) => {
              setPassword(e);
              if (e != "") {
                setPasswordError("");
              }
            }}
          />
        </View>

        {passwordError === "" ? null : (
          <Text style={styles.inputMsg}>{passwordError}</Text>
        )}

        <Pressable onPress={handleLogin} style={styles.loginBtn}>
          <Text style={styles.btnText}>login</Text>
        </Pressable>

        {response ? (
          <View style={{ marginTop: 25, paddingHorizontal: 10 }}>
            <Text
              style={{ fontSize: 18, color: "tomato", textAlign: "center" }}
            >
              {auth.message}
            </Text>
          </View>
        ) : null}

        <Pressable onPress={() => navigation.navigate("register")}>
          <Text style={styles.regLink}>new user? create an account</Text>
        </Pressable>

        <Text style={{ fontSize: 18, marginTop: 35, marginBottom: 10 }}>
          or continue with
        </Text>

        <View style={styles.iconsBox}>
          <Pressable onPress={() => console.log("login with google")}>
            <Image
              source={require("../assets/google.png")}
              style={styles.gLogo}
            />
          </Pressable>
          <Pressable onPress={() => console.log("login with facebook")}>
            <FontAwesome5 name="facebook" size={39} color="#3b5998" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get("screen").width,
    height: "100%",
    alignItems: "center",
    backgroundColor: colors.accent,
  },
  scrollArea: {
    width: Dimensions.get("screen").width,
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("window").height,
  },
  upperCircle: {
    backgroundColor: colors.theme,
    position: "absolute",
    height: Dimensions.get("window").width * 5,
    width: Dimensions.get("window").width * 5,
    borderRadius: Dimensions.get("window").width * 2.5,
    top:
      -(Dimensions.get("window").width * 5) +
      Dimensions.get("window").height * 0.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  title: {
    fontSize: 40,
    color: colors.theme,
  },
  inputContainer: {
    marginTop: 20,
    paddingLeft: 5,
    height: 40,
    width: "85%",
    borderColor: colors.theme,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainerFocused: {
    marginTop: 20,
    paddingLeft: 5,
    height: 40,
    width: "85%",
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  inputBox: {
    width: "89%",
    marginLeft: 5,
    borderColor: colors.theme,
    borderLeftWidth: 1,
    fontSize: 18,
    paddingLeft: 5,
  },
  inputBoxFocused: {
    width: "89%",
    marginLeft: 5,
    borderColor: colors.primary,
    borderLeftWidth: 1,
    fontSize: 18,
    paddingLeft: 5,
  },
  inputMsg: {
    width: "85%",
    paddingLeft: 5,
    color: "tomato",
  },
  loginBtn: {
    backgroundColor: colors.primary,
    width: "85%",
    height: 40,
    marginTop: 20,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    color: colors.accent,
  },
  regLink: {
    fontSize: 18,
    marginTop: 20,
    color: colors.theme,
  },
  iconsBox: {
    width: 120,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  gLogo: {
    height: 38,
    width: 38,
  },
});

export default LoginScreen;
