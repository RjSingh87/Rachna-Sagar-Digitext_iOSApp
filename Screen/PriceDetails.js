import { StyleSheet, Text, View, Dimensions, Modal, Alert, Button, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useContext, useState, } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { MyContext } from '../Store'
import { rsplTheme } from '../constant'


const PriceDetails = ({ }) => {
  const navigation = useNavigation()
  const { userData, grandTotal, cartList } = useContext(MyContext)
  // console.log(route.params.singleProduct, "DFFF")






  return (
    <View style={{}}>
      <View style={styles.orderSummeryContainer}>
        <Text style={styles.orderSumryTitle}>{`ORDER SUMMARY`}</Text>
        <Text style={styles.summery}>{`View Order`}</Text>
      </View>

      <View style={styles.orderSumContainer}>
        <View style={styles.orderSumLeft}>
          <Text style={styles.orderSumLeftTitle}>Total MRP</Text>
        </View>
        <View style={styles.orderSumRight}>
          <Text style={styles.orderSumRightTitle}>{` \u20B9 ${grandTotal.data?.Total_Merged_MRP}`}</Text>
        </View>
      </View>

      <View style={styles.orderSumContainer}>
        <View style={styles.orderSumLeft}>
          <Text style={styles.orderSumLeftTitle}>Discount (-)</Text>
        </View>
        <View style={styles.orderSumRight}>
          <Text style={styles.orderSumRightTitle}>{` \u20B9 ${grandTotal.data?.Total_Merged_discount}`}</Text>
        </View>
      </View>

      <View style={styles.orderSumContainer}>
        <View style={styles.orderSumLeft}>
          <Text style={styles.orderSumLeftTitle}>Shipping Charge (+)</Text>
        </View>
        <View style={styles.orderSumRight}>
          <Text style={styles.orderSumRightTitle}>{` \u20B9 ${grandTotal.data?.Shipping_Charge}`}</Text>
        </View>
      </View>

      <View style={styles.orderSumContainer}>
        <View style={styles.orderSumLeft}>
          <Text style={styles.orderSumLeftTitle}>Total Price</Text>
        </View>
        <View style={styles.orderSumRight}>
          <Text style={styles.orderSumRightTitle}>{` \u20B9 ${grandTotal.data?.Total_Merged_price}`}</Text>
        </View>
      </View>

      <View style={styles.orderSumContainer}>
        <View style={styles.orderSumLeft}>
          <Text style={styles.orderSumLeftTitle}>Net Payable Amount</Text>
        </View>
        <View style={styles.orderSumRight}>
          <Text style={[styles.orderSumRightTitle, { fontSize: 20, color: rsplTheme.rsplGreen }]}>{` \u20B9 ${grandTotal.data?.Total_grand_price}`}</Text>
        </View>
      </View>
    </View>
  )
}

export default PriceDetails

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