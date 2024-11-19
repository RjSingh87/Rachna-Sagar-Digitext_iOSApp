import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, } from 'react-native'
import React, { useState } from 'react'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import { rsplTheme } from '../constant'
import LinearGradient from 'react-native-linear-gradient'
import Banner from './Banner'
import NewReleases from './NewReleases'
import NoInternetConn from './NoInternetConn'


const WelcomStore = () => {
  const navigation = useNavigation()

  const [showStore, setShowStore] = useState(true)



  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/menu.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        // title={showStore ? "Rachna Sagar DigiText" : "NEW RELEASES"}
        title={"Rachna Sagar DigiText"}
        onClickLeftIcon={() => { navigation.openDrawer(); }}
        onClickRightIcon={() => { return }}
      />
      <NoInternetConn />


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

          <View style={styles.storeImgBox}>
            <Image style={styles.storeImg} source={require("../assets/icons/storeImg.png")} />
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
    backgroundColor: rsplTheme.rsplWhite
  },
  banner: {
    width: "100%",
    height: 210,
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
  }
})