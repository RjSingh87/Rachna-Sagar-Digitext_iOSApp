import { Alert, StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../comman/Header'
import Services from '../services'
import { apiRoutes, rsplTheme, token } from '../constant'
import NoInternetConn from './NoInternetConn'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Voice from '@react-native-voice/voice';


// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const AllTitleView = ({ navigation }) => {

  const [allTitle, setAllTitle] = useState([])
  const [originalTitle, setOriginalTitle] = useState([]); // Original data
  const [loading, setLoading] = useState(false);
  const [imgBaseUrl, setImgBaseUrl] = useState(null)
  const { width, height } = Dimensions.get("window")
  const [showScrollButton, setShowScrollButton] = useState(false); // For arrow button visibility
  const [query, setQuery] = useState(''); // User search query
  const [isListening, setIsListening] = useState(false)
  const [lastQuery, setLastQuery] = useState('');
  const [error, setError] = useState(null);
  const [searchLoader, setSearchLoader] = useState(false)
  const [timeoutId, setTimeoutId] = useState(null)

  const flatListRef = useRef(null)
  const searchRef = useRef(null);


  useEffect(() => {
    fetchAllTitles()

    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => stopListening();
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = (error) => {
      console.log("Speech Error:", error);
      stopListening();
    };

    return () => {
      Voice.destroy().then(() => Voice.removeAllListeners());
    };

  }, [])



  useEffect(() => {
    if (!query) {
      setAllTitle(originalTitle);
      setSearchLoader(false);
      setError(null);
      return;
    }

    setSearchLoader(true);
    setError(null);

    const timer = setTimeout(() => {
      searchWithAPI(query);
    }, 500); // 500ms 

    return () => clearTimeout(timer);
  }, [query]);

  const onSpeechResults = (event) => {
    const text = event.value[0]?.trim();
    if (!text) {
      stopListening();
      return;
    }

    setQuery(text);
    if (searchRef.current) {
      searchRef.current.focus();
    }
    clearTimeout(timeoutId);
    const newTimeout = setTimeout(() => {
      stopListening();
    }, 3000);
    setTimeoutId(newTimeout);
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start("en-US");
      const id = setTimeout(() => {
        stopListening();
      }, 10000);
      setTimeoutId(id);
    } catch (error) {
      console.log("Start Listening Error:", error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      clearTimeout(timeoutId);
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
        stopListening();
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

  // old search functionality
  // const handleSearch = () => {
  //   const searchQuery = query.toLowerCase(); // Convert query to lowercase for case-insensitive search
  //   const filteredData = allTitle.filter((item) => {
  //     // Match against title, price, and author
  //     return (
  //       item?.product_title?.toLowerCase().includes(searchQuery) || // Title
  //       item?.book_price?.toString().includes(searchQuery) ||       // Price
  //       item?.author?.toLowerCase().includes(searchQuery)           // Author
  //     );
  //   });

  //   if (filteredData.length > 0) {
  //     setAllTitle(filteredData);
  //   } else {
  //     Alert.alert("No Results", `No products match your search: ${query}`);
  //   }
  // };

  const handleSearch = () => {
    searchWithAPI()
    return
    const searchQuery = query.toLowerCase().trim(); // Normalize search query
    if (searchQuery === '') {
      // Reset to original data if query is empty
      setAllTitle(originalTitle);
      return;
    }

    const keywords = searchQuery.split(" ");

    const filteredData = originalTitle.filter((item) => {
      // Match against title, price, author, isbn, subject and Publisher
      const title = item?.product_title?.toLowerCase() || '';
      const price = item?.book_price?.toString() || '';
      const author = item?.author?.toLowerCase() || '';
      const isbn = item?.isbn?.toLowerCase() || '';
      const subject = item?.subject?.toLowerCase() || '';
      const publisher = item?.Publisher?.toLowerCase() || '';

      // Check if any keyword matches any of the fields
      return keywords.every((keyword) =>
        title.includes(keyword) ||
        price.includes(keyword) ||
        author.includes(keyword) ||
        isbn.includes(keyword) ||
        subject.includes(keyword) ||
        publisher.includes(keyword)
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
    setError(null)
    return;
  }

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace' && query.length === 1) {
      setAllTitle(originalTitle); // Jab textinput value empty ho jaye tab function call karein
      return
    }
  };

  const searchWithAPI = async (searchQuery) => {
    // const searchQuery = query.toLowerCase().trim(); // Normalize the search query
    // if (searchQuery === lastQuery) return; // Skip if query hasn't changed
    // setLastQuery(searchQuery);

    // if (searchQuery === '') {
    //   setAllTitle(originalTitle); // Reset to original data if query is empty
    //   return;
    // }

    try {
      const payLoad = {
        "api_token": "123456",
        "searchKey": searchQuery,
      };
      const result = await Services.post(apiRoutes.titleSearchAPI, payLoad);

      if (result.status === "success" && result?.data?.data) {
        const fetchedBooks = result.data.data;
        if (fetchedBooks.length > 0) {
          setAllTitle(fetchedBooks); // Update the search result
        } else {
          Alert.alert('No Results', `No products match your search: ${query}`);
          setAllTitle([]); // Clear the list if no results
        }
      } else {
        setError(result.message || "Failed to fetch search results")
        // Alert.alert('Error', result.message || 'Failed to fetch search results');
        setAllTitle([]); // Clear the list in case of failure
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
      setAllTitle([]); // Clear the list in case of error
    } finally {
      setSearchLoader(false); // Hide loading indicator
    }
  };


  const debouncedSearch = useCallback(debounce(searchWithAPI, 300), [query, originalTitle]);

  const handleChangeQuery = (text) => {
    setQuery(text);
    debouncedSearch();
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

      <NoInternetConn />

      <View style={styles.container}>
        {/* <TouchableOpacity onPress={(() => { navigation.navigate("SearchScreen") })}>
          <Text>Search</Text>
        </TouchableOpacity> */}

        <View style={{ flexDirection: "row", position: "relative", alignItems: "center", }}>

          {/* <AntDesign name="search1" size={30} color={rsplTheme.jetGrey} style={{ position: "absolute", left: 30, top: 0, }} /> */}
          <TextInput
            ref={searchRef}
            placeholder={isListening ? "Speak now" : "Search products"}
            value={query}
            onChangeText={(text) => {
              setQuery(text.trimStart());
              stopListening()
            }}
            // onChangeText={handleChangeQuery}
            // onSubmitEditing={handleSearch}
            // returnKeyType='search'
            // onKeyPress={handleKeyPress}
            autoCapitalize='none'
            autoCorrect={false}
            // autoFocus={isListening ? true : false}
            style={{
              height: 40,
              paddingRight: 35,
              paddingLeft: 15,
              borderColor: 'gray',
              borderWidth: 1,
              paddingHorizontal: 10,
              margin: 10,
              backgroundColor: rsplTheme.rsplWhite,
              borderRadius: 20,
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


        {searchLoader && <ActivityIndicator size="large" color={rsplTheme.rsplRed} />}

        {error && <Text style={{ color: 'red', textAlign: "center" }}>{error}</Text>}


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
    width: "100%",
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
  // searchIcon: {
  //   marginRight: 15,
  //   width: 18,
  //   height: 18,
  //   tintColor: rsplTheme.textColorLight,
  //   resizeMode: 'contain',
  // },

})