import { Alert, StyleSheet, Text, TouchableOpacity, View, Image, Linking, Share, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { rsplTheme } from '../constant'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MyContext } from '../Store'
import { DrawerActions } from '@react-navigation/native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DrawerMenu = ({ navigation, props }) => {

  const { userData, logout, setSelectedTab, fetchUpdatedProfileImage, userUpadatedRecord, setUserUpadatedRecord } = useContext(MyContext)

  const [userProfileImg, setUserProfileImg] = useState(require("../assets/RSPL.png"))

  useEffect(() => {
    if (userData?.isLogin) {
      fetchUpdatedProfileImage()
    } else {
      setUserProfileImg(require("../assets/RSPL.png"))
      setUserUpadatedRecord(null) // <-- reset this
    }
  }, [userData?.isLogin,])


  const privacyPolicy = (userSelected) => {
    const termconditionUrl = 'https://www.rachnasagar.in/termcondition';
    const privacyPolicyUrl = 'https://www.rachnasagar.in/privacyPolicy';
    if (userSelected === "Term condition") {
      Linking.openURL(termconditionUrl).catch((err) =>
        console.error('Failed to open URL:', err)
      );
    } else if (userSelected === "Privacy Policy") {
      Linking.openURL(privacyPolicyUrl).catch((err) =>
        console.error('Failed to open URL:', err)
      );
    }
  }

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

  const handlePress = (platform) => {
    const facebookUrl = "https://www.facebook.com/rachnasagargrp/"
    const xUrl = "https://twitter.com/rachnasagargrp"
    const linkedinUrl = "https://www.linkedin.com/company/rachnasagar"
    const instagramUrl = "https://www.instagram.com/rachnasagar.grp/"
    const youTubeUrl = "https://www.youtube.com/user/rachnasagarin"
    const telegramUrl = "https://telegram.me/rachnasagargrp"
    const pinterestUrl = "https://in.pinterest.com/rachnasagargrp/_created"
    const amazonUrl = "https://www.amazon.in/stores/page/678BD0FF-0F67-4B80-9720-DD130DE44E96"
    const flipkartUrl = "https://www.flipkart.com/books/rachna-sagar~contributor/pr?sid=bks"

    switch (platform) {
      case 'facebook':
        Linking.openURL(facebookUrl).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        break;
      case 'X':
        Linking.openURL(xUrl).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        break;

      case 'LinkedIn':
        Linking.openURL(linkedinUrl).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        break;

      case 'instagram':
        Linking.openURL(instagramUrl).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        break;

      case 'YouTube':
        Linking.openURL(youTubeUrl).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        break;

      case 'Telegram':
        Linking.openURL(telegramUrl).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        break;

      case 'Telegram':
        Linking.openURL(telegramUrl).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        break;

      case 'Pinterest':
        Linking.openURL(pinterestUrl).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        break;

      case 'Amazon':
        Linking.openURL(amazonUrl).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        break;

      case 'Flipkart':
        Linking.openURL(flipkartUrl).catch((err) =>
          console.error('Failed to open URL:', err)
        );
        break;

      default:
        Alert.alert("Info", 'Platform not available');
    }
  };




  return (
    <View style={{ flex: 1, }}>

      <TouchableOpacity onPress={(() => { setSelectedTab(4), navigation.navigate("Main"), navigation.dispatch(DrawerActions.closeDrawer()) })} style={{ width: "100%", paddingVertical: 10, alignItems: "center", justifyContent: "center", backgroundColor: rsplTheme.gradientColorRight, alignSelf: "center", marginBottom: 25, }}>
        <View style={{ width: 80, height: 80, borderRadius: 80 / 2, alignItems: "center", justifyContent: "center", backgroundColor: rsplTheme.rsplWhite }}>
          <Image style={{ width: 70, height: 70, borderColor: rsplTheme.rsplLightPink, borderRadius: 70 / 2, resizeMode: "contain" }} source={userUpadatedRecord?.image ? { uri: userUpadatedRecord?.image } : userProfileImg} />
          {/* <Image style={{ width: 70, height: 70, borderColor: rsplTheme.rsplLightPink, borderRadius: 70 / 2, resizeMode: "contain" }} source={userData?.data?.[0]?.image ? { uri: userData?.data[0]?.image } : require("../assets/RSPL.png")} /> */}
        </View>
        <View style={{ marginVertical: 8, }}>
          <Text style={{ color: rsplTheme.rsplWhite, fontWeight: "600", fontSize: 16 }}> {`${userUpadatedRecord?.name || 'Unknow User'}`} </Text>
          {/* <Text style={{ color: rsplTheme.rsplWhite, fontWeight: "600", fontSize: 16 }}> {`${userData?.data?.[0]?.name || 'Unknow User'}`} </Text> */}
        </View>
      </TouchableOpacity>

      <DrawerContentScrollView {...props}>

        <View style={{ flex: 1, }}>

          <View style={{ flexDirection: "row", alignItems: "center", }}>
            <View style={{ width: 50, alignItems: "center", padding: 10, }}>
              <AntDesign name="home" size={20} color={rsplTheme.gradientColorLeft} />
            </View>

            <TouchableOpacity style={{ flex: 1, paddingVertical: 18, }} onPress={(() => {
              setSelectedTab(0); navigation.navigate("Main")
              navigation.dispatch(DrawerActions.closeDrawer())
            })}>
              <Text style={{ fontSize: 16, fontWeight: "500", color: rsplTheme.jetGrey }}>Dashboard</Text>
            </TouchableOpacity>

          </View>

          <View style={{ flexDirection: "row", alignItems: "center", }}>
            <View style={{ width: 50, alignItems: "center", padding: 10, }}>
              <AntDesign name="phone" size={20} color={rsplTheme.gradientColorLeft} />
            </View>

            <TouchableOpacity style={{ flex: 1, paddingVertical: 18, }} onPress={(() => {
              navigation.navigate("ContactUs")
              navigation.dispatch(DrawerActions.closeDrawer())
              // Alert.alert("dldldl") 
            })}>
              <Text style={{ fontSize: 16, fontWeight: "500", color: rsplTheme.jetGrey }}>Contact Us</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", }}>
            <View style={{ width: 50, alignItems: "center", padding: 10, }}>
              <AntDesign name="sharealt" size={20} color={rsplTheme.gradientColorLeft} />
            </View>

            <TouchableOpacity style={{ flex: 1, paddingVertical: 18, }} onPress={(() => {
              onShare()
              navigation.dispatch(DrawerActions.closeDrawer())
            })}>
              <Text style={{ fontSize: 16, fontWeight: "500", color: rsplTheme.jetGrey }}>Share App</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", }}>
            <View style={{ width: 50, alignItems: "center", padding: 10, }}>
              <AntDesign name="user" size={20} color={rsplTheme.gradientColorLeft} />
            </View>

            <TouchableOpacity style={{ flex: 1, paddingVertical: 18, }} onPress={(() => {
              setSelectedTab(4); navigation.navigate("Main")
              navigation.dispatch(DrawerActions.closeDrawer())
            })}>
              <Text style={{ fontSize: 16, fontWeight: "500", color: rsplTheme.jetGrey }}>Account/Login</Text>
            </TouchableOpacity>

          </View>



          {userData?.isLogin &&
            <>
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <View style={{ width: 50, alignItems: "center", padding: 10, }}>
                  <AntDesign name="hearto" size={20} color={rsplTheme.gradientColorLeft} />
                </View>

                <TouchableOpacity style={{ flex: 1, paddingVertical: 18, }} onPress={(() => {
                  setSelectedTab(5); navigation.navigate("Main")
                  navigation.dispatch(DrawerActions.closeDrawer())
                })}>
                  <Text style={{ fontSize: 16, fontWeight: "500", color: rsplTheme.jetGrey }}>Wish List</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <View style={{ width: 50, alignItems: "center", padding: 10, }}>
                  <AntDesign name="shoppingcart" size={20} color={rsplTheme.gradientColorLeft} />
                </View>

                <TouchableOpacity style={{ flex: 1, paddingVertical: 18, }} onPress={(() => {
                  setSelectedTab(3); navigation.navigate("Main")
                  navigation.dispatch(DrawerActions.closeDrawer())
                })}>
                  <Text style={{ fontSize: 16, fontWeight: "500", color: rsplTheme.jetGrey }}>Cart</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <View style={{ width: 50, alignItems: "center", padding: 10, }}>
                  <Entypo name="address" size={20} color={rsplTheme.gradientColorLeft} />
                </View>

                <TouchableOpacity style={{ flex: 1, paddingVertical: 18, }} onPress={(() => {
                  navigation.navigate("SavedAddress")
                  navigation.dispatch(DrawerActions.closeDrawer())
                })}>
                  <Text style={{ fontSize: 16, fontWeight: "500", color: rsplTheme.jetGrey }}>Address</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <View style={{ width: 50, alignItems: "center", padding: 10, }}>
                  <AntDesign name="book" size={20} color={rsplTheme.gradientColorLeft} />
                </View>

                <TouchableOpacity style={{ flex: 1, paddingVertical: 18, }} onPress={(() => {
                  navigation.navigate("YourAccount", { data: "Your Account" })
                  navigation.dispatch(DrawerActions.closeDrawer())
                })}>
                  <Text style={{ fontSize: 16, fontWeight: "500", color: rsplTheme.jetGrey }}>My Order</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <View style={{ width: 50, alignItems: "center", padding: 10, }}>
                  <AntDesign name="logout" size={20} color={rsplTheme.gradientColorLeft} />
                </View>

                <TouchableOpacity style={{ flex: 1, paddingVertical: 18, }} onPress={(() => {
                  logout()
                  navigation.navigate("Home")
                })}>
                  <Text style={{ fontSize: 16, fontWeight: "500", color: rsplTheme.jetGrey }}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </>
          }
        </View>
      </DrawerContentScrollView>


      <View style={{ borderBottomColor: rsplTheme.jetGrey, borderBottomWidth: 1, }}>
        <Text style={{ fontWeight: "500", color: rsplTheme.jetGrey, marginLeft: 10, fontSize: 11 }}>Follow Us</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, }}>
          <TouchableOpacity style={{ width: "11.11%", alignItems: "center" }} onPress={() => handlePress('facebook')}>
            <FontAwesome name="facebook" size={17} color="#4267B2" />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: "11.11%", alignItems: "center" }} onPress={() => handlePress('X')}>
            <AntDesign name="close" size={17} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: "11.11%", alignItems: "center" }} onPress={() => handlePress('LinkedIn')}>
            <AntDesign name="linkedin-square" size={17} color="#0077B5" />
          </TouchableOpacity>

          {/* Instagram Icon */}
          <TouchableOpacity style={{ width: "11.11%", alignItems: "center" }} onPress={() => handlePress('instagram')}>
            <Feather name="instagram" size={17} color="#C13584" />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: "11.11%", alignItems: "center" }} onPress={() => handlePress('YouTube')}>
            <FontAwesome name="youtube-play" size={17} color="#FF0000" />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: "11.11%", alignItems: "center" }} onPress={() => handlePress('Telegram')}>
            <FontAwesome name="telegram" size={17} color="#0088CC" />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: "11.11%", alignItems: "center" }} onPress={() => handlePress('Pinterest')}>
            <FontAwesome name="pinterest" size={17} color="#E60023" />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: "11.11%", alignItems: "center" }} onPress={() => handlePress('Amazon')}>
            <FontAwesome name="amazon" size={17} color="#FF9900" />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: "11.11%", alignItems: "center" }} onPress={() => handlePress('Flipkart')}>
            {/* <MaterialIcons name="storefront" size={17} color="#2874F0" /> */}
            <Image style={{ width: 20, height: 20, resizeMode: "contain" }} source={{ uri: "https://rachnasagar.in/assets/socialMedia/img/62e7786ae8ff6flipkart.png" }} />
          </TouchableOpacity>

        </View>
      </View>




      <View style={{}}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginVertical: 5, padding: 5, }}>
          <Text onPress={(() => { privacyPolicy("Term condition") })} style={{ textAlign: "center", color: rsplTheme.rsplBlue, fontWeight: "400", }} >Terms & Conditions</Text>
          <Text style={{ textAlign: "center", color: rsplTheme.rsplBlue, fontWeight: "400", }} >|</Text>
          <Text onPress={(() => { privacyPolicy("Privacy Policy") })} style={{ textAlign: "center", color: rsplTheme.rsplBlue, fontWeight: "400", }}>Privacy Policy</Text>
        </View>
        <Text style={{ fontSize: 12, textAlign: "center", color: rsplTheme.jetGrey }} >Version: 1.0.1  |  Made in Rachna Sagar</Text>
      </View>


    </View>
  )
}

export default DrawerMenu

const styles = StyleSheet.create({})