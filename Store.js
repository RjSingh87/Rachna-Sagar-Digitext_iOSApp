import { createContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native'
import Services from './services';
import { apiRoutes, token } from './constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './constant/Loader';
import NetInfo from '@react-native-community/netinfo';



export const MyContext = createContext("");


export default Store = ({ children }) => {
  const [userData, setUserDate] = useState({ isLogin: false, isLoading: false, msg: "", type: "", data: [] });
  const [selectedTab, setSelectedTab] = useState(0)
  const [addToCartPopup, setAddToCartPopup] = useState({ isVisible: false, message: "" })
  const [cartList, setCartList] = useState({ isLoader: false, Data: [], length: 0, message: "" })
  const [grandTotal, setGrandTotal] = useState({ total: "", data: [] })
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    getNetworkStatus()
    checkLoginStatus()
    if (userData.isLogin) {
      getAllCartItems()
    }
    // getGrandTotal()
  }, [userData.isLogin, cartList.length])


  const getNetworkStatus = () => {
    const networkConnectionCheck = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      networkConnectionCheck();
    };

  }


  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem("key");
      if (value !== null) {
        // Alert.alert("Info", "User already logged in")
        setUserDate((prev) => { return { ...prev, isLogin: true, data: JSON.parse(value) } })
      }
    } catch (e) {
      console.log(e, "errr")
      Alert.alert("info", e)
    }

  }



  const login = async (data, navigation) => {
    if (data?.email !== "" && data?.password !== "") {
      setUserDate((prev) => { return { ...prev, isLoading: true } }) //for loader true
      const payLoad = {
        "api_token": token,
        "email": data?.email,
        "password": data?.password
      }
      await Services.post(apiRoutes.loginAccount, payLoad)
        .then((res) => {
          if (res.status === "success") {
            setUserDate((prev) => {
              return { ...prev, data: res.result, msg: res.message, isLogin: true, type: "success", isLoading: false, }
            });
            AsyncStorage.setItem("key", JSON.stringify(res.result))
            setSelectedTab(0)
            // navigation.navigate("Home")
            navigation.navigate("Main")
          } else if (res.status == "failed") {
            Alert.alert("Info", `${res.message}`)
            return
          }
          // const dataStore = AsyncStorage.getItem("key")
          // return dataStore !== null ? JSON.stringify(res.result) : false
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally(() => { setUserDate((prev) => { return { ...prev, isLoading: false } }) })
    } else {
      Alert.alert("Info", "Please enter valid user credentials")
      return
    }
  }

  async function logout(navigation) {
    await AsyncStorage.clear();
    setUserDate((prev) => { return { ...prev, isLogin: false, data: [] } })
    setCartList((prev) => { return { ...prev, Data: [], length: null } }) // cartList Item Notifications 0
  }

  const addToCart = async (navigation, BookId, BookType, typeOfCart) => {
    // console.log({ typeOfCart })
    setUserDate((prev) => { return { ...prev, isLoading: true } })
    const payLoad = {
      "api_token": token,
      "userid": userData.data[0].id,
      "bookid": BookId,
      "product_type": BookType,
      "quantity": "1"
    }
    await Services.post(apiRoutes.addToCartList, payLoad)
      .then((res) => {
        if (res.status === "success") {
          getAllCartItems()
          // getGrandTotal()
          setAddToCartPopup((prev) => { return { ...prev, isVisible: true, message: res.message } })
          setTimeout(() => {
            setAddToCartPopup((prev) => { return { ...prev, isVisible: false, } })
          }, 2000);

          // add on 2 july 2024 by raju
          if (typeOfCart == "buyNow") {
            getGrandTotal([res.data])
          } else if (typeOfCart == "IncrementalQnty") {
            const cartIDs = []
            for (let cart of cartList.Data) {
              cartIDs.push(cart.id)
            }
            getGrandTotal(cartIDs)
          }
          // setSelectedTab(3)
          // navigation.navigate("Main")
          // navigation.navigate("Home")
          // Alert.alert("OK", "API working")
        } else if (res.status == "error") {
          return
          Alert.alert(`${res.message}`)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setUserDate((prev) => { return { ...prev, isLoading: false } }) })
  }


  const getAllCartItems = async () => {
    setCartList((prev) => { return { ...prev, isLoader: true } })
    const payLoad = {
      "api_token": token,
      "userid": userData.data[0]?.id
    }
    await Services.post(apiRoutes.viewAllCartList, payLoad)
      .then((res) => {
        if (res.status === "success" && res.result.length > 0) {
          setCartList((prev) => { return { ...prev, Data: res.result, length: res.result.length } })

          //for total amount of getGrandTotal functionality
          let cartIdArray = []
          for (const key of res.result) {
            cartIdArray.push(key.id)
          }
          getGrandTotal(cartIdArray)
          // ------------------------------
        } else if (res.status == "failed") {
          // Alert.alert(`${res.errors}`)
          setCartList((prev) => { return { ...prev, Data: [], length: null, message: res.message } })
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setCartList((prev) => { return { ...prev, isLoader: false } }) })
  }


  const getGrandTotal = async (cartId) => {
    const payLoad = {
      "api_token": token,
      "userid": userData.data[0]?.id,
      "cartIDs": cartId // add 2 july 2024 by raju
    }
    await Services.post(apiRoutes.grandTotalOfCart, payLoad)
      .then((res) => {
        if (res.status === 'success') {
          setGrandTotal((prev) => { return { ...prev, total: res.result.Total_Merged_price, data: res.result } })
        } else if (res.success == false) {
          Alert.alert(`${res.errors}`)
          return
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { })
  }











  // if (userData.isLoading) {
  //   return (
  //     <View style={styles.loader}>
  //       <Loader text='Loading...' />
  //     </View>
  //   )
  // }

  return (
    <MyContext.Provider
      value={{
        isConnected: isConnected,
        userData: userData,
        login: login,
        logout: logout,
        addToCart: addToCart,
        selectedTab,
        setSelectedTab,
        addToCartPopup,
        setAddToCartPopup,
        getAllCartItems,
        setCartList,
        cartList,
        getGrandTotal,
        grandTotal
      }}>
      {children}
      {userData.isLoading &&
        <View style={styles.loader}>
          <Loader text='Loading...' />
        </View>
      }

    </MyContext.Provider>
  )
}



const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})