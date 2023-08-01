import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import MainNavigation from './src/navigation/AppNavigation';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from './src/api/server';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import {Alert, Linking, Platform} from 'react-native';

export default function App() {
  // to subscribe the users to topics based on their selection of news topic using FCM notification service

  const [userTopics, setUserTopics] = useState([]);
  const [config, setConfig] = useState();
  const [updatedVersion, setUpdatedVersion] = useState();

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
    const notificationFirstTime = async () => {
      const value = await AsyncStorage.getItem('notFirstTime');
      await AsyncStorage.setItem('notificationStatus', 'true');
      if (userTopics && !value) {
        for (let x in userTopics) {
          messaging()
            .subscribeToTopic(userTopics[x])
            .then(() => {})
            .catch(console.log('error'));
        }
      }
    };
    notificationFirstTime();
  }, [userTopics]);

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  /// notification

  const openGoogleORAppStore = () => {
    if (Platform.OS === 'ios') {
      return Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.sojonewsapp',
      );
    }
    if (Platform.OS === 'android') {
      return Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.sojonewsapp',
      );
    }
  };
  useEffect(() => {
    setTimeout(() => {
      getVersionFromFirebase();
    }, 2000);
  }, []);
  const getVersionFromFirebase = async () => {
    const version = await firestore()
      .collection('sojoNewsAppVersion')
      .doc('FdH5CyUSU9pZAvjYx89l')
      .get();

    setUpdatedVersion(version._data.version);
  };

  return (
    <>
      {updatedVersion &&
      DeviceInfo.getVersion() !== updatedVersion &&
      DeviceInfo.getVersion() < updatedVersion
        ? Alert.alert('', `New version ${updatedVersion} available!`, [
            {
              text: 'Update Now',
              onPress: () => openGoogleORAppStore(),
              style: 'cancel',
            },
            {text: 'Later', onPress: () => console.log('OK Pressed')},
          ])
        : null}
      <Provider store={store}>
        <NavigationContainer theme={DarkTheme}>
          <MainNavigation />
        </NavigationContainer>
      </Provider>
    </>
  );
}
