import { StyleSheet, Alert, Text, View, SafeAreaView, TouchableOpacity, } from 'react-native'
import React, { useCallback, useContext, useEffect } from 'react';
import { rsplTheme } from '../constant';
import Login from './Login';
import Dashboard from './Dashboard';
import PrivacyPolicy from './PrivacyPolicy';
import AboutUs from './AboutUs';
import ProductDetail from './ProductDetail';
import SignUp from './SignUp';
import OtpVerify from './OtpVerify';


import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from './Main';
import NewReleaseBooks from './NewReleaseBooks';
import CreateAccount from './CreateAccount';
import OtpVerifyForCreateAcc from './OtpVerifyForCreateAcc';
import ForgotPassword from './ForgotPassword';
import ForgotVerifyOtp from './ForgotVerifyOtp';
import CreateNewPassword from './CreateNewPassword';
import HomeScreen from './HomeScreen';
import EbookList from './EbookList';
import InteractiveEbookList from './InteractiveEbookList';
import { MyContext } from '../Store';
import User from './User';
import Cart from './Cart';
import CartItemDetails from './CartItemDetails';
import OrderSummery from './OrderSummery';
import AddNewAddress from './AddNewAddress';
import BuyNow from './BuyNow';
import CCAvenuePayment from './CCAvenuePayment';
import ViewOrderList from './ViewOrderList';
import OrderListDetail from './OrderListDetail';
import PdfViewer from './PdfViewer';
import PdfViewerPasswordProtected from './PdfViewerPasswordProtected';
import InvoiceViewer from './InvoiceViewer';
import NewReleases from './NewReleases';
import YourAccount from './YourAccount';
import CloseAccount from './CloseAccount';
import PaymentSuccessScreen from './PaymentSuccessScreen';
import AllTitleView from './AllTitleView';
import Bookseller from './Bookseller';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userData, logout } = useContext(MyContext)
  //HomeScreen
  return (
    <SafeAreaView style={{ flex: 1, }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Home" component={userData.isLogin == true ? Main : Login} />
          {/* <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard', headerShown: true }} /> */}
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={({ route }) => ({ title: `${route.params?.name}`, headerStyle: { backgroundColor: rsplTheme.rsplLightGrey }, headerTintColor: rsplTheme.jetGrey, })} />
          <Stack.Screen name="AboutUs" component={AboutUs} options={({ route }) => ({ title: `${route.params?.name}`, headerTintColor: rsplTheme.jetGrey, })} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} options={({ route }) => ({ title: `${route.params?.name}`, headerTintColor: rsplTheme.jetGrey, headerShown: false, headerBackTitleVisible: false, })} />
          <Stack.Screen name="SignUp" component={SignUp} options={({ route }) => ({ title: `${route.params?.name}`, headerTintColor: rsplTheme.jetGrey, })} />
          <Stack.Screen name="OtpVerify" component={OtpVerify} options={({ route }) => ({ title: `${route.params?.name}`, headerTintColor: rsplTheme.jetGrey, })} />
          <Stack.Screen name="Main" component={Main} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.jetGrey, })} />
          <Stack.Screen name="NewReleaseBooks" component={NewReleaseBooks} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="OtpVerifyForCreateAcc" component={OtpVerifyForCreateAcc} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="ForgotVerifyOtp" component={ForgotVerifyOtp} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="EbookList" component={EbookList} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="InteractiveEbookList" component={InteractiveEbookList} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="CartItemDetails" component={CartItemDetails} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="OrderSummery" component={OrderSummery} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="AddNewAddress" component={AddNewAddress} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="BuyNow" component={BuyNow} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="ViewOrderList" component={ViewOrderList} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="OrderListDetail" component={OrderListDetail} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="PdfViewer" component={PdfViewer} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="PdfViewerPasswordProtected" component={PdfViewerPasswordProtected} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="InvoiceViewer" component={InvoiceViewer} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="NewReleases" component={NewReleases} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="YourAccount" component={YourAccount} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="CloseAccount" component={CloseAccount} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="AllTitleView" component={AllTitleView} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="Bookseller" component={Bookseller} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          {/* <Stack.Screen name="User" component={User} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} />
          <Stack.Screen name="Cart" component={Cart} options={({ route }) => ({ title: `${route.params?.name}`, headerShown: false, headerTintColor: rsplTheme.rsplWhite, headerBackTitleVisible: false, headerStyle: { backgroundColor: rsplTheme.gradientColorRight } })} /> */}
        </Stack.Navigator>
        {/* <DrawerNavigation/> */}
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default AppNavigator

const styles = StyleSheet.create({

})


