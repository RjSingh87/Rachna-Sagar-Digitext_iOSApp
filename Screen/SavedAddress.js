import { StyleSheet, Text, View, Image, Alert, Modal, Button, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from '../comman/Header'
import { apiRoutes, rsplTheme, token } from '../constant'
import { MyContext } from '../Store'
import Services from '../services'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { useIsFocused } from '@react-navigation/native'


const SavedAddress = ({ route, navigation }) => {

  // const { routeData } = route?.params
  // const { type } = routeData
  // console.log(type, "dmdmdmdm?")


  const { userData } = useContext(MyContext)
  const [address, setAddress] = useState({ userAddress: [], error: null })
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [loader, setLoader] = useState(false)
  const [userContactVisible, setUserContactVisible] = useState(false)
  const [userDeatail, setUserDetails] = useState({ name: "", address: "", landmark: "", mobile: "", country: "", state: "", cityTown: "", pincode: "" })
  const isFocused = useIsFocused()


  useEffect(() => {
    fetchUserAddress()
  }, [isFocused])

  const fetchUserAddress = async () => {
    setLoader(true)
    try {
      const payLoad = {
        "api_token": token,
        "userID": userData.data[0]?.id
      }
      // console.log(payLoad, "akdkdk")
      const result = await Services.post(apiRoutes.getUserAddress, payLoad)
      if (result.status === "success") {
        const sortedAddresses = result.message.sort((a, b) => b.byDefault - a.byDefault);
        setAddress((perv) => { return { ...perv, userAddress: sortedAddresses, error: null } })
        setLoader(false)
      } else if (result.status === "failed") {
        // Alert.alert("Address", result.message) || "Fetching address failed"
        setLoader(false)
        setAddress((perv) => { return { ...perv, userAddress: [], error: result.message } })
      }
    } catch (error) {
      setLoader(false);
      if (error.message === "TypeError: Network request failed") {
        Alert.alert("Network Error", `Please try again.`);
      } else {
        Alert.alert("Error", `${error.message || 'Something went wrong'}`);
      }
    }
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
        Alert.alert("Info", result.message || "Fetch default address went wrong.")
        fetchUserAddress()
      } else if (result.status === "failed") {
        Alert.alert("Failed", result.message || "Fetch default address failed.")
      }
    } catch (error) {
      Alert.alert("Error:", result.message || "Something went wrong.")
      console.log(error.message, "Something went wrong")
    }
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
          fetchUserAddress()
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

  const deleteAddress = async (id) => {
    const sortedAddressId = address?.userAddress?.filter(item => item.byDefault === 1);
    const currentAddressId = sortedAddressId[0].id


    if (currentAddressId != id) {
      Alert.alert("Info", "Please select an address.")
      return
    } else {
      setLoader(true)
      const payLoad = {
        "api_token": token,
        "address_id": currentAddressId//selectedAddress
      }
      console.log(payLoad, "after delete")
      await Services.post(apiRoutes.userDeleteAddress, payLoad)
        .then((res) => {
          if (res.status == "success" && res.message.length !== 0) {
            console.log(res, "after suceeedd")
            fetchUserAddress()
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

  const toggleParentModal = () => {
    navigation.navigate("AddNewAddress")
  };



  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={route?.params?.type === "BuyNow" || route?.params?.type === "AddtoCart" ? "Change Address" : "Saved Address"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      <View style={styles.addContainer}>

        <View style={{ marginTop: 30, alignSelf: "center", width: 200, height: 200, borderRadius: 200 / 2, borderWidth: 5, alignItems: "center", justifyContent: "center", overflow: "hidden", borderColor: rsplTheme.rsplWhite }}>
          <Image style={{ width: 220, height: 220, resizeMode: "cover" }} source={require("../assets/icons/Locationreview.gif")} />
        </View>

        <View style={{ flex: 1, padding: 10, }}>
          <View style={{ marginBottom: 10, }}>
            <TouchableOpacity onPress={(() => { toggleParentModal() })}>
              <Text style={styles.addNewAdd}>+ ADD NEW ADDRESS</Text>
            </TouchableOpacity>
          </View>

          {loader ?
            <ActivityIndicator size={"small"} color={rsplTheme.jetGrey} /> :
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ marginTop: 10, paddingBottom: 50, }}>
              {address?.userAddress.length > 0 ?
                <>
                  {address?.userAddress?.map((item, index) => {
                    // console.log(item.byDefault, "item.byDefault")
                    let backgroundColor = rsplTheme.rsplWhite
                    item.byDefault === 1 ? backgroundColor = rsplTheme.rsplGreen : backgroundColor = backgroundColor
                    if (item.byDefault === 1 && selectedAddress == null) {
                      // console.log("first", item?.id)
                      setSelectedAddress(item?.id)
                    }
                    // console.log(loader, "loaderselected address???")
                    // if (item.id == selectedAddress) {
                    //   backgroundColor = rsplTheme.rsplGreen
                    // }
                    return (
                      <View style={{ flexDirection: "row", alignItems: "center", padding: 5, }} key={item.id}>
                        <View style={styles.row}>

                          {loader && selectedAddress == item?.id ?
                            <ActivityIndicator size={"large"} color={rsplTheme.rsplRed} /> :
                            <TouchableOpacity onPress={(() => { fetchDefaultAddress(item.id) })} style={[styles.button, { flex: 1, flexDirection: "row", alignItems: "center", }]}>
                              <View style={{ width: 15, height: 15, borderRadius: 15 / 2, borderWidth: 1, alignItems: "center", justifyContent: "center" }}><View style={{ width: 8, height: 8, borderRadius: 8 / 2, backgroundColor: backgroundColor }}></View></View>
                              <View style={[styles.button, { marginLeft: 10, marginRight: 10, }]}>
                                <Text selectable={true} style={styles.userName}>{item.name}</Text>
                                <Text selectable={true} style={styles.userAdd}>{item.address}, {item.landmark}, {item.state} {item.city} {item.country} {item.pincode} </Text>
                                <Text selectable={true} style={styles.userMob}>+91 {item.mobile}</Text>
                              </View>
                            </TouchableOpacity>
                          }

                          <View style={[styles.button, { justifyContent: "space-evenly" }]}>
                            <TouchableOpacity onPress={(() => {
                              const sortedAddressId = address?.userAddress?.filter(item => item.byDefault === 1);
                              const currentAddressId = sortedAddressId[0].id

                              if (currentAddressId != item.id) {
                                Alert.alert("Info", "Please select an address.")
                              } else {
                                navigation.navigate("EditAddress", { userData: item })
                                return
                                setUserContactVisible(true),
                                  setUserDetails((prev) => {
                                    return {
                                      ...prev, name: item?.name, address: item?.address, landmark: item?.landmark, mobile: item?.mobile, country: item?.country, state: item?.state, cityTown: item?.city, pincode: item?.pincode
                                    }
                                  })
                              }
                            })}
                              style={{ width: 22, height: 22, borderRadius: 22 / 2, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                              <Feather name="edit" size={16} color={rsplTheme.jetGrey} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={(() => { deleteAddress(item.id) })}>
                              <FontAwesome6 name="trash" size={15} color={rsplTheme.rsplRed} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </> :
                <Text style={{ textAlign: "center", color: rsplTheme.jetGrey }}> {`${address.error}`} </Text>
              }

            </ScrollView>
          }
        </View>
      </View>

      {/* This popup is commented by Raju 21-01-2025 because made seperate component  */}

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
                    value={userDeatail?.name}
                    returnKeyType='send'
                    onChangeText={(txt) => { userInputValHandle(txt, "name") }}
                  />
                </View>

                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Mob.</Text>
                  <TextInput
                    style={styles.input}
                    value={userDeatail?.mobile}
                    onChangeText={(txt) => { userInputValHandle(txt, "mobile") }}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>


                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Country</Text>
                  <TextInput
                    style={styles.input}
                    value={userDeatail?.country}
                    onChangeText={(txt) => { userInputValHandle(txt, "country") }}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>


                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>State</Text>
                  <TextInput
                    style={styles.input}
                    value={userDeatail?.state}
                    onChangeText={(txt) => { userInputValHandle(txt, "state") }}
                  />
                </View>


                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>City/Town</Text>
                  <TextInput
                    style={styles.input}
                    value={userDeatail?.cityTown}
                    onChangeText={(txt) => { userInputValHandle(txt, "citytown") }}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>



                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Address (Area and Street)</Text>
                  <TextInput
                    style={styles.input}
                    value={userDeatail?.address}
                    onChangeText={(txt) => { userInputValHandle(txt, "address") }}
                  />
                </View>


                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Landmark</Text>
                  <TextInput
                    style={styles.input}
                    value={userDeatail?.landmark}
                    onChangeText={(txt) => { userInputValHandle(txt, "landmark") }}
                  />
                </View>


                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Pin code</Text>
                  <TextInput
                    style={styles.input}
                    value={userDeatail?.pincode}
                    onChangeText={(txt) => { userInputValHandle(txt, "pincode") }}
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



    </View>
  )
}

export default SavedAddress

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite,
  },
  addContainer: {
    flex: 1,
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
    padding: 10,
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
    padding: 6,
    justifyContent: "center",
  },
  orderSumLeftTitle: {
    fontSize: 15,
    color: rsplTheme.textColorBold,
    fontWeight: "500"
  },
  orderSumRight: {
    flex: 1,
    padding: 6,
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
    fontSize: 14,
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
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    backgroundColor: rsplTheme.rsplWhite,
    borderColor: rsplTheme.rsplWhite,
    marginVertical: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
    paddingRight: 35,
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
  rowContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  text1: {
    // flex: 1
    width: 90,
  },
})