import { ScrollView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, } from 'react-native'
import React from 'react'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import { rsplTheme } from '../constant'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


const ViewOrderList = ({ route }) => {
  // console.log(route.params, "funf....")
  const navigation = useNavigation()
  const { orderListData } = route.params;

  const OrderListProduct = ({ product }) => {
    let productTitle = product.orderDetail?.getProduct?.product_title
    let productImage = product.orderDetail?.getProduct?.main_image
    return (
      <TouchableOpacity onPress={(() => { navigation.navigate("OrderListDetail", { OrderListData: product }) })} style={styles.containers}>
        <Image source={{ uri: productImage }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{productTitle}</Text>
          <Text style={styles.price}>{`Paid on: ${product.orderDate}`}</Text>
        </View>

        <View style={styles.moveTocartDele}>
          {/* <Image style={{ width: 20, height: 20, resizeMode: "center", alignSelf: "center", }} source={require("../assets/icons/right.png")} /> */}
          <FontAwesome6 name="chevron-right" alignSelf="center" color={rsplTheme.jetGrey} size={10} />
        </View>
      </TouchableOpacity>
    )
  }






  return (
    <View style={{ flex: 1 }}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Order List"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />

      {!orderListData.length ?
        <Text>Order list not found.</Text> :
        <FlatList
          data={orderListData}
          keyExtractor={item => `${item.Order_Number}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <OrderListProduct product={item} />
          )}
        />
      }


    </View>
  )
}

export default ViewOrderList

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
  },
  containers: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '400',
  },
  price: {
    fontSize: 12,
    color: '#888',
    paddingVertical: 5,
  },
  moveTocartDele: {
    // borderLeftWidth: .5,
    width: 30,
    borderLeftColor: rsplTheme.jetGrey,
    paddingLeft: 8,
    alignItems: "center",
    flexDirection: "row"
    // justifyContent: "space-evenly",
  },
  image: {
    width: 80,
    height: 100,
    resizeMode: "contain",
    borderRadius: 8,
    alignSelf: "center",
  },
})