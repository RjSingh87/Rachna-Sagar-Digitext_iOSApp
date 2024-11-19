import { StyleSheet, Text, View, Alert, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import Header from '../comman/Header';
import { apiRoutes, rsplTheme, token } from '../constant';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Services from '../services';
import Loader from '../constant/Loader';


const ForgotPassword = () => {
  const navigation = useNavigation()
  const [forgotValue, setForgotValue] = useState()
  const [loader, setLoader] = useState(false)

  const sendForgotPassword = async () => {
    if (forgotValue !== undefined) {
      setLoader(true)
      const newData = "";
      const payload = {
        "api_token": token,
        [newData + (forgotValue.includes("@") ? "email" : "contactno")]: forgotValue
      }
      // console.log(payload, "PayLOOO")
      // return
      await Services.post(apiRoutes.forgotPassword, payload)
        .then((res) => {
          if (res.status === "success") {
            navigation.navigate("ForgotVerifyOtp", { mobileNo: forgotValue, message: res.message, otp: res.otp, name: "Sign In" })
          } else if (res.status == "failed") {
            Alert.alert(`${res.message}`)
            return
          }
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally(() => { setLoader(false) })
    } else {
      Alert.alert("Info", "Please enter your mobile number.")
    }
  }

  if (loader) {
    return (
      <View style={styles.loader}>
        <Loader text='Loading...' />
      </View>
    )

  }




  return (
    <View style={styles.mainContainer}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Forgot Password"}
        onClickLeftIcon={() => { navigation.goBack() }}
      />

      <KeyboardAvoidingView
        style={styles.avoidContainer}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 10, }}>
          <View style={styles.lockContainer}>
            <Image style={styles.lockIcon} source={require("../assets/icons/lockQuestion.png")} />
          </View>
          <Text style={styles.pleaseEnter}>Please enter your email address/mobile no. to receive a verification code</Text>
        </View>

        <View style={styles.emailPass}>
          <Text style={styles.EmaiPass}>Email/Mobile No.</Text>
          <TextInput autoCapitalize='none' value={forgotValue} onChangeText={(text) => { setForgotValue(text) }} placeholder='Enter your Email/Mobile number' returnKeyType='done' keyboardType='email-address' style={styles.txtInput} />
        </View>

        <TouchableOpacity onPress={(() => { sendForgotPassword() })}
          style={[styles.poweredBy, { width: "50%", marginTop: 10, alignSelf: "center" }]}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
            <Text style={styles.buttonText}>Send</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite
  },
  avoidContainer: {
    flex: 1,
    // justifyContent: 'center',
    // paddingHorizontal: 20,
  },
  lockContainer: {
    backgroundColor: rsplTheme.lightYellow,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    // marginTop: 20,
  },
  lockIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  pleaseEnter: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: rsplTheme.textColorLight,
    textAlign: "center",
    marginLeft: 10,
  },
  emailPass: {
    marginTop: 20,
    padding: 10,

  },
  EmaiPass: {
    fontSize: 16,
    paddingBottom: 6,
    color: rsplTheme.textColorLight
  },
  txtInput: {
    backgroundColor: rsplTheme.rsplWhite,
    padding: 10,
    // top: 10,
    height: 45,
    borderRadius: 6,
    color: rsplTheme.jetGrey,
    borderWidth: .5,
    borderColor: rsplTheme.jetGrey,
    fontSize: 18,
    fontWeight: "500",
    color: rsplTheme.textColorBold
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    // margin: 10,
    color: rsplTheme.rsplWhite,
  },
  linearGradient: {
    // flex: 1,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})