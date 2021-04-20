import React, { useRef, useEffect, useState } from "react";
// import { useKeyboard } from "@react-native-community/hooks";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";
import NavigationTab from "../components/NavigationTab";
import { ScrollView } from "react-native-gesture-handler";

const PostingScreen = ({ navigation, props }) => {
  // const keyboard = useKeyboard();
  const [selectDrop, setSelectDrop] = useState(false);
  const [focused, setFocused] = useState(0);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("--please select a category--");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const [itemNameError, setItemNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleSelect = () => {
    if (selectDrop) {
      setSelectDrop(false);
      setFocused(0);
    } else {
      setSelectDrop(true);
      setFocused(2);
    }
  };

  const handleSelection = (data) => {
    setCategory(data);
    setSelectDrop(false);
    setFocused(0);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create post</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <Text style={styles.title}>Post an item for listing</Text>

        <View
          style={
            focused == 1 ? styles.inputContainerFocused : styles.inputContainer
          }
        >
          <Ionicons
            name="cube-outline"
            size={24}
            color={focused == 1 ? colors.primary : colors.theme}
          />
          <TextInput
            placeholder="item name"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            onFocus={() => {
              setFocused(1);
              setSelectDrop(false);
            }}
            onBlur={() => setFocused(0)}
            style={focused == 1 ? styles.inputBoxFocused : styles.inputBox}
            onChangeText={(e) => {
              setItemName(e);
              if (e != "") {
                setItemNameError("");
              }
            }}
          />
        </View>

        <Pressable
          onPress={handleSelect}
          style={
            focused == 2
              ? { ...styles.inputContainerFocused, paddingVertical: 5 }
              : { ...styles.inputContainer, paddingVertical: 5 }
          }
        >
          <Ionicons
            name={
              selectDrop == false
                ? "chevron-down-outline"
                : "chevron-up-outline"
            }
            size={24}
            color={focused == 2 ? colors.primary : colors.theme}
          />
          <View style={focused == 2 ? styles.areaBoxFocused : styles.areaBox}>
            <Text
              style={{
                fontSize: 18,
                paddingTop: 2,
                opacity: category == "--please select a category--" ? 0.5 : 1,
              }}
            >
              {category}
            </Text>
          </View>
        </Pressable>

        <View style={focused == 3 ? styles.inputAreaFocused : styles.inputArea}>
          <Ionicons
            name="clipboard-outline"
            size={24}
            color={focused == 3 ? colors.primary : colors.theme}
          />
          <TextInput
            placeholder="description"
            autoCapitalize="none"
            autoCorrect={false}
            multiline={true}
            numberOfLines={4}
            onFocus={() => {
              setFocused(3);
              setSelectDrop(false);
            }}
            onBlur={() => setFocused(0)}
            style={focused == 3 ? styles.areaBoxFocused : styles.areaBox}
            onChangeText={(e) => {
              setItemName(e);
              if (e != "") {
                setItemNameError("");
              }
            }}
          />
          {selectDrop ? (
            <ScrollView style={styles.selectWrapper}>
              <Pressable
                style={styles.selectBtns}
                onPress={() => handleSelection("Apparel")}
              >
                <Text style={styles.selectText}>Apparel</Text>
              </Pressable>
              <Pressable
                style={styles.selectBtns}
                onPress={() => handleSelection("Books")}
              >
                <Text style={styles.selectText}>Books</Text>
              </Pressable>
              <Pressable
                style={styles.selectBtns}
                onPress={() => handleSelection("Electronics")}
              >
                <Text style={styles.selectText}>Electronics</Text>
              </Pressable>
              <Pressable
                style={styles.selectBtns}
                onPress={() => handleSelection("Furnitures")}
              >
                <Text style={styles.selectText}>Furnitures</Text>
              </Pressable>
              <Pressable
                style={styles.selectBtns}
                onPress={() => handleSelection("Others")}
              >
                <Text style={styles.selectText}>Others</Text>
              </Pressable>
            </ScrollView>
          ) : null}
        </View>

        <View
          style={
            focused == 4 ? styles.inputContainerFocused : styles.inputContainer
          }
        >
          <Ionicons
            name="pricetag-outline"
            size={24}
            color={focused == 4 ? colors.primary : colors.theme}
          />
          <TextInput
            placeholder="asking price"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            onFocus={() => {
              setFocused(4);
              setSelectDrop(false);
            }}
            onBlur={() => setFocused(0)}
            style={focused == 4 ? styles.inputBoxFocused : styles.inputBox}
            onChangeText={(e) => {
              setPrice(e);
              if (e != "") {
                setPriceError("");
              }
            }}
          />
          <Text style={styles.priceUnit}>BDT</Text>
        </View>

        <View style={styles.imageUpload}>
          <View style={styles.iconBtn}>
            <Ionicons name="camera-outline" size={28} color={colors.accent} />
          </View>
          <Text style={{ fontSize: 18, color: colors.theme, marginLeft: 10 }}>
            Add images
          </Text>
        </View>
      </ScrollView>

      <NavigationTab data={navigation} screen="posting" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: colors.accent,
  },
  scrollArea: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height - 130,
    alignItems: "center",
  },
  header: {
    backgroundColor: colors.theme,
    width: "120%",
    height: 75,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    elevation: 5,
  },
  headerText: {
    color: colors.accent,
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    marginTop: 10,
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
  inputArea: {
    marginTop: 20,
    paddingLeft: 5,
    height: 120,
    width: "85%",
    borderColor: colors.theme,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
  },
  inputAreaFocused: {
    marginTop: 20,
    paddingLeft: 5,
    height: 120,
    width: "85%",
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
  },
  areaBox: {
    width: "89%",
    height: "100%",
    marginLeft: 5,
    borderColor: colors.theme,
    borderLeftWidth: 1,
    fontSize: 18,
    paddingLeft: 5,
    textAlignVertical: "top",
  },
  areaBoxFocused: {
    width: "89%",
    height: "100%",
    marginLeft: 5,
    borderColor: colors.primary,
    borderLeftWidth: 1,
    fontSize: 18,
    paddingLeft: 5,
    textAlignVertical: "top",
  },
  selectWrapper: {
    position: "absolute",
    top: -22,
    left: "12%",
    width: "88%",
    backgroundColor: colors.accent,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    elevation: 5,
    paddingHorizontal: 10,
    paddingBottom: 10,
    height: 130,
  },
  selectBtns: {
    paddingVertical: 5,
    marginVertical: 5,
  },
  selectText: {
    fontSize: 18,
  },
  priceUnit: {
    position: "absolute",
    color: colors.theme,
    right: 10,
    top: -10,
    backgroundColor: colors.accent,
    paddingHorizontal: 5,
  },
  imageUpload: {
    marginTop: 20,
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.theme,
    justifyContent: "center",
    alignItems: "center",
  },
  inputMsg: {
    width: "85%",
    paddingLeft: 5,
    color: "tomato",
  },
});

export default PostingScreen;
