import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState, } from 'react'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import { apiRoutes, rsplTheme, token } from '../constant'
import Icon from 'react-native-vector-icons/AntDesign'
import Services from '../services'
import Loader from '../constant/Loader'
import { MyContext } from '../Store'


const YourAccount = ({ route }) => {
  const navigation = useNavigation()
  const [loader, setLoader] = useState(false)

  const { userData } = useContext(MyContext)

  const viewOrderList = async () => {
    setLoader(true)
    const payLoad = {
      "api_token": token,
      "userid": userData.data[0]?.id
    }
    await Services.post(apiRoutes.orderlist, payLoad)
      .then((res) => {
        if (res.status == "success") {
          // console.log(res, "res>LPP?")
          navigation.navigate("ViewOrderList", { orderListData: res.data })
        } else if (res.status == "error") {
          Alert.alert(`${res.message}`);
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setLoader(false) })
  }

  const closeAccount = () => {
    navigation.navigate("CloseAccount", { data: "Close Account" })
  }


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
        title={route.params?.data}
        onClickLeftIcon={() => { navigation.goBack() }}
        onClickRightIcon={() => { return }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} style={styles.manageAccontContainer}>
        <View style={{ marginBottom: 15, }}>
          <Text style={styles.manageAccText}>Orders</Text>
          <View style={styles.dataContainer}>
            <Pressable onPress={(() => { viewOrderList() })} style={styles.dataType}>
              <View style={styles.dataHeading}>
                <Text>Your Order </Text>
              </View>
              <View style={styles.icon}>
                <Icon name={"right"} />
              </View>
            </Pressable>
          </View>
        </View>


        <View style={{ marginBottom: 15, }}>
          <Text style={styles.manageAccText}>Manage your data</Text>
          <View style={styles.dataContainer}>
            <Pressable onPress={(() => { closeAccount() })} style={styles.dataType}>
              <View style={styles.dataHeading}>
                <Text>Close your Rachna Sagar Account </Text>
              </View>
              <View style={styles.icon}>
                <Icon name={"right"} />
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>


    </View>
  )
}

export default YourAccount

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  manageAccText: {
    fontSize: 18,
    fontWeight: "500",
    color: rsplTheme.rsplBlack
  },
  manageAccontContainer: {
    padding: 6,
  },
  dataContainer: {
    marginTop: 10,
    borderWidth: .3,
    borderRadius: 6,
    borderColor: rsplTheme.jetGrey,
    backgroundColor: rsplTheme.OFFWhite
  },
  dataType: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderBottomWidth: 1,
    borderBottomColor: rsplTheme.jetGrey,
    padding: 10,
  },
  dataHeading: {
    flex: 1,
    paddingVertical: 6,
  },
  icon: {
    width: 40,
    alignItems: "flex-end"
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

})