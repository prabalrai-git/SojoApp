import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../api/server';

const SearchBar = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState();
  const [config, setConfig] = useState();
  const [term, setTerm] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const config = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };

        setConfig(config);
      }
    };
    fetchToken();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await Axios.get('/users/profile', config);

      if (!res.data.data.isComplete) {
        return navigation.navigate('Auth', {screen: 'InfoScreen'});
      }
      setProfile(res.data.data);
    } catch (err) {
      console.log(err);
      if (err && err.response && err.response.status === 401) {
        logout();
        setProfile(null);
        // return router.replace('/');
      }
    }
  };
  useEffect(() => {
    if (config) {
      fetchProfile();
    }
  }, [config]);

  return (
    <View style={{backgroundColor: '#f3f4f7'}}>
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
                profile: profile,
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
                profile: profile,
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
