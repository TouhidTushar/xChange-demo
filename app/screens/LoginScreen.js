import React, { useEffect, useState } from "react";
import { Text, View, Pressable, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../actions/auth.action";

const LoginScreen = ({ navigation, props }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const userData = { email, password };

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
    <View style={{ padding: 10 }}>
      <TextInput
        placeholder="email"
        onChangeText={(e) => {
          setEmail(e);
          if (e != "") {
            setEmailError("");
          }
        }}
        style={{ marginTop: 50 }}
      />
      {emailError === "" ? null : <Text>{emailError}</Text>}
      <TextInput
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(e) => {
          setPassword(e);
          if (e != "") {
            setPasswordError("");
          }
        }}
      />
      {passwordError === "" ? null : <Text>{passwordError}</Text>}
      <Pressable onPress={handleLogin}>
        <Text>Login</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("register")}>
        <Text>Create account</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;
