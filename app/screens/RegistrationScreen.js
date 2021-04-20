import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  Animated,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
} from "react-native";
import { useDispatch } from "react-redux";
import { register } from "../actions/auth.action";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";

const ScaleInView = (props) => {
  const scaleAnim = useRef(new Animated.Value(0.78)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 0,
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

const RegistrationScreen = ({ navigation, props }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validContact, setValidContact] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [focused, setFocused] = useState(0);

  const userData = { username, email, contact, password };

  const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      setValidEmail(false);
      setEmailError("please enter a valid email");
    } else {
      setValidEmail(true);
    }
  };

  const validateContact = (text) => {
    let reg = /^(?:\+?88|0088)?01[15-9]\d{8}$/;
    if (reg.test(text) === false) {
      setValidContact(false);
      setContactError("please enter a valid phone number");
    } else {
      setValidContact(true);
    }
  };

  useEffect(() => {
    if (password != "" && confirmPassword != "") {
      if (password === confirmPassword) {
        setValidPassword(true);
        setConfirmPasswordError("matching");
      } else {
        setValidPassword(false);
        setConfirmPasswordError("passwords must match");
      }
    } else {
      setValidPassword(false);
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  const handleRegister = () => {
    const warning = "this field is required!";
    if (
      username.length >= 5 &&
      email != "" &&
      validEmail == true &&
      validContact == true &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      validPassword == true
    ) {
      dispatch(register(userData));
    } else {
      if (username.length < 5) {
        if (username === "") {
          setUsernameError(warning);
        } else {
          setUsernameError("use at least 5 characters");
        }
      }
      if (validEmail == false) {
        if (email === "") {
          setEmailError(warning);
        } else {
          setEmailError("please enter a valid email");
        }
      }
      if (validContact == false) {
        if (contact === "") {
          setContactError(warning);
        } else {
          setContactError("please enter a valid phone number");
        }
      }
      if (validPassword == false) {
        if (password.length < 6) {
          if (password === "") {
            setPasswordError(warning);
          } else {
            setPasswordError("password must be at least 6 characters long");
          }
        }
        if (confirmPassword.length < 6) {
          if (confirmPassword === "") {
            setConfirmPasswordError(warning);
          } else {
            setConfirmPasswordError("passwords must match");
          }
        }
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScaleInView style={styles.upperCircle}></ScaleInView>

      <Text style={styles.title}>SIGN UP</Text>

      <View
        style={
          focused == 1 ? styles.inputContainerFocused : styles.inputContainer
        }
      >
        <Ionicons
          name="md-person-outline"
          size={24}
          color={focused == 1 ? colors.primary : colors.theme}
        />
        <TextInput
          placeholder="username"
          autoCapitalize="none"
          autoCompleteType="name"
          autoCorrect={false}
          maxLength={20}
          onFocus={() => setFocused(1)}
          onBlur={() => setFocused(0)}
          style={focused == 1 ? styles.inputBoxFocused : styles.inputBox}
          onChangeText={(e) => {
            setUsername(e);
            if (e != "") {
              setUsernameError("");
            }
          }}
        />
      </View>

      {usernameError === "" ? null : (
        <Text style={styles.inputMsg}>{usernameError}</Text>
      )}

      <View
        style={
          focused == 2 ? styles.inputContainerFocused : styles.inputContainer
        }
      >
        <Ionicons
          name="mail-outline"
          size={24}
          color={focused == 2 ? colors.primary : colors.theme}
        />
        <TextInput
          placeholder="email"
          autoCapitalize="none"
          autoCompleteType="email"
          autoCorrect={false}
          onFocus={() => setFocused(2)}
          onBlur={() => setFocused(0)}
          style={focused == 2 ? styles.inputBoxFocused : styles.inputBox}
          onChangeText={(e) => {
            setEmail(e);
            if (e != "") {
              setEmailError("");
            }
            validateEmail(e);
          }}
        />
      </View>

      {emailError === "" ? null : (
        <Text style={styles.inputMsg}>{emailError}</Text>
      )}

      <View
        style={
          focused == 3 ? styles.inputContainerFocused : styles.inputContainer
        }
      >
        <Ionicons
          name="call-outline"
          size={24}
          color={focused == 3 ? colors.primary : colors.theme}
        />
        <TextInput
          placeholder="contact"
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setFocused(3)}
          onBlur={() => setFocused(0)}
          style={focused == 3 ? styles.inputBoxFocused : styles.inputBox}
          onChangeText={(e) => {
            setContact(e);
            if (e != "") {
              setContactError("");
            }
            validateContact(e);
          }}
        />
      </View>

      {contactError === "" ? null : (
        <Text style={styles.inputMsg}>{contactError}</Text>
      )}

      <View
        style={
          focused == 4 ? styles.inputContainerFocused : styles.inputContainer
        }
      >
        <Ionicons
          name="key-outline"
          size={24}
          color={focused == 4 ? colors.primary : colors.theme}
        />
        <TextInput
          placeholder="password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          onFocus={() => setFocused(4)}
          onBlur={() => setFocused(0)}
          style={focused == 4 ? styles.inputBoxFocused : styles.inputBox}
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

      <View
        style={
          focused == 5 ? styles.inputContainerFocused : styles.inputContainer
        }
      >
        <Ionicons
          name="key"
          size={24}
          color={focused == 5 ? colors.primary : colors.theme}
        />
        <TextInput
          placeholder="confirm password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          onFocus={() => setFocused(5)}
          onBlur={() => setFocused(0)}
          style={focused == 5 ? styles.inputBoxFocused : styles.inputBox}
          onChangeText={(e) => {
            setConfirmPassword(e);
          }}
        />
      </View>

      {confirmPasswordError === "" ? null : (
        <Text
          style={
            confirmPasswordError === "matching"
              ? { ...styles.inputMsg, color: colors.theme }
              : styles.inputMsg
          }
        >
          {confirmPasswordError}
        </Text>
      )}

      <Pressable style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.btnText}>Register</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("login")}>
        <Text style={styles.logLink}>have an account? login</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.accent,
  },
  upperCircle: {
    backgroundColor: colors.theme,
    position: "absolute",
    height: Dimensions.get("window").width * 5,
    width: Dimensions.get("window").width * 5,
    borderRadius: Dimensions.get("window").width * 2.5,
    bottom: "50%",
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
  registerBtn: {
    backgroundColor: colors.primary,
    width: "85%",
    height: 40,
    marginTop: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    color: colors.accent,
  },
  logLink: {
    marginTop: 20,
    fontSize: 18,
    color: colors.theme,
  },
});

export default RegistrationScreen;
