import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";


const PaymentSuccessScreen = ({ route }) => {
  const circleAnim1 = useRef(new Animated.Value(0)).current;
  const circleAnim2 = useRef(new Animated.Value(0)).current;
  const circleAnim3 = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation()

  const txnStatus = route.params?.txnStatus
  const tXNAMOUNT = route.params?.txnAmount

  useEffect(() => {
    // Sequential Animation for Circles
    Animated.loop(
      Animated.stagger(400, [
        createCircleAnimation(circleAnim1),
        createCircleAnimation(circleAnim2),
        createCircleAnimation(circleAnim3),
      ]),
      { iterations: -1 }
    ).start();

    setTimeout(() => {
      navigation.goBack()
    }, 6000)

  }, []);

  const createCircleAnimation = (animValue) => {
    return Animated.timing(animValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Expanding Circles */}
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [
                { scale: circleAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 2] }) },
              ],
              opacity: circleAnim1.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [
                { scale: circleAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 2] }) },
              ],
              opacity: circleAnim2.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [
                { scale: circleAnim3.interpolate({ inputRange: [0, 1], outputRange: [0, 2] }) },
              ],
              opacity: circleAnim3.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
            },
          ]}
        />
        {/* Center Tick Icon */}
        <View style={styles.tickContainer}>
          <Text style={styles.tickText}>✔</Text>
        </View>
      </View>

      {/* Success Text */}
      <Text style={styles.successTitle}>{txnStatus}</Text>
      <Text style={styles.amountPaid}> ₹ {tXNAMOUNT}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  circleContainer: {
    position: "relative",
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#28a745",
  },
  tickContainer: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
  },
  tickText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28a745",
    marginTop: 20,

  },
  transactionDetails: {
    marginTop: 10,
    fontSize: 16,
    color: "#666666",
  },
  amountPaid: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
  },
  paidVia: {
    marginTop: 5,
    fontSize: 16,
    color: "#007bff",
  },
});

export default PaymentSuccessScreen;





// return
// import React, { useEffect, useRef } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
// import { rsplTheme } from "../constant";

// const PaymentSuccessScreen = ({ navigation }) => {
//   const scaleAnim = useRef(new Animated.Value(0)).current;
//   const circleAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Circle Animation
//     Animated.timing(circleAnim, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: false,
//     }).start(() => {
//       // Tick Animation after Circle
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 3,
//         useNativeDriver: true,
//       }).start();
//     });
//   }, []);

//   const handleContinue = () => {
//     navigation.navigate("Home");
//   };

//   return (
//     <View style={styles.container}>

//       <View style={styles.circleContainer}>
//         <Animated.View
//           style={[
//             styles.circle,
//             {
//               borderColor: "#28a745",
//               borderWidth: circleAnim.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: [0, 5], // Circle grows over time
//               }),
//             },
//           ]}
//         />

//         <Animated.View
//           style={[
//             styles.tick,
//             {
//               transform: [{ scale: scaleAnim }],
//             },
//           ]}
//         >
//           <FontAwesome5 name={"check"} size={30} color={rsplTheme.rsplGreen} />
//         </Animated.View>
//       </View>

//       {/* Success Message */}
//       <Text style={styles.successText}>Payment Successful!</Text>
//       <Text style={styles.subText}>Your payment has been processed successfully.</Text>

//       {/* Continue Button */}
//       <TouchableOpacity style={styles.button} onPress={handleContinue}>
//         <Text style={styles.buttonText}>Continue</Text>
//       </TouchableOpacity>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//   },
//   circleContainer: {
//     position: "relative",
//     width: 100,
//     height: 100,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   circle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     position: "absolute",
//   },
//   tick: {
//     position: "absolute",
//     width: 50,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   tickLine1: {
//     width: 20,
//     height: 5,
//     backgroundColor: "#28a745",
//     position: "absolute",
//     top: 20,
//     left: 10,
//     transform: [{ rotate: "45deg" }],
//   },
//   tickLine2: {
//     width: 30,
//     height: 5,
//     backgroundColor: "#28a745",
//     position: "absolute",
//     top: 15,
//     right: 0,
//     transform: [{ rotate: "-45deg" }],
//   },
//   successText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#28a745",
//     marginTop: 20,
//   },
//   subText: {
//     fontSize: 16,
//     color: "#6c757d",
//     textAlign: "center",
//     marginVertical: 10,
//     paddingHorizontal: 20,
//   },
//   button: {
//     backgroundColor: "#28a745",
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 5,
//     marginTop: 20,
//   },
//   buttonText: {
//     color: "#ffffff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default PaymentSuccessScreen;
