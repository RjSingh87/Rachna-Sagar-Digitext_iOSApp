import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useState } from 'react'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import { apiRoutes, rsplTheme, token } from '../constant'
import Services from '../services'
import { MyContext } from '../Store'
import Loader from '../constant/Loader'


const OrderListDetail = ({ route }) => {
  const navigation = useNavigation()
  const { OrderListData } = route.params
  const { userData } = useContext(MyContext)
  const [loader, setLoader] = useState(false)

  const orderInvoice = () => {
    setLoader(true)
    const payLoad = {
      "api_token": token,
      "userid": userData.data[0]?.id,
      "orderNumber": OrderListData?.Order_Number
    }
    Services.post(apiRoutes.order_invoice_api, payLoad)
      .then((res) => {
        if (res.status === "success") {
          navigation.navigate("InvoiceViewer", { data: res.data })
          // setPdfSource(res.data)
        } else if (res.status === "error") {
          Alert.alert("Failed:", `${res.message}` || "Server error")
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}` || "Something went wrong.") }
      })
      .finally(() => { setLoader(false) })
  }

  // if (loader) {
  //   return (
  //     <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, }}>
  //       <Loader text='Loading....' />
  //     </View>
  //   )
  // }





  return (
    <View style={{ flex: 1 }}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"View order details"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 6, }}>Order Details</Text>
        <View style={styles.orderContainer}>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, }}>Order Date</Text>
            <Text style={{ flex: 1, }}>{`${OrderListData?.orderDate}`}</Text>
          </View>

          <View style={styles.orderBox} >
            <Text style={{ flex: 1, }}>Order #</Text>
            <Text style={{ flex: 1, }}>{`${OrderListData?.Order_Number}`}</Text>
          </View>

          <View style={styles.orderBox} >
            <Text style={{ flex: 1, }}>Order total</Text>
            <Text style={{ flex: 1, }}>{`₹ ${OrderListData?.orderDetail?.price}`}</Text>
          </View>
        </View>

        <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 6, }}>Payment information</Text>
        <View style={styles.orderContainer}>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, }}>Payment Methods</Text>
            <Text style={{ flex: 1, }}>{`${OrderListData?.Payment_Method}`}</Text>
          </View>
        </View>


        <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 6, }}>Purchase Details</Text>
        <View style={styles.orderContainer}>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, textTransform: "capitalize", color: rsplTheme.rsplGreen, fontWeight: "600", fontSize: 16 }}>{`${OrderListData?.orderDetail?.payment_status === null ? "" : OrderListData?.orderDetail?.payment_status}`}</Text>
          </View>
          <View style={[styles.orderBox, { marginBottom: 10 }]} >
            <Image style={{ width: "100%", height: 200, resizeMode: "contain", }} source={{ uri: OrderListData?.orderDetail?.getProduct?.main_image }} />
          </View>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, fontWeight: "600" }}>{OrderListData?.orderDetail?.getProduct?.product_title}</Text>
          </View>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, }}>Publisher:</Text>
            <Text style={{ flex: 1, }}>{OrderListData?.orderDetail?.getProduct?.Publisher}</Text>
          </View>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, }}>Author:</Text>
            <Text style={{ flex: 1, }}>{OrderListData?.orderDetail?.getProduct?.Author}</Text>
          </View>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, }}>Binding:</Text>
            <Text style={{ flex: 1, }}>{OrderListData?.orderDetail?.getProduct?.Binding}</Text>
          </View>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, }}>Edition:</Text>
            <Text style={{ flex: 1, }}>{OrderListData?.orderDetail?.getProduct?.Edition}</Text>
          </View>

          <TouchableOpacity onPress={(() => { orderInvoice() })} style={[{ backgroundColor: rsplTheme.rsplBorderGrey, paddingVertical: 10, marginTop: 8, alignItems: "center" }]} >
            {loader ?
              <ActivityIndicator size={"small"} color={rsplTheme.rsplWhite} /> :
              <Text style={{ flex: 1, fontWeight: "600" }}>Show Invoice</Text>
            }
          </TouchableOpacity>


        </View>

        <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 6, }}>Order Summary</Text>
        <View style={styles.orderContainer}>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, }}>Amount</Text>
            <Text style={{ flex: 1, }}>{`₹ ${OrderListData?.orderDetail?.price}`}</Text>
          </View>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, }}>Convenience fee</Text>
            <Text style={{ flex: 1, }}>{`₹ 0.00`}</Text>
          </View>
          <View style={styles.orderBox} >
            <Text style={{ flex: 1, fontWeight: "800", }}>Paid Amount</Text>
            <Text style={{ flex: 1, fontWeight: "800", color: '#800000' }}>{`₹ ${OrderListData?.orderDetail?.price}`}</Text>
          </View>
        </View>


      </ScrollView>

    </View >
  )
}

export default OrderListDetail

const styles = StyleSheet.create({
  container: {
    margin: 8,
    paddingVertical: 10,
  },
  orderBox: {
    flexDirection: "row",
    // justifyContent: "center",
    marginVertical: 3
  },
  orderContainer: {
    borderWidth: .5,
    borderRadius: 5,
    borderColor: rsplTheme.jetGrey,
    padding: 10,
    marginBottom: 20,
    // flexDirection: "row",
    // justifyContent: "space-between"
  }
})