import { Alert, StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../comman/Header'
import Services from '../services'
import { apiRoutes, rsplTheme, token } from '../constant'

const AllTitleView = ({ navigation }) => {

  const [allTitle, setAllTitle] = useState([])
  const [loading, setLoading] = useState(false);
  const [imgBaseUrl, setImgBaseUrl] = useState(null)
  const { width, height } = Dimensions.get("window")
  const [showScrollButton, setShowScrollButton] = useState(false); // For arrow button visibility
  const [query, setQuery] = useState(''); // User search query

  const flatListRef = useRef(null)


  useEffect(() => {
    fetchAllTitles()
  }, [])


  const fetchAllTitles = async () => {
    try {
      setLoading(true)
      const payLoad = { "api_token": token }
      const result = await Services.post(apiRoutes.allBookList, payLoad)
      if (result.status === "success") {
        setLoading(false)
        setImgBaseUrl(result.data?.url)
        // const processData = result.data?.bookList?.length % 2 !== 0 ? [...result?.data?.bookList, { id: "rjSingh", isDummy: true }] : result?.data?.bookList
        setAllTitle(result?.data || [])
      } else if (result.status === "failed") {
        setLoading(false);
        Alert.alert("Error", result.message || "Failed to fetch data");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message || "An unexpected error occurred");
    }
  }

  const renderItem = useCallback(({ item }) => {
    console.log(`${imgBaseUrl}${item.front_image}`, "with call back")
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
        <Text style={styles.title}>{item?.product_title}</Text>
      </TouchableOpacity>
    )

  }, [allTitle?.bookList])

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const fetchData = (newQuery = query, newPage = 1) => {
    console.log(newQuery, "whee?")
  }

  const handleSearch = () => {
    fetchData(query, 1); // Fetch data for new search query
  };





  return (
    <View style={{ flex: 1, }}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/pen.png')}
        title={"All Books"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      <View style={styles.container}>
        <TextInput
          placeholder="Search products..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            paddingHorizontal: 10,
            margin: 10,
            backgroundColor: rsplTheme.rsplWhite,
            borderRadius: 5,
          }}
        />
        {loading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', }}>
            <ActivityIndicator tyle={styles.indicator} size={"large"} color={rsplTheme.rsplRed} />
          </View> :
          <FlatList
            ref={flatListRef}
            data={allTitle?.bookList}
            renderItem={renderItem}
            keyExtractor={(item) => item.productId.toString()}
            numColumns={2}
            onScroll={((e) => {
              const offsetY = e.nativeEvent.contentOffset.y;
              setShowScrollButton(offsetY > 300);
            })}
          // onEndReached={fetchData}
          // onEndReachedThreshold={0.5}
          />
        }

        {showScrollButton && (
          <TouchableOpacity
            style={styles.scrollButton}
            onPress={scrollToTop}
          >
            <Text style={styles.scrollButtonText}>↑</Text>
          </TouchableOpacity>
        )}



      </View>
    </View>
  )
}

export default AllTitleView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplBorderGrey
    // backgroundColor: "#f5f5f5",
  },
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
    fontSize: 14,
    fontWeight: "600",
    color: rsplTheme.jetGrey
  },

  scrollButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: rsplTheme.rsplRed,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  scrollButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

})