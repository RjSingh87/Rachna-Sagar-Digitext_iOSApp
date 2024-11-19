import { StyleSheet, Text, Alert, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, ScrollView, } from 'react-native'
import React, { useState } from 'react'
import Header from '../comman/Header'
import { apiRoutes, rsplTheme, token } from '../constant'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient';
import Services from '../services'
import Loader from '../constant/Loader'

const CreateNewPassword = ({ route }) => {
  const navigation = useNavigation()
  const [newPassword, setNewPassword] = useState({ newPass: null, confirmPass: null, newPassView: false, confirmPassView: false })
  const [loader, setLoader] = useState(false)
  const [showAlert, setShowAlert] = useState({ status: false, message: "" });

  const generateNewPassword = async () => {
    if (newPassword.newPass == newPassword.confirmPass) {
      setLoader(true)
      const payload = {
        "api_token": token,
        "contactno": route.params?.contactNo,
        "password": newPassword.newPass
      }
      // console.log(payload, "New Pass")
      await Services.post(apiRoutes.newPasswordGenerator, payload)
        .then((res) => {
          if (res.status === "success") {
            setShowAlert((prev) => { return { ...prev, status: true, message: res.message } })
            let timer = setTimeout(() => {
              setShowAlert((prev) => { return { ...prev, status: false, message: null } })
              navigation.pop(3)
              // navigation.popToTop()
            }, 3000)
            return () => clearTimeout(timer);
          } else if (res.status == "Failed") {
            Alert.alert(`${res.message}`)
          }
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally(() => { setLoader(false) })
    } else {
      Alert.alert("Info", "Confirm password does not match.")
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
        title={"Create New Password"}
        onClickLeftIcon={() => { navigation.pop(3) }}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
        <KeyboardAvoidingView
          style={styles.avoidContainer}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
          <View style={styles.lockContainer}>
            <Image style={styles.lockIcon} source={require("../assets/icons/lockCheckMark.png")} />
          </View>
          <Text style={styles.pleaseEnter}>Your new password is must be different from previously used password.</Text>

          <View style={styles.emailPass}>
            <Text style={styles.EmaiPass}>New password</Text>
            <TextInput value={newPassword.newPass} secureTextEntry={!newPassword.newPassView} onChangeText={(text) => { setNewPassword((prev) => { return { ...prev, newPass: text } }) }} placeholder='Type new password' returnKeyType='done' style={styles.txtInput} />
            <TouchableOpacity onPress={(() => { setNewPassword((prev) => { return { ...prev, newPassView: !newPassword.newPassView } }) })} style={styles.eyePosition}>
              <Image style={styles.eyeIcon} source={newPassword.newPassView == true ? require("../assets/icons/eye.png") : require("../assets/icons/eyeClose.png")} />
            </TouchableOpacity>

            <Text style={[styles.EmaiPass, { marginTop: 10, }]}>Confirm password</Text>
            <TextInput value={newPassword.confirmPass} secureTextEntry={!newPassword.confirmPassView} onChangeText={(text) => { setNewPassword((prev) => { return { ...prev, confirmPass: text } }) }} placeholder='Type confirm password' returnKeyType='done' style={styles.txtInput} />
            <TouchableOpacity onPress={(() => { setNewPassword((prev) => { return { ...prev, confirmPassView: !newPassword.confirmPassView } }) })} style={styles.eyePositionConfirm}>
              <Image style={styles.eyeIcon} source={newPassword.confirmPassView == true ? require("../assets/icons/eye.png") : require("../assets/icons/eyeClose.png")} />
            </TouchableOpacity>
          </View>

          <View style={{ marginVertical: 10 }}>
            <TouchableOpacity onPress={(() => { generateNewPassword() })}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
                <Text style={styles.buttonText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>


      {showAlert.status &&
        <View style={styles.successAlert}>
          <View style={styles.successAlertInside}>
            <Image style={styles.successImage} source={require("../assets/icons/check.png")} />
            <Text style={styles.successMessage}>{showAlert.message}</Text>
          </View>
        </View>
      }

    </View>
  )
}

export default CreateNewPassword

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite,
  },
  lockContainer: {
    backgroundColor: rsplTheme.lightYellow,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  lockIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  pleaseEnter: {
    fontSize: 18,
    fontWeight: "500",
    color: rsplTheme.textColorLight,
    textAlign: "center",
    marginTop: 20,
  },
  emailPass: {
    marginTop: 10,
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
    paddingRight: 50,
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
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  successAlert: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: rsplTheme.rsplLightGrey + 75
  },
  successAlertInside: {
    backgroundColor: "white",
    borderWidth: .5,
    borderColor: rsplTheme.rsplGreen,
    width: 350,
    height: 200,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  successImage: {
    width: 75,
    height: 75,
    resizeMode: "cover",
  },
  successMessage: {
    fontSize: 18,
    color: rsplTheme.textColorBold,
    fontWeight: "300",
    textAlign: "center"
  },
  eyePosition: {
    position: "absolute",
    top: "30%",
    left: "92%"
  },
  eyePositionConfirm: {
    position: "absolute",
    top: "84%",
    left: "92%"
  },
  eyeIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain"
  },
  avoidContainer: {
    flex: 1,
  }
})