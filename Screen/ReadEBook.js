import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Header from '../comman/Header';
import { useNavigation } from '@react-navigation/native';
import { rsplTheme } from '../constant';
import LinearGradient from 'react-native-linear-gradient'
import NoInternetConn from './NoInternetConn';

const ReadEBook = () => {
  const navigation = useNavigation()

  const getEbookList = () => {
    navigation.navigate("EbookList")
  }
  const getInteractiveEbook = () => {
    navigation.navigate("InteractiveEbookList")
  }



  return (
    <View style={styles.continer}>
      <Header
        leftIcon={require("../assets/icons/menu.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Read eBook"}
        onClickLeftIcon={() => { navigation.openDrawer(); }}
      />

      <NoInternetConn />

      <View style={styles.viewContainer}>
        <TouchableOpacity onPress={(() => { getEbookList() })} style={styles.eBookRow}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.eBook}>
            <Text style={styles.eBookHeading}>Ebook</Text>
            <Text style={styles.eBookText}>Tap to download and read e-book</Text>
          </LinearGradient>
          <View style={styles.interactiveBook}>
            <Image style={styles.eBookLogo} source={require("../assets/icons/eBookLogo.png")} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={(() => { getInteractiveEbook() })} style={styles.eBookRow}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.eBook}>
            <Text style={styles.eBookHeading}>INTERACTIVE Ebook</Text>
            <Text style={styles.eBookText}>Tap to download and interactive Ebook</Text>
          </LinearGradient>
          <View style={styles.interactiveBook}>
            <Image style={styles.eBookLogo} source={require("../assets/icons/interactiveBookLogo.png")} />
          </View>
        </TouchableOpacity>
      </View>




    </View>
  )
}

export default ReadEBook

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite
  },
  viewContainer: {
    margin: 15,

  },
  eBookRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1.5,
    borderColor: rsplTheme.gradientColorRight,
    borderRadius: 12,
    marginBottom: 15,
  },
  eBook: {
    width: "60%",
    padding: 20,
    borderRadius: 10,
    // alignItems: "center",
    // justifyContent: "center",
  },
  eBookLogo: {
    width: "100%",
    height: 100,
    resizeMode: "center"
  },
  eBookHeading: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 5,
    color: rsplTheme.rsplWhite
  },
  eBookText: {
    fontSize: 18,
    fontWeight: "300",
    color: rsplTheme.rsplWhite
  },
  interactiveBook: {
    width: "40%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  }

})