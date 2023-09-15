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
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../../redux/features/HideTabBar';
import firestore from '@react-native-firebase/firestore';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const Category = () => {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigation = useNavigation();
  const [term, setTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState(data);
  const [adMobIds, setAdMobIds] = useState();
  const [adInterval, setAdInterval] = useState();

  const getAdMobIdsFromFireStore = async () => {
    try {
      const ApIds = await firestore().collection('adMobIds').get();

      setAdMobIds(ApIds.docs);
    } catch (error) {}
  };

  const getBannerAdsIntervalFromFireStore = async () => {
    try {
      const interval = await firestore().collection('bannerAdsInterval').get();

      setAdInterval(interval.docs[0]._data.Interval);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdMobIdsFromFireStore();
    getBannerAdsIntervalFromFireStore();
  }, []);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     StatusBar.setBackgroundColor('#27B161');
  //   }, 1); // set a small delay here (in milliseconds)

  //   return () => clearTimeout(timeout);
  // }, [navigation]);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // do something
      setTerm('');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(showTabBar());
    });

    return unsubscribe;
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

  // const fetchTopics = async () => {
  //   try {
  //     const res = await Axios.get('/topics');
  //     setFilteredTopics(res.data.data);
  //     setData(res.data.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  useEffect(() => {
    // fetchTopics();
    if (profile) {
      let userTopics = [];
      for (x in profile.topics) {
        userTopics.push(profile.topics[x]);
      }
      setFilteredTopics(userTopics);
      setData(userTopics);
    }
  }, [profile]);

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
    searchTopic();
  }, [term]);

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
        <StatusBar
          backgroundColor={darkMode ? global.brandColorDark : global.brandColor}
        />
        <View
          style={[
            styles.topBar,
            {
              backgroundColor: darkMode
                ? global.brandColorDark
                : global.brandColor,
            },
          ]}>
          <Text style={styles.title}>My Topics</Text>
          <TopicsHeader isGuest={profile?.isGuestUser} />
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
              renderItem={({item, index}) => {
                if (adInterval && (index + 1) % adInterval === 0 && adMobIds) {
                  const adIndex = (index + 1) / adInterval;
                  const adItem = adMobIds[adIndex - 1];
                  return (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.link,
                          {
                            // marginBottom:
                            //   filteredTopics.length === index ? null : null,
                            backgroundColor: darkMode
                              ? global.inputColorDark
                              : global.inputColor,
                            borderColor: darkMode
                              ? global.inputColorDark
                              : '#D6D7DA',
                          },
                        ]}
                        onPress={() => {
                          return navigation.navigate('CategoryScreen', {
                            id: item.id,
                          });
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
                        <Text
                          style={[
                            styles.linkTitle,
                            {color: darkMode ? 'white' : '#3F424A'},
                          ]}>
                          {item.name}
                        </Text>
                        <Icon
                          name="arrow-right"
                          size={22}
                          color="#6B6F76"
                          style={[
                            styles.linkIcon,
                            {
                              backgroundColor: darkMode
                                ? global.inputColorDark
                                : global.inputColor,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginVertical: 10,
                          height: 25,
                        }}>
                        {adItem && (
                          <BannerAd
                            unitId={adItem._data.adId}
                            size="360x45"
                            requestOptions={{
                              requestNonPersonalizedAdsOnly: true,
                            }}
                          />
                        )}
                      </View>
                    </>
                  );
                } else {
                  return (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.link,
                          {
                            // marginBottom:
                            //   filteredTopics.length === index ? null : null,
                            backgroundColor: darkMode
                              ? global.inputColorDark
                              : global.inputColor,
                            borderColor: darkMode
                              ? global.inputColorDark
                              : '#D6D7DA',
                          },
                        ]}
                        onPress={() => {
                          return navigation.navigate('CategoryScreen', {
                            id: item.id,
                          });
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
                        <Text
                          style={[
                            styles.linkTitle,
                            {color: darkMode ? 'white' : '#3F424A'},
                          ]}>
                          {item.name}
                        </Text>
                        <Icon
                          name="arrow-right"
                          size={22}
                          color="#6B6F76"
                          style={[
                            styles.linkIcon,
                            {
                              backgroundColor: darkMode
                                ? global.inputColorDark
                                : global.inputColor,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                      {/* <View style={{height: 30}}></View> */}
                    </>
                  );
                }
                return (
                  <TouchableOpacity
                    style={[
                      styles.link,
                      {
                        // marginBottom:
                        //   filteredTopics.length === index ? null : null,
                        backgroundColor: darkMode
                          ? global.inputColorDark
                          : global.inputColor,
                        borderColor: darkMode
                          ? global.inputColorDark
                          : '#D6D7DA',
                      },
                    ]}
                    onPress={() => {
                      return navigation.navigate('CategoryScreen', {
                        id: item.id,
                      });
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
                    <Text
                      style={[
                        styles.linkTitle,
                        {color: darkMode ? 'white' : '#3F424A'},
                      ]}>
                      {item.name}
                    </Text>
                    <Icon
                      name="arrow-right"
                      size={22}
                      color="#6B6F76"
                      style={[
                        styles.linkIcon,
                        {
                          backgroundColor: darkMode
                            ? global.inputColorDark
                            : global.inputColor,
                        },
                      ]}
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
    borderWidth: 1.5,
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
