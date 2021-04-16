import React, { useEffect, useState } from "react";
import { Text, View, Pressable, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import { register } from "../actions/auth.action";

const RegistrationScreen = ({ navigation, props }) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fnameError, setFnameError] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validContact, setValidContact] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const userData = { firstName, lastName, email, contact, password };

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
      firstName.length >= 3 &&
      lastName.length >= 3 &&
      email != "" &&
      validEmail == true &&
      validContact == true &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      validPassword == true
    ) {
      dispatch(register(userData));
    } else {
      if (firstName.length < 3) {
        if (firstName === "") {
          setFnameError(warning);
        } else {
          setFnameError("use at least 3 characters");
        }
      }
      if (lastName.length < 3) {
        if (lastName === "") {
          setLnameError(warning);
        } else {
          setLnameError("use at least 3 characters");
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
    <View style={{ padding: 10 }}>
      <TextInput
        placeholder="first name"
        maxLength={20}
        onChangeText={(e) => {
          setFirstName(e);
          if (e != "") {
            setFnameError("");
          }
        }}
        style={{ marginTop: 50 }}
      />
      {fnameError === "" ? null : <Text>{fnameError}</Text>}
      <TextInput
        placeholder="last name"
        onChangeText={(e) => {
          setLastName(e);
          if (e != "") {
            setLnameError("");
          }
        }}
      />
      {lnameError === "" ? null : <Text>{lnameError}</Text>}
      <TextInput
        placeholder="email"
        onChangeText={(e) => {
          setEmail(e);
          if (e != "") {
            setEmailError("");
          }
          validateEmail(e);
        }}
      />
      {emailError === "" ? null : <Text>{emailError}</Text>}
      <TextInput
        placeholder="contact"
        onChangeText={(e) => {
          setContact(e);
          if (e != "") {
            setContactError("");
          }
          validateContact(e);
        }}
      />
      {contactError === "" ? null : <Text>{contactError}</Text>}
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
      <TextInput
        placeholder="confirm password"
        secureTextEntry={true}
        onChangeText={(e) => {
          setConfirmPassword(e);
          if (e != "") {
            setConfirmPasswordError("");
          }
        }}
      />
      {confirmPasswordError === "" ? null : <Text>{confirmPasswordError}</Text>}

      <Pressable onPress={handleRegister}>
        <Text>Register</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("login")}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
};

export default RegistrationScreen;
