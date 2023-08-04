import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PRIMARY_COLOR, windowWidth} from '../helper/usefulConstants';
import {logoutUser} from '../helper/auth';
import {Switch} from 'react-native-switch';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../redux/features/HideTabBar';
import {toggleDarkMode} from '../redux/features/DarkMode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../api/server';
import messaging from '@react-native-firebase/messaging';

const ProfileSettings = props => {
  const [checked, setChecked] = useState(null);
  const [darkModeChecked, setDarkModeChecked] = useState(null);
  const [config, setConfig] = useState();
  const [userTopics, setUserTopics] = useState([]);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const {isGuestUser} = props?.route?.params;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(showTabBar());
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '550042982411-7dedsj7l7oe7v7kut8vopdn284sgnjh6.apps.googleusercontent.com',
    });
  }, []);
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };
  const darkMode = useSelector(state => state.darkMode.value);

  useEffect(() => {
    if (userTopics && checked) {
      for (let x in userTopics) {
        messaging()
          .subscribeToTopic(userTopics[x])
          .then(() => {})
          .catch(console.log('error'));
      }
    } else if (userTopics && !checked) {
      for (let x in userTopics) {
        messaging()
          .unsubscribeFromTopic(userTopics[x])
          .then(() => {})
          .catch(console.log('error'));
      }
    }
  }, [checked, userTopics]);

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
      // res.data.data.topics.forEach(item => {});
      if (!res.data.data.isComplete) {
        return navigation.navigate('Auth', {screen: 'InfoScreen'});
      }

      const topics = res.data.data.topics;

      const subscribeTopics = [];
      for (let x in topics) {
        subscribeTopics.push(topics[x].name.toLowerCase());
      }
      setUserTopics(subscribeTopics);
    } catch (err) {
      console.log(err);
      if (err && err.response && err.response.status === 401) {
        logout();
        setUserTopics(null);
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
    const getNotiStatusInitialValue = async () => {
      const notiStatus = await AsyncStorage.getItem('notificationStatus');
      if (notiStatus === 'true' || notiStatus === true) {
        setChecked(true);
      } else {
        setChecked(false);
      }
    };
    getNotiStatusInitialValue();
  }, []);

  useEffect(() => {
    const setDarkModeInitialVaue = async () => {
      await AsyncStorage.setItem('darkmode', darkModeChecked?.toString());
    };
    setDarkModeInitialVaue();
  }, [darkModeChecked]);

  useEffect(() => {
    const getDarkModeInitialValue = async () => {
      const darkmode = await AsyncStorage.getItem('darkmode');
      if (darkmode === 'true' || darkmode === true) {
        setDarkModeChecked(true);
        dispatch(toggleDarkMode(true));
      } else {
        setDarkModeChecked(false);
        dispatch(toggleDarkMode(false));
      }
    };
    getDarkModeInitialValue();
  }, []);

  const onNotiToggle = async value => {
    setChecked(value);
    await AsyncStorage.setItem('notificationStatus', value.toString());
  };

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
        <View style={styles.topBar}>
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              paddingHorizontal: 15,
              padding: 6,
            }}
            onPress={() => navigation.pop()}>
            <Image
              source={require('../assets/arrow-left.png')}
              style={{tintColor: 'white', width: 20, height: 20}}
            />
          </TouchableOpacity>

          <View style={styles.container}>
            <TouchableOpacity
              style={styles.titleWrapper}
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="save" size={16} color="#26B160" />
              <Text style={styles.title}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          {/* Start of body/ content */}
          <View style={{paddingHorizontal: 15}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 15,
              }}>
              <View>
                <Text
                  style={{
                    color: darkMode ? 'white' : 'black',
                    fontWeight: 'bold',
                    fontSize: 22,
                  }}>
                  Settings
                </Text>
                <Text style={{color: 'grey'}}>sojo_news</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: darkMode
                    ? global.brandColorDark2
                    : '#b3e0bd',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 8,
                  height: 35,
                  borderRadius: 5,
                }}
                onPress={() => {
                  // navigation.reset({
                  //   index: 0,
                  //   routes: [{name: 'Auth'}],
                  // });
                  logoutUser();
                  signOut();
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'MainScreen'}],
                  });
                  // navigation.navigate('MainScreen');
                }}>
                <Text style={{color: darkMode ? 'white' : '#082313'}}>
                  {isGuestUser ? 'Sign In' : 'Sign Out'}
                </Text>
                <Image
                  source={require('../assets/logout.png')}
                  style={{
                    width: 14,
                    height: 14,
                    tintColor: darkMode ? 'white' : '#082313',
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',
                backgroundColor: darkMode ? '#3F424A' : 'lightgrey',
                height: 1,
                marginBottom: 20,
              }}></View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  color: darkMode ? 'white' : 'black',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                Send me push notifications
              </Text>
              <Switch
                // color="#296146"
                activeText={''}
                inActiveText={''}
                backgroundActive={darkMode ? global.brandColorDark2 : '#27b060'}
                circleSize={30}
                // barHeight={34}
                switchWidthMultiplier={2}
                circleBorderWidth={0}
                outerCircleStyle={{}}
                backgroundInactive={'grey'}
                circleActiveColor={'white'}
                circleInActiveColor={'white'}
                value={checked}
                onValueChange={value => onNotiToggle(value)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 35,
              }}>
              <Text
                style={{
                  color: darkMode ? 'white' : 'black',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                Dark Mode
              </Text>
              <Switch
                // color="#296146"
                activeText={''}
                inActiveText={''}
                backgroundActive={darkMode ? global.brandColorDark2 : '#27b060'}
                circleSize={30}
                // barHeight={34}
                switchWidthMultiplier={2}
                circleBorderWidth={0}
                outerCircleStyle={{}}
                backgroundInactive={'grey'}
                circleActiveColor={'white'}
                circleInActiveColor={'white'}
                value={darkModeChecked}
                onValueChange={value => {
                  setDarkModeChecked(value);
                  dispatch(toggleDarkMode(value));
                }}
              />
            </View>

            <View
              style={{
                width: '100%',
                backgroundColor: darkMode ? '#3F424A' : 'lightgrey',
                height: 1,
                marginVertical: 20,
              }}></View>
            {!isGuestUser && (
              <>
                <Text
                  style={{
                    color: darkMode ? 'white' : 'black',
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginBottom: 20,
                  }}>
                  Account Settings
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: darkMode ? '#7B3445' : '#fecdd3',
                    padding: 8,
                    borderRadius: 8,
                    width: '60%',
                  }}>
                  <Text
                    style={{
                      color: darkMode ? 'white' : '#881337',
                      fontWeight: '500',
                      fontSize: 16,
                      textAlign: 'center',
                    }}>
                    Deactivate Account
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          {/* modal
          <Modal
            isVisible={modalVisible}
            style={{
              position: 'relative',
              margin: 0,
            }}>
            <View
              style={{
                backgroundColor: 'white',
                position: 'absolute',
                bottom: 0,
                // height: 200,
                width: '100%',
                borderTopRightRadius: 20,
                paddingTop: 25,
                borderTopLeftRadius: 20,
              }}>
              {notificationFrequency.map(item => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={{width: windowWidth}}
                    onPress={() => {
                      setModalVisible(prev => !prev);
                      setNotiFreqValue(item.title);
                    }}>
                    <Text style={{color: 'black', marginHorizontal: 20}}>
                      {item.title}
                    </Text>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: 'lightgrey',
                        marginVertical: 18,

                        width: windowWidth,
                      }}></View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Modal> */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  container: {
    backgroundColor: '#FEFEFF',
    paddingVertical: 8,
    paddingRight: 7,
    paddingLeft: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 8,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#26B160',
    fontSize: 14,
    // marginRight: 3,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    marginLeft: 5,
  },

  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
    color: 'black',
    height: 40,
  },
  btnTxt: {
    textAlign: 'center',
    color: '#176a3a',
    fontWeight: 'bold',
  },
  iconContainer: {
    backgroundColor: '#53C180',
    paddingHorizontal: 10,
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  btn: {
    // backgroundColor: '#296146',
    width: '49%',
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
    borderColor: '#c2e4ca',
    borderWidth: 2,
  },
  btnContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 6,
  },
  topBar: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    paddingVertical: 15.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
  },
  topBarText: {
    color: '#27B161',
    fontWeight: '500',
    fontSize: 15,
    alignSelf: 'center',
  },
});
