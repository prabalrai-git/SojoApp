import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../api/server';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StatusBar, Image, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import '../../../globalThemColor';
import {toggleDarkMode} from '../../redux/features/DarkMode';
import NetInfo from '@react-native-community/netinfo';

const SplashScreen = () => {
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notFirstTime, setNotFirstTime] = useState(null);
  const [isconnectedToInternet, setIsConnectedToInternet] = useState();
  const navigation = useNavigation();

  const darkMode = useSelector(state => state.darkMode.value);

  const dispatch = useDispatch();

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

    async function getDarkModeValue() {
      const darkMode = await AsyncStorage.getItem('darkmode');

      if (darkMode === 'true' || darkMode === true) {
        dispatch(toggleDarkMode(true));
      } else {
        dispatch(toggleDarkMode(false));
      }
    }
    getDarkModeValue();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setIsConnectedToInternet(state.isConnected);
      } else {
        Alert.alert(
          'No internet connection',
          'Please check your network settings and try again.',
        );
      }
    });
  }, []);

  useEffect(() => {});

  useEffect(() => {
    const notFirstTimeFn = async () => {
      const value = await AsyncStorage.getItem('notFirstTime');

      if (!value && isconnectedToInternet) {
        setTimeout(() => {
          return navigation.replace('WelcomeSignup');
        }, 500);
      } else if (isconnectedToInternet) {
        setTimeout(() => {
          if (!profile) {
            return navigation.replace('MainScreen');
          }
        }, 500);
      }
    };
    setTimeout(() => {
      notFirstTimeFn();
    }, 1000);
  }, [profile, isconnectedToInternet]);

  return (
    <>
      <StatusBar
        backgroundColor={darkMode ? global.brandColor : global.brandColor}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: darkMode ? global.brandColor : global.brandColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{
            width: 110,
            height: 30,
            resizeMode: 'contain',
            tintColor: 'white',
          }}
        />
        <Image
          source={require('../../assets/logo1.png')}
          style={{
            width: 120,
            height: 40,
            resizeMode: 'contain',
          }}
        />
      </View>
    </>
  );
};

export default SplashScreen;
