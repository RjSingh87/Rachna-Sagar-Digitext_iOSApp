import { StyleSheet, Alert, Text, View, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native'
import React, { useEffect } from 'react';
import Orientation from 'react-native-orientation'
import * as ScreenOrientation from "expo-screen-orientation";
import Dashboard from './Screen/Dashboard';
import Login from './Screen/Login';
import PrivacyPolicy from './Screen/PrivacyPolicy';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AboutUs from './Screen/AboutUs';
import { rsplTheme } from './constant';
import ProductDetail from './Screen/ProductDetail';
import AppNavigator from './Screen/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import LinearGradient from 'react-native-linear-gradient';
import Store from './Store';
import AppMain from './Screen/AppMain';




const Stack = createNativeStackNavigator();



const App = () => {
  // const rotate = () => {
  //   console.log(Orientation.lockToLandscape())
  //   Orientation.lockToPortrait();
  //   // Alert.alert("Rotate")
  // }

  // const initial = Orientation.getInitialOrientation();

  // useEffect(() => {
  //   if (initial === 'PORTRAIT') {
  //     console.log(initial, "DATa")
  //     Orientation.lockToLandscape();
  //   } else {
  //     Orientation.lockToPortrait();
  //   }

  // }, [])

  useEffect(()=>{
    setTimeout(() => {
      SplashScreen.hide()
    }, 2000);

  },[])





  return (
    <Store>
    <LinearGradient angleCenter={{x: 0, y: 0.3}} useAngle={true} angle={-20} start={{ x: 0, y: 0 }} end={{ x: 1, y: 2.2 }} colors={["white", rsplTheme.gradientColorRight, rsplTheme.gradientColorLeft]} style={{ flex: 1, }}>
      <StatusBar barStyle={"light-content"} />
      <AppNavigator />
      {/* <AppMain/> */}
    </LinearGradient>
    </Store>


    // <SafeAreaView style={{ flex: 1, }}>
    //   <Login />
    //   {/* <Dashboard /> */}
    //   {/* <TouchableOpacity onPress={(() => { rotate() })}>
    //     <Text style={{ fontSize: 40 }}>App rotate</Text>
    //   </TouchableOpacity> */}
    // </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({})