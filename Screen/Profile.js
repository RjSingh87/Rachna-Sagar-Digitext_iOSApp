import { StyleSheet, Share, Text, View, FlatList, TouchableOpacity, KeyboardAvoidingView, Button, Image, Alert, Modal, TextInput, ScrollView, ActivityIndicator, } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { apiRoutes, rsplTheme, token } from '../constant'
import LinearGradient from 'react-native-linear-gradient';
import { MyContext } from '../Store';
import { useNavigation } from '@react-navigation/native';
import Services from '../services';
import Loader from '../constant/Loader';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Profile = ({ data }) => {
  const navigation = useNavigation()
  const { logout, login, userData, setUserDate, fetchUpdatedProfileImage, userUpadatedRecord } = useContext(MyContext)
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupEditProfileVisible, setEditProfilePopupVisible] = useState(false);
  const [userDeatail, setUserDetails] = useState({ name: "", email: "", mobile: "", address: "", country: "" })
  const [loader, setLoader] = useState(false)
  const [profileImgLoader, setProfileImgLoader] = useState(false)
  const [userPickImg, setUserPickImg] = useState()
  const [saveLoader, setSaveLoader] = useState(false)
  // const [userUpadateName, setUserUpadatedName] = useState({ name: null, email: null, phone: null })


  useEffect(() => {
    if (userData?.isLogin) {
      fetchUpdatedProfileImage()
    }
  }, [userData?.isLogin,])


  const toggleCameraPopup = () => {
    setPopupVisible(!popupVisible);
  };
  const toggleEditProfilePopup = () => {
    setUserDetails({
      name: userUpadatedRecord?.name || "",
      email: userUpadatedRecord?.email || "",
      mobile: userUpadatedRecord?.Mobile || "",
      // name: data?.name || "",       // Set initial name
      // email: data?.email || "",     // Set initial email
      // mobile: data?.Mobile || "",   // Set initial mobile
    });

    setEditProfilePopupVisible(true);
  };

  const signOutAccount = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout(navigation) // Perform logout here
          }
        }
      ]
    )
    // navigation.navigate("Login")
    // Alert.alert("Info", "Coming soon")
  }



  const cameraAccess = async (userSelect) => {
    const options = { mediaType: 'photo', saveToPhotos: true, quality: 1, };
    try {
      let result
      setPopupVisible(false) // Hide popup
      if (userSelect === "camera") {
        result = await launchCamera(options)
      } else if (userSelect === "photo gallery") {
        result = await launchImageLibrary(options)
      }
      if (result?.didCancel) {
        console.log('User cancelled selection.');
        return;
      }
      if (result?.errorCode) {
        console.log('Error:', result.errorMessage);
        return;
      }
      const selectedImage = result.assets[0];
      // setUserPickImg(selectedImage.uri); // Show the image locally first
      await uploadImageToServer(selectedImage);// Upload to server


    } catch (error) {
      console.error('Camera/Gallery error:', error);
    }
  }

  const uploadImageToServer = async (userImg) => {
    try {
      setProfileImgLoader(true)
      const formData = new FormData();
      formData.append("profileImg", {
        uri: userImg?.uri,
        type: userImg?.type,
        name: userImg?.fileName
      })
      formData.append("userID", userData.data[0].id.toString())
      formData.append("api_token", token)
      const result = await Services.formMethod(apiRoutes.updateUserProfile, formData)
      if (result.status === 'success') {
        setProfileImgLoader(false)
        fetchUpdatedProfileImage()
      } else if (result.status === "failed") {
        Alert.alert("Info", result.message)
        fetchUpdatedProfileImage()
        setProfileImgLoader(false)
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  }

  // const fetchUpdatedProfileImage = async () => {
  //   try {
  //     const payLoad = {
  //       "api_token": token,
  //       "userID": userData.data[0].id
  //     }
  //     const result = await Services.post(apiRoutes.getUserProfile, payLoad)
  //     if (result.status === 'success') {
  //       const updatedImageUrl = result.userData[0]?.image
  //       setUserPickImg(updatedImageUrl)
  //       setUserUpadatedName((prev) => { return { ...prev, name: result.userData[0]?.name } })
  //     } else if (result.status === 'failed') {
  //       Alert.alert("Failed", result.message)
  //     }
  //   } catch (error) {
  //     if (error.message === "TypeError: Network request failed") {
  //       Alert.alert("Network Error", "Please try again.");
  //     } else {
  //       Alert.alert("Error:", error.message || "Something went wrong.")
  //     }
  //   }
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
          <TouchableOpacity onPress={onClose} style={{ width: "100%", height: "100%" }} />
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.option} onPress={() => cameraAccess("camera")}>
              <Image style={styles.iconGallery} source={require("../assets/icons/camera.png")} />
              <Text style={styles.userCamGallery}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => cameraAccess("photo gallery")}>
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
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile); // Exactly 10 digits
  };


  const saveProfile = async () => {
    if (!userDeatail.name.trim()) {
      Alert.alert("Name", "Name is required");
      return;
    }
    if (!validateEmail(userDeatail.email)) {
      Alert.alert("Email", "Please enter a valid email address");
      return;
    }
    if (!validateMobile(userDeatail.mobile)) {
      Alert.alert("Mobile", "Mobile number must be 10 digits");
      return;
    }
    setSaveLoader(true)
    try {
      const payLoad = {
        "api_token": token,
        "userID": userData.data[0].id,
        "userName": userDeatail.name.trim(),
        "email": userDeatail.email,
        "contactNo": userDeatail.mobile
      }
      const result = await Services.post(apiRoutes.updateUserDetails, payLoad)
      if (result.status === "success") {
        fetchUpdatedProfileImage()
        // const updatedUserData = result.userData[0]; // Update user data from API
        // setUserDate({ ...userData, data: [updatedUserData] }); // Update global state
        // setUserDetails({
        //   name: updatedUserData.name || "",
        //   email: updatedUserData.email || "",
        //   mobile: updatedUserData.Mobile || "",
        // });
        Alert.alert("Success", result?.message);
        setEditProfilePopupVisible(false); // Close modal
        // setUserDetails((prev) => { return { ...prev, name: "", email: "", mobile: "", address: "" } })
      } else if (result.status === "failed") {
        setLoader(false)
        Alert.alert("Info", result.message)
      }
    } catch (error) {
      console.log(error, "error?userData.??")
    } finally {
      setSaveLoader(false)
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
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
      <ScrollView contentContainerStyle={{ paddingBottom: 40, }}>
        <View style={styles.profileBox}>
          <View style={{ borderWidth: 3, borderColor: rsplTheme.rsplWhite, width: "95%", height: "95%", borderRadius: 100, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
            {profileImgLoader ?
              <ActivityIndicator size={"small"} color={rsplTheme.rsplWhite} /> :
              <Image style={styles.profileIcon} source={userUpadatedRecord?.image == null ? require("../assets/icons/ProfileIcon.png") : { uri: `${userUpadatedRecord?.image}` }} />
            }
          </View>


          <TouchableOpacity onPress={(() => { toggleCameraPopup() })} style={styles.cameraBox}>
            <Image style={styles.cameraIcon} source={require("../assets/icons/camera.png")} />
          </TouchableOpacity>
          <CameraPopup isVisible={popupVisible} onClose={toggleCameraPopup} />

        </View>


        <View style={{ marginVertical: 5, }}>
          <Text style={styles.profileName}>{userUpadatedRecord?.name}</Text>
          {/* <Text style={styles.profileName}>{data?.name}</Text> */}
        </View>



        <View style={styles.profileDetails}>
          <View style={styles.DetailsDes}>
            <View style={styles.Side1}>
              <Text style={styles.allTypes}>Email:</Text>
            </View>
            <View style={styles.Side2}>
              <Text style={styles.allTypesValue}>{userUpadatedRecord?.email}</Text>
              {/* <Text style={styles.allTypesValue}>{data?.email}</Text> */}
            </View>
          </View>
          <View style={styles.DetailsDes}>
            <View style={styles.Side1}>
              <Text style={styles.allTypes}>Mobile:</Text>
            </View>
            <View style={styles.Side2}>
              <Text style={styles.allTypesValue}>{userUpadatedRecord?.Mobile}</Text>
              {/* <Text style={styles.allTypesValue}>{data?.Mobile}</Text> */}
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={(() => { signOutAccount() })} style={styles.poweredBy}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
            <Text style={styles.buttonText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ marginTop: 20, alignSelf: "center", }}>
          <Button onPress={onShare} title="Share" />
          <Button onPress={yourAccount} title="Your Account" />
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
                  style={[styles.input, { opacity: 0.5, backgroundColor: '#f0f0f0' }]}
                  editable={false}
                  placeholder="Enter Email"
                  autoCapitalize='none'
                  value={userDeatail.email}
                  onChangeText={(txt) => { userInputValHandle(txt, "email") }}
                  keyboardType="email-address"
                />

                <Text style={styles.txtInptName}>Mobile No.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Mobile"
                  value={userDeatail.mobile}
                  onChangeText={(txt) => {
                    const onlyNums = txt.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                    userInputValHandle(onlyNums, "mobile");
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                  {saveLoader ?
                    <ActivityIndicator size={"small"} /> :
                    <Button title="Save" onPress={saveProfile} />
                  }
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
    // borderWidth: 3,
    borderColor: rsplTheme.rsplRed,
    backgroundColor: rsplTheme.gradientColorRight,
    alignSelf: "center",
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    // overflow: "hidden",
  },
  profileIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    // marginBottom: -5,
  },
  linearGradient: {
    // flex: 1,
    width: "60%",
    height: 40,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    // margin: 10,
    color: rsplTheme.rsplWhite,
    // textTransform: "uppercase"
  },
  profileName: {
    fontSize: 18,
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
    fontSize: 16,
  },
  allTypesValue: {
    color: rsplTheme.textColorBold,
    fontSize: 16,
  },
  DetailsDes: {
    flexDirection: 'row',
  },
  Side1: {
    width: 70,
    paddingVertical: 5,
  },
  Side2: {
    flex: 1,
    paddingVertical: 5,
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
    top: 85,
    left: "70%",
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
    zIndex: 100,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: rsplTheme.gradientColorLeft
  },
  editBox: {
    position: "absolute",
    top: "-5%",
    left: "92%",
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    // borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: rsplTheme.rsplWhite
  },
  editIcon: {
    width: 12,
    height: 12,
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