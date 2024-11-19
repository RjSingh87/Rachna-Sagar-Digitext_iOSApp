import React, { useState } from 'react';
import { View, FlatList, Dimensions, Text, Modal, StyleSheet, Image, PanResponder, Animated, TouchableOpacity } from 'react-native';
import { rsplTheme } from '../constant';
import NoInternetConn from './NoInternetConn';
import Icon from 'react-native-vector-icons/AntDesign';

const SwipeDownModal = ({ modalView, setModalView, image }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const panY = new Animated.Value(0);
  const { width, height } = Dimensions.get("window")
  const [currentIndex, setCurrentIndex] = useState(0)

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      panY.setValue(gestureState.dy);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        // Swipe down threshold
        setModalView(false);
        Animated.timing(panY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(panY, {
          toValue: 0,
          tension: 10,
          friction: 5,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const translateY = panY.interpolate({
    inputRange: [0, 300], // Adjust the range as needed
    outputRange: [0, 300], // Adjust the output range as needed
    extrapolate: 'clamp',
  });

  const showModal = () => {
    setModalView(true);
    Animated.timing(panY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const hideModal = () => {
    setModalView(false);
    Animated.timing(panY, {
      toValue: 300, // Adjust the value based on your modal height
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const ImageView = ({ img }) => {
    return (
      <View style={{ width: width, justifyContent: "center", alignItems: "center", backgroundColor: rsplTheme.white }}>
        {/* {loading && <View style={styles.loader}><Loader text='Image loading...' /></View>} */}

        <Image
          // onLoad={() => setLoading(false)}
          // onError={() => { setLoading(false) }}
          style={{ width: "100%", minHeight: "100%", resizeMode: "contain", }}
          src={img} />
      </View>
    )
  }




  return (
    <View>
      <Modal
        transparent
        animationType="slide"
        visible={modalView}
        onRequestClose={hideModal}
      >
        <Animated.View
          // {...panResponder.panHandlers}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            transform: [{ translateY }],
          }}
        >

          <View style={{ padding: 0, }}>

            <View style={{ height: height, backgroundColor: rsplTheme.rsplWhite, }}>
              <FlatList
                data={image}
                renderItem={({ item, index }) => <ImageView img={item} />}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={e => {
                  const offsetVal = e.nativeEvent.contentOffset.x
                  setCurrentIndex((offsetVal / width).toFixed(0))
                }}
              />
              {/* image scroll gesture view */}
              <View style={{ flexDirection: "row", width: width, marginBottom: 20, justifyContent: "center", alignItems: "center" }}>
                {image?.map((item, index) => {
                  return (
                    <View key={index}
                      style={[styles.imgView, { borderColor: currentIndex == index ? rsplTheme.rsplBackgroundColor : rsplTheme.rsplWhite }]}>
                      <Image style={{ width: 80, height: 80, resizeMode: "center" }} src={item} />
                    </View>
                  )
                })}
              </View>
            </View>

            <NoInternetConn />

            <TouchableOpacity style={{ position: "absolute", top: "6%", left: "2%" }} onPress={hideModal}>
              {/* <Image style={{ width: 35, height: 35, resizeMode: "center" }} source={require("../assets/icons/close.png")} /> */}
              <Icon name="close" size={30} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default SwipeDownModal;

const styles = StyleSheet.create({
  imgView: {
    width: 100,
    height: 100,
    borderRadius: 6,
    borderWidth: .5,
    borderColor: rsplTheme.jetGrey,
    marginLeft: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,

  },
})