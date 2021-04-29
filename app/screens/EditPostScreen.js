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
  BackHandler,
} from "react-native";
import colors from "../colors";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import NavigationTab from "../components/NavigationTab";
import { ScrollView } from "react-native-gesture-handler";
import { updatePost } from "../actions";

//animation 1
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

//animation 2
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

const EditPostScreen = ({ route, navigation, props }) => {
  const { item } = route.params;
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.general.categories);
  const locations = useSelector((state) => state.general.locations);
  const [focused, setFocused] = useState(0);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("--select a category--");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("--set item location--");
  const [images, setImages] = useState([]);
  const [tempImages, setTempImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [itemNameError, setItemNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageCount, setImageCount] = useState(0);
  const [catDrop, setCatDrop] = useState(false);
  const [locDrop, setLocDrop] = useState(false);
  const [camClicked, setCamClicked] = useState(false);
  const [discardWarning, setDiscardWarning] = useState(false);

  const postData = {
    itemName,
    category,
    price,
    description,
    location,
    navigation,
  };

  useEffect(() => {
    var tempArray = [];
    var oldArray = [];
    setItemName(item.itemName);
    setCategory(item.category);
    setDescription(item.description);
    setLocation(item.location);
    setPrice(item.price);
    setImages(item.images);
    setImageCount(item.images.length);
    item.images.map((img) => {
      tempArray.push(img);
      oldArray.push(img);
    });
    setTempImages(tempArray);
    setOldImages(oldArray);
  }, []);

  //back button handler
  useEffect(() => {
    if (
      itemName === "" &&
      category === "--select a category--" &&
      price === 0 &&
      description === "" &&
      location === "--set item location--" &&
      imageCount == 0
    ) {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    } else {
      BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    }
    return () =>
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
  }, [itemName, category, price, description, location, imageCount]);

  const handleBackButtonClick = () => {
    setDiscardWarning(true);
    return true;
  };

  const handleUpdate = () => {
    if (
      itemName.length >= 3 &&
      category != "--select a category--" &&
      price != 0 &&
      description != "" &&
      location != "--set item location--" &&
      imageCount > 0
    ) {
      var dataObj = { ...postData, tempImages, id: item.id };
      dispatch(updatePost(dataObj));
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
      if (location == "--set item location--") {
        setLocationError("must set the location");
      }
      if (imageCount == 0) {
        setImageError("must select at least one image");
      }
    }
  };

  const handleCat = () => {
    if (catDrop) {
      setCatDrop(false);
      setFocused(0);
    } else {
      setCatDrop(true);
      setFocused(2);
    }
  };

  const handleCatSelection = (data) => {
    setCategoryError("");
    setCategory(data);
    setCatDrop(false);
    setFocused(0);
  };

  const handleLoc = () => {
    if (locDrop) {
      setLocDrop(false);
      setFocused(0);
    } else {
      setLocDrop(true);
      setFocused(4);
    }
  };

  const handleLocSelection = (data) => {
    setLocationError("");
    setLocation(data);
    setLocDrop(false);
    setFocused(0);
  };

  const handleRemoveImage = (data) => {
    var tempArray = tempImages;
    tempArray.map((item, index) => {
      if (item.image == data) {
        tempArray.splice(index, 1);
        setImageCount(imageCount - 1);
      }
    });
    setTempImages(tempArray);
  };

  const handleImage = async () => {
    if (imageCount < 5) {
      let imageArray = tempImages;
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        let _name = uuidv4() + ".jpg";
        let imageObj = {
          image: result.uri,
          filename: _name,
        };
        imageArray.push(imageObj);
        setTempImages(imageArray);
        setImageCount(imageCount + 1);
        setImageError("");
      }
    } else {
      alert("Sorry, maximum 5 images are allowed!");
    }
  };

  const handleCamera = async () => {
    if (imageCount < 5) {
      let imageArray = tempImages;
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        let _name = uuidv4() + ".jpg";
        let imageObj = {
          image: result.uri,
          filename: _name,
        };
        imageArray.push(imageObj);
        setTempImages(imageArray);
        setImageCount(imageCount + 1);
        setImageError("");
      }
    } else {
      alert("Sorry, maximum 5 images are allowed!");
    }
  };

  const handleLibPermission = () => {
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

  const handleCamPermission = () => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, permission is required to take photos!");
        } else {
          handleCamera();
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

  const resetState = () => {
    setItemName(item.itemName);
    setCategory(item.category);
    setDescription(item.description);
    setLocation(item.location);
    setPrice(item.price);
    setTempImages([]);
    setImageCount(0);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          onPress={
            itemName == "" &&
            category == "--select a category--" &&
            price == 0 &&
            description == "" &&
            location == "--set item location--" &&
            imageCount == 0
              ? () => navigation.goBack()
              : () => setDiscardWarning(true)
          }
          style={{ position: "absolute", left: 10, bottom: 8 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color={colors.accent} />
        </Pressable>
        <Text style={styles.headerText}>Edit post</Text>
      </View>

      {/* scrollable input area */}
      <ScrollView
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Post an item for listing</Text>

        {/* itemname input */}
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
            maxLength={32}
            value={itemName}
            onFocus={() => {
              setFocused(1);
              setCatDrop(false);
              setLocDrop(false);
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

        {/* category select */}
        <Pressable
          onPress={handleCat}
          style={
            focused == 2
              ? { ...styles.inputContainerFocused, paddingVertical: 5 }
              : { ...styles.inputContainer, paddingVertical: 5 }
          }
        >
          <Ionicons
            name={
              catDrop == false ? "chevron-down-outline" : "chevron-up-outline"
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

        {catDrop ? (
          <ScrollView
            style={styles.selectWrapper}
            showsVerticalScrollIndicator={false}
          >
            {categories.map((item, index) => {
              return (
                <Pressable
                  key={item.name + index}
                  style={styles.selectBtns}
                  onPress={() => handleCatSelection(item.name)}
                >
                  <Text style={styles.selectText}>{item.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}

        {/* description box */}
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
            value={description}
            onFocus={() => {
              setFocused(3);
              setCatDrop(false);
              setLocDrop(false);
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
        </View>

        {descriptionError === "" ? null : (
          <Text style={styles.inputMsg}>{descriptionError}</Text>
        )}

        {/* location select */}
        <Pressable
          onPress={handleLoc}
          style={
            focused == 4
              ? { ...styles.inputContainerFocused, paddingVertical: 5 }
              : { ...styles.inputContainer, paddingVertical: 5 }
          }
        >
          <Ionicons
            name="location-outline"
            size={24}
            color={focused == 4 ? colors.primary : colors.theme}
          />
          <View style={focused == 4 ? styles.areaBoxFocused : styles.areaBox}>
            <Text
              style={{
                fontSize: locationError === "" ? 18 : 14,
                paddingTop: 2,
                color: colors.contrast,

                opacity:
                  locationError === ""
                    ? location == "--set item location--"
                      ? 0.4
                      : 1
                    : 1,
              }}
            >
              {locationError === "" ? location : locationError}
            </Text>
          </View>
        </Pressable>

        {locDrop ? (
          <ScrollView
            style={styles.selectWrapper}
            showsVerticalScrollIndicator={false}
          >
            {locations.map((item, index) => {
              return (
                <Pressable
                  key={item.name + index}
                  style={styles.selectBtns}
                  onPress={() => handleLocSelection(item.name)}
                >
                  <Text style={styles.selectText}>{item.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}

        {/* price input */}
        <View
          style={
            focused == 5 ? styles.inputContainerFocused : styles.inputContainer
          }
        >
          <Ionicons
            name="pricetag-outline"
            size={24}
            color={focused == 5 ? colors.primary : colors.theme}
          />
          <TextInput
            placeholder="asking price"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            value={price.toString()}
            onFocus={() => {
              setFocused(5);
              setCatDrop(false);
              setLocDrop(false);
            }}
            onBlur={() => setFocused(0)}
            style={focused == 5 ? styles.inputBoxFocused : styles.inputBox}
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

        {/* image input */}
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
                  onPress={handleLibPermission}
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
                  onPress={handleCamPermission}
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

        {/* selected images */}
        {tempImages.length > 0 ? (
          <View
            style={{
              width: "85%",
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 15,
            }}
          >
            {tempImages.map((item, index) => (
              <View key={index}>
                <Image source={{ uri: item.image }} style={styles.imgBox} />
                <Pressable
                  onPress={() => handleRemoveImage(item.image)}
                  style={{ position: "absolute", right: 0, top: 0 }}
                >
                  <Ionicons name="close-circle" size={22} color="tomato" />
                </Pressable>
              </View>
            ))}
            {tempImages.length < 5 ? (
              <Pressable style={styles.extraImg} onPress={handleLibPermission}>
                <Ionicons name="add-outline" size={40} color={colors.primary} />
                <Text>add more</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {/* post button */}
        <Pressable onPress={handleUpdate} style={styles.postBtn}>
          <Text style={styles.btnText}>
            {item.flag == "post" ? "update" : "post"}
          </Text>
        </Pressable>
        <View style={{ height: 45 }}></View>
      </ScrollView>
      <View style={{ height: 55 }}></View>

      {/* bottom navbar */}
      <NavigationTab
        data={navigation}
        action={() => setDiscardWarning(true)}
        screen={
          itemName == "" &&
          category == "--select a category--" &&
          price == 0 &&
          description == "" &&
          location == "--set item location--" &&
          imageCount == 0
            ? "posting"
            : "postingAlt"
        }
      />

      {/* discard modal */}
      {discardWarning ? (
        <>
          <Pressable
            style={styles.discardWrapper}
            onPress={() => setDiscardWarning(false)}
          ></Pressable>
          <View style={styles.discardModal}>
            <Text
              style={{ fontSize: 20, marginBottom: 35, color: colors.accent }}
            >
              Do you want to discard your changes?
            </Text>
            <Pressable
              style={{ marginBottom: 15 }}
              onPress={() => {
                setDiscardWarning(false);
                resetState();
                navigation.goBack();
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="trash-outline" size={20} color="tomato" />
                <Text style={{ fontSize: 18, color: "tomato" }}>discard</Text>
              </View>
            </Pressable>
            <Pressable
              style={{ marginBottom: 15 }}
              onPress={() => {
                setDiscardWarning(false);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="checkmark-outline"
                  size={20}
                  color={colors.theme}
                />
                <Text style={{ fontSize: 18, color: colors.theme }}>
                  continue editing
                </Text>
              </View>
            </Pressable>
          </View>
        </>
      ) : null}
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
    width: "100%",
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
    width: "72%",
    backgroundColor: colors.accent,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    elevation: 5,
    marginLeft: "9%",
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
  discardWrapper: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.contrast,
    opacity: 0.7,
    elevation: 10,
  },
  discardModal: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.contrast,
    justifyContent: "space-around",
    padding: 15,
    elevation: 11,
  },
});

export default EditPostScreen;
