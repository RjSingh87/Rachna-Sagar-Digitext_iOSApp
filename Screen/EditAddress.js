import { StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, Keyboard, Platform, TouchableWithoutFeedback, TextInput, Button, Image, Modal, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Header from '../comman/Header'
import { apiRoutes, rsplTheme, token } from '../constant'
import Services from '../services'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const EditAddress = ({ route, navigation }) => {
  const { userData } = route.params || {};
  const { name, country, landmark, mobile, pincode, state, city, address, id } = userData || {};
  const [loader, setLoader] = useState({ saveLoader: false, countryLoader: false, popupStatus: false })
  const [cityStateCountry, setCityStateCountry] = useState({ status: false, list: [], type: "" })
  const [userDetail, setUserDetails] = useState({
    name: name || "",
    address: address || "",
    landmark: landmark || "",
    mobile: mobile || "",
    country: country || "",
    state: state || "",
    cityTown: city || "",
    pincode: pincode || "",
    selectedAddressId: id || ""
  });


  const userInputValHandle = (txt, type) => {
    if (type == "name") {
      setUserDetails((prev) => { return { ...prev, name: txt, } })
    } else if (type == "address") {
      setUserDetails((prev) => { return { ...prev, address: txt, } })
    } else if (type == "landmark") {
      setUserDetails((prev) => { return { ...prev, landmark: txt, } })
    } else if (type == "mobile") {
      setUserDetails((prev) => { return { ...prev, mobile: txt.replace(/[^0-9]/g, ''), } })
    } else if (type == "citytown") {
      setUserDetails((prev) => { return { ...prev, cityTown: txt } })
    } else if (type == "state") {
      setUserDetails((prev) => { return { ...prev, state: txt } })
    } else if (type == "pincode") {
      setUserDetails((prev) => { return { ...prev, pincode: txt } })
    } else if (type == "country") {
      setUserDetails((prev) => { return { ...prev, country: txt } })
    } else {
      return
      Alert.alert("DFFF",)
    }
  }

  const saveEditAddress = async () => {

    if (
      userDetail.name.trim() === "" ||
      userDetail.mobile.trim() === "" ||
      userDetail.address.trim() === "" ||
      userDetail.pincode.trim() === "" ||
      userDetail.landmark.trim() === "" ||
      userDetail?.country == null ||
      userDetail?.cityTown.trim() === "" ||
      userDetail?.state.trim() === "") {
      Alert.alert("Info", "Please fill all fields.");
      return;
    }

    // Validate mobile number length
    else if (userDetail.mobile.length !== 10) {
      Alert.alert("Mobile Number", "Please enter a valid mobile number.");
      return;
    }

    // Validate zip code length
    else if (userDetail.pincode.length !== 6) {
      Alert.alert("Zip Code", "Please enter a valid zip code.");
      return;
    }

    // Validate city/town and state to contain only letters and spaces
    const citytownAndStateRegex = /^[A-Za-z\s]+$/;

    if (!citytownAndStateRegex.test(userDetail?.cityTown)) {
      Alert.alert("City/Town", "City must only contain letters and spaces.");
      return;
    }

    if (!citytownAndStateRegex.test(userDetail?.state)) {
      Alert.alert("State", "State must only contain letters and spaces.");
      return;
    }

    else {
      setLoader((prev) => { return { saveLoader: true } })
      try {
        const payLoad = {
          "api_token": token,
          "addressID": userDetail.selectedAddressId,
          "name": userDetail.name,
          "address": userDetail.address,
          "mobile": userDetail.mobile,
          "landmark": userDetail.landmark,
          "country": userDetail.country,
          "cityTown": userDetail.cityTown,
          "state": userDetail.state,
          "pincode": userDetail.pincode
        }
        const result = await Services.post(apiRoutes.userEditAddressSave, payLoad)
        if (result.message && result.status === "success") {
          setLoader((prev) => { return { saveLoader: false } })
          Alert.alert("Info", result.message)
          navigation.goBack()
        } else if (result.status === "error") {
          setLoader((prev) => { return { saveLoader: false } })
          Alert.alert("Address", `${result.message}`)
        }

      } catch (error) {
        if (error.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${error.message}`) }
      }

    }

  }

  const getCountryList = async () => {
    setLoader((prev) => { return { countryLoader: true } })
    const payLoad = { "api_token": token, }

    try {
      const res = await Services.post(apiRoutes.countryList, payLoad);
      if (res.status === "success" && res.result.length !== 0) {
        setLoader((prev) => { return { countryLoader: false, popupStatus: true } })
        // Use localeCompare for better alphabetic sorting
        const sortedResult = res.result.sort((a, b) => {
          return a.country.localeCompare(b.country);
        });
        setCityStateCountry((prev) => {
          return { ...prev, status: true, list: sortedResult, type: "Country" }
        });
      } else if (res.status === "failed") {
        setLoader((prev) => { return { countryLoader: false } })
        Alert.alert("Country", `${res.message}`);
      }
    } catch (err) {
      if (err.message === "TypeError: Network request failed") {
        setLoader((prev) => { return { countryLoader: false } })
        Alert.alert("Network Error", "Please try again.");
      } else {
        Alert.alert("Error", err.message || "Something went wrong.");
      }
    }
  }

  const SetValue = (item) => {
    if (cityStateCountry.type === "Country") {
      setUserDetails((prev) => {
        return { ...prev, country: item.country };  // Assuming 'item.country' holds the country name
      });
      setCityStateCountry((perv) => { return { ...perv, status: false } })
    }
    // else if (cityStateCountry.type === "State") {
    //   setSelectItem((prev) => { return { ...prev, state: item, city: null, } })
    //   setCityStateCountry((perv) => { return { ...perv, status: false } })
    // } else if (cityStateCountry.type == "City") {
    //   setSelectItem((prev) => { return { ...prev, city: item, } })
    //   setCityStateCountry((perv) => { return { ...perv, status: false } })
    // }
  }






  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Edit Address"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />


      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <KeyboardAvoidingView style={styles.modalContainerEdit} behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
          <View style={[styles.modalContent,]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, }} keyboardShouldPersistTaps="handled">
              <View style={{ flex: 1, flexDirection: "column", }}>
                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={userDetail?.name}
                    returnKeyType='send'
                    onChangeText={(txt) => { userInputValHandle(txt, "name") }}
                  />
                </View>

                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Mob.</Text>
                  <TextInput
                    style={styles.input}
                    value={userDetail?.mobile}
                    onChangeText={(txt) => { userInputValHandle(txt, "mobile") }}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>


                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Country</Text>

                  <TouchableOpacity onPress={(() => { getCountryList() })} style={[styles.input, { flex: 1, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }]}>
                    <View style={{ width: "65%", height: 40, justifyContent: "center" }}>
                      <Text style={{ color: rsplTheme.textColorBold, fontWeight: "400" }}>{userDetail?.country ? userDetail.country : "Select country"}</Text>
                    </View>
                    {loader.countryLoader ?
                      <ActivityIndicator size={"small"} color={rsplTheme.jetGrey} /> :
                      <View style={{ paddingHorizontal: 8, height: 40, flex: 1, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 0 }}>
                        <EvilIcons name="chevron-down" size={30} color={rsplTheme.jetGrey} />
                      </View>
                    }
                  </TouchableOpacity>

                  {/* <TextInput
                  style={styles.input}
                  value={userDetail?.country}
                  onChangeText={(txt) => { userInputValHandle(txt, "country") }}
                /> */}
                </View>


                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>State</Text>
                  <TextInput
                    style={styles.input}
                    value={userDetail?.state}
                    onChangeText={(txt) => { userInputValHandle(txt, "state") }}
                  />
                </View>


                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>City/Town</Text>
                  <TextInput
                    style={styles.input}
                    value={userDetail?.cityTown}
                    onChangeText={(txt) => { userInputValHandle(txt, "citytown") }}
                  />
                </View>



                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Address (Area and Street)</Text>
                  <TextInput
                    style={styles.input}
                    value={userDetail?.address}
                    onChangeText={(txt) => { userInputValHandle(txt, "address") }}
                  />
                </View>


                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Landmark</Text>
                  <TextInput
                    style={styles.input}
                    value={userDetail?.landmark}
                    onChangeText={(txt) => { userInputValHandle(txt, "landmark") }}
                  />
                </View>


                <View style={styles.rowContainer}>
                  <Text style={styles.text1}>Pin code</Text>
                  <TextInput
                    style={styles.input}
                    value={userDetail?.pincode}
                    onChangeText={(txt) => { userInputValHandle(txt, "pincode") }}
                    keyboardType='numeric'
                    maxLength={6}
                  />
                </View>



              </View>
            </ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              {loader.saveLoader ?
                <ActivityIndicator size={"large"} color={rsplTheme.jetGrey} /> :
                <Button title="Save" onPress={(() => { saveEditAddress() })} />
              }
              <Button title='Close' onPress={(() => { navigation.goBack() })} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>


      <Modal
        animationType='slide'
        transparent={true}
        visible={cityStateCountry?.status}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={{ width: "100%", flex: 1, }} onPress={(() => { setCityStateCountry((prev) => { return { ...prev, status: false } }) })} />
          <View style={styles.greyDesign}></View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {cityStateCountry.list?.map((item, index) => {
              const isSelected = item?.country === userDetail?.country

              // let allListItem = ""
              // let radioBtnColor = false;
              // if (cityStateCountry.type === "Country") {
              //   // allListItem = `${item.concatenatedCode}`
              //   allListItem = `${item?.country}`
              //   radioBtnColor = item.id === selectItem.country?.id
              // }

              const backgroundColor = isSelected ? rsplTheme.gradientColorRight : "transparent";
              const width = isSelected ? 8 : 16
              const height = isSelected ? 8 : 16
              const borderRadius = isSelected ? 4 : 8

              return (
                <View style={styles.itemContainer} key={index.toString()}>
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", }} onPress={(() => { SetValue(item) })}>
                    <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: rsplTheme.jetGrey, alignItems: "center", justifyContent: "center" }}><View style={{ width, height, borderRadius, backgroundColor }}></View></View>
                    <Text style={{ color: rsplTheme.jetGrey, fontSize: 20, marginLeft: 8, }}> {item?.country}</Text>
                  </TouchableOpacity>
                </View>
              )
            })}
          </ScrollView>
        </View>
      </Modal>





    </View>
  )
}

export default EditAddress

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
    backgroundColor: rsplTheme.rsplWhite,
    borderColor: rsplTheme.textColorLight,
    borderWidth: .5,
    borderRadius: 5,
    // marginBottom: 10,
    paddingHorizontal: 10,
    color: rsplTheme.textColorBold,
    fontWeight: "400"
  },
  modalContainerEdit: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: rsplTheme.rsplWhite,
    flex: 1,
    width: '100%',
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
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    marginBottom: 10,
  },
  text1: {
    flex: 1,
    paddingVertical: 6,
    color: rsplTheme.jetGrey,
    fontSize: 15,
    // width: 90,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollView: {
    width: '100%',
    maxHeight: '50%', // Cover half of the screen
    backgroundColor: rsplTheme.rsplWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

})