import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useRef } from 'react'
import Header from '../comman/Header';
import { rsplTheme } from '../constant';
import { useNavigation, useRoute } from '@react-navigation/native';


const CartItemDetails = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { data } = useRef(route.params).current
  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Cart Item Details"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cartItemContainer}>
        <Image style={styles.titleImage} source={{ uri: data.full_image_url }} />
        <View style={{ margin: 10, }}>
          <Text style={styles.productTitle}>{data.product_title}</Text>
          <Text style={styles.productMetaData}>Class: {data.class}</Text>
          <Text style={styles.productMetaData}>Subject: {data.subject}</Text>
          <Text style={styles.productMetaData}>Discount: {data.disPercent}%</Text>
          <Text style={styles.productMetaData}>ISBN: {data.isbn}</Text>
          <Text style={styles.productMetaData}>Price: {data.total_price}</Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default CartItemDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite
  },
  cartItemContainer: {
    // flex: 1,
    paddingBottom: 480
  },
  titleImage: {
    // width: "100%",
    minHeight: "70%",
    resizeMode: "contain",
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: rsplTheme.textColorBold,
  },
  productMetaData: {
    fontSize: 16,
    fontWeight: "500",
    color: rsplTheme.textColorBold,
    paddingVertical: 5,
  }

})