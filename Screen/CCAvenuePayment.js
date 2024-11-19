import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../comman/Header';

const CCAvenuePayment = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  const CCAvenueURL = 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
  const MerchantID = '902014';
  const AccessCode = 'AVNK79JD29CA31KNAC';
  const Amount = '100.00'; // The amount you want to charge
  const Currency = 'INR';
  const OrderID = 'Order0001'; // Your unique order ID

  const paymentForm = `
    <html>
      <head></head>
      <body onload="document.forms[0].submit()">
        <form action="${CCAvenueURL}" method="POST">
          <input type="hidden" name="merchant_id" value="${MerchantID}" />
          <input type="hidden" name="access_code" value="${AccessCode}" />
          <input type="hidden" name="order_id" value="${OrderID}" />
          <input type="hidden" name="currency" value="${Currency}" />
          <input type="hidden" name="amount" value="${Amount}" />
          <!-- Add more hidden fields as required by CCAvenue -->
        </form>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>

      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Payment"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />


      {loading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          size="large"
          color="#0000ff"
        />
      )}
      <WebView
        originWhitelist={['*']}
        source={{ html: paymentForm }}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(navState) => {
          // Handle navigation state changes (e.g., successful payment, failure, etc.)
          if (navState.url.includes('success_url')) {
            // Handle successful payment
            navigation.navigate('SuccessScreen');
          } else if (navState.url.includes('failure_url')) {
            // Handle failed payment
            navigation.navigate('FailureScreen');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CCAvenuePayment;