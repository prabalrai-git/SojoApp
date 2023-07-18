import React, {useState, useEffect} from 'react';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack, TabAndAuthStack} from './Stacks';
import TabNavigator from './Tab';
import {useSelector} from 'react-redux';

export default function MainNavigator() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigation = useNavigation();

  const Stack = createNativeStackNavigator();

  const fetchProfile = async () => {
    try {
      const res = await Axios.get('/users/profile', config);
      setProfile(res.data.data);
    } catch (err) {
      console.log(err);
      if (err && err.response && err.response.status === 401) {
        await AsyncStorage.removeItem('token');
        // navigation.reset({index: 0, routes: [{name: 'Auth'}]});
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

  const darkMode = useSelector(state => state.darkMode.value);

  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{cardStyle: {backgroundColor: 'transparent'}}}>
      {profile ? (
        <Stack.Screen
          name="Home"
          component={TabAndAuthStack}
          options={{
            headerShown: false,
            cardStyle: {backgroundColor: 'transparent'},
          }}
        />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
}
