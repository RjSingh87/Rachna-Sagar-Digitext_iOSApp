import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Alert, StatusBar, } from 'react-native'
import React, { useState } from 'react'
import { rsplTheme } from '../constant'
import { useNavigation } from '@react-navigation/native'

const SignUp = () => {
  const navigation = useNavigation()

  const userData = [
    {
      id: 1,
      userType: "Student",
    },
    {
      id: 2,
      userType: "Parents",
    },
    {
      id: 3,
      userType: "Teacher",
    },
    {
      id: 4,
      userType: "School",
    },
  ]

  const userInput = [
    {
      id: 1,
      inputType: "Name",
    },
    {
      id: 2,
      inputType: "Mobile",
    },
    {
      id: 3,
      inputType: "Email",
    },
    {
      id: 4,
      inputType: "Address",
    },
    {
      id: 5,
      inputType: "City",
    },
    {
      id: 6,
      inputType: "State",
    },
    {
      id: 7,
      inputType: "Country",
    },
    {
      id: 8,
      inputType: "Pincode",
    },
    {
      id: 9,
      inputType: "Password",
    },
  ]



  const [userTypeValue, setUserTypeValue] = useState({ value: "", status: false })
  const [inputValue, setInputValue] = useState({ name: "", mobile: "", email: "", address: "", city: "", state: "", country: "", pincode: "", password: "" })


  const OnChangeTxt = (value, type) => {
    console.log(typeof value)
    if (value == "") {
      alert("Please select")
    }

    else {
      setInputValue((prev) => { return { ...prev, name: value, mobile: "" } })
    }
    // console.log(type, "raju")

  }


  const CreateAccountSubmit = () => {
    if (userTypeValue.value == "") {
      Alert.alert("Info", "Please select user type.")
      return
    }
    if ((inputValue.name == "") && (inputValue.mobile == "") && (inputValue.email == "") && (inputValue.address == "") && (inputValue.city == "") && (inputValue.state == "") && (inputValue.country == "") && (inputValue.pincode == "") && (inputValue.password == "")) {
      Alert.alert("Info", "All fields are required")
      // return
    }

    else {
      Alert.alert("Info", "Create Account Successfully")
      navigation.goBack()
    }
  }

  const UserTypeValue = (type) => {
    if (type == "Student" || type == "Parents" || type == "Teacher" || type == "School") {
      setUserTypeValue((prev) => { return { ...prev, value: type, status: true } })
    }
  }




  return (
    <>
      <ScrollView style={styles.contaner}>
        <View style={styles.typeBox}>
          <View style={styles.username}>
            <Text style={styles.loginType}>User As*</Text>
          </View>



          <View style={styles.userAs}>
            {userData?.map((item, index) => {
              let width = item.userType == userTypeValue.value ? 10 : 20
              let height = item.userType == userTypeValue.value ? 10 : 20
              let borderRadius = item.userType == userTypeValue.value ? 5 : 0
              let backgroundColor = item.userType == userTypeValue.value ? rsplTheme.rsplBgColor : "transparent"
              return (
                <TouchableOpacity key={item.id} onPress={(() => { UserTypeValue(item.userType) })} style={styles.userType}>
                  <View style={styles.radioBtn}><View style={{ borderRadius, width, height, backgroundColor }}></View></View>
                  <Text style={styles.loginType}>{item.userType}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

        </View>

        {userInput?.map((item, index) => {
          return (
            <View key={item.id} style={styles.typeBox}>
              <View style={styles.username}>
                <Text style={styles.loginType}>{item.inputType}</Text>
              </View>
              <TextInput onChangeText={inputTxt => OnChangeTxt(inputTxt, item.inputType)} style={styles.txtInput} placeholder='Enter username' />
            </View>

          )
        })}

      </ScrollView>
      <TouchableOpacity onPress={(() => { CreateAccountSubmit() })} style={styles.submitBox}>
        <Text style={styles.submitTxt}>Create Account</Text>
      </TouchableOpacity>
    </>
  )
}

export default SignUp

const styles = StyleSheet.create({
  contaner: {
    flex: 1,
    margin: 15,
    // marginBottom:50,
  },

  typeBox: {
    marginTop: 10,
    marginBottom: 15,
  },

  username: {
    flexDirection: "row",
    alignItems: "center",
  },

  loginType: {
    color: rsplTheme.jetGrey,
    fontWeight: "500",
    fontSize: 16,
  },
  txtInput: {
    backgroundColor: rsplTheme.rsplWhite,
    padding: 10,
    top: 10,
    height: 45,
    borderRadius: 12,
    color: rsplTheme.jetGrey,
    borderWidth: .5,
    borderColor: rsplTheme.jetGrey
  },
  submitBox: {
    // position:"absolute",
    // bottom:0,
    marginTop: 30,
    backgroundColor: rsplTheme.rsplBgColor,
    padding: 12,
    width: "50%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    alignSelf: "center",
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitTxt: {
    color: rsplTheme.rsplWhite,
    fontWeight: "500",
    fontSize: 18,
  },
  radioBtn: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    borderWidth: 1,
    borderColor: rsplTheme.jetGrey,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  userAs: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor:"blue"
  },
  userType: {
    // width:"25%",
    flexDirection: "row",
    alignItems: "center",
  },
})