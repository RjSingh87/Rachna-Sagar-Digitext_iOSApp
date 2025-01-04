import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../comman/Header'
import { apiRoutes, rsplTheme, token } from '../constant'
import Services from '../services'
const Bookseller = ({ navigation }) => {
  const [booksellerData, setBookSellerData] = useState([])
  const [booksellerLoader, setBookSellerLoader] = useState(false)
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false)

  let limit = 100

  useEffect(() => {
    fetchDataOfBookSeller()
  }, [])


  const fetchDataOfBookSeller = async () => {
    if (loading || !hasMore) return; // Avoid multiple or unnecessary calls
    setLoading(true);
    try {
      const payLoad = { "api_token": token }
      let urlQuery = `?page=${page}&limit=${limit}` //chunk data with pagination API
      const result = await Services.post(apiRoutes.bookSellerList + `${urlQuery}`, payLoad)
      if (result.status === "success") {
        const newData = result?.data?.data || [];
        if (newData.length === 0) setHasMore(false);
        setBookSellerData((prevData) => [...prevData, ...newData]);
        setPage((prevPage) => prevPage + 1);
      } else if (result.status === "failed") {
        Alert.alert("Info:", result.message || "Fetch error occurred")
      }
    } catch (error) {
      Alert.alert("Error:", error.message || "Something went wrong")
      return
    } finally {
      setLoading(false)
      setBookSellerLoader(false)
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

  }, [])

  const onEndReached = () => {
    if (!loading && hasMore) {
      fetchDataOfBookSeller();
    }
  }

  const renderFooter = useCallback(() => {
    if (!loading) return null;
    return <ActivityIndicator style={{ marginVertical: 12 }} size="large" color={rsplTheme.rsplRed} />;
  }, [loading]);


  // console.log(booksellerData, "RjSingh???")
  // console.log(page, "page???")



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
        {booksellerLoader ? (
          <ActivityIndicator color={rsplTheme.rsplRed} size="large" />
        ) : (
          <FlatList
            data={booksellerData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`} // Combine id and index to make it unique
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        )}
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
    marginBottom: 10,
  },
})