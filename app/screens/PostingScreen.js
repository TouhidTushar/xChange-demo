import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";
import NavigationTab from "../components/NavigationTab";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { newPost } from "../actions";
import { useDispatch } from "react-redux";

const SlideView = (props) => {
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").width * 0.85,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [slideAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        width: slideAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const DelayedView = (props) => {
  const delayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(delayAnim, {
      toValue: 1,
      delay: 500,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [delayAnim]);

  return (
    <Animated.View
      style={{
        marginHorizontal: 8,
        flexDirection: "row",
        transform: [{ scale: delayAnim }],
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const PostingScreen = ({ navigation, props }) => {
  const dispatch = useDispatch();
  const [selectDrop, setSelectDrop] = useState(false);
  const [focused, setFocused] = useState(0);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("--select a category--");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const [itemNameError, setItemNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [imageError, setImageError] = useState("");
  const [camClicked, setCamClicked] = useState(false);
  const [imageCount, setImageCount] = useState(0);

  const postData = { itemName, category, price, description, images };

  const handlePost = () => {
    if (
      itemName.length >= 3 &&
      category != "--select a category--" &&
      price != 0 &&
      description != "" &&
      images.length > 0
    ) {
      dispatch(newPost(postData));
    } else {
      if (itemName.length < 3) {
        setItemNameError("use at least 3 characters");
      }
      if (category == "--select a category--") {
        setCategoryError("must select a category");
      }
      if (price == 0) {
        setPriceError("must set a price");
      }
      if (description == "") {
        setDescriptionError("write a few words about the item");
      }
      if (images.length == 0) {
        setImageError("must select at least one image");
      }
    }
  };

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
    setCategoryError("");
    setCategory(data);
    setSelectDrop(false);
    setFocused(0);
  };

  const handleImage = async () => {
    if (imageCount < 5) {
      let imageArray = images;
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        let imageObj = {
          image: result.uri,
          filename: result.uri.substr(result.uri.lastIndexOf("/") + 1),
        };
        imageArray.push(imageObj);
        setImages(imageArray);
        setImageCount(imageCount + 1);
        setImageError("");
      }
    } else {
      alert("Sorry, maximum 5 images are allowed!");
    }
  };

  const handlePermission = () => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, permission is required to upload images!");
        } else {
          handleImage();
        }
      }
    })();
    setCamClicked(false);
  };

  const handleCamClick = () => {
    if (camClicked) {
      setCamClicked(false);
    } else {
      setCamClicked(true);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create post</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          ...styles.scrollArea,
          height:
            itemNameError == "" &&
            categoryError == "" &&
            priceError == "" &&
            descriptionError == "" &&
            imageError == ""
              ? Dimensions.get("window").height - 55
              : Dimensions.get("window").height,
        }}
      >
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

        {itemNameError === "" ? null : (
          <Text style={styles.inputMsg}>{itemNameError}</Text>
        )}

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
                fontSize: categoryError === "" ? 18 : 14,
                paddingTop: 2,
                color: colors.contrast,

                opacity:
                  categoryError === ""
                    ? category == "--select a category--"
                      ? 0.4
                      : 1
                    : 1,
              }}
            >
              {categoryError === "" ? category : categoryError}
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
              setDescription(e);
              if (e != "") {
                setDescriptionError("");
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

        {descriptionError === "" ? null : (
          <Text style={styles.inputMsg}>{descriptionError}</Text>
        )}

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

        {priceError === "" ? null : (
          <Text style={styles.inputMsg}>{priceError}</Text>
        )}

        {camClicked ? null : (
          <Pressable style={styles.imageUpload} onPress={handleCamClick}>
            <View style={styles.iconBtn}>
              <Ionicons name="camera-outline" size={28} color={colors.accent} />
            </View>
            <Text style={{ fontSize: 18, color: colors.theme, marginLeft: 10 }}>
              Add images
            </Text>
          </Pressable>
        )}

        {camClicked ? (
          <View style={styles.imageUpload}>
            <SlideView style={styles.iconBtnDrop}>
              <DelayedView>
                <Pressable
                  onPress={handlePermission}
                  style={{ flexDirection: "row" }}
                >
                  <Ionicons
                    name="folder-open"
                    size={20}
                    color={colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.theme,
                      marginLeft: 3,
                    }}
                  >
                    choose from files
                  </Text>
                </Pressable>
              </DelayedView>

              <DelayedView>
                <Pressable
                  // onPress={handlePermission}
                  style={{ flexDirection: "row" }}
                >
                  <Ionicons name="camera" size={20} color={colors.primary} />
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.theme,
                      marginLeft: 3,
                    }}
                  >
                    take photo
                  </Text>
                </Pressable>
              </DelayedView>

              <Pressable style={styles.iconBtn} onPress={handleCamClick}>
                <Ionicons
                  name="chevron-back-outline"
                  size={28}
                  color={colors.accent}
                />
              </Pressable>
            </SlideView>
          </View>
        ) : null}

        {imageError === "" ? null : (
          <Text style={styles.inputMsg}>{imageError}</Text>
        )}

        {images.length > 0 ? (
          <View
            style={{
              width: "85%",
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 15,
            }}
          >
            {images.map((item, index) => (
              <Image
                key={index}
                source={{ uri: item.image }}
                style={styles.imgBox}
              />
            ))}
            {images.length < 5 ? (
              <Pressable style={styles.extraImg} onPress={handlePermission}>
                <Ionicons name="add-outline" size={40} color={colors.primary} />
                <Text>add more</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <Pressable onPress={handlePost} style={styles.postBtn}>
          <Text style={styles.btnText}>post</Text>
        </Pressable>
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
    fontSize: 18,
    marginTop: 5,
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
    elevation: 1,
  },
  iconBtnDrop: {
    height: 50,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  inputMsg: {
    width: "85%",
    paddingLeft: 5,
    color: colors.primary,
  },
  postBtn: {
    backgroundColor: colors.primary,
    width: "85%",
    height: 40,
    marginTop: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    color: colors.accent,
  },
  imgBox: {
    width: 100,
    height: 75,
    margin: 5,
    borderRadius: 5,
  },
  extraImg: {
    width: 100,
    height: 75,
    margin: 5,
    borderColor: colors.theme,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});

export default PostingScreen;
