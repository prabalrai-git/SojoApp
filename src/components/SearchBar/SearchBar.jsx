import React, {useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const SearchBar = () => {
  const navigation = useNavigation();
  const [term, setTerm] = useState('');

  return (
    <View style={{backgroundColor: '#F3F4F7'}}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search for a news..."
          placeholderTextColor="#A9A9A9"
          value={term}
          onChangeText={setTerm}
          onSubmitEditing={() => {
            if (term.trim().length > 0) {
              setTerm('');
              navigation.push('SearchScreen', {
                term: term,
              });
            }
          }}
        />
        <Icon
          name="search"
          size={20}
          color="#000"
          onPress={() => {
            if (term.trim().length > 0) {
              setTerm('');
              Keyboard.dismiss();
              navigation.navigate('SearchScreen', {
                term: term,
              });
            }
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
    backgroundColor: 'white',
    borderRadius: 6,
    marginHorizontal: 15,
    marginVertical: 15,
    padding: 2,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#919298',
    paddingLeft: 0,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
});
