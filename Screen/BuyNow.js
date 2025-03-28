import { Alert, StyleSheet, Keyboard, Text, TouchableOpacity, Platform, TouchableWithoutFeedback, ActivityIndicator, Pressable, View, TextInput, KeyboardAvoidingView, Modal, Button, ScrollView, Image } from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../comman/Header';
import { apiRoutes, rsplTheme, token, CALLBACK_URL, MID, URL_SCHEME, baseURL, API_Key } from '../constant';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { MyContext } from '../Store';
import Services from '../services';
// import Loader from '../constant/Loader';
// import { generateToken } from '../PaytmService';
// import RazorpayCheckout from 'react-native-razorpay';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AllInOneSDKManager from 'paytm_allinone_react-native';
import NoInternetConn from './NoInternetConn';
import DeviceInfo from 'react-native-device-info';


const BuyNow = ({ route, singleProduct }) => {
  // console.log(route.params, "Saurabgchange cartid???")
  // console.log(route.params.singleProduct, "New purchase")
  // console.log(route.params.activeButton, "activeButton")
  const productType = route?.params?.activeButton
  const productID = route?.params?.productId
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const { userData, grandTotal, cartList } = useContext(MyContext)
  const [loader, setLoader] = useState(false)
  const [address, setAddress] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [userContactVisible, setUserContactVisible] = useState(false)
  const [userDeatail, setUserDetails] = useState({ name: "", address: "", landmark: "", mobile: "" })
  // const [quantity, setQuantity] = useState(0)
  const [enterPromoCode, setEnterPromoCode] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [promoCode, setPromoCode] = useState({ status: false, code: '', message: '', checkoutPromoCode: '' })
  const [loaderPromoCode, setLoaderPromoCode] = useState(false)
  const [placeOrderLoader, setPlaceOrderLoader] = useState(false)
  const [buyNowAmount, setBuyNowAmount] = useState([])
  const [lastCartId, setLastCartId] = useState(null)
  const [buyNowQuantity, setBuyNowQuantity] = useState(1)

  // const route = useRoute()
  // const { cartSummeryData } = route.params
  {/* <Text style={styles.orderSumRightTitle}>{`\u20B9`} {route.params.activeButton == "Paperback" ? route.params.singleProduct.item[0]?.book_discount : route.params.singleProduct.item[0]?.eBook_discount} </Text> */ }
  let totalPrice = `${route.params.singleProduct.item[0]?.book_mrp}` - `${route.params.activeButton == "Paperback" ? route.params.singleProduct.item[0]?.book_discount : route.params.singleProduct.item[0]?.eBook_discount}`
  let shipingCharge = 0
  let netPayableAmount = `${totalPrice}`
  if (totalPrice < 600) {
    shipingCharge = 49 //79
    netPayableAmount = totalPrice + shipingCharge
  }
  if (route.params.activeButton == "Ebook") {
    shipingCharge = 0
    netPayableAmount = totalPrice + shipingCharge
  }

  useEffect(() => {
    if (isFocused) {
      getUserAddress()
    }
  }, [isFocused])

  useEffect(() => {
    // if (cartList?.Data?.length > 0) {
    //   const cartIDs = cartList.Data.map(cart => cart.id);
    //   const lastID = cartIDs[cartIDs.length - 1]; // Get the last cart ID      
    //   // setLastElement(lastID); // Update lastElement when cartList changes
    //   calculateAmountOfBuyNow(lastID, true);
    // }
    for (const key in cartList.Data) {
      if (cartList.Data[key].productId == route.params?.productId && productType == cartList.Data[key].product_type && lastCartId == null) {
        calculateAmountOfBuyNow(cartList?.Data[key]?.id, buyNowQuantity)
        setLastCartId(cartList?.Data[key]?.id)
        // console.log(cartList?.Data[key]?.id, "First time Id?")
      } else {
        calculateAmountOfBuyNow(lastCartId, buyNowQuantity)
        // setLastCartId(lastCartId)
        // console.log(lastCartId, "LastId???")
      }
    }
  }, [cartList, address]);



  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  const getValidateCoupon = async () => {
    if (isInputEmptyOrWhitespace(promoCode.code)) {
      setPromoCode((prev) => { return { ...prev, error: "Validation Error" } })
      Alert.alert('Please Enter Promocode.');
    } else {
      setLoaderPromoCode(true)
      const payLoad = {
        "api_token": token,
        "couponCode": promoCode.code //RS11ABG
      }
      await Services.post(apiRoutes.validateCoupon, payLoad)
        .then((res) => {
          if (res.status === "success") {
            let promoCodeMessage = `Additional discount of ${res.data?.discountValue} ${res.data?.discountType} will be applied on checkout.`
            setPromoCode((prev) => { return { ...prev, status: true, message: promoCodeMessage, checkoutPromoCode: res.data?.couponCode } })
          } else if (res.status === "failed") { Alert.alert(res.message) }
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally(() => { setLoaderPromoCode(false) })
    }

  }

  const isInputEmptyOrWhitespace = (text) => {
    return text.trim().length === 0;
  };





  const getUserAddress = async () => {
    setLoader(true)
    const payLoad = {
      "api_token": token,
      "userID": userData.data[0]?.id
    }
    await Services.post(apiRoutes.getUserAddress, payLoad)
      .then((res) => {
        if (res.status === "success" && res.message.length !== 0) {
          setAddress(res.message)
          fetchDefaultAddress()
          // setAddress(res.message.slice(0, 1))
        } else {
          setAddress([])
          return
          Alert.alert("Address", res.message)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally((err) => { setLoader(false) });
  }



  const fetchDefaultAddress = async (addressID) => {
    setSelectedAddress(addressID) // set user selected address id
    const payLoad = {
      "api_token": token,
      "userID": userData.data[0]?.id,
      "addressID": addressID
    }
    try {
      const result = await Services.post(apiRoutes.defaultAddress, payLoad)
      if (result.status === "success") {
        getUserAddress()
        console.log(result.message, "all welll")
      } else if (result.status === "failed") {
        // console.log(result.message, "not welll")
      }
    } catch (error) {
      console.log(error.message, "Something went wrong")
    }
  }

  const toggleParentModal = () => {
    navigation.navigate("AddNewAddress")
    // setIsParentModalVisible(!isParentModalVisible);
  };

  const placeOrder = async () => {
    if (selectedAddress == null || !address.length > 0) {
      Alert.alert("Address", "Please add/select address.");
      return;
    }
    // const cartIDs = cartList.Data.map(cart => cart.id);
    // const lastElement = cartIDs[cartIDs.length - 1];
    const payLoad = {
      "api_token": token,
      "addressID": selectedAddress,
      "cartIDs": [lastCartId], //[route.params?.lastCartId != null ? route.params?.lastCartId : lastElement],
      "userID": userData.data[0]?.id,
      "couponCode": promoCode?.checkoutPromoCode,
      "orderType": "buyNow", // only in buynow case
      "quantity": buyNowQuantity // only in buynow case
    };
    // console.log(payLoad, "lastCartId???P")
    // return
    try {
      const res = await Services.post(apiRoutes.generateOrderPaytm, payLoad);
      // console.log(res, "RESSS??>")
      if (res.status === "success") {
        const orderId = res.orderID; // Unique Order ID
        const mid = "Rachna00883415851600"; // Paytm MID
        const txnToken = res.txnToken; // Generated from Paytm API
        const amount = "1.00"; // Transaction amount
        const callbackUrl = `https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}` //`https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`;
        const isStaging = false; // true for testing, false for production
        const restrictAppInvoke = true; // Allow Paytm App invoke
        const urlScheme = "paytmRachna00883415851600"; // URL Scheme for iOS

        const result = await AllInOneSDKManager.startTransaction(
          orderId,
          mid,
          txnToken,
          amount,
          callbackUrl,
          isStaging,
          restrictAppInvoke,
          urlScheme
        );
        // console.log(result, "Paytm Transition Intialized");
        if (result.STATUS === "TXN_SUCCESS" && result.RESPCODE === "01") {
          console.log("successfulllele...")
          await verifyOrder(result?.ORDERID, lastCartId, result?.TXNAMOUNT);
          // navigation.goBack();
          if (productType === "Ebook") {
            eBookDownloadPermissions(orderId) // if Ebook payment is successful add by raju 13 Feb.2025
          }
        } else {
          Alert.alert("Payment Failed", result.RESPMSG || "Transaction could not be completed.");
        }
      } else if (res.status === "error") {
        Alert.alert("Info", res.message);
      }
    } catch (err) {
      Alert.alert("Transaction cancelled.");
      setPromoCode(prev => ({ ...prev, status: false, code: "", checkoutPromoCode: "" }));
      console.error("Transaction Failed:", err);
    }
  };

  const verifyOrder = async (orderNumber, cartIDs, TXNAMOUNT) => {
    console.log(orderNumber, "YashverifyOrder")
    const payLoad = {
      "api_token": token,
      "orderNumber": orderNumber,
      "cartIDs": [cartIDs]
    }
    console.log(payLoad, "payLoadVerifiorder")
    await Services.post(apiRoutes.paymentStatus, payLoad)
      .then((res) => {
        if (res.status === "success") {
          console.log(res, "When Success")
          navigation.navigate("PaymentSuccessScreen", { txnStatus: res.message, txnAmount: TXNAMOUNT })
          // navigation.goBack()
          // getAllCartItems();
          // setOrderVerifyData(res.data)
        } else if (res.status === "error") {
          Alert.alert("Error", res.message)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { })

  }

  const userInputValHandle = (txt, type) => {
    if (type == "name") {
      setUserDetails((prev) => { return { ...prev, name: txt, } })
    } else if (type == "address") {
      setUserDetails((prev) => { return { ...prev, address: txt, } })
    } else if (type == "landmark") {
      setUserDetails((prev) => { return { ...prev, landmark: txt, } })
    } else if (type == "mobile") {
      setUserDetails((prev) => { return { ...prev, mobile: txt.replace(/[^0-9]/g, ''), } })
    } else {
      return
      Alert.alert("DFFF",)
    }
  }

  const deleteAddress = async (id) => {
    if (selectedAddress != id) {
      Alert.alert("Info", "Please select an address.")
      return
    } else {
      setLoader(true)
      const payLoad = {
        "api_token": token,
        "address_id": selectedAddress
      }
      console.log(payLoad, "after delete")
      await Services.post(apiRoutes.userDeleteAddress, payLoad)
        .then((res) => {
          if (res.status == "success" && res.message.length !== 0) {
            console.log(res, "after suceeedd")
            getUserAddress()
            // fetchDefaultAddress()
          } else if (res.status === "failed") {
            console.log(res.message, "after error")
            return
            Alert.alert("Address", res.message)
          }
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally((err) => { setLoader(false) });
    }

  }

  const saveEditAddress = async () => {
    const payLoad = {
      "api_token": token,
      "addressID": selectedAddress,
      "name": userDeatail.name,
      "address": userDeatail.address,
      "mobile": userDeatail.mobile,
      "landmark": userDeatail.landmark,
    }
    await Services.post(apiRoutes.userEditAddressSave, payLoad)
      .then((res) => {
        if (res.status == "success") {
          Alert.alert("Info", res.message)
          getUserAddress()
          setUserContactVisible(false)
        } else {
          Alert.alert("Info", res.message)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { })

  }

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };




  const calculateAmountOfBuyNow = useCallback(debounce(async (cartID, quantity) => {
    setLoader(true)
    const payLoad = {
      "api_token": token,
      "userid": userData.data[0]?.id,
      // "cartIDs": [route.params?.lastCartId !== null ? route.params?.lastCartId : lastElement]
      "cartIDs": [cartID],
      "quantity": quantity === undefined ? buyNowQuantity : quantity
    }
    try {
      const result = await Services.post(apiRoutes.singleCartAmmount, payLoad)
      if (result.result && result.status === "success") {
        setLoader(false)
        const data = result.result
        setBuyNowAmount(data || [])
      } else if (result.success === "false") {
        Alert.alert("Failed:", result?.errors || "Failed to load.")
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      if (error.message === "TypeError: Network request failed") {
        Alert.alert("Network Error", "Please try again.");
      } else {
        Alert.alert("Error:", error.message || "Something went wrong.")
      }
    } finally { setLoader(false) }
  }, 300), [token, userData])


  const increment = (quantity) => {
    const newQuantity = quantity + 1;
    setBuyNowQuantity(newQuantity)
    calculateAmountOfBuyNow(lastCartId, newQuantity)
  };

  const decrement = () => {
    const newQuantity = Math.max(1, buyNowQuantity - 1); // Prevent quantity < 1
    setBuyNowQuantity(newQuantity)
    calculateAmountOfBuyNow(lastCartId, newQuantity)
  };

  const getDeviceID = async () => {
    const uniqueId = await DeviceInfo.getUniqueId();  // Har device ka ek alag ID hota hai
    const model = await DeviceInfo.getModel();
    let deviceInfo = {
      "uniqueId": uniqueId,
      "model": model
    }
    return deviceInfo;
  };

  const eBookDownloadPermissions = async (orderId) => {
    try {
      const deviceId = (await getDeviceID()).uniqueId;
      const model = (await getDeviceID()).model;
      const payload = {
        "api_token": token,
        "userID": userData.data[0]?.id,
        "orderID": orderId, //45698,
        "productId": [productID], //3124,
        //"zip_title": route.params.singleProduct.item[0]?.product_title, //"TogetherWithDemoTestPdf",
        "book_type": productType, //"eBook",
        "last_mob_device_id": deviceId, //"59961f43dd911d056",
        "last_mob_model": model, //"MotoG3-TE"
      }
      const result = await Services.post(apiRoutes.eBookDownload, payload)
      if (result.status === "success") {

      } else if (result.status === "failed") {
        Alert.alert("Error:", result.message)
      }

    } catch (error) {
      if (error.message === "TypeError: Network request failed") {
        Alert.alert("Network Error", "Please try again.");
      } else {
        Alert.alert("Error:", error.message || "Something went wrong.")
      }
    }
  }





  // if (loader) {
  //   return (
  //     <View style={styles.loader}>
  //       <Loader text='Loading...' />
  //     </View>
  //   )
  // }






  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        title={"Buy Now"}
        onClickLeftIcon={() => { navigation.goBack() }}
        onClickRightIcon={() => { return }}
      />

      <NoInternetConn />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={{ flex: 1, }} behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset={Platform.OS === "ios" ? 75 : 0}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, }} keyboardShouldPersistTaps="handled">

            <View style={styles.userAddContaner}>

              <TouchableOpacity style={{ height: 30, justifyContent: "center" }} onPress={(() => { toggleParentModal() })}>
                <Text style={styles.addNewAdd}>+ ADD NEW ADDRESS</Text>
              </TouchableOpacity>

              {address.filter(item => item.byDefault === 1).map((item, index) => {
                let backgroundColor = rsplTheme.rsplWhite
                item.byDefault === 1 ? backgroundColor = rsplTheme.rsplGreen : backgroundColor = backgroundColor;
                if (item.byDefault === 1 && selectedAddress == null) {
                  setSelectedAddress(item?.id)
                }
                // if (item.id == selectedAddress) {
                //   backgroundColor = rsplTheme.rsplGreen
                // }
                return (
                  <View style={{ flexDirection: "row", alignItems: "center", }} key={item.id}>
                    <View style={styles.row}>

                      <TouchableOpacity disabled onPress={(() => { fetchDefaultAddress(item.id) })} style={[styles.button, { flex: 1, flexDirection: "row", alignItems: "center", }]}>
                        {/* <View style={{ width: 15, height: 15, borderRadius: 15 / 2, borderWidth: 1, alignItems: "center", justifyContent: "center" }}><View style={{ width: 8, height: 8, borderRadius: 8 / 2, backgroundColor: backgroundColor }}></View></View> */}
                        <View style={[styles.button, {}]}>
                          <Text selectable={true} style={styles.userName}>{`Delivering to ${item?.name}`}</Text>
                          <Text selectable={true} style={styles.userAdd}>{item?.address}, {item?.landmark}, {item.state} {item.city} {item.country} {item.pincode} </Text>
                          <Text selectable={true} style={styles.userMob}>+91 {item?.mobile}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              })}

              {address.length >= 1 &&
                <TouchableOpacity style={{ marginTop: 8, }} onPress={(() => { navigation.navigate("SavedAddress", { type: "BuyNow" }) })}>
                  <Text style={{ color: rsplTheme.rsplBlue, fontSize: 15 }}>Change delivery address</Text>
                </TouchableOpacity>
              }
            </View>





            <View style={styles.containerImg}>
              <View style={[styles.imageContainer, {}]}>
                <Image
                  source={{ uri: route.params.singleProduct?.frontBackImgArry[0] }}
                  style={styles.image}
                />
                {/* Quantity increase decrease UI */}
                {productType !== "Ebook" &&
                  <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", marginTop: 6, }}>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity disabled={buyNowQuantity <= 1} onPress={(() => { decrement(buyNowQuantity) })} style={[styles.pulsButton]}>
                        <Text style={styles.quantityText}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.countText}>{buyNowQuantity}</Text>

                      <TouchableOpacity onPress={(() => { increment(buyNowQuantity) })} style={[styles.minusButton]}>
                        <Text style={styles.quantityText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                }
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.title}>{route.params.singleProduct.item[0]?.product_title}</Text>
                <Text style={styles.description}>{`ISBN : ${route.params.singleProduct.item[0]?.isbn}`}</Text>
                <Text style={styles.description}>{`Class : ${route.params.singleProduct.item[0]?.class}`}</Text>
                <Text style={styles.description}>{`Subject : ${route.params.singleProduct.item[0]?.subject}`}</Text>
                <Text style={styles.description}>{`Product Type : ${route.params.activeButton}`}</Text>
                <Text style={styles.description}>{`Quantity : ${buyNowQuantity}`}</Text>
                <View style={{ flexDirection: "row", }}>
                  <Text style={[styles.description, { fontWeight: "700" }]}>{`\u20B9`} {route.params.activeButton == "Paperback" ? route.params.singleProduct.item[0]?.book_price : route.params.singleProduct.item[0]?.ebook_price} </Text>
                  {route.params.singleProduct.item[0].book_perDiscount !== 0 &&
                    <Text style={[styles.description, { textDecorationLine: "line-through", textDecorationColor: "red", marginLeft: 10, }]}>{`\u20B9`} {route.params.activeButton == "Paperback" ? route.params.singleProduct.item[0]?.book_mrp : route.params.singleProduct.item[0]?.ebook_mrp} </Text>
                  }
                </View>
                {route.params.singleProduct.item[0].book_perDiscount !== 0 &&
                  <View style={{ flexDirection: "row", }}>
                    <Text style={styles.description}>{`You Save : \u20B9`} {route.params.activeButton == "Paperback" ? route.params.singleProduct.item[0]?.book_discount || "0.00" : route.params.singleProduct.item[0]?.eBook_discount || ".0"} </Text>
                    <Text style={[styles.description, { marginLeft: 10, }]}>({route.params.activeButton == "Paperback" ? route.params.singleProduct.item[0]?.book_perDiscount : route.params.singleProduct.item[0]?.ebook_perDiscount} % off)</Text>
                    {/* <Text style={[styles.description, { marginLeft: 10, }]}>({`${route.params.singleProduct.item[0]?.book_perDiscount}% off`})</Text> */}
                  </View>
                }



              </View>

            </View>








            <View style={styles.orderSummeryContainer}>
              <Text style={styles.orderSumryTitle}>{`ORDER SUMMARY`}</Text>
              <Text style={styles.summery}>{`View Order`}</Text>
            </View>

            {loader ?
              <ActivityIndicator size={"large"} color={rsplTheme.rsplRed} /> :
              <>
                <View style={styles.orderSumContainer}>
                  <View style={styles.orderSumLeft}>
                    <Text style={styles.orderSumLeftTitle}>Total MRP</Text>
                  </View>
                  <View style={styles.orderSumRight}>
                    <Text style={styles.orderSumRightTitle}>{` \u20B9 ${buyNowAmount?.Total_Merged_MRP ?? "0.00"}`}</Text>
                    {/* <Text style={styles.orderSumRightTitle}>{` \u20B9 ${route.params.singleProduct.item[0]?.book_mrp}`}.00</Text> */}
                  </View>
                </View>

                <View style={styles.orderSumContainer}>
                  <View style={styles.orderSumLeft}>
                    <Text style={styles.orderSumLeftTitle}>Discount (-)</Text>
                  </View>
                  <View style={styles.orderSumRight}>
                    <Text style={styles.orderSumRightTitle}>{`\u20B9 ${buyNowAmount.Total_Merged_discount ?? "0.00"}`}</Text>
                    {/* <Text style={styles.orderSumRightTitle}>{`\u20B9`} {route.params.activeButton == "Paperback" ? route.params.singleProduct.item[0]?.book_discount : route.params.singleProduct.item[0]?.eBook_discount} </Text> */}
                    {/* <Text style={styles.orderSumRightTitle}>{` \u20B9 ${route.params.singleProduct.item[0]?.book_discount}`}</Text> */}
                  </View>
                </View>

                <View style={styles.orderSumContainer}>
                  <View style={styles.orderSumLeft}>
                    <Text style={styles.orderSumLeftTitle}>Total Price</Text>
                  </View>
                  <View style={styles.orderSumRight}>
                    <Text style={styles.orderSumRightTitle}>{` \u20B9 ${buyNowAmount.Total_Merged_price ?? "0.00"}`}</Text>
                    {/* <Text style={styles.orderSumRightTitle}>{` \u20B9 ${totalPrice}`}</Text> */}
                    {/* <Text style={styles.orderSumRightTitle}>{`\u20B9`} {route.params.activeButton == "Paperback" ? route.params.singleProduct.item[0]?.book_discount : route.params.singleProduct.item[0]?.eBook_discount} </Text> */}
                  </View>
                </View>

                <View style={styles.orderSumContainer}>
                  <View style={styles.orderSumLeft}>
                    <Text style={styles.orderSumLeftTitle}>Shipping Charge (+)</Text>
                  </View>
                  <View style={styles.orderSumRight}>
                    <Text style={styles.orderSumRightTitle}>{` \u20B9 ${buyNowAmount?.Shipping_Charge ?? "0.00"}`}</Text>
                    {/* <Text style={styles.orderSumRightTitle}>{` \u20B9 ${shipingCharge}.00`}</Text> */}
                  </View>
                </View>



                <View style={styles.orderSumContainer}>
                  <View style={styles.orderSumLeft}>
                    <Text style={styles.orderSumLeftTitle}>Net Payable Amount</Text>
                  </View>
                  <View style={styles.orderSumRight}>
                    <Text style={[styles.orderSumRightTitle, { fontSize: 20, color: rsplTheme.rsplGreen }]}>{` \u20B9 ${buyNowAmount?.Total_grand_price ?? "0.00"}`}</Text>
                    {/* <Text style={[styles.orderSumRightTitle, { fontSize: 20, color: rsplTheme.rsplGreen }]}>{` \u20B9 ${netPayableAmount}`}</Text> */}
                  </View>
                </View>
              </>

            }



            {/* Enter the Promo Code UI */}
            <View style={{ flexDirection: "column" }}>
              <View style={styles.enterProContainer}>
                <TouchableOpacity style={styles.enterProHead} onPress={(() => { setEnterPromoCode(!enterPromoCode) })}>
                  <Text style={styles.enterProTitle}>Enter a promo code</Text>
                </TouchableOpacity>
              </View>
              {enterPromoCode &&
                <View style={[styles.inputContainer, { marginBottom: 0 }]}>
                  <View style={{ flexDirection: "row", width: 250, alignItems: "center", }}>
                    <TextInput autoFocus={true} autoCapitalize='none' autoCorrect={false} autoComplete='off' value={promoCode.code} onChangeText={(text) => { setPromoCode((prev) => { return { ...prev, code: text.trim(), error: "" } }) }} style={[styles.txtInputPromo, { borderColor: promoCode.error ? rsplTheme.rsplRed : rsplTheme.jetGrey }]} placeholder='Enter Promocode' />
                    {promoCode.code !== "" &&
                      <TouchableOpacity style={{ position: "absolute", left: 220, }} onPress={(() => { setPromoCode({ code: "" }) })}>
                        <AntDesign name={"close"} size={20} color={rsplTheme.rsplRed} />
                      </TouchableOpacity>
                    }
                  </View>


                  <Pressable style={styles.applyBtn} onPress={(() => { getValidateCoupon() })}>
                    {loaderPromoCode ?
                      (<ActivityIndicator size={"small"} color={rsplTheme.rsplWhite} />) :
                      (<Text style={styles.text}>Apply</Text>)
                    }
                  </Pressable>
                  <View style={{ marginTop: 10, }}>
                    {promoCode.status &&
                      <Text style={{ color: rsplTheme.rsplGreen, fontSize: 15, fontWeight: "500" }}>{promoCode.message} </Text>
                    }
                  </View>
                </View>
              }
            </View>

            {/* <Text> {buyNowAmount.Shipping_Charge} </Text> */}






          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <View>
        <TouchableOpacity onPress={(() => { placeOrder() })} style={styles.poweredBy}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
            {placeOrderLoader ?
              <ActivityIndicator color={rsplTheme.rsplWhite} /> :
              <Text style={styles.buttonText}>Place Order</Text>
            }
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default BuyNow

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite,
  },
  poweredBy: {
    bottom: 0,
    padding: 10,
    width: "70%",
    alignSelf: "center"
  },
  poweredByTxt: {
    color: rsplTheme.jetGrey + 75,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },

  linearGradient: {
    // flex: 1,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: rsplTheme.rsplWhite,
  },
  orderSummeryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: rsplTheme.rsplLightGrey,
    paddingLeft: 15,
    paddingRight: 15,
    height: 30,

  },
  orderSumryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: rsplTheme.textColorBold
  },
  summery: {
    fontSize: 14,
    fontWeight: "600",
    color: rsplTheme.rsplBlue
  },
  orderSumContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
  },
  orderSumLeft: {
    width: 180,
    padding: 3,
    justifyContent: "center",
  },
  orderSumLeftTitle: {
    fontSize: 14,
    color: rsplTheme.textColorBold,
    fontWeight: "500"
  },
  orderSumRight: {
    flex: 1,
    padding: 3,
    justifyContent: "center",
  },
  orderSumRightTitle: {
    fontSize: 14,
    color: rsplTheme.textColorBold,
    fontWeight: "600",
    textAlign: "right",
  },
  userAddContaner: {
    padding: 10,
    // backgroundColor: rsplTheme.jetGrey
  },
  addNewAdd: {
    color: rsplTheme.rsplRed,
    fontSize: 15,
    textAlign: "left"
  },
  userName: {
    fontSize: 16,
    marginVertical: 6,
    fontWeight: "600",
    color: rsplTheme.textColorBold,
  },
  userAdd: {
    fontSize: 12,
    fontWeight: "400",
    color: rsplTheme.textColorBold
  },
  userMob: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
    color: rsplTheme.textColorBold
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  button: {
    // backgroundColor: '#e1e1e1e1',
    borderRadius: 5,
    // padding: 5,
    // alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: rsplTheme.textColorLight,
    borderWidth: .5,
    // marginBottom: 10,
    paddingHorizontal: 10,
    color: rsplTheme.textColorBold
  },
  modalContainerEdit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  containerImg: {
    flexDirection: 'row',
    padding: 10,
  },
  imageContainer: {
    flex: 1,
    // paddingRight: 10,
    // alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: '95%',
    height: 150,
    resizeMode: 'contain',
  },
  descriptionContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: rsplTheme.textColorBold,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: rsplTheme.textColorLight,
    paddingVertical: 2,
  },
  poweredBy: {
    bottom: 0,
    padding: 10,
    width: "70%",
    alignSelf: "center"
  },
  rowContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  text1: {
    width: 50,
  },

  enterProContainer: {
    // margin: 10,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    // borderWidth: 1,
  },
  enterProHead: {
    width: 180,
    padding: 6,
    borderRadius: 6,
    // borderWidth: .5,
    // borderColor: rsplTheme.jetGrey,
    backgroundColor: rsplTheme.rsplLightGrey
  },
  enterProTitle: {
    fontSize: 14,
    textAlign: "center",
    color: rsplTheme.jetGrey
  },
  inputContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    flexWrap: "wrap"
  },
  txtInputPromo: {
    // backgroundColor: "#e1e1e1",
    borderWidth: .5,
    borderColor: rsplTheme.jetGrey,
    padding: 10,
    flex: 1,
    borderRadius: 4,
    fontSize: 16,
    paddingRight: 35,
  },

  applyBtn: {
    // width: 100,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: rsplTheme.jetGrey,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    width: 100,
    height: 30,
    borderWidth: .5,
    borderColor: rsplTheme.jetGrey,
    borderRadius: 5,
    backgroundColor: rsplTheme.rsplWhite,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    // color: '#888',
    color: rsplTheme.textColorBold
  },
  pulsButton: {
    borderRightWidth: .5,
    borderColor: rsplTheme.jetGrey,
    backgroundColor: rsplTheme.rsplLightGrey,
    padding: 2,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    width: 30,
  },
  minusButton: {
    borderLeftWidth: .5,
    borderColor: rsplTheme.jetGrey,
    backgroundColor: rsplTheme.rsplLightGrey,
    padding: 2,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: 30,
  },
  countText: {
    fontSize: 16,
    textAlign: "center",
    color: rsplTheme.rsplBlue
    // marginBottom: 20,
  },

})