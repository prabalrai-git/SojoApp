import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../api/server';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StatusBar, Image} from 'react-native';

const SplashScreen = () => {
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notFirstTime, setNotFirstTime] = useState(null);
  const navigation = useNavigation();

  const fetchProfile = async () => {
    try {
      const res = await Axios.get('/users/profile', config);
      setProfile(res.data.data);
    } catch (err) {
      console.log(err);
      if (err && err.response && err.response.status === 401) {
        await AsyncStorage.removeItem('token');
        navigation.reset({index: 0, routes: [{name: 'Auth'}]});
      }
    }
  };

  useEffect(() => {
    config && fetchProfile();
  }, [config]);

  // check if user is logged in
  useEffect(() => {
    // Check if the user is logged in
    async function checkLoginStatus() {
      // await AsyncStorage.removeItem('token');
      const token = await AsyncStorage.getItem('token');
      // setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
      if (token) {
        const config = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        setConfig(config);
      }
    }
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const notFirstTimeFn = async () => {
      const value = await AsyncStorage.getItem('notFirstTime');
      if (!value) {
        setTimeout(() => {
          return navigation.replace('WelcomeSignup');
        }, 2000);
      } else {
        setTimeout(() => {
          if (!profile) {
            return navigation.replace('MainScreen');
          }
        }, 2000);
      }
    };
    notFirstTimeFn();
  }, [profile]);

  return (
    <>
      <StatusBar backgroundColor={'white'} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{
            width: 200,
            height: 200,
            resizeMode: 'contain',
          }}
        />
      </View>
    </>
  );
};

export default SplashScreen;
