import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { apiRoutes, rsplTheme, token, tokenMobileOTP } from '../constant'
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../constant/Loader';
import Services from '../services';



const OtpVerifyForCreateAcc = ({ navigation, route }) => {
  // console.log(route, "data of route")
  const { mobileNo, message, otp, name } = useRef(route.params).current
  const [loader, setLoader] = useState(false)
  const [time, setTime] = useState(60);
  const timerRef = React.useRef(time);
  const [resendOTP, setresendOTP] = useState()
  const [OTP, setOTP] = useState({ 0: "", 1: "", 2: "", 3: "" })
  const [nextIputIndex, setNextIputIndex] = useState(0)
  const [showAlert, setShowAlert] = useState({ status: false, message: "" });

  const input = useRef()


  useEffect(() => {
    const timerId = setInterval(() => {
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        clearInterval(timerId);
      } else {
        setTime(timerRef.current);
      }
    }, 1000);
    return () => {
      clearInterval(timerId);
    };

  }, [time])

  useEffect(() => {
    input.current?.focus();
  }, [nextIputIndex])



  const GetOTP = async () => {
    setLoader(true)
    const payLoadOTP = {
      "api_token": token,
      "contactNo": mobileNo
    }

    await Services.post(apiRoutes.mobileOTP, payLoadOTP)
      .then((res) => {
        if (res.status == "success") {
          setresendOTP(res.otp)
          setTime(50)
        } else {
          Alert.alert("errors", res.message)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setLoader(false) })
  }

  const SubmitOTP = () => {
    setLoader(true)
    const InputVal = `${OTP[0]}${OTP[1]}${OTP[2]}${OTP[3]}`
    if (InputVal == otp || InputVal == resendOTP) {
      const payload = {
        "api_token": token,
        "name": route.params.registration?.name,
        "mobile": route.params.registration?.mobile,
        "email": route.params.registration?.email,
        "country": route.params.registration?.country,
        "state": route.params.registration?.state,
        "city": route.params.registration?.city,
        "pincode": route.params.registration?.pincode,
        "address": route.params.registration?.address,
        "password": route.params.registration?.password,
        "you_are": route.params.registration?.you_are,
      }
      Services.post(apiRoutes.registrationAcc, payload)
        .then((res) => {
          if (res.status === "success") {
            setShowAlert((prev) => { return { ...prev, status: true, message: res.message } })
            let timer = setTimeout(() => {
              setShowAlert((prev) => { return { ...prev, status: false, message: null } })
              navigation.pop(2)
              // navigation.popToTop()
            }, 3000)
            return () => clearTimeout(timer);
          } else {
            Alert.alert("Error", res.message)
          }
        })
        .catch((err) => {
          if (err.message == "TypeError: Network request failed") {
            Alert.alert("Network Error", `Please try again.`)
          } else { Alert.alert("Error", `${err.message}`) }
        })
        .finally(() => { setLoader(false) })
      // navigation.navigate("Main")
    } else {
      Alert.alert("Info", "Entered OTP does not match.")
      return
    }
  }






  if (loader) {
    return (
      <View style={{ flex: 1, width: "100%", backgroundColor: rsplTheme.rsplWhite, borderRadius: 12 }}>
        <Loader text='Loading...' />
      </View>
    )
  }


  const txtInput = Array(4).fill("")
  let newInputIndex = 0


  const handleChangeTxt = (txt, index) => {
    const newOTP = { ...OTP }
    newOTP[index] = txt
    // console.log(newOTP, "newOTP")
    setOTP(newOTP)

    const lastInputIndex = txtInput.length - 1
    // console.log(lastInputIndex, "which")
    if (!txt) {
      newInputIndex = index === 0 ? 0 : index - 1
    } else {
      newInputIndex = index === lastInputIndex ? lastInputIndex : index + 1
    }
    setNextIputIndex(newInputIndex)


  }
  // console.log(OTP, "update")









  return (
    <View style={styles.container}>
      <Text style={styles.verifyOTP}>Verify Your Mobile Number</Text>
      <Text style={styles.verifyMessage}>An SMS with 4-digit OTP was sent to</Text>

      <View style={styles.mobileChange}>
        <Text style={styles.mobNo}> +91 {mobileNo}</Text>
        <TouchableOpacity style={{}} onPress={(() => { navigation.goBack() })}>
          <Text style={styles.changeMob}>  Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.textInput}>
        {txtInput.map((value, index) => {
          return (
            <View key={index.toString()}>
              <TextInput
                value={OTP[index]}
                keyboardType='numeric'
                style={styles.txtInput}
                maxLength={1}
                onChangeText={(txt) => { handleChangeTxt(txt, index) }}
                ref={nextIputIndex === index ? input : null}
              />
            </View>
          )
        })}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
        <Text>{time == 0 ?
          <TouchableOpacity onPress={(() => { GetOTP() })}>
            <Text>Resend OTP</Text>
          </TouchableOpacity> :
          `Waiting for OTP... ${time} seconds`}  </Text>
      </View>



      <View style={{ marginVertical: 10 }}>
        <TouchableOpacity onPress={(() => { SubmitOTP() })}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
            <Text style={styles.buttonText}>VERIFY</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

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

export default OtpVerifyForCreateAcc

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite,
    padding: 20,
  },
  verifyOTP: {
    fontSize: 28,
    fontWeight: "600",
    color: rsplTheme.textColorBold
  },
  verifyMessage: {
    fontSize: 18,
    color: rsplTheme.textColorLight,
    marginTop: 10,
  },
  mobNo: {
    fontSize: 18,
    fontWeight: "600",
    color: rsplTheme.textColorBold
  },
  changeMob: {
    fontWeight: "600",
    fontSize: 18,
    color: rsplTheme.rsplBackgroundColor,
  },
  mobileChange: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,

  },
  linearGradient: {
    // flex: 1,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    // margin: 10,
    color: rsplTheme.rsplWhite,
  },
  textInput: {
    // backgroundColor:"#e1e1e1",
    // borderWidth: 1,
    // height: 240,
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 15,
    alignItems: "center"
  },
  txtInput: {
    height: 70,
    width: 70,
    borderRadius: 10,
    backgroundColor: rsplTheme.rsplLightGrey,
    alignSelf: "center",
    padding: 10,
    borderWidth: .7,
    borderColor: rsplTheme.textColorBold,
    textAlign: "center",
    fontSize: 30
  },
  otpContainer: {
    flexDirection: "row",
    flex: 0.4,
    justifyContent: "space-between"
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
    fontSize: 20,
    color: rsplTheme.textColorBold,
    fontWeight: "300",
    textAlign: "center"
  }
})