import { StyleSheet, Text, View, Image, Modal, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import Login from './Login'
import { apiRoutes, rsplTheme, token } from '../constant'
import LinearGradient from 'react-native-linear-gradient';
import Services from '../services'
import Loader from '../constant/Loader'
import Profile from './Profile'
import CatchError from './CatchError'
import { MyContext } from '../Store'
import NoInternetConn from './NoInternetConn'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';






const User = () => {
  const navigation = useNavigation()
  const { userData, login, logout } = useContext(MyContext)
  // console.log(userData.isLogin, "Kya true hail..????")


  const [remember, setRemember] = useState({ rememberPassStatus: false, forgotPassModal: false })
  const [userDatail, setUserDetail] = useState({ email: "", password: "", status: false, data: [] })
  const [loader, setLoader] = useState(false)
  const [profileDetail, setProfileDetails] = useState({ details: [], status: false })

  const [errorMessage, setErrorMessage] = useState(null);


  useEffect(() => {
    const loadEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('rememberedEmail');
        if (storedEmail) {
          setUserDetail((prev) => ({ ...prev, email: storedEmail }));
          setRemember((prev) => ({ ...prev, rememberPassStatus: true }));
        }
      } catch (error) {
        console.log("Error loading email:", error);
      }
    };

    loadEmail();
  }, []);



  const rememberPass = () => {
    setRemember(((prev) => { return { ...prev, rememberPassStatus: !remember.rememberPassStatus } }))
  }

  const signInAccount = async () => {
    try {
      if (remember.rememberPassStatus) {
        await AsyncStorage.setItem('rememberedEmail', userDatail.email);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
      }
      login(userDatail, navigation);
    } catch (error) {
      console.log("Error saving email:", error);
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
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/menu.png")}
        // rightIcon={require('../assets/icons/pen.png')}
        title={!userData?.isLogin ? "Login" : "Profile"}
        onClickLeftIcon={() => { navigation.openDrawer(); }}
        onClickRightIcon={() => { return }}
      />

      <NoInternetConn />

      {!userData?.isLogin ?
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, padding: 10, }}>
          <Text style={styles.creatAccHeader}>Enter your login details to access your account</Text>
          <View>
            <View style={styles.emailPass}>
              <Text style={styles.EmaiPass}>Email</Text>
              <TextInput
                autoCapitalize='none'
                autoCorrect={true}
                autoComplete='email'
                value={userDatail.email}
                onChangeText={(text) => { setUserDetail((prev) => { return { ...prev, email: text } }) }}
                placeholder='Enter email id'
                keyboardType='email-address'
                textContentType='emailAddress'
                style={styles.txtInput}
              />
            </View>
            <View style={styles.emailPass}>
              <Text style={styles.EmaiPass}>Password</Text>
              <TextInput
                value={userDatail.password}
                onChangeText={(text) => { setUserDetail((prev) => { return { ...prev, password: text } }) }}
                placeholder='Enter password'
                textContentType='password'
                autoComplete='password'
                secureTextEntry={!userDatail.status}
                style={[styles.txtInput, { paddingRight: 45 }]}
              />
              <TouchableOpacity onPress={(() => { setUserDetail((prev) => { return { ...prev, status: !userDatail.status } }) })} style={styles.eyePosition}>
                <Image style={styles.eyeIcon} source={userDatail.status == true ? require("../assets/icons/eye.png") : require("../assets/icons/eyeClose.png")} />
              </TouchableOpacity>
            </View>

            {errorMessage &&
              <CatchError message={errorMessage} fontSize={16} color={rsplTheme.rsplRed} marginVertical={5} />
            }


            <View style={styles.rememberForgetPass}>
              <TouchableOpacity style={{ alignItems: "center", flexDirection: "row", width: "40%" }} onPress={(() => { rememberPass() })}>
                {remember.rememberPassStatus ?
                  <MaterialCommunityIcons name="checkbox-marked" size={25} color={rsplTheme.rsplGreen} /> :
                  <MaterialCommunityIcons name="checkbox-blank-outline" size={25} color={rsplTheme.jetGrey} />
                }
                <Text style={{ marginHorizontal: 5 }}>Remember</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={(() => {
                navigation.navigate("ForgotPassword")
                // setRemember((prev) => { return { ...prev, forgotPassModal: true } })
              })}
                style={{ alignItems: "flex-end", flex: 1, }}>
                <Text>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={{}}>
              <TouchableOpacity onPress={(() => { signInAccount() })} style={styles.poweredBy}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[rsplTheme.gradientColorLeft, rsplTheme.gradientColorRight]} style={styles.linearGradient}>
                  <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Image style={styles.loginImg} source={require("../assets/icons/loginImg.png")} />

              <View style={styles.dontAcount}>
                <Text style={styles.DontAccount}>Don't have an account?</Text>
                <TouchableOpacity onPress={(() => { navigation.navigate("CreateAccount") })} style={{ marginLeft: 10, }}>
                  <Text style={styles.Register}>Register</Text>
                </TouchableOpacity>
              </View>


            </View>
          </View>
        </ScrollView> :
        <Profile data={userData?.data[0]} />
      }





    </View>
  )
}

export default User

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite,
  },
  creatAccHeader: {
    fontSize: 16,
    color: rsplTheme.textColorLight,
    fontWeight: "800",
  },
  loginView: {
    margin: 4,
    padding: 10,
  },
  EmaiPass: {
    fontSize: 16,
    paddingBottom: 6,
    color: rsplTheme.textColorLight
  },
  DontAccount: {
    fontSize: 16,
    color: rsplTheme.textColorLight,
    fontWeight: "500",
  },
  Register: {
    fontSize: 18,
    color: rsplTheme.rsplRed,
    fontWeight: "500",
  },
  // txtInput: {
  //   backgroundColor: "#e1e1e1",
  //   height: 40,
  // },
  emailPass: {
    marginTop: 10,
  },
  squareBox: {
    width: 25,
    height: 25,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: rsplTheme.textColorLight,
    marginRight: 10,
  },
  rememberForgetPass: {
    marginTop: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  poweredBy: {
    bottom: 0,
    padding: 10,
    width: "100%",
  },
  poweredByTxt: {
    color: rsplTheme.jetGrey + 75,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },

  linearGradient: {
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
    color: rsplTheme.rsplWhite,
  },
  txtInput: {
    backgroundColor: rsplTheme.rsplWhite,
    padding: 10,
    height: 45,
    borderRadius: 6,
    color: rsplTheme.jetGrey,
    borderWidth: .5,
    borderColor: rsplTheme.jetGrey

  },
  dontAcount: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  loginImg: {
    width: "80%",
    height: 130,
    alignSelf: "center",
    resizeMode: "contain"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: rsplTheme.jetGrey + 75
  },
  modalView: {
    width: "92%",
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  eyePosition: {
    position: "absolute",
    top: "50%",
    right: 10,
    // left: "90%"

  },
  eyeIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain"
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})