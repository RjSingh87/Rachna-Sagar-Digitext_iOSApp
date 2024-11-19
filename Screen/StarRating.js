import React from 'react';
import { View, Text } from 'react-native';
import { rsplTheme } from '../constant';

const StarRating = ({ rating }) => {
  // Function to render stars based on the rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      // Check if the current star should be filled or outlined based on the rating
      const filled = i <= rating;
      stars.push(
        <Text key={i} style={{ color: filled ? rsplTheme.ratingStarColor : rsplTheme.textColorLight, fontSize: 20, }}>{filled ? '★' : '☆'}</Text>
      );
    }
    return stars;
  };

  return <View style={{ flexDirection: 'row', marginVertical: 3, }}>{renderStars()}</View>;
};

export default StarRating;