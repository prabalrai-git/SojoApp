import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PRIMARY_COLOR, windowWidth} from '../helper/usefulConstants';
import {logoutUser} from '../helper/auth';
import {Switch} from 'react-native-switch';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../redux/features/HideTabBar';
import {toggleDarkMode} from '../redux/features/DarkMode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../api/server';
import messaging from '@react-native-firebase/messaging';
import {Appearance} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

const ProfileSettings = props => {
  const [checked, setChecked] = useState(null);
  const [darkModeChecked, setDarkModeChecked] = useState(null);
  const [config, setConfig] = useState();
  const [userTopics, setUserTopics] = useState([]);
  const [text, onChangeText] = useState('');
  const [disableSend, setDisableSend] = useState(true);

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
          .catch();
      }
    } else if (userTopics && !checked) {
      for (let x in userTopics) {
        messaging()
          .unsubscribeFromTopic(userTopics[x])
          .then(() => {})
          .catch();
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
        if (Appearance.getColorScheme() === 'dark') {
          dispatch(toggleDarkMode(true));
        } else {
          dispatch(toggleDarkMode(false));
        }
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

  const onDeactivateAccount = async () => {
    try {
      const res = await Axios.delete(
        '/users/profile/deactivateAccount',
        config,
      );

      if (res) {
        navigation.reset({
          index: 0,
          routes: [{name: 'MainScreen'}],
        });
      }
    } catch (error) {}
  };

  const removeGuestUser = async () => {
    await AsyncStorage.removeItem('guestUser');
  };
  // const importData = async () => {
  //   try {
  //     const keys = await AsyncStorage.getAllKeys();
  //     const result = await AsyncStorage.multiGet(keys);
  //     const parsedData = [];

  //     result.forEach(req => {
  //       try {
  //         const parsedItem = JSON.parse(req);
  //         parsedData.push(parsedItem);
  //         console.log(parsedItem);
  //       } catch (error) {
  //         console.error('Error parsing JSON:', error);
  //         console.log('Problematic item:', req);
  //       }
  //     });

  //     return parsedData;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   importData();
  // }, []);

  useEffect(() => {
    if (text.length > 0) {
      setDisableSend(false);
    } else {
      setDisableSend(true);
    }
  }, [text]);
  const sendFeedBack = async () => {
    try {
      firestore()
        .collection('surveyQuestions')
        .add({
          FeedBack: text,
          // 'Would you recommend our app to a friend or family member? (Yes/No)':
          //   answerThree,
          // 'Please write us short note': review,
        })
        .then(() => {
          onChangeText('');
        });
      const now = new Date().getTime();

      await AsyncStorage.setItem('surveyCompleted', 'true');
      await AsyncStorage.setItem('surveryCompletedTime', now.toString());
      await AsyncStorage.removeItem('surveySkipTimestamp');
      Toast.show({
        autoClose: 2000,
        onPress: () => Toast.hide(),
        type: ALERT_TYPE.SUCCESS,
        textBody: 'Thank you! We appreciate your feedback!',
      });
      // Alert.alert('Thank You!', 'We appreciate your feedback!', [
      //   // {
      //   //   text: 'Cancel',
      //   //   onPress: () => console.log('Cancel Pressed'),
      //   //   style: 'cancel',
      //   // },
      //   {text: 'OK', onPress: () => console.log('OK Pressed')},
      // ]);
    } catch (error) {}
  };

  return (
    <AlertNotificationRoot theme="white">
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
              style={{
                tintColor: 'white',
                width: 20,
                height: 20,
              }}
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
                  removeGuestUser();

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
            <View>
              <Text
                style={{
                  color: darkMode ? 'white' : 'black',
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginBottom: 10,
                  marginTop: 0,
                }}>
                Your voice matters, and we're here to listen
              </Text>
              <TextInput
                multiline={true}
                placeholderTextColor={'grey'}
                style={[
                  styles.input,
                  {
                    backgroundColor: darkMode
                      ? global.inputColorDark
                      : global.inputColor,
                    color: darkMode ? 'white' : 'black',
                    paddingTop: 10,
                  },
                ]}
                onChangeText={onChangeText}
                value={text}
                placeholder="Your feedback..."
              />
              <TouchableOpacity
                disabled={disableSend}
                onPress={() => sendFeedBack()}
                style={{
                  backgroundColor: disableSend ? 'grey' : global.brandColor,
                  paddingVertical: 12,
                  marginTop: 8,
                  width: '40%',
                  elevation: 2,
                  borderRadius: 8,
                  alignSelf: 'flex-start',
                }}>
                <Text
                  style={{
                    color: disableSend ? 'lightgrey' : 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Send Us Feedback
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 20}}>
              <Text
                style={{
                  color: darkMode ? 'white' : 'black',
                  textAlign: 'left',
                  fontWeight: '500',
                  fontSize: 18,
                  marginBottom: 10,
                }}>
                Connect with us:
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 25,
                  marginBottom: 10,
                  justifyContent: 'flex-start',
                  marginTop: 8,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://www.facebook.com/profile.php?id=61550332155442',
                    )
                  }>
                  <Image
                    source={require('../assets/facebook.png')}
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL('mailto:newssojo@gmail.com')}>
                  <Image
                    source={require('../assets/gmail.png')}
                    style={{
                      width: 27,
                      height: 27,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('https://twitter.com/Sojo_News')
                  }>
                  <Image
                    source={require('../assets/twitter.png')}
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://www.instagram.com/sojojob_offical/',
                    )
                  }>
                  <Image
                    source={require('../assets/instagram.png')}
                    style={{
                      width: 23,
                      height: 23,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {!isGuestUser && (
              <>
                <Text
                  style={{
                    color: darkMode ? 'white' : 'black',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginBottom: 20,
                    marginTop: 10,
                  }}>
                  Account Settings
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Delete Account',
                      'Are you sure you want to delete your account? When you delete your account, your personal data will be promptly and completely removed from our resources.Your privacy is our priority.',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {text: 'Yes', onPress: () => onDeactivateAccount()},
                      ],
                    )
                  }
                  style={{
                    backgroundColor: darkMode ? '#7B3445' : '#fecdd3',
                    padding: 12,
                    borderRadius: 8,
                    width: '40%',
                  }}>
                  <Text
                    style={{
                      color: darkMode ? 'white' : '#881337',
                      fontWeight: '500',
                      fontSize: 16,
                      textAlign: 'center',
                    }}>
                    Delete Account
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
    </AlertNotificationRoot>
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
    height: 110,
    // verticalAlign: 'top',
    textAlignVertical: 'top',
    alignItems: 'flex-start',
    padding: 12,
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
    backgroundColor: '#18AD56',
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
