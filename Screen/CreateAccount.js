import { StyleSheet, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Modal, Image, TextInput, View, Alert, ActivityIndicator } from 'react-native'
import React, { isValidElement, useEffect, useState } from 'react'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import { apiRoutes, rsplTheme, token } from '../constant'
import LinearGradient from 'react-native-linear-gradient';
import Services from '../services'
import Loader from '../constant/Loader'
import OtpVerify from './OtpVerify'
import EvilIcons from "react-native-vector-icons/EvilIcons"

const CreateAccount = () => {
  const navigation = useNavigation()
  const [userAccountType, setUserAccountType] = useState({ typeId: null, type: null })
  const [commonLoader, setCommonLoading] = useState({ countryLoader: false, submitLoader: false })
  const [cityStateCountry, setCityStateCountry] = useState({ status: false, list: [], type: "" })
  const [selectItem, setSelectItem] = useState({ country: null, state: null, city: null, categoryId: null })
  const [validation, setValidation] = useState({ name: "", mobile: "", email: "", address: "", country: "", state: "", city: "", zipPincode: "", password: "", status: false })

  const acountType = (type, typeId) => {
    setUserAccountType((prev) => { return { ...prev, typeId: typeId, type: type } })
  }


  const handleCityStateCountry = (id) => {
    if (id == 1) {
      getCountryList()
    } else if (id == 2) {
      getStateOfIndia()
    } else if (id == 3) {
      getCityOfIndia()
    } else if (id == 4) {
      getCountryList()
      // Alert.alert("Info", "Country Code API coming soon...")
    }

  }


  const getCountryList = async () => {
    setCommonLoading((prev) => { return { ...prev, countryLoader: true } })
    const payLoad = {
      "api_token": token,
    }
    await Services.post(apiRoutes.countryList, payLoad)
      .then((res) => {
        if (res.status === "success" && res.result.length != 0) {
          const sortedResult = res.result.sort((a, b) => {
            return a.country.localeCompare(b.country);
          });
          setCityStateCountry((prev) => { return { ...prev, status: true, list: sortedResult, type: "Country" } })
        } else if (res.status === "failed") {
          Alert.alert("Info", res.message)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setCommonLoading((prev) => { return { ...prev, countryLoader: false } }) })
  }

  const getStateOfIndia = async () => {
    if (selectItem.country == null) {
      Alert.alert("Info", "Please select a country")
    } else {
      setLoading(true)
      const payLoad = {
        "api_token": token,
        "countryID": selectItem.country?.countryID
      }
      await Services.post(apiRoutes.indianState, payLoad)
        .then((res) => {
          if (res.status === "success" && res.result.length != 0) {
            setCityStateCountry((prev) => { return { ...prev, status: true, list: res.result, type: "State" } })
          } else {
            Alert.alert("Info", res.message)
          }
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally(() => { setLoading(false) })
    }

  }

  const getCityOfIndia = async () => {
    if (selectItem.country == null || selectItem.state == null) {
      Alert.alert("Info", "Please select a state")
    } else {
      setLoading(true)
      const payLoad = {
        "api_token": token,
        "state": selectItem.state?.id
      }
      await Services.post(apiRoutes.indianCity, payLoad)
        .then((res) => {
          if (res.status === "success" && res.result.length != 0) {
            setCityStateCountry((prev) => { return { ...prev, status: true, list: res.result, type: "City" } })
          } else {
            Alert.alert("Info", res.message)
          }
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally(() => { setLoading(false) })
    }
  }

  const SetValue = (item) => {

    if (cityStateCountry.type === "Country") {
      setSelectItem((prev) => { return { ...prev, country: item, state: null, city: null } })
      setCityStateCountry((perv) => { return { ...perv, status: false } })
    } else if (cityStateCountry.type === "State") {
      setSelectItem((prev) => { return { ...prev, state: item, city: null, } })
      setCityStateCountry((perv) => { return { ...perv, status: false } })
    } else if (cityStateCountry.type == "City") {
      setSelectItem((prev) => { return { ...prev, city: item, } })
      setCityStateCountry((perv) => { return { ...perv, status: false } })
    }
  }

  const submit = async () => {
    setCommonLoading((prev) => { return { ...prev, submitLoader: true } })
    const payLoad = {
      "api_token": token,
      "name": validation.name,
      "mobile": validation.mobile,
      "email": validation.email,
      "country": selectItem.country?.country,   //selectItem.country?.country_code,
      "state": selectItem.state?.state_title,
      "city": selectItem.city?.city_title,
      "pincode": validation.zipPincode,
      "address": validation.address,
      "password": validation.password,
      "you_are": userAccountType.type
    }
    // console.log(payLoad, "of submit...?")

    await Services.post(apiRoutes.createAccount, payLoad)
      .then((res) => {
        if (res.status === "success") {
          // Alert.alert("Info", res.message)
          navigation.navigate("OtpVerifyForCreateAcc", { mobileNo: validation.mobile, message: res.message, otp: res.otp, name: "Sign In", registration: payLoad })
        } else {
          Alert.alert(`${res.errors}`)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else {
          Alert.alert("Error", `${err.message}`)
        }
      })
      .finally(() => { setCommonLoading((prev) => { return { ...prev, submitLoader: false } }) })

    // navigation.goBack()
  }




  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Create Account"}
        onClickLeftIcon={() => { navigation.goBack(); }}
      />
      <KeyboardAvoidingView
        style={styles.avoidKeyboarContainer}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>



        <ScrollView showsVerticalScrollIndicator={false} style={styles.acountBox}>
          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Name *</Text>
            <TextInput onChangeText={(text) => { setValidation((prev) => { return { ...prev, name: text } }) }} value={validation.name} placeholder='Enter your name' style={styles.txtInput} />
          </View>


          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Country *</Text>
            <TouchableOpacity onPress={(() => { handleCityStateCountry(4) })} style={[styles.txtInput, { alignItems: "center", flexDirection: "row", justifyContent: "space-between", }]}>
              <Text style={[styles.countryStateCity, { width: 350, fontSize: selectItem.country !== null ? 18 : 14, fontWeight: selectItem.country !== null ? "500" : "normal", color: selectItem.country !== null ? rsplTheme.textColorBold : rsplTheme.textColorLight }]}>{`${selectItem.country?.id == null ? "Select country" : selectItem?.country?.country}`}</Text>
              {commonLoader.countryLoader ?
                <ActivityIndicator /> :
                <EvilIcons name={"chevron-down"} size={30} />
              }
            </TouchableOpacity>
          </View>




          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Mobile *</Text>
            <View style={{ flexDirection: "row", flex: 1, }}>


              {/* {selectItem?.country?.country_code ?
                <View style={{ justifyContent: "center" }}>
                  <Text> {selectItem?.country?.cCode} </Text>
                </View> : null
              } */}

              <TextInput
                returnKeyType={'done'}
                onChangeText={(text) => {
                  const formattedText = text.replace(/[^0-9]/g, '');
                  setValidation((prev) => { return { ...prev, mobile: formattedText } })
                }}
                value={validation.mobile}
                keyboardType='numeric'
                maxLength={10}
                placeholder='Enter your mobile no.'
                style={[styles.txtInput, { flex: 1, }]} />
            </View>
          </View>
          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Email *</Text>
            <TextInput autoCapitalize='none' onChangeText={(text) => { setValidation((prev) => { return { ...prev, email: text } }) }} value={validation.email} keyboardType='email-address' placeholder='Enter your email' style={styles.txtInput} />
          </View>

          {/* <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Address *</Text>
            <TextInput onChangeText={(text) => { setValidation((prev) => { return { ...prev, address: text } }) }} value={validation.address} placeholder='Enter your address' style={styles.txtInput} />
          </View>

          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Country *</Text>
            <TouchableOpacity onPress={(() => { handleCityStateCountry(1) })} style={[styles.txtInput, { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }]}>
              <Text style={[styles.countryStateCity, { fontSize: selectItem.country !== null ? 18 : 14, fontWeight: selectItem.country !== null ? "500" : "normal", color: selectItem.country !== null ? rsplTheme.textColorBold : rsplTheme.textColorLight }]}>{`${selectItem.country?.countryNameLang1 == null ? "Select country" : selectItem.country?.countryNameLang1}`}</Text>
              <Image style={{ width: 20, height: 20, resizeMode: "center" }} source={require("../assets/icons/down-arrow.png")} />
            </TouchableOpacity>
          </View>

          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>State *</Text>
            <TouchableOpacity onPress={(() => { handleCityStateCountry(2) })} style={[styles.txtInput, { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }]}>
              <Text style={[styles.countryStateCity, { fontSize: selectItem.state !== null ? 18 : 14, fontWeight: selectItem.state !== null ? "500" : "normal", color: selectItem.state !== null ? rsplTheme.textColorBold : rsplTheme.textColorLight }]}>{`${selectItem.state?.state_title == null ? "Select state" : selectItem.state?.state_title}`}</Text>
              <Image style={{ width: 20, height: 20, resizeMode: "center" }} source={require("../assets/icons/down-arrow.png")} />
            </TouchableOpacity>
          </View>

          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>City *</Text>
            <TouchableOpacity onPress={(() => { handleCityStateCountry(3) })} style={[styles.txtInput, { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }]}>
              <Text style={[styles.countryStateCity, { fontSize: selectItem.city !== null ? 18 : 14, fontWeight: selectItem.city !== null ? "500" : "normal", color: selectItem.city !== null ? rsplTheme.textColorBold : rsplTheme.textColorLight }]}>{`${selectItem.city?.city_title == null ? "Select city" : selectItem.city?.city_title}`}</Text>
              <Image style={{ width: 20, height: 20, resizeMode: "center" }} source={require("../assets/icons/down-arrow.png")} />
            </TouchableOpacity>
          </View>


          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Zip / Pincode *</Text>
            <TextInput maxLength={6} returnKeyType={'done'} onChangeText={(text) => { setValidation((prev) => { return { ...prev, zipPincode: text } }) }} value={validation.zipPincode} keyboardType='numeric' placeholder='Enter your zip/pincode' style={styles.txtInput} />
          </View> */}
          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Password *</Text>
            <TextInput returnKeyType={'done'} onChangeText={(text) => { setValidation((prev) => { return { ...prev, password: text } }) }} value={validation.password} secureTextEntry={!validation.status} placeholder='Enter your password' style={styles.txtInput} />
            <TouchableOpacity onPress={(() => { setValidation((prev) => { return { ...prev, status: !validation.status } }) })} style={styles.eyePosition}>
              <Image style={styles.eyeIcon} source={validation.status == true ? require("../assets/icons/eye.png") : require("../assets/icons/eyeClose.png")} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{}}>
        <Text style={styles.youAre}>You are *</Text>
        <View style={{ flexDirection: "row" }} >
          <TouchableOpacity onPress={(() => { acountType("student", 0) })} style={styles.typeOfAccount}>
            <View style={styles.radioBtn}>
              <View style={{ width: userAccountType.typeId == 0 ? 10 : 18, height: userAccountType.typeId == 0 ? 10 : 18, borderRadius: userAccountType.typeId == 0 ? 5 : 18, backgroundColor: userAccountType.typeId == 0 ? rsplTheme.textColorBold : "transparent" }} />
            </View>
            <Text>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={(() => { acountType("parents", 1) })} style={styles.typeOfAccount}>
            <View style={styles.radioBtn}>
              <View style={{ width: userAccountType.typeId == 1 ? 10 : 18, height: userAccountType.typeId == 1 ? 10 : 18, borderRadius: userAccountType.typeId == 1 ? 5 : 18, backgroundColor: userAccountType.typeId == 1 ? rsplTheme.textColorBold : "transparent" }} />
            </View>
            <Text>Parents</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={(() => { acountType("teacher", 2) })} style={styles.typeOfAccount}>
            <View style={styles.radioBtn}>
              <View style={{ width: userAccountType.typeId == 2 ? 10 : 18, height: userAccountType.typeId == 2 ? 10 : 18, borderRadius: userAccountType.typeId == 2 ? 5 : 18, backgroundColor: userAccountType.typeId == 2 ? rsplTheme.textColorBold : "transparent" }} />
            </View>
            <Text>Teacher</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={(() => { acountType("school", 3) })} style={styles.typeOfAccount}>
            <View style={styles.radioBtn}>
              <View style={{ width: userAccountType.typeId == 3 ? 10 : 18, height: userAccountType.typeId == 3 ? 10 : 18, borderRadius: userAccountType.typeId == 3 ? 5 : 18, backgroundColor: userAccountType.typeId == 3 ? rsplTheme.textColorBold : "transparent" }} />
            </View>
            <Text>School</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={(() => { submit() })} style={styles.poweredBy}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
            {commonLoader?.submitLoader ?
              <ActivityIndicator size={"small"} color={rsplTheme.rsplWhite} /> :
              <Text style={styles.buttonText}>Submit</Text>
            }
          </LinearGradient>
        </TouchableOpacity>
      </View>


      <Modal
        animationType='slide'
        transparent={true}
        visible={cityStateCountry.status}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={{ width: "100%", flex: 1, }} onPress={(() => { setCityStateCountry((prev) => { return { ...prev, status: false } }) })} />
          <View style={styles.greyDesign}></View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {cityStateCountry.list?.map((item, index) => {

              let allListItem = ""
              let radioBtnColor = ""
              if (cityStateCountry.type === "Country") {
                // allListItem = `${item.country_code}`
                allListItem = `${item?.country}`    //`${item.country_title}`
                radioBtnColor = item.id == selectItem.country?.id
                // console.log(radioBtnColor, "radioBtnColor")
              } else if (cityStateCountry.type === "State") {
                allListItem = `${item.state_title}`
                radioBtnColor = item.id == selectItem.state?.id
              } else if (cityStateCountry.type === "City") {
                allListItem = `${item.city_title}`
                radioBtnColor = item.id == selectItem.city?.id
              }

              const backgroundColor = radioBtnColor ? rsplTheme.gradientColorRight : "transparent";
              const width = radioBtnColor ? 8 : 16
              const height = radioBtnColor ? 8 : 16
              const borderRadius = radioBtnColor ? 4 : 8

              return (
                <View style={styles.itemContainer} key={index.toString()}>
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", }} onPress={(() => { SetValue(item) })}>
                    <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: rsplTheme.jetGrey, alignItems: "center", justifyContent: "center" }}><View style={{ width, height, borderRadius, backgroundColor }}></View></View>
                    <Text style={{ color: rsplTheme.jetGrey, fontSize: 20, marginLeft: 8, }}> {allListItem}</Text>
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

export default CreateAccount

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite
  },
  acountBox: {
    margin: 10,
    flex: 1,
  },
  emailPass: {
    marginTop: 10,
  },
  EmaiPass: {
    fontSize: 16,
    paddingBottom: 6,
    color: rsplTheme.textColorLight
  },
  txtInput: {
    backgroundColor: rsplTheme.rsplWhite,
    padding: 10,
    // top: 10,
    height: 45,
    borderRadius: 6,
    color: rsplTheme.textColorBold,
    fontWeight: "500",
    fontSize: 16,
    borderWidth: .5,
    borderColor: rsplTheme.jetGrey

  },
  poweredBy: {
    padding: 10,
    width: "100%",
    // flex: 1,
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
    // margin: 10,
    color: rsplTheme.rsplWhite,
  },
  radioBtn: {
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    borderWidth: 1,
    borderColor: rsplTheme.jetGrey,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  typeOfAccount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollView: {
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
  countryStateCity: {
    color: rsplTheme.jetGrey,
  },
  youAre: {
    fontWeight: "500",
    fontSize: 16,
    color: rsplTheme.textColorBold,
    padding: 10,
  },
  eyePosition: {
    position: "absolute",
    top: "50%",
    left: "90%"

  },
  eyeIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain"
  },
  avoidKeyboarContainer: {
    flex: 1,
    justifyContent: 'center',
    // paddingHorizontal: 20,
  },
})