import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../comman/Header'
import { apiRoutes, rsplTheme, token } from '../constant'
import Services from '../services'
const Bookseller = ({ navigation }) => {
  const [booksellerData, setBookSellerData] = useState([])
  const [booksellerLoader, setBookSellerLoader] = useState(false)

  useEffect(() => {
    fetchDataOfBookSeller()
  }, [])


  const fetchDataOfBookSeller = async () => {
    try {
      setBookSellerLoader(true)
      const payLoad = { "api_token": token }
      const result = await Services.post(apiRoutes.allBookList, payLoad)
      if (result.status === "success") {
        console.log(result.data, "Data;..resultsuccessful")
        setBookSellerLoader(false)
        setBookSellerData(result?.data || [])
      } else if (result.status === "failed") {
        Alert.alert("Info:", result.message || "Fetch error occurred")
      }

    } catch (error) {
      Alert.alert("Error:", error.message || "Something went wrong")


    }
  }

  const renderItem = useCallback(({ item }) => {
    console.log(item, "bookselller")
    return (
      <TouchableOpacity onPress={(() => {
        navigation.navigate("ProductDetail",
          {
            item: [item],
            productId: item?.productId,
            imgArray: [
              { item: item?.front_image },
              { item: item?.back_image }
            ],
            title: "Product details"
          }
        )
      })} style={styles.card}>
        <Image
          source={{ uri: `${imgBaseUrl}${item.front_image}` }}
          // source={`${imgBaseUrl}${item.front_image}` == undefined ? require("../assets/icons/empty-cart.png") : { uri: `${imgBaseUrl}${item.front_image}` }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{item?.shop_name}</Text>
      </TouchableOpacity>
    )

  }, [booksellerData])


  // console.log(booksellerData, "booksellerData")



  return (
    <View style={{ flex: 1, }}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/pen.png')}
        title={"All Books"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      <View style={{ flex: 1 }}>
        {booksellerLoader ?
          <ActivityIndicator color={rsplTheme.rsplRed} size={"large"} /> :
          <FlatList
            data={booksellerData}
            renderItem={renderItem}
            keyExtractor={(item) => { item.id }}
          />

        }
      </View>




    </View>
  )
}

export default Bookseller

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: rsplTheme.rsplWhite,
    borderRadius: 5,
    elevation: 3,
  },
  dummyCard: {
    backgroundColor: 'transparent', // Make dummy card invisible
    elevation: 0,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
})