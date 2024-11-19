import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { apiRoutes, rsplTheme, token } from '../constant'
import { MyContext } from '../Store'
import { useNavigation } from '@react-navigation/native'

const CartSummery = ({ totalItem }) => {
  const navigation = useNavigation()
  const { userData, grandTotal } = useContext(MyContext)
  // const [grandTotal, setGrandTotal] = useState({ total: "", data: [] })


  return (
    <View style={styles.container}>
      <View style={styles.orderSummeryContainer}>
        <Text style={styles.orderSumryTitle}>{`Cart Item  ${totalItem.length}`}</Text>
        {/* <Text>{totalItem.length}</Text> */}
      </View>

      <View style={styles.orderSumContainer}>
        <View style={styles.orderSumLeft}>
          <Text style={styles.orderSumLeftTitle}>Shipping Charges</Text>
        </View>
        <View style={styles.orderSumRight}>
          <Text style={styles.orderSumRightTitle}>{` \u20B9 ${grandTotal?.data.Shipping_Charge}`}</Text>
        </View>
      </View>

      <View style={styles.orderSumContainer}>
        <View style={styles.orderSumLeft}>
          <Text style={styles.orderSumLeftTitle}>Grand Total</Text>
        </View>
        <View style={styles.orderSumRight}>
          <Text style={styles.orderSumRightTitle}>{` \u20B9 ${grandTotal?.total}`}</Text>
        </View>
      </View>

      {/* <View style={{ marginBottom: 10, }}>
        <TouchableOpacity onPress={(() => {
          navigation.navigate("OrderSummery");
        })}
          style={styles.checkOutBtn}>
          <Text style={styles.checkOutTitle}>CHECKOUT</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  )
}

export default CartSummery

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "grey",
    // padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  orderSummeryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: rsplTheme.rsplLightGrey,
    padding: 6,
  },
  orderSumryTitle: {
    fontWeight: "500",
    color: rsplTheme.textColorBold
  },
  checkOutBtn: {
    width: "50%",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 50,
    padding: 8,
    borderColor: rsplTheme.gradientColorRight,
  },
  checkOutTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: rsplTheme.textColorBold,
    textAlign: "center",
  },
  orderSumContainer: {
    flexDirection: "row",
    // marginHorizontal: 10,
  },
  orderSumLeft: {
    width: 200,
    padding: 10,
    justifyContent: "center",
  },
  orderSumLeftTitle: {
    fontSize: 16,
    color: rsplTheme.textColorBold,
    fontWeight: "400"
  },
  orderSumRight: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  orderSumRightTitle: {
    fontSize: 16,
    color: rsplTheme.textColorBold,
    fontWeight: "400",
    textAlign: "right",
  },
})