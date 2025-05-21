import { StyleSheet, Text, View, Image, ScrollView, Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../comman/Header'
import { rsplTheme } from '../constant'
import Feather from "react-native-vector-icons/Feather"
import Ionicons from "react-native-vector-icons/Ionicons"
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'


const ContactUs = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: rsplTheme.lightGrey }}>

        <View style={styles.container}>
          <Header
            leftIcon={require("../assets/icons/backArrow.png")}
            // rightIcon={require('../assets/icons/shopping-cart.png')}
            title={"Contact Us"}
            onClickLeftIcon={() => { navigation.goBack(); }}
            onClickRightIcon={() => { return }}
          />

          <ScrollView>
            <View style={{ flex: 1, }}>

              <View style={{ marginTop: 30, alignSelf: "center", width: 150, height: 150, borderRadius: 150 / 2, borderWidth: 5, alignItems: "center", justifyContent: "center", overflow: "hidden", borderColor: rsplTheme.rsplWhite }}>
                <Image style={{ width: 160, height: 160, resizeMode: "cover" }} source={require("../assets/icons/Callcenter.gif")} />
              </View>


              <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10, marginTop: 20 }}>
                <View style={{ width: 70, alignItems: "center" }}>
                  <Feather name="phone-call" size={25} color={rsplTheme.rsplLightPink} />
                </View>
                <View style={{ flex: 1, }}>

                  <TouchableOpacity
                    onPress={async () => {
                      const phone = '+911143585858';
                      const url = `tel:${phone}`;
                      const supported = await Linking.canOpenURL(url);
                      if (supported) {
                        Linking.openURL(url);
                      } else {
                        console.log("Calling not supported on this device.");
                      }
                    }}
                  >
                    <Text style={{ fontSize: 16, color: rsplTheme.jetGrey, paddingVertical: 4 }}>
                      +91-11-43585858
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={async () => {
                      const phone = '+911123285568';
                      const url = `tel:${phone}`;
                      const supported = await Linking.canOpenURL(url);
                      if (supported) {
                        Linking.openURL(url);
                      } else {
                        console.log("Calling not supported on this device.");
                      }
                    }}
                  >
                    <Text style={{ fontSize: 16, color: rsplTheme.jetGrey, paddingVertical: 4 }}>
                      +91-11-23285568
                    </Text>
                  </TouchableOpacity>
                  {/* <Text selectable style={{ fontSize: 16, color: rsplTheme.jetGrey }}>+91-11-43585858, 23285568</Text> */}
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10 }}>
                <View style={{ width: 70, alignItems: "center" }}>
                  <Feather name="mail" size={25} color={rsplTheme.rsplLightPink} />
                </View>
                <View style={{ flex: 1, }}>
                  <TouchableOpacity
                    onPress={async () => {
                      const email = 'info@rachnasagar.in';
                      const url = `mailto:${email}`;
                      const supported = await Linking.canOpenURL(url);
                      if (supported) {
                        Linking.openURL(url);
                      } else {
                        console.log("No email app found.");
                      }
                    }}
                  >
                    <Text selectable style={{ fontSize: 16, color: rsplTheme.jetGrey }}>
                      info@rachnasagar.in
                    </Text>
                  </TouchableOpacity>
                  {/* <Text selectable style={{ fontSize: 16, color: rsplTheme.jetGrey }}>info@rachnasagar.in </Text> */}
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10 }}>
                <View style={{ width: 70, alignItems: "center" }}>
                  <Ionicons name="location-outline" size={25} color={rsplTheme.rsplLightPink} />
                </View>
                <View style={{ flex: 1, }}>
                  <Text selectable style={{ fontSize: 16, color: rsplTheme.jetGrey }}>4583/15, Daryaganj, New Delhi – 110002, INDIA  </Text>
                </View>
              </View>

            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default ContactUs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rsplTheme.lightGrey
  }
})