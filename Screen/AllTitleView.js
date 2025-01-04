import { Alert, StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../comman/Header'
import Services from '../services'
import { apiRoutes, rsplTheme, token } from '../constant'
import NoInternetConn from './NoInternetConn'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Voice from '@react-native-voice/voice';

const AllTitleView = ({ navigation }) => {

  const [allTitle, setAllTitle] = useState([])
  const [originalTitle, setOriginalTitle] = useState([]); // Original data
  const [loading, setLoading] = useState(false);
  const [imgBaseUrl, setImgBaseUrl] = useState(null)
  const { width, height } = Dimensions.get("window")
  const [showScrollButton, setShowScrollButton] = useState(false); // For arrow button visibility
  const [query, setQuery] = useState(''); // User search query
  const [isListening, setIsListening] = useState(false)

  const flatListRef = useRef(null)
  const searchRef = useRef(null);


  useEffect(() => {
    fetchAllTitles()

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = (error) => console.log("Speech Error:", error);

    return () => {
      Voice.destroy().then(() => Voice.removeAllListeners());
    };

  }, [])


  const onSpeechStart = (event) => {
    console.log("Speech Start.....", event);
    setIsListening(true)
  }
  const onSpeechEnd = (event) => {
    console.log("Speech End.....", event);
    setIsListening(false)
  }
  const onSpeechResults = (event) => {
    const text = event.value[0]
    setQuery(text)
    if (searchRef.current) {
      searchRef.current.focus();
    }
    setTimeout(() => {
      stopListening()
    }, 5000);

  }

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start("en-US");
      setTimeout(stopListening, 5000);
    } catch (error) {
      console.log("Start Listening Error:", error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.log("Stop Listening Error:", error);
    }
  };


  const fetchAllTitles = async () => {
    try {
      setLoading(true)
      const payLoad = { "api_token": token }
      const result = await Services.post(apiRoutes.allBookList, payLoad)
      if (result.status === "success") {
        setLoading(false)
        // const processData = result.data?.bookList?.length % 2 !== 0 ? [...result?.data?.bookList, { id: "rjSingh", isDummy: true }] : result?.data?.bookList
        const imgUrl = result.data?.url || "https://www.rachnasagar.in/assets/images/product/big/"; // Fallback URL
        const bookList = result?.data?.bookList || [];
        setImgBaseUrl(imgUrl)
        setAllTitle(bookList); // Set filtered data
        setOriginalTitle(bookList); // Set original data
      } else if (result.status === "failed") {
        setLoading(false);
        Alert.alert("Info", result.message || "Failed to fetch data");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message || "An unexpected error occurred");
    }
  }

  const renderItem = useCallback(({ item }) => {
    // console.log(`${imgBaseUrl}${item.front_image}`, "with call back")
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
        <Text style={styles.productPrice}><Text style={{ fontSize: 18, color: rsplTheme.textColorBold, }}>{`\u20B9`}</Text> {`${item.book_price}`}</Text>
        {item?.book_perDiscount != 0 &&
          <View style={styles.priceBox}>
            <Text style={{}}>MRP:</Text>
            <Text style={styles.productMrp}>{`\u20B9 ${item.book_mrp}`}</Text>
            <Text style={styles.productDiscount}>{`(${item?.book_perDiscount == undefined ? 0 : item?.book_perDiscount}% off)`}</Text>
          </View>
        }
      </TouchableOpacity>
    )

  }, [allTitle])

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const handleSearch = () => {
    const searchQuery = query.toLowerCase().trim(); // Normalize search query
    if (searchQuery === '') {
      console.log("calling")
      // Reset to original data if query is empty
      setAllTitle(originalTitle);
      return;
    }

    const filteredData = originalTitle.filter((item) => {
      // Match against title, price, and author
      return (
        item?.product_title?.toLowerCase().includes(searchQuery) || // Title
        item?.book_price?.toString().includes(searchQuery) ||       // Price
        item?.author?.toLowerCase().includes(searchQuery) ||        // Author
        item?.isbn?.toLowerCase().includes(searchQuery) ||        // ISBN
        item?.subject?.toLowerCase().includes(searchQuery) ||           // Subject
        item?.Publisher?.toLowerCase().includes(searchQuery)           // Publisher
      );
    });

    if (filteredData.length > 0) {
      setAllTitle(filteredData);
    } else {
      Alert.alert("No Results", `No products match your search: ${query}`);
    }
  };

  const resetFiltersTitles = () => {
    setQuery("")
    setAllTitle(originalTitle);
    return;
  }



  // const handleSearch = () => {
  //   fetchData(query, 1); // Fetch data for new search query
  // };

  // console.log(allTitle, "allTitle??")





  return (
    <View style={{ flex: 1, }}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/pen.png')}
        title={"All Books"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      <NoInternetConn />

      <View style={styles.container}>

        <View style={{ flexDirection: "row", position: "relative", alignItems: "center", }}>
          <TextInput
            ref={searchRef}
            placeholder={isListening ? "Speak now" : "Search products"}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType='search'
            // autoFocus={isListening ? true : false}
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              paddingHorizontal: 10,
              margin: 10,
              backgroundColor: rsplTheme.rsplWhite,
              borderRadius: 5,
              flex: 1,
            }}
          />

          {query.length > 0 ?
            <TouchableOpacity style={{ justifyContent: "center", position: "absolute", right: 10, width: 30, height: 40, }} onPress={(() => { resetFiltersTitles() })}>
              <Ionicons name="close-outline" size={20} color={rsplTheme.jetGrey} />
            </TouchableOpacity> :

            <TouchableOpacity
              onPress={(() => {
                isListening ? stopListening() : startListening()
              })}
              style={{ justifyContent: "center", position: "absolute", right: 10, width: 30, height: 40, }}>
              {isListening ?
                <Entypo name="controller-record" size={20} color={rsplTheme.rsplRed} /> :
                <Ionicons name="mic" size={20} color={rsplTheme.jetGrey} />
              }
            </TouchableOpacity>
          }
        </View>


        {loading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', }}>
            <ActivityIndicator tyle={styles.indicator} size={"large"} color={rsplTheme.rsplRed} />
          </View> :
          <FlatList
            ref={flatListRef}
            data={allTitle}
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
  priceBox: {
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 6,
    alignSelf: "flex-start",
    color: rsplTheme.textColorBold,
  },
  productMrp: {
    fontSize: 16,
    color: rsplTheme.rsplRed,
    textDecorationLine: "line-through"
  },
  productDiscount: {
    fontSize: 16,
    color: '#888',
  },

})