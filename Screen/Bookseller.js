import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../comman/Header'
import { apiRoutes, rsplTheme, token } from '../constant'
import Services from '../services'
const Bookseller = ({ navigation }) => {
  const [booksellerData, setBookSellerData] = useState([])
  const [booksellerLoader, setBookSellerLoader] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDataOfBookSeller()
  }, [])


  const fetchDataOfBookSeller = async () => {
    try {
      setBookSellerLoader(true)
      setLoading(true)
      const payLoad = { "api_token": token }
      let urlQuery = `?page=${page}&limit=10`
      const result = await Services.post(apiRoutes.bookSellerList + `${urlQuery}`, payLoad)
      if (result.status === "success") {
        const newData = result?.data?.data;
        setBookSellerData((prevData) => Array.isArray(prevData) ? [...prevData, ...newData] : newData);
        setPage((prevPage) => prevPage + 1);
        setBookSellerLoader(false)
        setLoading(false)
      } else if (result.status === "failed") {
        Alert.alert("Info:", result.message || "Fetch error occurred")
      }

    } catch (error) {
      Alert.alert("Error:", error.message || "Something went wrong")
    }
  }

  const renderItem = useCallback(({ item }) => {
    // console.log(item, "bookselller")
    return (
      <View style={styles.card}>

        <Text style={styles.title}>{item?.shop_name}</Text>

        <View style={{ flex: 1, flexDirection: "row", marginVertical: 4 }}>
          <View style={{ width: 130 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>Shop Name</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>{`${item.shop_name}`}</Text>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: "row", marginVertical: 4 }}>
          <View style={{ width: 130 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>Address</Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ color: rsplTheme.jetGrey }}>{`${item.address1}, ${item.address2}`}</Text>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: "row", marginVertical: 4 }}>
          <View style={{ width: 130 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>Pincode</Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ color: rsplTheme.jetGrey }}>{`${item.pincode}`}</Text>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: "row", marginVertical: 4 }}>
          <View style={{ width: 130 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>Contact Number</Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ color: rsplTheme.jetGrey }}>{`${item.phone1}, ${item.phone3}`}</Text>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: "row", marginVertical: 4 }}>
          <View style={{ width: 130 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>Email Id</Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ color: rsplTheme.jetGrey }}>{`${item.email}`}</Text>
          </View>
        </View>


      </View>
    )

  }, [booksellerData])

  const onEndReached = useCallback(() => {
    fetchDataOfBookSeller()
    console.log("User end")
  }, [booksellerData])

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="green" />;
  };



  console.log(booksellerData, "RjSingh???")



  return (
    <View style={{ flex: 1, }}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/pen.png')}
        title={"Book Sellers"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      <View style={{ flex: 1 }}>
        {booksellerLoader ?
          <ActivityIndicator color={rsplTheme.rsplRed} size={"large"} /> :
          <FlatList
            data={booksellerData}
            // data={booksellerData?.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => { `${item.id + 4}-${index}` }}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}

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
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: rsplTheme.jetGrey,
    marginBottom: 10
  },
})