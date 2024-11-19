import { StyleSheet, Share, Text, View, FlatList, TouchableOpacity, KeyboardAvoidingView, Button, Image, Alert, Modal, TextInput, ScrollView, } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { apiRoutes, rsplTheme, token } from '../constant'
import LinearGradient from 'react-native-linear-gradient';
import { MyContext } from '../Store';
import { useNavigation } from '@react-navigation/native';
import Services from '../services';
import Loader from '../constant/Loader';

const Profile = ({ data }) => {
  const navigation = useNavigation()
  const { logout, userData } = useContext(MyContext)
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupEditProfileVisible, setEditProfilePopupVisible] = useState(false);
  const [userDeatail, setUserDetails] = useState({ name: "", email: "", mobile: "", address: "", country: "" })
  const [loader, setLoader] = useState(false)

  const toggleCameraPopup = () => {
    setPopupVisible(!popupVisible);
  };
  const toggleEditProfilePopup = () => {
    setEditProfilePopupVisible(true);
  };

  const signOutAccount = () => {
    logout(navigation)
    // navigation.navigate("Login")
    // Alert.alert("Info", "Coming soon")
  }


  // const getProfileDetails = async (userId) => {
  //   const payLoad = {
  //     "api_token": token,
  //     "userID": userData.data[0].id //userDatail.data[0]?.id
  //   }
  //   await Services.post(apiRoutes.profileDetails, payLoad)
  //     .then((res) => {
  //       if (res.status === "success") {
  //         setProfileDetails((prev) => { return { ...prev, details: res.result, status: true } })
  //       } else {
  //         Alert.alert("Info", res.message)
  //       }
  //     })
  //     .catch((err) => {
  //       Alert.alert("Error", err.message)
  //     })
  //     .finally(() => { })
  // }

  const CameraPopup = ({ isVisible, onClose }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.option} onPress={() => console.log('Camera')}>
              <Image style={styles.iconGallery} source={require("../assets/icons/camera.png")} />
              <Text style={styles.userCamGallery}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => console.log('Gallery')}>
              <Image style={styles.iconGallery} source={require("../assets/icons/image-gallery.png")} />
              <Text style={styles.userCamGallery}>Gallery Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={onClose}>
              <Image style={styles.iconGallery} source={require("../assets/icons/close.png")} />
              <Text style={[styles.userCamGallery,]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };



  const userInputValHandle = (txt, type) => {
    if (type == "name") {
      setUserDetails((prev) => { return { ...prev, name: txt, } })
    } else if (type == "email") {
      setUserDetails((prev) => { return { ...prev, email: txt, } })
    } else if (type == "mobile") {
      setUserDetails((prev) => { return { ...prev, mobile: txt, } })
    } else if (type == "address") {
      setUserDetails((prev) => { return { ...prev, address: txt, } })
    } else if (type == "country") {
      setUserDetails((prev) => { return { ...prev, country: txt } })
    } else {
      return
      Alert.alert("DFFF",)
    }
  }


  const saveProfile = () => {
    setEditProfilePopupVisible(false)
    setUserDetails((prev) => { return { ...prev, name: "", email: "", mobile: "", address: "" } })
    // Implement logic to save profile data
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        // message: 'https://appstoreconnect.apple.com/apps',
        url: "https://apps.apple.com/app/rachna-sagar/id6654905066" //"https://apps.apple.com/us/app/swaadhyayanlms/id6450884259",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };


  const yourAccount = () => {
    navigation.navigate("YourAccount", { data: "Your Account" })
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
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.profileBox}>
          <Image style={styles.profileIcon} source={require("../assets/icons/ProfileIcon.png")} />
        </View>

        {/* cameraIcon UI disable for apple term condition 26 August 2024 */}
        {/* <TouchableOpacity onPress={(() => { toggleCameraPopup() })} style={styles.cameraBox}>
          <Image style={styles.cameraIcon} source={require("../assets/icons/camera.png")} />
        </TouchableOpacity>
        <CameraPopup isVisible={popupVisible} onClose={toggleCameraPopup} /> */}
        {/* ---------------------------------------------------------------- */}

        <Text style={styles.profileName}>{data?.name}</Text>

        <View style={styles.profileDetails}>
          <View style={styles.DetailsDes}>
            <View style={styles.Side1}>
              <Text style={styles.allTypes}>Email:</Text>
            </View>
            <View style={styles.Side2}>
              <Text style={styles.allTypesValue}>{data?.email}</Text>
            </View>
          </View>
          <View style={styles.DetailsDes}>
            <View style={styles.Side1}>
              <Text style={styles.allTypes}>Mobile:</Text>
            </View>
            <View style={styles.Side2}>
              <Text style={styles.allTypesValue}>{data?.phone}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={(() => { signOutAccount() })} style={styles.poweredBy}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
            <Text style={styles.buttonText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ marginTop: 20, alignSelf: "center" }}>
          <Button onPress={onShare} title="Share and earn" />
          {/* <Button onPress={viewOrder} title="View Order" /> */}
          <Button
            onPress={yourAccount}
            title="Your Account" />
        </View>
      </ScrollView>



      {/* Profile Edit UI */}
      <TouchableOpacity onPress={(() => { toggleEditProfilePopup() })} style={styles.editBox}>
        <Image style={styles.editIcon} source={require("../assets/icons/pen.png")} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={popupEditProfileVisible}
        >
          <KeyboardAvoidingView style={styles.modalContainerEdit}>
            <View style={[styles.modalContent, { borderBottomRightRadius: 20, borderBottomLeftRadius: 20, }]}>
              <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
                <Text style={styles.txtInptName}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Name"
                  value={userDeatail.name}
                  onChangeText={(txt) => { userInputValHandle(txt, "name") }}
                />
                <Text style={styles.txtInptName}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email"
                  value={userDeatail.email}
                  onChangeText={(txt) => { userInputValHandle(txt, "email") }}
                  keyboardType="email-address"
                />

                <Text style={styles.txtInptName}>Mobile No.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Mobile"
                  value={userDeatail.mobile}
                  onChangeText={(txt) => { userInputValHandle(txt, "mobile") }}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                  <Button title="Save" onPress={saveProfile} />
                  <Button title='Close' onPress={setEditProfilePopupVisible} />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </TouchableOpacity>



    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite,
    padding: 10,
  },
  profileBox: {
    marginTop: 10,
    marginBottom: 10,
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    borderWidth: 3,
    borderColor: rsplTheme.rsplRed,
    backgroundColor: rsplTheme.gradientColorRight,
    alignSelf: "center",
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  profileIcon: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  linearGradient: {
    // flex: 1,
    width: "50%",
    height: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    // margin: 10,
    color: rsplTheme.rsplWhite,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: rsplTheme.jetGrey,
    textAlign: "center"
  },
  profileDetails: {
    marginTop: 10,
    marginBottom: 10,
  },
  allTypes: {
    color: rsplTheme.textColorLight,
    fontSize: 18,
  },
  allTypesValue: {
    color: rsplTheme.textColorBold,
    fontSize: 18,
  },
  DetailsDes: {
    flexDirection: 'row',
    // flex: 1,
    // paddingTop: 8,
  },
  Side1: {
    width: 125,
    // borderBottomWidth:1,
    // borderBottomColor:swaTheme.swaBackgroundColor,
    padding: 8,
  },
  Side2: {
    backgroundColor: "white",
    flex: 1,
    padding: 8,
  },
  HwDetailTxt: {
    color: rsplTheme.textColorBold,
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  option: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: "center",
  },
  cameraBox: {
    flex: 1,
    position: "absolute",
    top: 90,
    left: "63%",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: rsplTheme.rsplWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 2,
    elevation: 5,
  },
  cameraIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    tintColor: rsplTheme.gradientColorLeft
  },
  editBox: {
    position: "absolute",
    top: "-7%",
    left: "92%",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    // borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: rsplTheme.rsplWhite
  },
  editIcon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
    tintColor: rsplTheme.gradientColorLeft
  },
  userCamGallery: {
    fontSize: 18,
    fontWeight: "500",
    color: rsplTheme.textColorBold
  },
  iconGallery: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: rsplTheme.textColorLight,
    marginRight: 15,
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
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

})