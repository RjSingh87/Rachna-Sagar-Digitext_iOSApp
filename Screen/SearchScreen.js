import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['Arijit Singh', 'Coldplay', 'Taylor Swift']);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;

  const fetchSearchResults = async (searchTerm) => {
    try {
      // Replace with your API logic
      const mockResults = [
        { id: '1', name: `${searchTerm} Song 1` },
        { id: '2', name: `${searchTerm} Song 2` },
      ];
      setResults(mockResults);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
    if (text.length > 2) {
      fetchSearchResults(text);
    } else {
      setResults([]);
    }
  };

  const addToRecentSearches = (searchTerm) => {
    setRecentSearches((prev) => [...new Set([searchTerm, ...prev])]);
  };


  const animatedStyle = {
    transform: [
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 10],
        }),
      },
    ],
    opacity: animationValue,
  };


  const flatListRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setQuery('');
    setResults([]);
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };




  return (
    <View style={styles.container}>


      <Animated.View style={[styles.searchBar,
        animatedStyle
      ]}>
        <Icon name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search for songs, artists, albums..."
          value={query}
          onChangeText={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isLoading && <ActivityIndicator size="small" color="#000" />}

        <TouchableOpacity onPress={(() => { navigation.goBack() })}>

          <Text>Cancel</Text>
        </TouchableOpacity>


      </Animated.View>









      {/* <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search for songs, artists, albums..."
          value={query}
          onChangeText={handleSearch}
        />
      </View> */}

      {query.length === 0 ? (
        <View style={styles.recentSearches}>
          <Text style={styles.heading}>Recent Searches</Text>
          {recentSearches.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSearch(item)}
              style={styles.recentItem}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                addToRecentSearches(item.name);
                setQuery('');
                setResults([]);
              }}
              style={styles.resultItem}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    // borderWidth: 1,
  },
  recentSearches: {
    margin: 10,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default SearchScreen;
