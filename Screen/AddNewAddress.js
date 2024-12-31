import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Keyboard, Alert, Button, Image, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import Header from '../comman/Header';
import { apiRoutes, rsplTheme, token } from '../constant';
import { TabRouter, useNavigation } from '@react-navigation/native';
import Loader from '../constant/Loader';
import Services from '../services';
import { MyContext } from '../Store';


const AddNewAddress = () => {
  const navigation = useNavigation()
  const { userData } = useContext(MyContext)
  const [commonLoader, setCommonLoading] = useState({ countryLoader: false, stateLoader: false, cityLoader: false, saveAddressLoader: false })
  const [selectItem, setSelectItem] = useState({ country: null, state: null, city: null, categoryId: null })
  const [validation, setValidation] = useState({ name: "", mobile: "", email: "", address: "", zipPincode: "", landmark: "", status: false })
  const [cityStateCountry, setCityStateCountry] = useState({ status: false, list: [], type: "" })
  const [keyboardHeight, setKeyboardHeight] = useState(0);



  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.startCoordinates.height)
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

  const saveProfile = async () => {
    // console.log(selectItem.country?.countryNameLang1, "Count")
    // return
    if (validation.name.trim() == "" || validation.mobile.trim() == "" || validation.address.trim() == "" || validation.zipPincode.trim() == "" || validation.landmark.trim() == "" || selectItem.country?.country_title == null || selectItem.state?.state_title == null || selectItem.city?.city_title == null) {
      Alert.alert("Info", "Please fill all fields.")
      return
    } else if (validation.mobile.length !== 10) {
      Alert.alert("Mobile Number", "Please enter a valid mobile number")
      return
    } else if (validation.zipPincode.length !== 6) {
      Alert.alert("Zip Code", "Please enter a valid zip code")
      return
    }
    else {
      setCommonLoading((prev) => { return { ...prev, saveAddressLoader: true } })
      const payLoad = {
        "api_token": token,
        "userID": userData.data[0]?.id,
        "country": selectItem.country?.countryNameLang1,
        "city": selectItem.city?.city_title,
        "state": selectItem.state?.state_title,
        "name": validation?.name,
        "mobile": validation?.mobile,
        "address": validation?.address,
        "landmark": validation?.landmark,
        "pincode": validation?.zipPincode
      }
      await Services.post(apiRoutes.userAddAddress, payLoad)
        .then((res) => {
          if (res.status === "success") {
            Alert.alert("Info", res.message)
            setValidation((prev) => { return { ...prev, name: "", email: "", mobile: "", address: "" } })
            navigation.goBack()
          } else {
            Alert.alert("Info", res.message)
            return
          }
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally(() => { setCommonLoading((prev) => { return { ...prev, saveAddressLoader: false } }) })
    }
  };


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
          setCityStateCountry((prev) => { return { ...prev, status: true, list: res.result, type: "Country" } })
        } else if (res.status == "failed") {
          Alert.alert(res.message)
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
      setCommonLoading((prev) => { return { ...prev, stateLoader: true } })
      const payLoad = {
        "api_token": token,
        "countryID": selectItem.country?.id
      }
      await Services.post(apiRoutes.indianState, payLoad)
        .then((res) => {
          if (res.status === "success" && res.result.length != 0) {
            setCityStateCountry((prev) => { return { ...prev, status: true, list: res.result, type: "State" } })
          } else if (res.status == "failed") {
            Alert.alert("Info", res.message)
          }
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally(() => { setCommonLoading((prev) => { return { ...prev, stateLoader: false } }) })
    }

  }

  const getCityOfIndia = async () => {
    if (selectItem.country == null || selectItem.state == null) {
      Alert.alert("Info", "Please select a state")
    } else {
      setCommonLoading((prev) => { return { ...prev, cityLoader: true } })
      const payLoad = {
        "api_token": token,
        "state": selectItem.state?.id
      }
      await Services.post(apiRoutes.indianCity, payLoad)
        .then((res) => {
          if (res.status === "success" && res.result.length != 0) {
            setCityStateCountry((prev) => { return { ...prev, status: true, list: res.result, type: "City" } })
          } else if (res.status == "failed") {
            Alert.alert(res.message)
          }
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally(() => { setCommonLoading((prev) => { return { ...prev, cityLoader: false } }) })
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


  // if (loading) {
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
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Add Address"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      <KeyboardAvoidingView style={{ marginBottom: keyboardHeight + 20 }} behavior="padding">
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.inputContainer]}>
          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Name *</Text>
            <TextInput onChangeText={(text) => { setValidation((prev) => { return { ...prev, name: text } }) }} value={validation.name} placeholder='Enter your name' style={styles.txtInput} />
          </View>
          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Mobile *</Text>
            <View style={{ flexDirection: "row", flex: 1, }}>
              <TouchableOpacity onPress={(() => { handleCityStateCountry(4) })} style={[styles.txtInput, { alignItems: "center", flexDirection: "row", justifyContent: "space-between", width: 120, marginRight: 10, }]}>
                <Text style={[styles.countryStateCity, { width: 70, fontSize: selectItem.country !== null ? 18 : 14, fontWeight: selectItem.country !== null ? "500" : "normal", color: selectItem.country !== null ? rsplTheme.textColorBold : rsplTheme.textColorLight }]}>{`${selectItem.country?.country_code == null ? "Select country" : selectItem.country?.country_code}`}</Text>
                <Image style={{ width: 20, height: 20, resizeMode: "center" }} source={require("../assets/icons/down-arrow.png")} />
              </TouchableOpacity>
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
            <Text style={styles.EmaiPass}>Address *</Text>
            <TextInput onChangeText={(text) => { setValidation((prev) => { return { ...prev, address: text } }) }} value={validation.address} placeholder='Enter your address' style={styles.txtInput} />
          </View>

          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Zip / Pincode *</Text>
            <TextInput
              maxLength={6}
              returnKeyType={'done'}
              onChangeText={(text) => {
                const formattedText = text.replace(/[^0-9]/g, '');
                setValidation((prev) => { return { ...prev, zipPincode: formattedText } })
              }}
              value={validation.zipPincode}
              keyboardType='numeric'
              placeholder='Enter your zip/pincode'
              style={styles.txtInput} />
          </View>

          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Landmark *</Text>
            <TextInput returnKeyType={'done'} onChangeText={(text) => { setValidation((prev) => { return { ...prev, landmark: text } }) }} value={validation.landmark} placeholder='Enter your landmark' style={styles.txtInput} />
          </View>


          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>Country *</Text>
            <TouchableOpacity onPress={(() => { handleCityStateCountry(1) })} style={[styles.txtInput, { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }]}>
              <Text style={[styles.countryStateCity, { fontSize: selectItem.country !== null ? 18 : 14, fontWeight: selectItem.country !== null ? "500" : "normal", color: selectItem.country !== null ? rsplTheme.textColorBold : rsplTheme.textColorLight }]}>{`${selectItem.country?.country_code == null ? "Select country" : selectItem.country?.country_code}`}</Text>
              {commonLoader?.countryLoader ?
                <ActivityIndicator /> :
                <Image style={{ width: 20, height: 20, resizeMode: "center" }} source={require("../assets/icons/down-arrow.png")} />
              }
            </TouchableOpacity>
          </View>

          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>State *</Text>
            <TouchableOpacity onPress={(() => { handleCityStateCountry(2) })} style={[styles.txtInput, { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }]}>
              <Text style={[styles.countryStateCity, { fontSize: selectItem.state !== null ? 18 : 14, fontWeight: selectItem.state !== null ? "500" : "normal", color: selectItem.state !== null ? rsplTheme.textColorBold : rsplTheme.textColorLight }]}>{`${selectItem.state?.state_title == null ? "Select state" : selectItem.state?.state_title}`}</Text>
              {commonLoader?.stateLoader ?
                <ActivityIndicator /> :
                <Image style={{ width: 20, height: 20, resizeMode: "center" }} source={require("../assets/icons/down-arrow.png")} />
              }
            </TouchableOpacity>
          </View>

          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>City *</Text>
            <TouchableOpacity onPress={(() => { handleCityStateCountry(3) })} style={[styles.txtInput, { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }]}>
              <Text style={[styles.countryStateCity, { fontSize: selectItem.city !== null ? 18 : 14, fontWeight: selectItem.city !== null ? "500" : "normal", color: selectItem.city !== null ? rsplTheme.textColorBold : rsplTheme.textColorLight }]}>{`${selectItem.city?.city_title == null ? "Select city" : selectItem.city?.city_title}`}</Text>
              {commonLoader?.cityLoader ?
                <ActivityIndicator /> :
                <Image style={{ width: 20, height: 20, resizeMode: "center" }} source={require("../assets/icons/down-arrow.png")} />
              }
            </TouchableOpacity>
          </View>

          {commonLoader.saveAddressLoader ?
            <ActivityIndicator /> :
            <Button title='Save Address' onPress={saveProfile} />
          }

        </ScrollView>
      </KeyboardAvoidingView>




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
                // allListItem = `${item.concatenatedCode}`
                allListItem = `${item.country_title}`
                radioBtnColor = item.id == selectItem.country?.id
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

export default AddNewAddress

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite
  },
  inputContainer: {
    // flex: 1,
    marginHorizontal: 10,
    flexGrow: 1,


  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
  input: {
    height: 40,
    borderColor: rsplTheme.textColorLight,
    borderWidth: .5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: rsplTheme.textColorBold
  },
  txtInptName: {
    fontSize: 16,
    color: rsplTheme.textColorBold,
    paddingVertical: 6,
  },
  emailPass: {
    marginTop: 10,
  },
  EmaiPass: {
    fontSize: 16,
    paddingBottom: 6,
    color: rsplTheme.textColorLight
  },
  countryStateCity: {
    color: rsplTheme.jetGrey,
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
})