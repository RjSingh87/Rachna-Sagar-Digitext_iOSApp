import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS } from 'react-native-reanimated';

const BreakingNews = () => {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'RACHNA SAGAR PVT. LTD.';
  const cursorOpacity = useSharedValue(1);

  const startTyping = () => {
    let currentIndex = 0;
    setDisplayedText(''); // Reset displayed text

    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + fullText[currentIndex]); // Add next letter
      currentIndex++;

      if (currentIndex === fullText.length) {
        clearInterval(typingInterval); // Stop typing when done
        setTimeout(() => runOnJS(startTyping)(), 2000); // Restart after 2 seconds delay
      }
    }, 150); // Typing speed
  };

  useEffect(() => {
    startTyping();
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    cursorOpacity.value = withTiming(0, { duration: 500 }, () => {
      cursorOpacity.value = withTiming(1, { duration: 500 });
    });
  }, [cursorOpacity]);

  const animatedCursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {displayedText}
        <Animated.Text style={[styles.cursor, animatedCursorStyle]}>|</Animated.Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#000',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  cursor: {
    color: '#fff',
    fontSize: 24,
  },
});

export default BreakingNews;
