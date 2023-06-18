import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Axios from './../../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation} from '@react-navigation/native';
import TopicsHeader from '../../components/TopicsHeader';
import Icon from 'react-native-vector-icons/Feather';

const Category = () => {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigation = useNavigation();
  const [term, setTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState(data);

  useEffect(() => {
    const timeout = setTimeout(() => {
      StatusBar.setBackgroundColor('#27B161');
    }, 1); // set a small delay here (in milliseconds)

    return () => clearTimeout(timeout);
  }, [navigation]);

  useEffect(() => {
    if (term.length > 0) {
      const delay = setTimeout(() => {
        searchTopic();
      }, 500);

      return () => clearTimeout(delay);
    }
  }, [term]);

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

  const fetchTopics = async () => {
    try {
      const res = await Axios.get('/topics');
      setFilteredTopics(res.data.data);
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    // AsyncStorage.removeItem('token');
    if (navigation && !AsyncStorage.getItem('token')) {
      navigation.replace('WelcomeScreen');
    }
  }, [navigation]);

  // fetch profile
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

  const searchTopic = () => {
    if (term === '') {
      setFilteredTopics(data);
    } else {
      const filtered = data.filter(topic => {
        return topic.name.toLowerCase().includes(term.toLowerCase());
      });
      setFilteredTopics(filtered);
    }
  };

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: '#27B060'}} />

      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F4F7'}}>
        <View style={styles.topBar}>
          <Text style={styles.title}>My Topics</Text>
          <TopicsHeader />
        </View>
        {/* <View style={{backgroundColor: '#E6E6E8'}}>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Search for a topic..."
              placeholderTextColor="#A9A9A9"
              value={term}
              onChangeText={setTerm}
              onSubmitEditing={searchTopic}
            />
            <Icon
              name="search"
              size={20}
              color="#000"
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
        </View> */}
        {profile && (
          <>
            <View style={{backgroundColor: '#F3F4F7'}}>
              <View style={styles.container}>
                <TextInput
                  style={styles.input}
                  placeholder="Search for a topic..."
                  placeholderTextColor="#A9A9A9"
                  value={term}
                  onChangeText={setTerm}
                  onSubmitEditing={searchTopic}
                />
                <Icon
                  name="search"
                  size={20}
                  color="#000"
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
                  <TouchableOpacity
                    style={styles.link}
                    onPress={() => {
                      let found = false;

                      profile.topics.forEach(topic => {
                        if (topic.id === item.id) {
                          found = true;
                          navigation.push('HomeScreen', {
                            screen: 'CategoryScreen',
                            params: {
                              id: item.id,
                            },
                          });
                          return false;
                        }
                      });

                      if (!found) {
                        navigation.push('ExploreScreen', {
                          screen: 'ExploreCategory',
                          params: {
                            id: item.id,
                          },
                        });
                      }
                    }}>
                    <Text style={styles.linkTitle}>{item.name}</Text>
                    <Icon
                      name="arrow-right"
                      size={22}
                      color="#6B6F76"
                      style={styles.linkIcon}
                    />
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
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
    padding: 10,
    borderWidth: 1,
    borderColor: '#D6D7DA',
    borderRadius: 5,
    // marginVertical: 10,
    marginBottom: 10,
    marginTop: 5,
    marginHorizontal: 15,
    backgroundColor: '#F3F4F7',
  },
  linkTitle: {
    color: '#4B4D54',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  linkIcon: {
    backgroundColor: '#F3F4F7',
  },
  topBar: {
    backgroundColor: '#27B161',
    padding: 20,
    paddingVertical: 15,
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
    borderRadius: 5,
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
    // backgroundColor: '#E6E6E8',
  },
});
