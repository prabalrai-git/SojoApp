import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import MainNavigation from './src/navigation/AppNavigation';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from './src/api/server';
export default function App() {
  // to subscribe the users to topics based on their selection of news topic using FCM notification service

  const [userTopics, setUserTopics] = useState([]);
  const [config, setConfig] = useState();

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

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  useEffect(() => {
    if (userTopics) {
      for (let x in userTopics) {
        messaging()
          .subscribeToTopic(userTopics[x])
          .then(() => console.log(`Subscribed to ${userTopics[x]}!`));
      }
    }
  }, [userTopics]);

  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <MainNavigation />
        </NavigationContainer>
      </Provider>
    </>
  );
}
