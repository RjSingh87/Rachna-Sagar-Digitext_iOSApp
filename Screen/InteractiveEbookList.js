import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, FlatList, Dimensions, RefreshControl, } from 'react-native'
import React, { useEffect, useState, useCallback, memo } from 'react'
import { apiRoutes, rsplTheme, token } from '../constant';
import Header from '../comman/Header';
import { useNavigation } from '@react-navigation/native';
import Services from '../services';
import Loader from '../constant/Loader';

const { width, height } = Dimensions.get("window")

const InteractiveEbookList = () => {
  const navigation = useNavigation()
  const [interactiveBookList, setInteractiveBookList] = useState({ data: [], loaderStatus: false, message: "" })

  useEffect(() => {
    // interactiveBookListing()
  }, [])

  const onRefresh = useCallback(() => {
    setInteractiveBookList((prev) => { return { ...prev, loaderStatus: true } })
    setTimeout(() => {
      interactiveBookListing()
      setInteractiveBookList((prev) => { return { ...prev, loaderStatus: false } })
    }, 1000);
  }, [interactiveBookList.loaderStatus])

  const interactiveBookListing = async () => {
    setInteractiveBookList((prev) => { return { ...prev, loaderStatus: true } }) // for loader true
    const payload = {
      "api_token": token,
      "userID": "13" // when user logging successfully then get userID dynamically.
    }
    await Services.post(apiRoutes.interactiveBookList, payload)
      .then((res) => {
        if (res.status === "success" && res.result.length != 0) {
          setInteractiveBookList((prev) => { return { ...prev, data: res.result, loaderStatus: true } })
        } else {
          Alert.alert("Info", res.message)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setInteractiveBookList((prev) => { return { ...prev, loaderStatus: false } }) })

  }

  if (interactiveBookList.loaderStatus) {
    return (
      <View style={styles.loader}>
        <Loader text='Loading...' />
      </View>
    )
  }


  const interactiveRenderItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={item.id} style={styles.productItem}>
        <Image style={styles.eBookImage} source={{ uri: item.full_image_path }} />
        <Text style={styles.eBookTitleName} numberOfLines={2}>{item.zip_title}</Text>
      </TouchableOpacity>
    )
  }




  return (
    <View sltye={styles.mainContainer}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Interactive Book"}
        onClickLeftIcon={() => { navigation.goBack(); }}
      />

      <View style={styles.listContainer}>
        <Text style={{ alignSelf: "center", justifyContent: "center" }}>Coming soon...</Text>
        {/* <FlatList
          data={interactiveBookList?.data}
          renderItem={interactiveRenderItem}
          // keyExtractor={(item, index) => { index.toString() }}
          numColumns={2} // Display 2 items in a row
          onEndReachedThreshold={0.1} // Trigger onEndReached when the end is reached at 90% of the list
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={interactiveBookList.loaderStatus}
              onRefresh={onRefresh}
            />
          }
        /> */}
      </View>
    </View>
  )
}

export default InteractiveEbookList

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite
  },
  loader: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  listContainer: {
    // flex: 1,
    padding: 8,
    height: height - 132,
    // marginBottom: "25%",
    backgroundColor: rsplTheme.rsplWhite
  },
  productItem: {
    flex: 1,
    margin: 8,
    backgroundColor: rsplTheme.rsplLightGrey,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 16,
    alignItems: 'center',
  },
  eBookImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  eBookTitleName: {
    fontSize: 16,
    fontWeight: "500",
    color: rsplTheme.textColorBold,
    textAlign: "center",
    marginVertical: 10,
  }
})