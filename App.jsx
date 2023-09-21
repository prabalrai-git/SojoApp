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
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export default function App() {
  // to subscribe the users to topics based on their selection of news topic using FCM notification service

  const [userTopics, setUserTopics] = useState([]);
  const [config, setConfig] = useState();
  const [updatedVersion, setUpdatedVersion] = useState();
  const [lastApiCallTimestamp, setLastApiCallTimestamp] = useState(null);

  const AdPermission = async () => {
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    if (result === RESULTS.DENIED) {
      // The permission has not been requested, so request it.
      await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    }
    const adapterStatuses = await mobileAds().initialize();
  };
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
    AdPermission();
  }, []);

  // fetch profile
  const fetchProfile = async () => {
    try {
      console.log(config);
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
    // console.log('Message handled in the background!', remoteMessage);
  });

  /// notification

  const openGoogleORAppStore = () => {
    if (Platform.OS === 'ios') {
      return Linking.openURL(
        'https://apps.apple.com/us/app/sojo-news/id6454899280',
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
    try {
      const version = await firestore()
        .collection('sojoNewsAppVersion')
        .doc('6dPXxZWyJCFqQjgJ5GoZ')
        .get();

      setUpdatedVersion(version._data.version);
    } catch (error) {
      // console.log(error);
    }
  };

  function compareVersions(version1, version2) {
    const v1Components = version1.split('.').map(Number);
    const v2Components = version2.split('.').map(Number);

    const maxLength = Math.max(v1Components.length, v2Components.length);

    for (let i = 0; i < maxLength; i++) {
      const v1Component = i < v1Components.length ? v1Components[i] : 0;
      const v2Component = i < v2Components.length ? v2Components[i] : 0;

      if (v1Component > v2Component) {
        return 1; // version1 is greater
      } else if (v1Component < v2Component) {
        return -1; // version2 is greater
      }
    }

    return 0; // versions are equal
  }

  return (
    <>
      {updatedVersion &&
      // DeviceInfo.getVersion() !== updatedVersion &&
      // DeviceInfo.getVersion() < updatedVersion
      compareVersions(updatedVersion, DeviceInfo.getVersion()) === 1
        ? Alert.alert('', `New version available!`, [
            {
              text: 'Update Now',
              onPress: () => openGoogleORAppStore(),
              style: 'cancel',
            },
            {text: 'Later', onPress: () => {}},
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
