import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Slider = ({ item }) => {
  return (
    <View style={styles.cardView}>
      <Image style={[styles.image, { height: width * 0.4 }]} source={{ uri: item.image }} />
      {/* <View style={styles.textView}></View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    width: width - 20,
    // height: height / 4.5,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },

  textView: {
    position: "absolute",
    bottom: 10,
    margin: 10,
    left: 5,
  },
  image: {
    width: "100%",
    // width: width - 20,
    // height: height / 3,
    borderRadius: 10,
    resizeMode: "stretch",
  },
});

export default Slider;