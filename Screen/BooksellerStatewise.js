import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Keyboard, Alert, Button, Image, ScrollView, KeyboardAvoidingView, ActivityIndicator, FlatList } from 'react-native'
import React, { useContext, useState, useEffect, useCallback } from 'react'
import Header from '../comman/Header';
import { apiRoutes, rsplTheme, token } from '../constant';
import { TabRouter, useNavigation } from '@react-navigation/native';
import Loader from '../constant/Loader';
import Services from '../services';
import { MyContext } from '../Store';
import { SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const BooksellerStatewise = () => {
  const navigation = useNavigation()
  const { userData } = useContext(MyContext)
  const [commonLoader, setCommonLoading] = useState({ countryLoader: false, stateLoader: false, cityLoader: false, saveAddressLoader: false })
  const [selectItem, setSelectItem] = useState({ country: null, state: null, city: null, categoryId: null })
  const [cityStateCountry, setCityStateCountry] = useState({ status: false, list: [], type: "" })
  const [booksellerList, setBooksellerList] = useState([])
  const [loadingBooksellers, setLoadingBooksellers] = useState(false);

  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (selectItem.city) {
      const fetchBooksellersDetails = async () => {
        setLoadingBooksellers(true);
        try {
          const payLoad = {
            "api_token": token,
            "stateID": selectItem.state?.id,
            "cityID": selectItem.city?.id
          }
          const result = await Services.post(apiRoutes.booksellerListStatewise, payLoad)
          if (result.status === "success") {
            const booksellerList = result.data || []
            setBooksellerList(booksellerList)
            setLoadingBooksellers(false);
          } else if (result.status === "failed") {
            Alert.alert("Info:", result.message || "Fetch error occurred")
          }
        } catch (error) {
          Alert.alert("Error:", error.message || "Something went wrong")
        }
      }
      fetchBooksellersDetails();
    }
  }, [selectItem.city])

  const handleCityStateCountry = (id) => {
    if (id == 1) {
      console.log(id, "clg??")
      getStateOfIndia()
    } else if (id == 2) {
      getCityOfIndia()
    }
  }

  const getStateOfIndia = async () => {
    setCommonLoading((prev) => { return { ...prev, stateLoader: true } })
    const payLoad = {
      "api_token": token,
      "countryID": 1 //selectItem.country?.id
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

  const getCityOfIndia = async () => {
    if (selectItem.state == null) {
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
    if (cityStateCountry.type === "State") {
      setSelectItem((prev) => { return { ...prev, state: item, city: null, } })
      setCityStateCountry((perv) => { return { ...perv, status: false } })
      setBooksellerList([]) // when state value change bookseller list empty
    } else if (cityStateCountry.type == "City") {
      setSelectItem((prev) => { return { ...prev, city: item, } })
      setCityStateCountry((perv) => { return { ...perv, status: false } })
    }
  }


  const renderItem = useCallback(({ item }) => {
    return (
      <View style={styles.card}>

        <Text selectable style={styles.title}>{item?.shop_name}</Text>

        <View style={{ borderWidth: .3, borderColor: rsplTheme.jetGrey, width: "100%", marginBottom: 10 }} />

        <View style={{ flex: 1, flexDirection: "row", marginVertical: 4 }}>
          <View style={{ width: 25, marginRight: 5, alignItems: "center", }}>
            <AntDesign name="home" size={15} color={rsplTheme.rsplLightPink} />
          </View>
          <View style={{ width: 130 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>Shop Name</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text selectable style={{ color: rsplTheme.jetGrey }}>{`${item.shop_name}`}</Text>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: "row", marginVertical: 4 }}>
          <View style={{ width: 25, marginRight: 5, alignItems: "center", }}>
            <EvilIcons name="location" size={20} color={rsplTheme.rsplLightPink} />
          </View>
          <View style={{ width: 130 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>Address</Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text selectable style={{ color: rsplTheme.jetGrey }}>{`${item.address1}, ${item.address2}`}</Text>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: "row", marginVertical: 4 }}>
          <View style={{ width: 25, marginRight: 5, alignItems: "center", }}>
            <FontAwesome name="map-pin" size={15} color={rsplTheme.rsplLightPink} />
          </View>
          <View style={{ width: 130 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>Pincode</Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text selectable style={{ color: rsplTheme.jetGrey }}>{`${item.pincode}`}</Text>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: "row", marginVertical: 4 }}>
          <View style={{ width: 25, marginRight: 5, alignItems: "center", }}>
            <Feather name="phone" size={15} color={rsplTheme.rsplLightPink} />
          </View>
          <View style={{ width: 130 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>Contact Number</Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text selectable style={{ color: rsplTheme.jetGrey }}>{`${item.phone1}, ${item.phone3}`}</Text>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: "row", marginVertical: 4 }}>
          <View style={{ width: 25, marginRight: 5, alignItems: "center", }}>
            <Fontisto name="email" size={15} color={rsplTheme.rsplLightPink} />
          </View>
          <View style={{ width: 130 }}>
            <Text style={{ color: rsplTheme.jetGrey }}>Email Id</Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text selectable style={{ color: rsplTheme.jetGrey }}>{`${item.email}`}</Text>
          </View>
        </View>

      </View>
    )

  }, [])



  return (
    <View style={[styles.container]}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Book sellers"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      <View style={[styles.inputContainer]}>

        <View style={styles.emailPass}>
          <Text style={styles.EmaiPass}>State *</Text>
          <TouchableOpacity onPress={(() => { handleCityStateCountry(1) })} style={[styles.txtInput, { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }]}>
            <Text style={[styles.countryStateCity, { fontSize: selectItem.state !== null ? 15 : 14, fontWeight: selectItem.state !== null ? "500" : "normal", color: selectItem.state !== null ? rsplTheme.textColorBold : rsplTheme.textColorLight }]}>{`${selectItem.state?.state_title == null ? "Select state" : selectItem.state?.state_title}`}</Text>
            {commonLoader?.stateLoader ?
              <ActivityIndicator /> :
              <Image style={{ width: 20, height: 20, resizeMode: "center" }} source={require("../assets/icons/down-arrow.png")} />
            }
          </TouchableOpacity>
        </View>

        <View style={styles.emailPass}>
          <Text style={styles.EmaiPass}>City *</Text>
          <TouchableOpacity onPress={(() => { handleCityStateCountry(2) })} style={[styles.txtInput, { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }]}>
            <Text style={[styles.countryStateCity, { fontSize: selectItem.city !== null ? 15 : 14, fontWeight: selectItem.city !== null ? "500" : "normal", color: selectItem.city !== null ? rsplTheme.textColorBold : rsplTheme.textColorLight }]}>{`${selectItem.city?.city_title == null ? "Select city" : selectItem.city?.city_title}`}</Text>
            {commonLoader?.cityLoader ?
              <ActivityIndicator /> :
              <Image style={{ width: 20, height: 20, resizeMode: "center" }} source={require("../assets/icons/down-arrow.png")} />
            }
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, marginVertical: 10, }}>
          {loadingBooksellers ?
            <View style={styles.loader}><Loader text='Loading...' /></View> :
            <View>
              <FlatList
                data={booksellerList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
              />
            </View>
          }
        </View>


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

export default BooksellerStatewise

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplLightGrey
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
    padding: 8,
    // top: 10,
    // height: 40,
    borderRadius: 6,
    color: rsplTheme.textColorBold,
    fontWeight: "500",
    fontSize: 15,
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
    // borderWidth: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: rsplTheme.jetGrey,
    marginBottom: 10,
  },
})