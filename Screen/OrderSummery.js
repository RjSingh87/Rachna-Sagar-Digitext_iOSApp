import { Alert, StyleSheet, Text, TouchableOpacity, Keyboard, View, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Modal, Button, ScrollView, Image, Pressable, ActivityIndicator, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../comman/Header';
import { apiRoutes, rsplTheme, token, CALLBACK_URL, MID, URL_SCHEME, baseURL, API_Key } from '../constant';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { MyContext } from '../Store';
import Services from '../services';
import Loader from '../constant/Loader';
// import RazorpayCheckout from 'react-native-razorpay';
import AllInOneSDKManager from 'paytm_allinone_react-native';
// import { generateToken } from '../PaytmService';
import NoInternetConn from './NoInternetConn';
import Icon from 'react-native-vector-icons/Feather'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import DeviceInfo from 'react-native-device-info';


const OrderSummery = ({ }) => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const { userData, grandTotal, cartList, getAllCartItems } = useContext(MyContext)
  const [loader, setLoader] = useState(false)
  const [address, setAddress] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [userContactVisible, setUserContactVisible] = useState(false)
  const [userDeatail, setUserDetails] = useState({ name: "", address: "", landmark: "", mobile: "" })
  const [orderVerifyData, setOrderVerifyData] = useState([])
  const [enterPromoCode, setEnterPromoCode] = useState(false)
  const [viewOrderData, setViewOrderData] = useState(true)
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [promoCode, setPromoCode] = useState({ status: false, code: '', message: '', checkoutPromoCode: '' })
  const [loaderPromoCode, setLoaderPromoCode] = useState(false)
  const [addtoCartAmount, setAddtoCartAmount] = useState([])
  const [loaderCartTotal, setLoaderCartTotal] = useState(false)


  // const route = useRoute()
  // const { cartSummeryData } = route.params

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


  useEffect(() => {
    if (isFocused) {
      getUserAddress()
    }
  }, [isFocused])


  useEffect(() => {
    if (cartList?.Data?.length > 0) {
      const cartIDs = cartList.Data.map(cart => cart.id);
      calculateAmountOfAddtoCart(cartIDs);
    }
  }, [cartList, address]);

  const calculateAmountOfAddtoCart = async (cartIDs) => {
    setLoaderCartTotal(true)
    const payLoad = {
      "api_token": token,
      "userid": userData.data[0]?.id,
      "cartIDs": cartIDs
    }

    try {
      const result = await Services.post(apiRoutes.grandTotalOfCart, payLoad)
      if (result.result && result.status === "success") {
        setLoaderCartTotal(false)
        const data = result.result
        setAddtoCartAmount(data || [])
      } else if (result.success === "false") {
        Alert.alert("Failed:", result?.errors || "Failed to load.")
        setLoaderCartTotal(false)
      }
    } catch (error) {
      setLoaderCartTotal(false)
      if (error.message === "TypeError: Network request failed") {
        Alert.alert("Network Error", "Please try again.");
      } else {
        Alert.alert("Error:", error.message || "Something went wrong.")
      }
    }
  }



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
        console.log(result.message, "not welll")
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
    // console.log(selectedAddress, "all delete par")
    if (selectedAddress == null || !address.length > 0) {
      Alert.alert("Address", "Please add/select address.");
      return;
    }

    const cartIDs = cartList.Data.map(cart => cart.id);

    const payLoad = {
      api_token: token,
      addressID: selectedAddress,
      cartIDs: cartIDs,
      userID: userData.data[0]?.id,
      couponCode: promoCode?.checkoutPromoCode
    };
    // console.log(payLoad, "of Address id")

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
          await verifyOrder(result?.ORDERID, cartIDs, result?.TXNAMOUNT);
          const eBookProductID = cartList?.Data?.filter(item => item.product_type === "Ebook").map(cart => cart.productId) || [];
          if (eBookProductID.length > 0) {
            eBookDownloadPermissions(orderId, eBookProductID)
          }
          // navigation.goBack();
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

  const getDeviceID = async () => {
    const uniqueId = await DeviceInfo.getUniqueId();  // Har device ka ek alag ID hota hai
    const model = await DeviceInfo.getModel();
    let deviceInfo = {
      "uniqueId": uniqueId,
      "model": model
    }
    return deviceInfo;
  };


  const eBookDownloadPermissions = async (orderId, eBookProductID) => {
    try {
      const deviceId = (await getDeviceID()).uniqueId;
      const model = (await getDeviceID()).model;
      const payload = {
        "api_token": token,
        "userID": userData.data[0]?.id,
        "orderID": orderId, //45698,
        "productId": eBookProductID, //3124,
        //"zip_title": route.params.singleProduct.item[0]?.product_title, //"TogetherWithDemoTestPdf",
        //"book_type": productType, //"eBook",
        "last_mob_device_id": deviceId, //"59961f43dd911d056",
        "last_mob_model": model, //"MotoG3-TE"
      }
      console.log(payload, "after payment successfully")
      const result = await Services.post(apiRoutes.eBookDownload, payload)
      if (result.status === "success") {
        console.log(result.message, "After success.")
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


  // razorpay_order_id
  // const placeOrder = async () => {
  //   if (selectedAddress == null) {
  //     Alert.alert("Address", "Please add/select address.")
  //     return
  //   } else {
  //     const cartIDs = []
  //     for (let cart of cartList.Data) {
  //       cartIDs.push(cart.id)
  //     }

  //     const payLoad = {
  //       api_token: token,
  //       addressID: selectedAddress,
  //       cartIDs: cartIDs,
  //       userID: userData.data[0]?.id,
  //       couponCode: promoCode?.checkoutPromoCode
  //     }

  //     await Services.post(apiRoutes.razorPayOrderGenerator, payLoad)
  //       .then((res) => {
  //         let orderNumber = ""
  //         if (res.status == "success") {
  //           orderNumber = res.orderNumber
  //           var options = {
  //             description: 'Rachna Sagar Pvt. Ltd.',
  //             image: "https://play-lh.googleusercontent.com/nYsABSI-d2E3ID0IXMC50RJxZcvTSvrea5YXPPnoN6NDwrmXcU5hSR5dQjF0gPkyRHA=w480-h960", //require('../assets/icons/ForeverbooksLogo.png'), //'https://i.imgur.com/3g7nmJC.jpg',
  //             currency: 'INR',
  //             key: API_Key, //'rzp_test_yXSkAOzF1i7ksl', //API_Key,
  //             amount: res.amount_due,
  //             name: 'Rachna Sagar Pvt. Ltd.',
  //             order_id: res.orderID, // '', //res.orderID,
  //             timeout: 380,
  //             prefill: {
  //               email: 'foreverbook4583@gmail.com',
  //               contact: '9717998857',
  //               name: ''
  //             },
  //             theme: { color: rsplTheme.gradientColorRight } //'#53a20e' }
  //           }

  //           RazorpayCheckout.open(options)
  //             .then((data) => {
  //               verifyOrder(orderNumber, cartIDs, data.razorpay_order_id, data.razorpay_payment_id, data.razorpay_signature)
  //               navigation.goBack()
  //               getAllCartItems() //rest cart item show after checkout
  //             })
  //             .catch((error) => {
  //               // handle failure
  //               // alert(`Error: ${error.code} | ${error.description}`);
  //               Alert.alert("Transaction cancelled.")
  //               setPromoCode((prev) => { return { ...prev, status: false, code: "", checkoutPromoCode: "" } })
  //             });
  //         } else if (res.status == "error") {
  //           Alert.alert("Info", res.message)
  //         }
  //       })
  //   }
  // }

  const verifyOrder = async (orderNumber, cartIDs, TXNAMOUNT) => {
    // console.log(orderNumber, "YashverifyOrder")
    const payLoad = {
      "api_token": token,
      "orderNumber": orderNumber,
      "cartIDs": cartIDs
    }
    // console.log(payLoad, "cartIDs")
    await Services.post(apiRoutes.paymentStatus, payLoad)
      .then((res) => {
        if (res.status === "success") {
          // console.log(res, "When Success")
          navigation.navigate("PaymentSuccessScreen", { txnStatus: res.message, txnAmount: TXNAMOUNT })
          getAllCartItems();
          //navigation.goBack() // land to cart page
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
          Alert.alert("Success:", res.message)
          getUserAddress()
          setUserContactVisible(false)
        } else {
          Alert.alert("Failed:", res.message)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { })

  }

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
          } else if (res.status === "failed") {
            Alert.alert(res.message)
            // setPromoCode({ code: "" })
            setPromoCode((prev) => { return { ...prev, error: "Validation Error" } })
          }
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


  if (loader) {
    return (
      <View style={styles.loader}>
        <Loader text='Loading...' />
      </View>
    )
  }






  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Order Summary"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      <NoInternetConn />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={{ flex: 1, }} behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset={Platform.OS === "ios" ? 75 : 0}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, }} keyboardShouldPersistTaps="handled">

            <View style={styles.userAddContaner}>
              <TouchableOpacity style={{ paddingVertical: 10, }} onPress={(() => { toggleParentModal() })}>
                <Text style={styles.addNewAdd}>+ ADD NEW ADDRESS</Text>
              </TouchableOpacity>
              {address.filter(item => item.byDefault === 1).map((item, index) => {
                // console.log(item.byDefault, "item.byDefault")
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
                          <Text selectable={true} style={styles.userAdd}>{item.address}, {item?.landmark}, {item.state} {item.city} {item.country} {item.pincode} </Text>
                          <Text selectable={true} style={styles.userMob}>+91 {item?.mobile}</Text>
                        </View>
                      </TouchableOpacity>




                      {/* <View style={[styles.button, { justifyContent: "space-evenly" }]}>
                    <TouchableOpacity onPress={(() => {
                      if (selectedAddress != item.id) {
                        Alert.alert("Info", "Please select an address.")
                      } else {
                        setUserContactVisible(true),
                          setUserDetails((prev) => {
                            return {...prev, name: item.name, address: item.address, landmark: item.landmark, mobile: item.mobile,}
                          })
                      }

                    })}
                      style={{ width: 22, height: 22, borderRadius: 22 / 2, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                      <Feather name="edit" size={20} color={rsplTheme.jetGrey} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(() => { deleteAddress(item.id) })}>
                      <FontAwesome6 name="trash" size={17} color={rsplTheme.rsplRed} />
                    </TouchableOpacity>
                  </View> */}

                    </View>
                  </View>
                )
              })}

              {address.length >= 1 &&
                <TouchableOpacity style={{ marginLeft: 10, }} onPress={(() => { navigation.navigate("SavedAddress", { type: "AddtoCart" }) })}>
                  <Text style={{ color: rsplTheme.rsplBlue, fontSize: 15 }}>Change delivery address</Text>
                </TouchableOpacity>
              }


            </View>



            {/* Address upadate and delete UI commented by Raju 22Jan2025 */}
            {/* <Modal
          animationType="slide"
          transparent={true}
          visible={userContactVisible}
        >
          <KeyboardAvoidingView style={styles.modalContainerEdit}>
            <View style={[styles.modalContent, { borderBottomRightRadius: 20, borderBottomLeftRadius: 20, }]}>
              <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
                <View style={{ flex: 1, flexDirection: "column", }}>
                  <View style={styles.rowContainer}>
                    <Text style={styles.text1}>Name</Text>
                    <TextInput
                      style={styles.input}
                      value={userDeatail.name}
                      returnKeyType='send'
                      onChangeText={(txt) => { userInputValHandle(txt, "name") }}
                    />
                  </View>

                  <View style={styles.rowContainer}>
                    <Text style={styles.text1}>Add. 1</Text>
                    <TextInput
                      style={styles.input}
                      value={userDeatail.address}
                      onChangeText={(txt) => { userInputValHandle(txt, "address") }}
                    />
                  </View>


                  <View style={styles.rowContainer}>
                    <Text style={styles.text1}>Add. 2</Text>
                    <TextInput
                      style={styles.input}
                      value={userDeatail.landmark}
                      onChangeText={(txt) => { userInputValHandle(txt, "landmark") }}
                    />
                  </View>

                  <View style={styles.rowContainer}>
                    <Text style={styles.text1}>Mob.</Text>
                    <TextInput
                      style={styles.input}
                      value={userDeatail.mobile}
                      onChangeText={(txt) => { userInputValHandle(txt, "mobile") }}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>




                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                  <Button title="Save" onPress={(() => { saveEditAddress() })} />
                  <Button title='Close' onPress={(() => { setUserContactVisible(false) })} />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal> */}




            <View style={styles.orderSummeryContainer}>
              <Text style={styles.orderSumryTitle}>{`ORDER SUMMARY`}</Text>
              <TouchableOpacity onPress={(() => { setViewOrderData(!viewOrderData) })} style={styles.summery}>
                {/* <Text style={{ fontSize: 15, fontWeight: "600", color: rsplTheme.rsplBlue }}>{`View Order`}</Text> */}
                <Icon size={22} name={viewOrderData ? "chevron-down" : "chevron-up"} />
              </TouchableOpacity>
            </View>

            {viewOrderData &&
              <>
                {loaderCartTotal ?
                  <ActivityIndicator size={"large"} color={rsplTheme.jetGrey} /> :
                  <>
                    <View style={styles.orderSumContainer}>
                      <View style={styles.orderSumLeft}>
                        <Text style={styles.orderSumLeftTitle}>Total MRP</Text>
                      </View>
                      <View style={styles.orderSumRight}>
                        <Text style={styles.orderSumRightTitle}>{` \u20B9 ${addtoCartAmount?.Total_Merged_MRP}`}</Text>
                        {/* <Text style={styles.orderSumRightTitle}>{` \u20B9 ${grandTotal.data?.Total_Merged_MRP}`}</Text> */}
                      </View>
                    </View>

                    <View style={styles.orderSumContainer}>
                      <View style={styles.orderSumLeft}>
                        <Text style={styles.orderSumLeftTitle}>Discount (-)</Text>
                      </View>
                      <View style={styles.orderSumRight}>
                        <Text style={styles.orderSumRightTitle}>{` \u20B9 ${addtoCartAmount?.Total_Merged_discount}`}</Text>
                        {/* <Text style={styles.orderSumRightTitle}>{` \u20B9 ${grandTotal.data?.Total_Merged_discount}`}</Text> */}
                      </View>
                    </View>

                    <View style={styles.orderSumContainer}>
                      <View style={styles.orderSumLeft}>
                        <Text style={styles.orderSumLeftTitle}>Total Price</Text>
                      </View>
                      <View style={styles.orderSumRight}>
                        <Text style={styles.orderSumRightTitle}>{` \u20B9 ${addtoCartAmount?.Total_Merged_price}`}</Text>
                        {/* <Text style={styles.orderSumRightTitle}>{` \u20B9 ${grandTotal.data?.Total_Merged_price}`}</Text> */}
                      </View>
                    </View>

                    <View style={styles.orderSumContainer}>
                      <View style={styles.orderSumLeft}>
                        <Text style={styles.orderSumLeftTitle}>Shipping Charge (+)</Text>
                      </View>
                      <View style={styles.orderSumRight}>
                        <Text style={styles.orderSumRightTitle}>{` \u20B9 ${addtoCartAmount?.Shipping_Charge}`}</Text>
                        {/* <Text style={styles.orderSumRightTitle}>{` \u20B9 ${grandTotal.data?.Shipping_Charge}`}</Text> */}
                      </View>
                    </View>



                    <View style={styles.orderSumContainer}>
                      <View style={styles.orderSumLeft}>
                        <Text style={styles.orderSumLeftTitle}>Net Payable Amount</Text>
                      </View>
                      <View style={styles.orderSumRight}>
                        <Text style={[styles.orderSumRightTitle, { fontSize: 18, color: rsplTheme.rsplGreen }]}>{` \u20B9 ${addtoCartAmount?.Total_grand_price}`}</Text>
                      </View>
                    </View>
                  </>
                }

                {/* Enter the Promo Code UI */}

                <View style={{ flexDirection: "column", }}>
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
              </>
            }



          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <View>
        <TouchableOpacity onPress={(() => { placeOrder() })} style={styles.poweredBy}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
            <Text style={styles.buttonText}> <MaterialCommunityIcons name="cart-check" size={20} color={rsplTheme.rsplWhite} /> Checkout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OrderSummery

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
    marginBottom: 5
  },
  orderSumryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: rsplTheme.textColorBold
  },
  summery: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: 60,
    paddingRight: 8,
  },
  orderSumContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
  },
  orderSumLeft: {
    width: 180,
    padding: 4,
    justifyContent: "center",
  },
  orderSumLeftTitle: {
    fontSize: 15,
    color: rsplTheme.textColorBold,
    fontWeight: "500"
  },
  orderSumRight: {
    flex: 1,
    padding: 4,
    justifyContent: "center",
  },
  orderSumRightTitle: {
    fontSize: 15,
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
    fontSize: 16,
    textAlign: "left"
  },
  userName: {
    fontSize: 16,
    marginVertical: 0,
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
    // borderWidth: 1,
  },
  button: {
    // backgroundColor: '#e1e1e1e1',
    borderRadius: 5,
    padding: 5,
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
  enterProContainer: {
    margin: 10,
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "center"
  },
  enterProHead: {
    width: 180,
    padding: 5,
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
    flex: 1,
    alignItems: "center",
    flexWrap: "wrap"
    // justifyContent: "space-around",
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
  rowContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  text1: {
    // flex: 1
    width: 50,
  },

})