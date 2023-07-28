import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  TextInput,
  Keyboard,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Axios from './../../api/server';

import {useNavigation, useRoute} from '@react-navigation/native';
import EditTopicsHeader from '../../components/EditTopicsHeader';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopicLoading from '../../components/TopicLoading';
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../../redux/features/HideTabBar';

const Category = () => {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState(null);
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [term, setTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(showTabBar());
    });

    return unsubscribe;
  }, [navigation]);
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     StatusBar.setBackgroundColor('#F43E5F'); // Set the specific color when the screen is focused
  //   });

  //   return unsubscribe;
  // // }, [navigation]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     StatusBar.setBackgroundColor('#27B161');
  //   }, 1); // set a small delay here (in milliseconds)

  //   return () => clearTimeout(timeout);
  // }, [navigation]);

  const fetchTopics = async () => {
    try {
      const res = await Axios.get('/topics');
      setData(res.data.data);
      setFilteredTopics(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

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

  // fetch profile
  const fetchProfile = async () => {
    try {
      const res = await Axios.get('/users/profile', config);
      res.data.data.topics.forEach(item => {});
      if (!res.data.data.isComplete) {
        return navigation.navigate('Auth', {screen: 'InfoScreen'});
      }

      setProfile(res.data.data);
      const arr = [];
      res.data.data.topics.forEach(item => {
        arr.push(item.id);
      });
      setSelectedTopics(arr);
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

  useEffect(() => {
    // AsyncStorage.removeItem('token');
    if (navigation && !AsyncStorage.getItem('token')) {
      navigation.replace('WelcomeScreen');
    }
  }, [navigation]);

  const searchTopic = () => {
    const filtered = data.filter(topic => {
      return topic.name.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredTopics(filtered);
  };

  useEffect(() => {
    if (term.length > 0) {
      const delay = setTimeout(() => {
        searchTopic();
      }, 500);

      return () => clearTimeout(delay);
    }
  }, [term]);

  const darkMode = useSelector(state => state.darkMode.value);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: darkMode ? global.brandColorDark : global.brandColor,
        }}
      />

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: darkMode
            ? global.backgroundColorDark
            : global.backgroundColor,
        }}>
        <View
          style={{
            backgroundColor: darkMode
              ? global.backgroundColorDark
              : global.backgroundColor,
          }}>
          <View style={styles.topBar}>
            <Text style={styles.title}>Explore Topics</Text>
            <EditTopicsHeader />
          </View>
          <View
            style={{
              backgroundColor: darkMode
                ? global.backgroundColorDark
                : global.backgroundColor,
            }}>
            <View
              style={[
                styles.container,
                {
                  backgroundColor: darkMode
                    ? global.inputColorDark
                    : global.inputColor,
                },
              ]}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: darkMode
                      ? global.inputColorDark
                      : global.inputColor,
                  },
                ]}
                placeholder="Search for a topic..."
                placeholderTextColor="#A9A9A9"
                value={term}
                onChangeText={setTerm}
                onSubmitEditing={searchTopic}
              />
              <Icon
                name="search"
                size={20}
                color={darkMode ? '#A9A9A9' : '#000'}
                onPress={() => {
                  Keyboard.dismiss();
                  if (term.trim().length > 0) {
                    searchTopic();
                  } else {
                    setFilteredTopics(data);
                  }
                }}
              />
            </View>
          </View>

          <FlatList
            data={filteredTopics}
            renderItem={({item}) => {
              return (
                <TopicLoading
                  item={item}
                  selectedTopics={selectedTopics}
                  config={config}
                  fetchProfile={fetchProfile}
                />
              );
            }}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Category;

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  linkTitle: {
    color: '#4B4D54',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 15,
    flex: 1,
  },
  linkIcon: {
    borderLeftWidth: 1,
    borderLeftColor: '#DEE1E5',
    padding: 17,
    paddingLeft: 20,
  },
  topBar: {
    backgroundColor: '#27B060',
    padding: 20,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 2,
  },

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
