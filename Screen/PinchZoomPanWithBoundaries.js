import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import Header from '../comman/Header'

const PinchZoomPanWithBoundaries = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"zoom image"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />
      <View style={{ flexShrink: 1, height: "100%", width: "100%", borderWidth: 1, alignSelf: "center" }}>
        <ReactNativeZoomableView
          doubleTapZoomToCenter={true}
          maxZoom={1.5}
          minZoom={0.5}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={true}
          onZoomAfter={this.logOutZoomState}
          style={{
            padding: 10,
            backgroundColor: 'red',
          }}
        >
          <Image
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            source={{ uri: 'https://plus.unsplash.com/premium_photo-1661603403807-aa68bfcc983a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          />
        </ReactNativeZoomableView>
      </View>
    </View>
  )
}

export default PinchZoomPanWithBoundaries

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 20,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
})








// import { StyleSheet, Text, View, Animated } from 'react-native'
// import React, { useRef } from 'react'
// import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler'
// import Header from '../comman/Header'




// const PinchZoomPanWithBoundaries = ({ navigation }) => {

//   const scale = useRef(new Animated.Value(1)).current
//   const handleGesture = Animated.event([{ nativeEvent: { scale: scale } }])
//   const translateX = useRef(new Animated.Value(0)).current

//   const handlePan = Animated.event([
//     {
//       nativeEvent: {
//         translationX: translateX
//       }
//     }
//   ],
//     {
//       listener: (e) => console.log(e.nativeEvent, "raju"),
//       useNativeDriver: true
//     }
//   )
//   // Together with chemistry, physics, biology, physical education english sampe paper book class 12

//   return (
//     <View style={{ flex: 1, }}>
//       <Header
//         leftIcon={require("../assets/icons/backArrow.png")}
//         // rightIcon={require('../assets/icons/shopping-cart.png')}
//         title={"zoom image"}
//         onClickLeftIcon={() => { navigation.goBack(); }}
//         onClickRightIcon={() => { return }}
//       />
//       <GestureHandlerRootView>
//         <PanGestureHandler onGestureEvent={handlePan}>
//           <Animated.View>
//             <PinchGestureHandler onGestureEvent={handleGesture}>
//               <Animated.Image style={[styles.image, { transform: [{ scale: scale }, { translateX: translateX }] }]}
//                 source={{ uri: "https://plus.unsplash.com/premium_photo-1661603403807-aa68bfcc983a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
//               />
//             </PinchGestureHandler>
//           </Animated.View>
//         </PanGestureHandler>
//       </GestureHandlerRootView>
//     </View>
//   )
// }

// export default PinchZoomPanWithBoundaries

// const styles = StyleSheet.create({
//   image: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "contain",
//   }
// })





// import React from 'react';
// import { StyleSheet, View, Dimensions } from 'react-native';
// import {
//   GestureHandlerRootView,
//   Gesture,
//   GestureDetector,
// } from 'react-native-gesture-handler';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
//   runOnUI,
// } from 'react-native-reanimated';

// const PinchZoomPanWithBoundaries = () => {
//   const scale = useSharedValue(1);
//   const focalX = useSharedValue(0); // Zoom focal point X
//   const focalY = useSharedValue(0); // Zoom focal point Y
//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);

//   const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
//   const IMAGE_WIDTH = SCREEN_WIDTH;
//   const IMAGE_HEIGHT = SCREEN_HEIGHT;

//   const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

//   // Pinch Gesture for Zoom
//   const pinchGesture = Gesture.Pinch()
//     .onUpdate((event) => {
//       const newScale = Math.max(1, event.scale);
//       scale.value = newScale;

//       // Dynamically adjust focal points during zoom
//       focalX.value = event.focalX;
//       focalY.value = event.focalY;
//     });

//   // Pan Gesture for Dragging
//   const panGesture = Gesture.Pan()
//     .onUpdate((event) => {
//       const scaledWidth = IMAGE_WIDTH * scale.value;
//       const scaledHeight = IMAGE_HEIGHT * scale.value;

//       const horizontalBound = (scaledWidth - SCREEN_WIDTH) / 2;
//       const verticalBound = (scaledHeight - SCREEN_HEIGHT) / 2;

//       // Apply boundaries for dragging
//       translateX.value = clamp(event.translationX, -horizontalBound, horizontalBound);
//       translateY.value = clamp(event.translationY, -verticalBound, verticalBound);
//     });

//   // Double Tap Gesture for Reset
//   const doubleTapGesture = Gesture.Tap()
//     .numberOfTaps(2)
//     .onEnd(() => {
//       runOnUI(() => resetZoom())();
//     });

//   // Reset Zoom Function
//   const resetZoom = () => {
//     scale.value = withTiming(1);
//     translateX.value = withTiming(0);
//     translateY.value = withTiming(0);
//   };

//   // Combine gestures
//   const combinedGesture = Gesture.Simultaneous(
//     doubleTapGesture,
//     Gesture.Race(panGesture, pinchGesture)
//   );

//   // Animated Styles
//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateX: translateX.value },
//       { translateY: translateY.value },
//       { scale: scale.value },
//     ],
//   }));

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <GestureDetector gesture={combinedGesture}>
//         <Animated.View style={styles.imageContainer}>
//           <Animated.Image
//             source={{
//               uri: 'https://plus.unsplash.com/premium_photo-1661603403807-aa68bfcc983a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//             }}
//             style={[styles.image, animatedStyle]}
//             resizeMode="contain"
//           />
//         </Animated.View>
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageContainer: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: 375,
//     height: 786,
//   },
// });

// export default PinchZoomPanWithBoundaries;










// import React from 'react';
// import { StyleSheet, View, Dimensions } from 'react-native';
// import {
//   GestureHandlerRootView,
//   Gesture,
//   GestureDetector,
// } from 'react-native-gesture-handler';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
//   runOnJS,
// } from 'react-native-reanimated';

// const PinchZoomPanWithBoundaries = () => {
//   const scale = useSharedValue(1);
//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);

//   const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

//   // Pinch Gesture
//   const pinchGesture = Gesture.Pinch()
//     .onUpdate((event) => {
//       scale.value = Math.max(1, event.scale);
//     });

//   // Pan Gesture
//   const panGesture = Gesture.Pan()
//     .onUpdate((event) => {
//       translateX.value = event.translationX;
//       translateY.value = event.translationY;
//     });

//   // Double Tap Gesture
//   const doubleTapGesture = Gesture.Tap()
//     .numberOfTaps(2)
//     .onEnd(() => {
//       runOnJS(resetZoom)();
//     });

//   // Reset Zoom Function
//   const resetZoom = () => {
//     scale.value = withTiming(1);
//     translateX.value = withTiming(0);
//     translateY.value = withTiming(0);
//   };

//   // Combine gestures
//   const combinedGesture = Gesture.Simultaneous(
//     doubleTapGesture,
//     Gesture.Race(panGesture, pinchGesture)
//   );

//   // Animated Styles
//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateX: translateX.value },
//       { translateY: translateY.value },
//       { scale: scale.value },
//     ],
//   }));

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <GestureDetector gesture={combinedGesture}>
//         <Animated.View style={styles.imageContainer}>
//           <Animated.Image
//             source={{
//               uri: 'https://plus.unsplash.com/premium_photo-1661603403807-aa68bfcc983a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//             }}
//             style={[styles.image, animatedStyle]}
//             resizeMode="contain"
//           />
//         </Animated.View>
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageContainer: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: 300,
//     height: 850,
//   },
// });

// export default PinchZoomPanWithBoundaries;
