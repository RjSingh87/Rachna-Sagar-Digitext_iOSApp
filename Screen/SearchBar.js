import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable, TextInput, StatusBar } from 'react-native';

const SearchBar = () => {

  const [searchMode, setSearchMode] = useState(false)

  const [searchText, setSearchText] = useState('');

  const [users, setUsers] = useState([
    { id: '1', name: 'Ali Khan', username: 'alikhan', gender: 'Male' },
    { id: '2', name: 'Fatima Ahmed', username: 'fatimaahm', gender: 'Female' },
    { id: '3', name: 'Ahmed Hassan', username: 'ahmedhassan', gender: 'Male' },
    { id: '4', name: 'Ayesha Malik', username: 'ayeshamalik', gender: 'Female' },
    { id: '5', name: 'Usman Qureshi', username: 'usman123', gender: 'Male' },
    { id: '6', name: 'Sana Khan', username: 'sanakhan', gender: 'Female' },
    { id: '7', name: 'Bilal Ali', username: 'bilalali', gender: 'Male' },
    { id: '8', name: 'Hina Aslam', username: 'hina99', gender: 'Female' }
  ]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <Text style={[styles.itemText, { width: '40%' }]}>{item.name}</Text>
        <Text style={[styles.itemText, { width: '40%' }]}>{item.username}</Text>
        <Text style={[styles.itemText, { width: '40%' }]}>{item.gender}</Text>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar hidden={true} /> */}
      <View style={styles.bar}>
        {searchMode ? (
          <TextInput placeholder='Search' placeholderTextColor='#fff' style={styles.input} value={searchText} onChangeText={val => setSearchText(val)} />
        ) : (<Text style={styles.barHeading}>Users</Text>)}

        <Pressable onPress={() => setSearchMode(!searchMode)}>
          <Image style={styles.icon} source={require('../assets/icons/loupe.png')} />
        </Pressable>
      </View>
      <View style={styles.header}>
        <Text style={[styles.headerText, { width: '40%' }]}>Name</Text>
        <Text style={[styles.headerText, { width: '40%' }]}>Username</Text>
        <Text style={[styles.headerText, { width: '20%' }]}>Gender</Text>
      </View>
      <FlatList showsVerticalScrollIndicator={false}
        data={users.filter((user) => {
          for (let key in user) {
            if (key !== "id" && typeof (key) === "string") {
              if (user[key].toLowerCase().includes(searchText.toLowerCase())) {
                return true;
              }
            }
          }
          return false;
        })}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 50
  },
  bar: {
    backgroundColor: '#0AB6AB',
    width: '100%',
    height: 60,
    marginBottom: 30,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  barHeading: {
    fontFamily: 'Poppins SemiBold',
    color: '#fff',
    fontSize: 17,
    borderColor: '#fff',
    borderBottomWidth: 1,
  },
  icon: {
    width: 25,
    height: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fcfcfc',
    paddingVertical: 15,
    borderRadius: 5,
    paddingHorizontal: 5,
  },

  headerText: {
    //flex: 1,
    fontFamily: 'Poppins SemiBold',
    fontSize: 14,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#A7E8DF',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Poppins Regular',
    marginBottom: 5,
    paddingRight: 10,
  },
  input: {
    borderColor: '#fff',
    borderBottomWidth: 1,
    flex: 1,
    marginRight: 20,
    fontFamily: 'Poppins Medium',
    fontSize: 14.5,
    padding: 0,
    color: '#fff',
  }
});

export default SearchBar;