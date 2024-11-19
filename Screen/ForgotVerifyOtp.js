import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Keyboard, Alert, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { apiRoutes, rsplTheme, token, tokenMobileOTP } from '../constant'
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../constant/Loader';
import Services from '../services';
import Header from '../comman/Header';



const ForgotVerifyOtp = ({ navigation, route }) => {
  const { mobileNo, message, otp, name } = useRef(route.params).current
  const [loader, setLoader] = useState(false)
  const [time, setTime] = useState(60);
  const timerRef = React.useRef(time);
  const [resendOTP, setresendOTP] = useState()
  const [OTP, setOTP] = useState({ 0: "", 1: "", 2: "", 3: "" })
  const [nextIputIndex, setNextIputIndex] = useState(0)
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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
    input.current.focus();
  }, [nextIputIndex])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);



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
    // const userInputVal = `${otpValue.oneOTP}${otpValue.twoOTP}${otpValue.threeOTP}${otpValue.fourOTP}`
    const InputVal = `${OTP[0]}${OTP[1]}${OTP[2]}${OTP[3]}`
    // console.log(InputVal, "RajIRRR?")
    if (InputVal == otp || InputVal == resendOTP) {
      navigation.navigate("CreateNewPassword", { contactNo: mobileNo })
    } else {
      Alert.alert("Entered OTP does not match.")
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









  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Verify your mobile number"}
        onClickLeftIcon={() => { navigation.goBack() }}
      />

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ marginBottom: keyboardHeight, }}>

        <View style={styles.lockContainer}>
          <Image style={styles.lockIcon} source={require("../assets/icons/keypad.png")} />
        </View>
        {/* <Text style={styles.pleaseEnter}>Please enter your email address to receive a verification code</Text> */}


        <View style={{ margin: 10, }}>
          <Text style={styles.verifyOTP}>Verify Your Mobile Number</Text>
          <Text style={styles.verifyMessage}>An SMS with 4-digit OTP was sent to</Text>

          <View style={styles.mobileChange}>
            <Text style={styles.mobNo}> +91 {mobileNo}</Text>
            <TouchableOpacity style={{}} onPress={(() => { navigation.goBack() })}>
              <Text style={styles.changeMob}>  Change</Text>
            </TouchableOpacity>
          </View>
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
                  returnKeyType='done'
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
              <Text style={styles.buttonText}>Verify</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </ScrollView>

    </View>
  )
}

export default ForgotVerifyOtp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite,
    // padding: 20,
  },
  verifyOTP: {
    fontSize: 25,
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
    width: "50%",
    height: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
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
    alignItems: "center",

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
    width: 55,
    height: 55,
    resizeMode: "contain",
  },

})