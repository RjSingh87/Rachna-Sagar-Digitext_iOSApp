import { StyleSheet, Text, View, Dimensions, Modal, Alert, Button, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useContext, useState, } from 'react'
import Header from '../comman/Header'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { MyContext } from '../Store'
import Loader from '../constant/Loader'
import { apiRoutes, rsplTheme, token } from '../constant'
import Services from '../services'
const { width, height } = Dimensions.get("window")


const UserAddress = ({ }) => {
  const navigation = useNavigation()
  const { userData, grandTotal, cartList } = useContext(MyContext)
  const isFocused = useIsFocused()
  const [loader, setLoader] = useState(false)
  const [userContactVisible, setUserContactVisible] = useState(false)
  const [userDeatail, setUserDetails] = useState({ name: "", address: "", landmark: "", mobile: "" })
  const [address, setAddress] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  // console.log(route.params.singleProduct, "DFFF")
  // const singleProductData = route.params.singleProduct

  useEffect(() => {
    if (isFocused) {
      getUserAddress()
    }
  }, [isFocused])


  const toggleParentModal = () => {
    navigation.navigate("AddNewAddress")
    // setIsParentModalVisible(!isParentModalVisible);
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


  if (loader) {
    return (
      <View style={styles.loader}>
        <Loader text='Loading...' />
      </View>
    )
  }






  return (
    <View style={{}}>

      <ScrollView style={styles.container}>
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
              <View style={{ flex: 1, width: "100%", flexDirection: "row", alignItems: "center", padding: 5, }} key={item.id}>
                <View style={styles.row}>

                  <TouchableOpacity onPress={(() => { setSelectedAddress(item.id) })} style={[styles.button, { width: "12%", }]}>
                    <View style={{ width: 15, height: 15, borderRadius: 15 / 2, borderWidth: 1, alignItems: "center", justifyContent: "center" }}><View style={{ width: 8, height: 8, borderRadius: 8 / 2, backgroundColor: backgroundColor }}></View></View>
                  </TouchableOpacity>


                  <View style={[styles.button, { width: "75%", alignItems: "baseline", }]}>
                    <TextInput multiline={true} style={styles.userName} value={item.name} />
                    <TextInput multiline={true} style={styles.userAdd} value={`${item.address} ${item.landmark} ${item.state} ${item.city} ${item.country} ${item.pincode}`} />
                    <TextInput style={styles.userMob} value={"+91 " + item.mobile} />
                  </View>


                  <View style={[styles.button, { flex: 1, height: "100%", justifyContent: "space-evenly", }]}>
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
                      style={{ width: 22, height: 22, borderRadius: 22 / 2, alignItems: "center", justifyContent: "center", backgroundColor: "grey" }}>
                      <Image style={{ width: 12, height: 12, resizeMode: "contain", tintColor: rsplTheme.rsplWhite }} source={require("../assets/icons/pen.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(() => { deleteAddress(item.id) })}>
                      <Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={require("../assets/icons/trash.png")} />
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
                <View>
                  <TextInput
                    style={styles.input}
                    value={userDeatail.name}
                    onChangeText={(txt) => { userInputValHandle(txt, "name") }}
                  />
                  <TextInput
                    style={styles.input}
                    value={userDeatail.address}
                    onChangeText={(txt) => { userInputValHandle(txt, "address") }}
                  />
                  <TextInput
                    style={styles.input}
                    value={userDeatail.landmark}
                    onChangeText={(txt) => { userInputValHandle(txt, "landmark") }}
                  />

                  <TextInput
                    style={styles.input}
                    value={userDeatail.mobile}
                    onChangeText={(txt) => { userInputValHandle(txt, "mobile") }}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                <Button title="Save" onPress={(() => { saveEditAddress() })} />
                <Button title='Close' onPress={(() => { setUserContactVisible(false) })} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </ScrollView>
    </View>
  )
}

export default UserAddress

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // height: height,
    backgroundColor: rsplTheme.rsplWhite
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  userAddContaner: {
    padding: 10,
    // backgroundColor: rsplTheme.jetGrey
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    // backgroundColor: '#e1e1e1e1',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
  },
  addNewAdd: {
    color: rsplTheme.rsplRed,
    fontSize: 16,
    textAlign: "left"
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: rsplTheme.textColorBold,
  },
  userAdd: {
    fontSize: 14,
    fontWeight: "400",
    color: rsplTheme.textColorBold
  },
  userMob: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "400",
    color: rsplTheme.textColorBold
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
    fontSize: 16,
    color: rsplTheme.textColorBold,
    fontWeight: "500"
  },
  orderSumRight: {
    flex: 1,
    padding: 6,
    justifyContent: "center",
  },
  orderSumRightTitle: {
    fontSize: 16,
    color: rsplTheme.textColorBold,
    fontWeight: "600",
    textAlign: "right",
  },
  orderSummeryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: rsplTheme.rsplLightGrey,
    padding: 15,
  },
  orderSumryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: rsplTheme.textColorBold
  },
  summery: {
    fontSize: 15,
    fontWeight: "600",
    color: rsplTheme.rsplBlue
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
  input: {
    height: 40,
    borderColor: rsplTheme.textColorLight,
    borderWidth: .5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: rsplTheme.textColorBold
  },

})