import { ActivityIndicator, Alert, Button, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import Header from '../comman/Header'
import { useNavigation } from '@react-navigation/native'
import { apiRoutes, rsplTheme, token } from '../constant'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Services from '../services'
import { MyContext } from '../Store'


const CloseAccount = ({ route }) => {
  const navigation = useNavigation()
  const [radioBtnActive, setRadioBtnActive] = useState(false)
  const [loader, setLoader] = useState(false)
  const { userData, logout, setSelectedTab } = useContext(MyContext)

  const ClosePermanentAccount = async () => {
    setLoader(true)
    const payLoad = {
      "api_token": token,
      "userRefID": userData.data[0]?.id//3364733//userData.data[0]?.id
    }
    await Services.post(apiRoutes.closeAccountPermanently, payLoad)
      .then((res) => {
        if (res.status == "success") {
          Alert.alert(res.message)
          logout()
          setSelectedTab(4)
          navigation.navigate("Main")
        } else if (res.status == "error") {
          Alert.alert(res.message)
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setLoader(false) })

  }

  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={route.params?.data}
        onClickLeftIcon={() => { navigation.goBack() }}
        onClickRightIcon={() => { return }}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, padding: 5 }}>
        <Text style={styles.txtHeading}>Close Your Rachna Sagar Account</Text>
        <View style={styles.conditionContainer}>
          <View style={styles.messageBox}>
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>Please read this carefully</Text>
            <Text style={{ textAlign: "justify" }}>You are going to submit a request for us to permanently close your account and delete your data. Once your account is deleted all of the products and services will no longer with us. </Text>

            <Text style={{ fontWeight: "600", marginVertical: 6 }}>Backup Important Data</Text>
            <Text style={{ textAlign: "justify" }}>Ensure you’ve downloaded or saved any necessary information, such as order history, invoices, and personal details. Once your account is deleted, this information will be permanently removed and cannot be recovered. </Text>

            <Text style={{ fontWeight: "600", marginVertical: 6 }}>Steps to Delete Your Account</Text>
            <Text style={{ textAlign: "justify" }}>Log In to Your Account: Sign in to Rachna Sagar Digitext App using your username and password.
              Navigate to Account Settings:
              Go to your account and manage your data then select close your account option. {"\n"}
              New screen will open and check confirmation message and click on close my account button.</Text>

            <Text style={{ fontWeight: "600", marginVertical: 6 }}>Completion of Deletion</Text>
            <Text style={{ textAlign: "justify" }}>Your account deletion request will be processed. Please note that it may take some time for the deletion to be completed. </Text>

            <Text style={{ fontWeight: "600", marginVertical: 6 }}>Important Notes</Text>
            <Text style={{ textAlign: "justify" }}>Account Deletion is Permanent: Once your account is deleted, it cannot be recovered. All associated data, including order history, cart history and saved preferences, will be permanently removed.</Text>

            <Text style={{ fontWeight: "600", marginVertical: 6 }}>Data Retention</Text>
            <Text style={{ textAlign: "justify" }}>While we strive to remove all personal data, certain information may be retained for legal or regulatory purposes as outlined in our Privacy Policy.</Text>
          </View>

          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 8 }} onPress={(() => setRadioBtnActive(!radioBtnActive))}>
            <View style={{ width: 20, height: 20, borderRadius: 2, borderWidth: .5, marginRight: 10, justifyContent: "center", alignItems: "center" }}>
              <AntDesign name={radioBtnActive ? "checksquare" : null} color={radioBtnActive ? "green" : null} size={18} />
              {/* <View style={{ width: 10, height: 10, borderRadius: 10 / 2, backgroundColor: radioBtnActive ? "green" : "red" }}></View> */}
            </View>
            <Text style={{ flex: 1, color: radioBtnActive ? rsplTheme.rsplBackgroundColor : null }}>Yes, I want to permanently close my Rachna Sagar Account and delete my data.</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={(() => { ClosePermanentAccount() })} disabled={!radioBtnActive} style={{ marginVertical: 12, width: 170, borderWidth: .5, borderRadius: 6, alignSelf: "center", padding: 10, opacity: !radioBtnActive ? .5 : 5, backgroundColor: radioBtnActive ? rsplTheme.rsplWhite : null }}>
            {loader ?
              <ActivityIndicator color={rsplTheme.jetGrey} /> :
              <Text style={{ fontWeight: "600", textAlign: "center", fontSize: 16, color: rsplTheme.jetGrey }}>Close My Account</Text>
            }
          </TouchableOpacity>

          <View style={{ marginVertical: 8, }}>
            <Text style={{ color: rsplTheme.jetGrey, textAlign: "justify" }}>Support: If you combat any issues or have questions, please contact our customer support team at <Text style={{ color: rsplTheme.rsplBackgroundColor, fontWeight: "600" }} >info@rechnasagar.in</Text> for assistance.
              Thank you for being a part of Rachna Sagar. If you have any feedback or need further assistance, we’re here to help.</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default CloseAccount

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  txtHeading: {
    fontSize: 20,
    fontWeight: "500"
  },
  conditionContainer: {
    marginTop: 20,
  },
  messageBox: {
    borderWidth: .5,
    borderColor: rsplTheme.jetGrey,
    backgroundColor: rsplTheme.rsplWhite,
    borderRadius: 6,
    padding: 8,
    marginVertical: 8
  }
})