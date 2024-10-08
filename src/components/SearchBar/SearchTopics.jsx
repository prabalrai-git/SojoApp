import React, {useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const SearchBar = () => {
  const [term, setTerm] = useState('');

  return (
    <View style={{backgroundColor: '#E6E6E8'}}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search for a topic..."
          placeholderTextColor="#A9A9A9"
          value={term}
          onChangeText={setTerm}
          // onSubmitEditing={() => {
          //   if (term.trim().length > 0) {
          //     setTerm('');
          //     navigation.navigate('SearchScreen', {
          //       term: term,
          //     });
          //   }
          // }}
        />
        <Icon
          name="search"
          size={20}
          color="#000"
          onPress={() => {
            // if (term.trim().length > 0) {
            //   setTerm('');
            //   Keyboard.dismiss();
            //   navigation.navigate('SearchScreen', {
            //     term: term,
            //   });
            // }
          }}
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#919298',
    paddingLeft: 0,
    paddingVertical: 8,
  },
});
