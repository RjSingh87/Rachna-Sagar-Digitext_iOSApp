import { StyleSheet, Text, View, Image, TextInput, RefreshControl, ScrollView, FlatList, TouchableOpacity, Modal, Alert, } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import Header from '../comman/Header'
import { apiRoutes, rsplTheme, token } from '../constant'
import Loader from '../constant/Loader'
import { useNavigation } from '@react-navigation/native'
import Services from '../services'
import NoInternetConn from './NoInternetConn'
// import Dashboard from './Dashboard'

const Filter = ({ route }) => {
  // console.log(route.params, "ScreenName")
  const { screenId, screenName } = route?.params || {};

  const navigation = useNavigation()
  const [filterType, setFilterType] = useState(["Select boards", "Select Class", "Type of Books", "Select Subjects"])
  const [loading, setLoading] = useState(false)
  const [listData, setListData] = useState({ status: false, list: null, type: "", })
  const [selectItem, setSelectItem] = useState({ board: null, class: null, books: null, subject: null, categoryId: null })
  const [defaultTitle, setDefaultTitle] = useState([])
  const [filterShowHide, setFilterShowHide] = useState({ status: false })

  useEffect(() => {
    if (selectItem.board?.categoryId !== undefined) {
      filterTitles()
    }
  }, [selectItem.board?.categoryId, selectItem.class?.classId, selectItem.books?.bookTypeId, selectItem.subject?.subjectId])



  const getListingFun = (type) => {
    let message = "Please select all fields."
    if (type == 0) {
      GetBoardTypes()
      // setListData((prev)=>{return{...prev, status:true, type:"Board", list:boardType}})
    } else if (type == 1 && selectItem.board !== null) {
      GetClasses()
      // setListData((prev)=>{return{...prev, status:true, type:"Class", list:boardClass}})
    } else if (type == 2 && selectItem.class !== null) {
      GetBooks()
      // setListData((prev)=>{return{...prev, status:true, type:"Books", list:testArray1}})
    } else if (type == 3 && selectItem.books !== null) {
      GetSubjects()
      // setListData((prev)=>{return{...prev, status:true, type:"Subject", list:testArray3}})
    } else {
      Alert.alert("Info", message)
    }
  }

  const SetValue = (item) => {
    if (listData.type === "Board") {
      setSelectItem((prev) => { return { ...prev, board: item, class: null, books: null, subject: null, } })
      setListData((perv) => { return { ...perv, status: false } })
    } else if (listData.type === "Class") {
      setSelectItem((prev) => { return { ...prev, class: item, books: null, subject: null } })
      setListData((perv) => { return { ...perv, status: false } })
    } else if (listData.type === "Books") {
      setSelectItem((prev) => { return { ...prev, books: item, subject: null } })
      setListData((perv) => { return { ...perv, status: false } })
    } else if (listData.type === "Subject") {
      setSelectItem((prev) => { return { ...prev, subject: item } })
      setListData((perv) => { return { ...perv, status: false } })
      setFilterShowHide((prev) => { return { ...prev, status: !filterShowHide.status } })
    }
  }


  useEffect(() => {
    GetByDefaultTitle()
  }, [])

  // const onRefresh = useCallback(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     GetByDefaultTitle()
  //     filterTitles()
  //     setLoading(false)
  //   }, 1000);
  // }, [loading])

  const GetByDefaultTitle = async () => {
    setLoading(true)
    const payLoad = {
      "api_token": token
    }
    await Services.post(apiRoutes.defaultTitleCBSE, payLoad)
      .then((res) => {
        if (res.status === "success" && res.length != 0) {
          setDefaultTitle(res.result)
        } else if (res.status == "failed") {
          Alert.alert(`${res.message}`)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setLoading(false) })
  }


  const GetBoardTypes = () => {
    setLoading(true)
    const payLoad = {
      "api_token": token,
    }
    Services.post(apiRoutes.boardTypes, payLoad)
      .then((res) => {
        if (res.status === "Success" && res.length != 0) {
          // setBoardType(res.result)
          setListData((prev) => { return { ...prev, status: true, type: "Board", list: res.result } })
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

  const GetClasses = async () => {
    setLoading(true)
    const payLoad = {
      "api_token": token,
      "mst_category": selectItem.board?.categoryId
    }
    await Services.post(apiRoutes.classes, payLoad)
      .then((res) => {
        if (res.status === "success" && res.length != 0) {
          // setBoardClass(res.result)
          setListData((prev) => { return { ...prev, status: true, type: "Class", list: res.result } })
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

  const GetBooks = async () => {
    setLoading(true)
    const payLoad = {
      "api_token": token,
      "mst_category": selectItem.board?.categoryId,
      "mst_class": selectItem.class?.classId
    }
    await Services.post(apiRoutes.bookType, payLoad)
      .then((res) => {
        if (res.status === "success" && res.length != 0) {
          setListData((prev) => { return { ...prev, status: true, type: "Books", list: res.result } })
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

  const GetSubjects = async () => {
    setLoading(true)
    const payLoad = {
      "api_token": token,
      "mst_category": selectItem.board?.categoryId,
      "mst_class": selectItem.class?.classId,
      "mst_booktype": selectItem.books?.bookTypeId
    }
    await Services.post(apiRoutes.subjects, payLoad)
      .then((res) => {
        if (res.status === "success" && res.length != 0) {
          setListData((prev) => { return { ...prev, status: true, type: "Subject", list: res.result } })
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

  const renderItem = ({ item }) => {
    let discount = ""
    if (item.book_perDiscount == null || item.book_perDiscount == 0) {
      discount = ""
    } else {
      discount = `(${item.book_perDiscount}% off)`
    }

    return (
      <TouchableOpacity onPress={(() => {
        navigation.navigate("ProductDetail",
          {
            item: [item],
            productId: item.productId,
            imgArray: [
              { item: item.full_front_image_path },
              { item: item.full_back_image_path }
            ],
            title: "Product details"
          }
        )
        // navigation.navigate("ABC", { id: item.id, name: "New Releases Books", title: "New Releases Books" }) 
      })} style={styles.productItem}>
        <Image source={{ uri: item.main_image }} style={styles.productImage} />
        <Text numberOfLines={2} style={styles.productName}>{item.product_title}</Text>
        <Text style={styles.productPrice}><Text style={{ fontSize: 15, color: rsplTheme.textColorBold, }}>{`\u20B9`}</Text> {`${item.book_price}`}</Text>
        {discount &&
          <View style={styles.priceBox}>
            <Text style={{}}>MRP: <Text style={styles.productMrp}>{`\u20B9${item.book_mrp}`}</Text></Text>
            {/* <Text style={styles.productDiscount}>{`(${item?.book_perDiscount == null ? 0 : item?.book_perDiscount}% off)`}</Text> */}
            <Text style={styles.productDiscount}>{discount}</Text>
          </View>
        }
      </TouchableOpacity>
    )
  };


  const filterTitles = async () => {
    setLoading(true)
    const payLoad = {
      "api_token": token,
      "mst_category": selectItem.board?.categoryId == undefined ? "" : selectItem.board?.categoryId, //categoryId, //selectItem.board?.categoryId,
      "mst_class": selectItem.class?.classId == undefined ? "" : selectItem.class?.classId,//"1",
      "mst_booktype": selectItem.books?.bookTypeId == undefined ? "" : selectItem.books?.bookTypeId,//"26",
      "mst_subjects": selectItem.subject?.subjectId == undefined ? "" : selectItem.subject?.subjectId  //"258"
    }
    // console.log(payLoad, "checking of palette")
    await Services.post(apiRoutes.filterTitlesOfBoardClassBooksSubject, payLoad)
      .then((res) => {
        if (res.status === "success" && res.result.length) {
          setDefaultTitle(res.result)
        } else if (res.status == "failed") {
          // setDefaultTitle([])
          Alert.alert("Info", res.message)
          return
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setLoading(false) })
  }



  if (loading) {
    return (
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, }}>
        <Loader text='Loading...' />
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <Header
        leftIcon={screenName ? require("../assets/icons/backArrow.png") : require("../assets/icons/menu.png")}
        rightIcon={require('../assets/icons/filter.png')}
        title={"Shop By Category"}
        onClickLeftIcon={() => { screenName ? navigation.goBack() : navigation.openDrawer(); }}
        onClickRightIcon={() => { setFilterShowHide((prev) => { return { ...prev, status: !filterShowHide.status } }) }}
      />

      <NoInternetConn />

      {filterShowHide.status &&
        <View style={{ backgroundColor: rsplTheme.rsplLightGrey, padding: 10, }}>
          <View style={{ display: "flex" }}>
            {filterType.map((val, index) => {
              let printValue = null
              if (index === 0) {
                printValue = selectItem.board?.category_title
              } else if (index === 1) {
                printValue = selectItem.class?.class;
              } else if (index === 2) {
                printValue = selectItem.books?.bookType;
              } else if (index === 3) {
                printValue = selectItem.subject?.subject;
              }
              return (
                <TouchableOpacity onPress={(() => { getListingFun(index) })} key={index.toString()} style={styles.selectBoard}>
                  <Text style={styles.selectBoardType}>{filterType[index]}</Text>
                  <Text numberOfLines={1} style={{ marginLeft: 10, fontSize: 14, color: rsplTheme.textColorBold }}>{printValue == null ? "Select" : printValue}</Text>
                  <Image style={styles.searchIcon} source={require("../assets/icons/down-arrow.png")} />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      }

      <View style={styles.listContainer}>
        <FlatList
          data={defaultTitle}
          scrollEnabled={true}
          keyExtractor={(item) => item.productId}
          renderItem={renderItem}
          numColumns={2} // Display 2 items in a row
          onEndReachedThreshold={0.1} // Trigger onEndReached when the end is reached at 90% of the list
          showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={loading}
        //     onRefresh={onRefresh}
        //   />
        // }
        />
      </View>





      <Modal
        animationType='slide'
        transparent={true}
        visible={listData.status}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={{ width: "100%", flex: 1, }} onPress={(() => { setListData((prev) => { return { ...prev, status: false } }) })} />
          <View style={styles.greyDesign}></View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {listData.list?.map((item, index) => {
              let allListItem = ""
              let radioBtnColor = ""
              if (listData.type === "Board") {
                allListItem = `${item.category_title}`
                radioBtnColor = item.categoryId == selectItem.board?.categoryId
              } else if (listData.type === "Class") {
                allListItem = `${item.class}`
                radioBtnColor = item.classId == selectItem.class?.classId
              } else if (listData.type === "Books") {
                allListItem = `${item.bookType}`
                radioBtnColor = item.bookTypeId == selectItem.books?.bookTypeId
              } else if (listData.type === "Subject") {
                allListItem = `${item.subject}`
                radioBtnColor = item.subjectId == selectItem.subject?.subjectId
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

export default Filter

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite
  },
  selectBoardType: {
    fontSize: 12,
    textAlign: "center",
    color: rsplTheme.textColorBold + 70,
    fontWeight: "500",
    backgroundColor: rsplTheme.rsplWhite,
    // width:"30%",
    marginLeft: 6,
    padding: 5,
    position: "absolute",
    top: -13,
    left: 0,
    zIndex: 1,
  },

  selectBoard: {
    borderWidth: .5,
    borderColor: rsplTheme.textColorLight,
    width: "100%",
    // height: 50,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: rsplTheme.rsplWhite,
    alignItems: "center",
    // justifyContent:"center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
    width: 16,
    height: 16,
    tintColor: rsplTheme.jetGrey,
    resizeMode: 'contain',
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
  greyDesign: {
    zIndex: 1,
    position: "absolute",
    top: "50.8%",
    width: 60,
    height: 10,
    borderRadius: 20,
    backgroundColor: rsplTheme.rsplBorderGrey,
    alignSelf: "center"
  },
  listContainer: {
    flex: 1,
    padding: 8,
    marginBottom: "12%"
  },

  productItem: {
    flex: 1,
    margin: 8,
    backgroundColor: rsplTheme.rsplLightGrey,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 16,
    alignItems: 'center',
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 8,
    borderRadius: 8,
  },
  productName: {
    width: "100%",
    fontSize: 15,
    fontWeight: '400',
    color: rsplTheme.textColorBold,
    textAlign: "center",
  },
  bookPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: rsplTheme.textColorBold
  },
  bookMrp: {
    textDecorationLine: "line-through",
    fontSize: 15,
    fontWeight: '600',
    color: rsplTheme.rsplRed
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 6,
    alignSelf: "flex-start",
    color: rsplTheme.textColorBold,
  },
  priceBox: {
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems:"center",
  },
  productMrp: {
    fontSize: 16,
    // padding:3,
    color: rsplTheme.rsplRed,
    textDecorationLine: "line-through"
  },
  productDiscount: {
    fontSize: 16,
    // padding:3,
    color: '#888',
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 6,
    alignItems: "center",
  }
})