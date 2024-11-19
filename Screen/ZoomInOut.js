import React, { useRef } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import {
  PinchGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get("window")

const ZoomInOut = () => {


  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
  });

  const doubleTapHandler = useAnimatedGestureHandler({
    onActive: () => {
      scale.value = scale.value > 1 ? withSpring(1) : withSpring(2);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: focalX.value },
        { translateY: focalY.value },
      ],
    };
  });


  return (
    <View style={styles.container}>
      <TapGestureHandler
        onHandlerStateChange={doubleTapHandler}
        numberOfTaps={2}
      >
        <Animated.View>
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.Image
              style={[styles.image, animatedStyle]}
              source={{ uri: 'https://cdn.pixabay.com/photo/2023/11/09/19/36/zoo-8378189_1280.jpg' }}
            />
          </PinchGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
  )
}

export default ZoomInOut

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
})