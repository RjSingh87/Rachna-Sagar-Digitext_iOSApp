import { StyleSheet, Text, View, Animated, TouchableOpacity, Image, ScrollView, } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import { rsplTheme } from '../constant'
import LinearGradient from 'react-native-linear-gradient'
import Banner from './Banner'
// import NewReleases from './NewReleases'
import NoInternetConn from './NoInternetConn'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import BreakingNews from './BreakingNews'


const WelcomStore = () => {
  const navigation = useNavigation()

  const flipAnim = useRef(new Animated.Value(0)).current; // Initial animated value

  useEffect(() => {
    // Define flipping animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 1000, // Flip duration
          useNativeDriver: true,
        }),
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 1000, // Flip back duration
          useNativeDriver: true,
        }),
      ])
    ).start(); // Start the animation loop
  }, [flipAnim]);

  // Interpolate the flip animation value
  const flipInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Rotate from 0 to 180 degrees
  });



  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/menu.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        // title={showStore ? "Rachna Sagar DigiText" : "NEW RELEASES"}
        // title={" RACHNA SAGAR PVT. LTD."}
        onClickLeftIcon={() => { navigation.openDrawer(); }}
        onClickRightIcon={() => { return }}
      />
      <NoInternetConn />

      <View style={{ position: "absolute", top: 8, left: 55, width: "82%", }}>
        {/* <Image style={{ width: 25, height: 25, resizeMode: "contain" }} source={require("../assets/RSPL.png")} /> */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
          <View style={{ width: 35, height: 35, borderRadius: 35 / 2, alignItems: "center", justifyContent: "center", backgroundColor: rsplTheme.rsplWhite }}>
            <Animated.Image
              source={require('../assets/RSPL.png')}
              style={[styles.image,
                // {
                //   transform: [{ rotateY: flipInterpolate }],
                // },
              ]}
            />
          </View>
          <BreakingNews />
        </View>
      </View>


      {/* 
      <View style={{ position: "absolute", left: 113, borderWidth: 1, top: 10, right: 0, width: "70%" }}>
        <BreakingNews />
      </View> */}



      <View style={{ flex: 1, }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.banner}>
            <Banner />
          </LinearGradient>

          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.wlcmStore}>
            <TouchableOpacity style={styles.wlcmBox} onPress={(() => { navigation.navigate("NewReleases") })}>
              <Text style={styles.wlcmStoreTxt}>Welcome to {`\n`} store</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* old UI design */}
          {/* <View style={styles.storeImgBox}>
            <Image style={styles.storeImg} source={require("../assets/icons/storeImg.png")} />
          </View> */}


          <View style={{ flex: 1, padding: 10, justifyContent: "center", }}>
            <View style={{ flexDirection: "row", padding: 10, justifyContent: "space-between" }}>

              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={{ width: "47%", alignSelf: "center", borderRadius: 15, }}>
                <TouchableOpacity onPress={(() => { navigation.navigate("Filter", { "screenId": 1, "screenName": "Filter" }) })} style={{ height: 150, justifyContent: "space-evenly", alignItems: "center", padding: 15, borderRadius: 20, }}>
                  <MaterialIcons name="category" size={45} color={rsplTheme.rsplWhite} />
                  <Text style={{ fontWeight: 500, color: rsplTheme.rsplWhite, fontSize: 20, textAlign: "center" }}>Shop By Category</Text>
                </TouchableOpacity>
              </LinearGradient>

              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={{ width: "47%", alignSelf: "center", borderRadius: 15, }}>
                <TouchableOpacity onPress={(() => { navigation.navigate("NewReleases") })} style={{ height: 150, justifyContent: "space-evenly", alignItems: "center", padding: 15, borderRadius: 20, }}>
                  <Entypo name="new" size={45} color={rsplTheme.rsplWhite} />
                  <Text style={{ fontWeight: 500, color: rsplTheme.rsplWhite, fontSize: 20, textAlign: "center" }}>New Release</Text>
                </TouchableOpacity>
              </LinearGradient>


            </View>

            <View style={{ flexDirection: "row", padding: 10, justifyContent: "space-between" }}>

              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={{ width: "47%", alignSelf: "center", borderRadius: 15, }}>
                <TouchableOpacity onPress={(() => { navigation.navigate("AllTitleView") })} style={{ height: 150, justifyContent: "space-evenly", alignItems: "center", padding: 15, borderRadius: 20, }}>
                  <MaterialIcons name="menu-book" size={45} color={rsplTheme.rsplWhite} />
                  <Text style={{ fontWeight: 500, color: rsplTheme.rsplWhite, fontSize: 20, textAlign: "center" }}>All Books</Text>
                </TouchableOpacity>
              </LinearGradient>

              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={{ width: "47%", alignSelf: "center", borderRadius: 15, }}>
                <TouchableOpacity onPress={(() => { navigation.navigate("BooksellerStatewise") })} style={{ height: 150, justifyContent: "space-evenly", alignItems: "center", padding: 15, borderRadius: 20, }}>
                  <Ionicons name="location" size={45} color={rsplTheme.rsplWhite} />
                  <Text style={{ fontWeight: 500, color: rsplTheme.rsplWhite, fontSize: 20, textAlign: "center" }}>Bookseller</Text>
                </TouchableOpacity>
              </LinearGradient>

            </View>
          </View>




        </ScrollView>
      </View>
      {/* <NewReleases /> */}


    </View>
  )
}

export default WelcomStore

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite,
    paddingBottom: 60
  },
  banner: {
    width: "100%",
    height: 225,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: "center",
    // alignItems: "center",
    marginBottom: 20,
  },
  wlcmBox: {
    width: "100%",
    // borderWidth:1.5,
    padding: 10,
    borderRadius: 50,
    backgroundColor: rsplTheme.rsplWhite
  },

  linearGradient: {
    // flex: 1,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  wlcmStoreTxt: {
    fontSize: 20,
    fontWeight: "700",
    textTransform: "uppercase",
    color: rsplTheme.textColorBold,
    textAlign: "center",
  },
  wlcmStore: {
    width: "95%",
    padding: 5,
    borderRadius: 50,
    // alignItems: "center"
    alignSelf: "center"
  },
  storeImgBox: {
    // width: "100%",
    height: 200,
    marginTop: 20,
    // marginBottom: 70,

    // borderWidth: 1,
  },
  storeImg: {
    width: "100%",
    height: "100%",
    // aspectRatio: 0.9,
    resizeMode: "contain",
  },
  bannerBox: {
    backgroundColor: rsplTheme.rsplWhite,
    width: "90%",
    // height:450,
    // bottom:0,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  image: {
    width: 28,
    height: 28,
    borderRadius: 8,
    resizeMode: "contain"
  }
})