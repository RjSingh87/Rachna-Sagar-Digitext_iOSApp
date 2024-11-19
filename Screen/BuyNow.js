import { Alert, StyleSheet, Keyboard, Text, TouchableOpacity, ActivityIndicator, Pressable, View, TextInput, KeyboardAvoidingView, Modal, Button, ScrollView, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../comman/Header';
import { apiRoutes, rsplTheme, token, CALLBACK_URL, MID, URL_SCHEME, baseURL, API_Key } from '../constant';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { MyContext } from '../Store';
import Services from '../services';
import Loader from '../constant/Loader';
import { generateToken } from '../PaytmService';
import RazorpayCheckout from 'react-native-razorpay';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'


const BuyNow = ({ route, singleProduct }) => {
  // console.log(route.params.singleProduct, "reerreererr")
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
  // const route = useRoute()
  // const { cartSummeryData } = route.params

  let totalPrice = `${route.params.singleProduct.item[0]?.book_mrp}` - `${route.params.singleProduct.item[0]?.book_discount}`
  let shipingCharge = 0
  let netPayableAmount = `${totalPrice}`
  if (totalPrice < 600) {
    shipingCharge = 79
    netPayableAmount = totalPrice + shipingCharge
  }

  useEffect(() => {
    if (isFocused) {
      getUserAddress()
    }
  }, [isFocused])


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
          if (res.status == "success") {
            let promoCodeMessage = `Additional discount of ${res.data?.discountValue} ${res.data?.discountType} will be applied on checkout.`
            setPromoCode((prev) => { return { ...prev, status: true, message: promoCodeMessage, checkoutPromoCode: res.data?.couponCode } })
          } else if (res.status == "error") { Alert.alert(res.message) }
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
          setAddress(res.message.slice(0, 1))
        } else {
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

  const toggleParentModal = () => {
    navigation.navigate("AddNewAddress")
    // setIsParentModalVisible(!isParentModalVisible);
  };

  const placeOrder = async () => {
    if (selectedAddress == null) {
      Alert.alert("Address", "Please add/select address.")
      return
    } else {
      setPlaceOrderLoader(true)
      const cartIDs = []
      for (let cart of cartList.Data) {
        cartIDs.push(cart.id)
      }
      const lastCartID = cartIDs[cartIDs.length - 1];
      console.log(lastCartID, "lastorder")

      const payLoad = {
        api_token: token,
        addressID: selectedAddress,
        cartIDs: [lastCartID],
        userID: userData.data[0]?.id
      }
      // console.log(payLoad, "payLoadd???")

      await Services.post(apiRoutes.razorPayOrderGenerator, payLoad)
        .then((res) => {
          let orderNumber = ""
          if (res.status == "success") {
            // console.log(res, "After successful")
            orderNumber = res.orderNumber
            var options = {
              description: 'Rachna Sagar Private Limited',
              image: "https://play-lh.googleusercontent.com/nYsABSI-d2E3ID0IXMC50RJxZcvTSvrea5YXPPnoN6NDwrmXcU5hSR5dQjF0gPkyRHA=w480-h960",
              currency: 'INR',
              key: API_Key, //'rzp_test_yXSkAOzF1i7ksl', //API_Key,
              amount: res.amount_due,
              name: 'Rachna Sagar Private Limited',
              order_id: res.orderID, // '', //res.orderID,
              timeout: 380,
              prefill: {
                email: 'foreverbook4583@gmail.com',
                contact: '9717998857',
                name: ''
              },
              theme: { color: rsplTheme.gradientColorRight } //'#53a20e' }
            }

            RazorpayCheckout.open(options)
              .then((data) => {
                verifyOrder(orderNumber, data.razorpay_order_id, data.razorpay_payment_id, data.razorpay_signature)
              })
              .catch((error) => {
                // handle failure
                // alert(`Error: ${error.code} | ${error.description}`);
                Alert.alert("Transaction cancelled.")
              })
              .finally(() => {
                setPlaceOrderLoader(false)
              })
          } else if (res.status == "error") {
            Alert.alert("Info", res.message)
          }
        })
    }
  }

  const verifyOrder = async (orderNumber, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const payLoad = {
      "api_token": token,
      "userID": userData.data[0]?.id,
      "orderNumber": orderNumber,
      "razorpay_order_id": razorpay_order_id,
      "razorpay_payment_id": razorpay_payment_id,
      "razorpay_signature": razorpay_signature
    }
    console.log(payLoad, "Verify")
    await Services.post(apiRoutes.verifyOrder, payLoad)
      .then((res) => {
        console.log(res, "OerderDATA?")
        if (res.status == "success") {
          setOrderVerifyData(res.data)
        } else if (res.status == "error") {
          if (res.message !== undefined) {
            Alert.alert("Error", res.message)
          } else {
            Alert.alert("Error", `${res.data?.code} | ${res.data?.description}`)
          }
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
    }
    // setLoader(true)
    const payLoad = {
      "api_token": token,
      "address_id": selectedAddress
    }
    await Services.post(apiRoutes.userDeleteAddress, payLoad)
      .then((res) => {
        if (res.status == "success" && res.message.length !== 0) {
          getUserAddress()
        } else {
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

  // const qunatityIncrease = () => {
  //   setQuantity(quantity + 1)
  // }
  // const qunatityDecrease = () => {
  //   setQuantity(quantity - 1)
  // }




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
        title={"Order Summary"}
        onClickLeftIcon={() => { navigation.goBack() }}
        onClickRightIcon={() => { return }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 25 }}>

        <View style={styles.userAddContaner}>
          <View style={{}}>
            <TouchableOpacity onPress={(() => { toggleParentModal() })}>
              <Text style={styles.addNewAdd}>+ ADD NEW ADDRESS</Text>
            </TouchableOpacity>
          </View>
          {address.map((item, index) => {
            let backgroundColor = rsplTheme.rsplWhite
            if (item.id == selectedAddress) {
              backgroundColor = rsplTheme.rsplGreen
            }
            return (
              <View style={{ flexDirection: "row", alignItems: "center", padding: 5, }} key={item.id}>
                <View style={styles.row}>

                  <TouchableOpacity onPress={(() => { setSelectedAddress(item.id) })} style={[styles.button, { flex: 1, flexDirection: "row", alignItems: "center", }]}>
                    <View style={{ width: 15, height: 15, borderRadius: 15 / 2, borderWidth: 1, alignItems: "center", justifyContent: "center" }}><View style={{ width: 8, height: 8, borderRadius: 8 / 2, backgroundColor: backgroundColor }}></View></View>
                    <View style={[styles.button, { marginLeft: 10, marginRight: 10, }]}>
                      <Text selectable={true} style={styles.userName}>{item.name}</Text>
                      <Text selectable={true} style={styles.userAdd}>{item.address}, {item.landmark}, {item.state} {item.city} {item.country} {item.pincode} </Text>
                      <Text selectable={true} style={styles.userMob}>{item.mobile}</Text>
                    </View>
                  </TouchableOpacity>




                  <View style={[styles.button, { justifyContent: "space-evenly" }]}>
                    <TouchableOpacity onPress={(() => {
                      if (selectedAddress != item.id) {
                        Alert.alert("Info", "Please select an address.")
                      } else {
                        setUserContactVisible(true),
                          setUserDetails((prev) => {
                            return {
                              ...prev, name: item.name, address: item.address, landmark: item.landmark, mobile: item.mobile,
                            }
                          })
                      }

                    })}
                      style={{ width: 22, height: 22, borderRadius: 22 / 2, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                      {/* <Image style={{ width: 12, height: 12, resizeMode: "contain", tintColor: rsplTheme.rsplWhite }} source={require("../assets/icons/pen.png")} /> */}
                      <Feather name="edit" size={20} color={rsplTheme.jetGrey} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(() => { deleteAddress(item.id) })}>
                      {/* <Image style={{ width: 20, height: 20, resizeMode: "contain" }} source={require("../assets/icons/trash.png")} /> */}
                      <FontAwesome6 name="trash" size={20} color={rsplTheme.rsplRed} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        <Modal
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
        </Modal>



        <View style={styles.containerImg}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: route.params.singleProduct?.frontBackImgArry[0] }}
              style={styles.image}
            />
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.title}>{route.params.singleProduct.item[0]?.product_title}</Text>
            <Text style={styles.description}>{`Class : ${route.params.singleProduct.item[0]?.class}`}</Text>
            <Text style={styles.description}>{`Subject : ${route.params.singleProduct.item[0]?.subject}`}</Text>
            <Text style={styles.description}>{`Product Type : ${route.params.activeButton}`}</Text>
            <Text style={styles.description}>{`Quantity : 1`}</Text>
            <View style={{ flexDirection: "row", }}>
              <Text style={[styles.description, { fontWeight: "700" }]}>{`\u20B9`} {route.params.activeButton == "Paperback" ? route.params.singleProduct.item[0]?.book_price : route.params.singleProduct.item[0]?.ebook_price} </Text>
              <Text style={[styles.description, { textDecorationLine: "line-through", textDecorationColor: "red", marginLeft: 10, }]}>{`\u20B9`} {route.params.activeButton == "Paperback" ? route.params.singleProduct.item[0]?.book_mrp : route.params.singleProduct.item[0]?.ebook_price} </Text>
            </View>
            <View style={{ flexDirection: "row", }}>
              <Text style={styles.description}>{`You Save : ${route.params.singleProduct.item[0]?.book_discount}`}</Text>
              <Text style={[styles.description, { marginLeft: 10, }]}>({`${route.params.singleProduct.item[0]?.book_perDiscount}% off`})</Text>
            </View>

            {/* Quantity increase decrease UI */}
            {/* <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Button title='-' onPress={qunatityDecrease} />
              <View style={{ borderWidth: .5, width: 30, height: 30, borderRadius: 5, marginHorizontal: 5, justifyContent: "center", marginVertical: 5 }}>
                <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "500" }}>{quantity}</Text>
              </View>
              <Button title='+' onPress={qunatityIncrease} />
            </View> */}

          </View>

        </View>








        <View style={styles.orderSummeryContainer}>
          <Text style={styles.orderSumryTitle}>{`ORDER SUMMARY`}</Text>
          <Text style={styles.summery}>{`View Order`}</Text>
        </View>

        <View style={styles.orderSumContainer}>
          <View style={styles.orderSumLeft}>
            <Text style={styles.orderSumLeftTitle}>Total MRP</Text>
          </View>
          <View style={styles.orderSumRight}>
            <Text style={styles.orderSumRightTitle}>{` \u20B9 ${route.params.singleProduct.item[0]?.book_mrp}`}.00</Text>
          </View>
        </View>

        <View style={styles.orderSumContainer}>
          <View style={styles.orderSumLeft}>
            <Text style={styles.orderSumLeftTitle}>Discount (-)</Text>
          </View>
          <View style={styles.orderSumRight}>
            <Text style={styles.orderSumRightTitle}>{` \u20B9 ${route.params.singleProduct.item[0]?.book_discount}`}</Text>
          </View>
        </View>

        <View style={styles.orderSumContainer}>
          <View style={styles.orderSumLeft}>
            <Text style={styles.orderSumLeftTitle}>Total Price</Text>
          </View>
          <View style={styles.orderSumRight}>
            <Text style={styles.orderSumRightTitle}>{` \u20B9 ${totalPrice}`}</Text>
          </View>
        </View>

        <View style={styles.orderSumContainer}>
          <View style={styles.orderSumLeft}>
            <Text style={styles.orderSumLeftTitle}>Shipping Charge (+)</Text>
          </View>
          <View style={styles.orderSumRight}>
            <Text style={styles.orderSumRightTitle}>{` \u20B9 ${shipingCharge}.00`}</Text>
          </View>
        </View>



        <View style={styles.orderSumContainer}>
          <View style={styles.orderSumLeft}>
            <Text style={styles.orderSumLeftTitle}>Net Payable Amount</Text>
          </View>
          <View style={styles.orderSumRight}>
            <Text style={[styles.orderSumRightTitle, { fontSize: 20, color: rsplTheme.rsplGreen }]}>{` \u20B9 ${netPayableAmount}`}</Text>
          </View>
        </View>


        {/* Enter the Promo Code UI */}
        <View style={styles.enterProContainer}>
          <TouchableOpacity style={styles.enterProHead} onPress={(() => { setEnterPromoCode(!enterPromoCode) })}>
            <Text style={styles.enterProTitle}>Enter a promo code</Text>
          </TouchableOpacity>
        </View>
        {enterPromoCode &&
          <View style={[styles.inputContainer, { marginBottom: keyboardHeight }]}>
            <TextInput autoCapitalize='none' value={promoCode.code} onChangeText={(text) => { setPromoCode((prev) => { return { ...prev, code: text, error: "" } }) }} style={[styles.txtInputPromo, { borderColor: promoCode.error ? rsplTheme.rsplRed : rsplTheme.jetGrey }]} placeholder='Enter Promocode' />
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






      </ScrollView>

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
    padding: 15,
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
    padding: 6,
    justifyContent: "center",
  },
  orderSumLeftTitle: {
    fontSize: 14,
    color: rsplTheme.textColorBold,
    fontWeight: "500"
  },
  orderSumRight: {
    flex: 1,
    padding: 6,
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
    fontSize: 14,
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
    marginTop: 2,
    fontWeight: "400",
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
  containerImg: {
    flexDirection: 'row',
    padding: 10,
  },
  imageContainer: {
    flex: 1,
    paddingRight: 10,
  },
  image: {
    width: '100%',
    height: 200,
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
    margin: 10,
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "center"
  },
  enterProHead: {
    width: 180,
    padding: 10,
    borderRadius: 4,
    // borderWidth: .5,
    // borderColor: rsplTheme.jetGrey,
    backgroundColor: rsplTheme.rsplLightGrey
  },
  enterProTitle: {
    fontSize: 16,
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
  },

  applyBtn: {
    width: 100,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
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

})