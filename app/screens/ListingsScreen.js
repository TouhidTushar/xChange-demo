import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions";
import colors from "../colors";
import NavigationTab from "../components/NavigationTab";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "../components/PostCard";
import { ScrollView, TextInput } from "react-native-gesture-handler";

const SlideInView = (props) => {
  const dim = Dimensions.get("screen").height;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: -dim + 75,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const ListingScreen = ({ navigation, props }) => {
  const postState = useSelector((state) => state.post);
  const posts = useSelector((state) => state.post.posts);
  const categories = useSelector((state) => state.general.categories);
  const locations = useSelector((state) => state.general.locations);
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [filterArray, setFilterArray] = useState([]);
  const [catArray, setCatArray] = useState([]);
  const [locArray, setLocArray] = useState([]);
  const [focused, setFocused] = useState(0);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(0);
  const [priceError, setPriceError] = useState("");
  const [validRange, setValidRange] = useState(false);
  const [checkToggle, setCheckToggle] = useState(false);
  const [filterFlag, setFilterFlag] = useState(false);
  const priceRange = { from: priceFrom, to: priceTo };

  const handleReload = () => {
    setIsFetching(true);
    dispatch(getPosts());
  };

  useEffect(() => {
    if (postState.loading == false) {
      setIsFetching(false);
    }
  }, [postState.loading]);

  useEffect(() => {
    if (priceFrom != 0 && priceTo != 0) {
      if (priceFrom < priceTo) {
        setPriceError("");
        setValidRange(true);
      } else {
        setPriceError("'to' value must be higher than 'from' value");
        setValidRange(false);
      }
    } else {
      if (priceFrom == 0 && priceTo == 0) {
        setPriceError("");
        setValidRange(true);
      } else {
        setPriceError("should set both 'from' and 'to' value");
        setValidRange(false);
      }
    }
  }, [priceFrom, priceTo]);

  const handleCatArray = (option) => {
    var myArray = catArray;
    if (myArray.includes(option)) {
      var index = myArray.indexOf(option);
      myArray.splice(index, 1);
      setCheckToggle(!checkToggle);
    } else {
      myArray.push(option);
      setCheckToggle(!checkToggle);
    }
    setCatArray(myArray);
  };

  const handleLocArray = (option) => {
    var myArray = locArray;
    if (myArray.includes(option)) {
      var index = myArray.indexOf(option);
      myArray.splice(index, 1);
      setCheckToggle(!checkToggle);
    } else {
      myArray.push(option);
      setCheckToggle(!checkToggle);
    }
    setLocArray(myArray);
  };

  const handleFilters = () => {
    var myArray = [];
    var myArrayTwo = [];
    var myArrayThree = [];
    if (validRange) {
      if (catArray.length > 0) {
        catArray.map((cat) => {
          posts.map((item) => {
            if (cat == item.category) {
              myArray.push(item);
            }
          });
        });
      }
      if (catArray.length == 0) {
        myArray = posts;
      }
      if (locArray.length > 0) {
        locArray.map((loc) => {
          myArray.map((item) => {
            if (loc == item.location) {
              myArrayTwo.push(item);
            }
          });
        });
      }
      if (locArray.length == 0) {
        myArrayTwo = myArray;
      }
      if (priceRange.from != 0 && priceRange.to != 0) {
        myArray.map((item) => {
          if (item.price >= priceRange.from && item.price <= priceRange.to) {
            myArrayThree.push(item);
          }
        });
      }
      if (priceRange.from == 0 || priceRange.to == 0) {
        myArrayThree = myArrayTwo;
      }
    } else {
      myArrayThree = posts;
    }
    setFilterArray(myArrayThree);
    setFilterFlag(true);
    setFilterModal(false);
  };

  const clearFilters = () => {
    setCatArray([]);
    setLocArray([]);
    setPriceFrom(0);
    setPriceTo(0);
    setCheckToggle(!checkToggle);
    setFilterArray([]);
    setFilterFlag(false);
    setFilterModal(false);
  };

  return (
    <View style={styles.background}>
      <SlideInView style={styles.header}>
        <Text style={styles.headerText}>Listings</Text>
        {filterModal ? (
          <Pressable
            onPress={() => setFilterModal(false)}
            style={{ position: "absolute", right: 50, bottom: 8 }}
          >
            <Ionicons name="close" size={24} color={colors.accent} />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setFilterModal(true)}
            style={{ position: "absolute", right: 50, bottom: 8 }}
          >
            <Ionicons name="funnel" size={22} color={colors.accent} />
          </Pressable>
        )}
      </SlideInView>

      {/* filtered flatlist */}
      {filterArray.length > 0 ? (
        <>
          <View
            style={{
              height: 75,
            }}
          ></View>
          <FlatList
            data={filterArray}
            renderItem={({ item }) => <PostCard post={item} nav={navigation} />}
            keyExtractor={(item) => item.id}
            refreshing={isFetching}
            onRefresh={handleReload}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              width: Dimensions.get("window").width,
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 45,
            }}
          />
          <View
            style={{
              height: 55,
            }}
          ></View>
        </>
      ) : filterFlag ? (
        <Text style={{ marginTop: 80, fontSize: 18 }}>
          Sorry! No matching items.
        </Text>
      ) : (
        <>
          <View
            style={{
              height: 75,
            }}
          ></View>
          <FlatList
            data={posts}
            renderItem={({ item }) => <PostCard post={item} nav={navigation} />}
            keyExtractor={(item) => item.id}
            refreshing={isFetching}
            onRefresh={handleReload}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              width: Dimensions.get("window").width,
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 45,
            }}
          />
          <View
            style={{
              height: 55,
            }}
          ></View>
        </>
      )}

      {filterModal ? (
        <ScrollView
          style={styles.filterWrapper}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: 10 }}></View>

          <View style={styles.filterCaption}>
            <Ionicons name="funnel" size={22} color={colors.primary} />
            <Text
              style={{ fontSize: 20, marginLeft: 5, color: colors.primary }}
            >
              Filter listings
            </Text>
          </View>

          {/* categories */}
          <View style={styles.filterBox}>
            <Text style={styles.filterTitle}>Categories:</Text>
            {categories.map((cat, index) => {
              return (
                <Pressable
                  key={cat.name + index}
                  style={styles.optionBtn}
                  onPress={() => handleCatArray(cat.name)}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      width: 27,
                      height: 27,
                      borderRadius: 5,
                      backgroundColor: catArray.includes(cat.name)
                        ? colors.theme
                        : colors.accent,
                      borderColor: catArray.includes(cat.name)
                        ? colors.theme
                        : colors.contrast,
                    }}
                  >
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color={colors.accent}
                    />
                  </View>
                  <Text style={styles.optionText}>{cat.name}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* locations */}
          <View style={styles.filterBox}>
            <Text style={styles.filterTitle}>Locations:</Text>
            {locations.map((loc, index) => {
              return (
                <Pressable
                  key={loc.name + index}
                  style={styles.optionBtn}
                  onPress={() => handleLocArray(loc.name)}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      width: 27,
                      height: 27,
                      borderRadius: 5,
                      backgroundColor: locArray.includes(loc.name)
                        ? colors.theme
                        : colors.accent,
                      borderColor: locArray.includes(loc.name)
                        ? colors.theme
                        : colors.contrast,
                    }}
                  >
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color={colors.accent}
                    />
                  </View>
                  <Text style={styles.optionText}>{loc.name}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* price */}
          <View>
            <Text style={styles.filterTitle}>Price range:</Text>
            {priceError == "" ? null : (
              <Text style={{ fontSize: 16, marginBottom: 3 }}>
                {priceError}
              </Text>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="from"
                keyboardType="numeric"
                onFocus={() => setFocused(1)}
                onBlur={() => setFocused(0)}
                style={{
                  ...styles.inputs,
                  borderColor: focused == 1 ? colors.theme : colors.contrast,
                }}
                onChangeText={(e) => {
                  setPriceFrom(parseInt(e));
                  if (e == "") {
                    setPriceFrom(0);
                  }
                }}
              />

              <TextInput
                placeholder="to"
                keyboardType="numeric"
                onFocus={() => setFocused(2)}
                onBlur={() => setFocused(0)}
                style={{
                  ...styles.inputs,
                  borderColor: focused == 2 ? colors.theme : colors.contrast,
                }}
                onChangeText={(e) => {
                  setPriceTo(parseInt(e));
                  if (e == "") {
                    setPriceTo(0);
                  }
                }}
              />
            </View>
          </View>
          <View style={{ height: 20 }}></View>
        </ScrollView>
      ) : null}

      {filterModal ? (
        <View style={styles.filterBtnContainer}>
          <Pressable onPress={handleFilters}>
            <Text style={styles.filterBtns}>Apply</Text>
          </Pressable>
          <Pressable onPress={clearFilters}>
            <Text style={styles.filterBtns}>Clear</Text>
          </Pressable>
        </View>
      ) : null}
      <NavigationTab data={navigation} screen="listings" />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.accent,
    alignItems: "center",
  },
  header: {
    backgroundColor: colors.theme,
    width: "120%",
    height: Dimensions.get("screen").height,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    elevation: 5,
    position: "absolute",
  },
  headerText: {
    color: colors.accent,
    fontSize: 16,
  },
  filterWrapper: {
    width: Dimensions.get("screen").width,
    height: 360,
    backgroundColor: colors.accent,
    position: "absolute",
    top: 75,
    left: 0,
    elevation: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 10,
  },
  filterCaption: {
    flexDirection: "row",
    alignItems: "center",
    color: colors.accent,
    marginBottom: 20,
  },
  filterBtnContainer: {
    position: "absolute",
    top: 85,
    right: 5,
    elevation: 5,
    flexDirection: "row",
  },
  filterBtns: {
    fontSize: 18,
    backgroundColor: colors.secondary,
    color: colors.contrast,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  filterBox: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: colors.theme,
  },
  optionBtn: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "center",
    marginLeft: 15,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 3,
  },
  inputContainer: {
    flexDirection: "row",
  },
  inputs: {
    width: 120,
    height: 35,
    fontSize: 16,
    paddingLeft: 5,
    marginRight: 20,
    borderRadius: 5,
    borderWidth: 1,
  },
});

export default ListingScreen;
