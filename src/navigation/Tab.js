import React, {useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AndDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Image, Text} from 'react-native';

import SettingsScreen from './../screens/SettingsScreen';
import {SettingStack, TopicsStack} from './Stacks';
import {HomeDrawerNavigator, ExploreDrawerNavigator} from './Drawer';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {windowWidth} from '../helper/usefulConstants';
import {useDispatch, useSelector} from 'react-redux';
import {toogleStatus} from '../redux/features/ReloadStatusBar';
import {logoutUser} from '../helper/auth';

const Tab = createMaterialTopTabNavigator();

function CustomTabBarLabel({label, focused}) {
  return (
    <Text
      style={{
        fontSize: 22,
        fontWeight: focused ? 'bold' : 'normal',
        display: 'block',
      }}>
      {label}
    </Text>
  );
}

const TabNavigator = () => {
  const dispatch = useDispatch();

  return (
    <Tab.Navigator
      keyboardHidesTabBar={true}
      tabBarPosition="bottom"
      screenOptions={({route}) => ({
        tabBarLabel: ({label, size, focused}) => {
          return <CustomTabBarLabel label={label} focused={focused} />;
        },
        tabBarStyle: {height: 70},
        tabBarIndicatorStyle: {
          backgroundColor: '#ECF9EF',
          height: '85%',
          marginBottom: 6,
          width: windowWidth * 0.2,
          marginLeft: 10,
          borderRadius: 16,
        },
        tabBarActiveTintColor: '#006203',
        tabBarShowLabel: true,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          textTransform: 'none',
        },
        tabBarAndroidRipple: {
          color: '#ECF9EF',
          radius: 50,
        },
        headerShown: false,

        tabBarIcon: ({color, size, focused}) => {
          let iconName;

          if (route.name === 'HomeTab') {
            // iconName = 'home';
            return (
              <Image
                source={
                  focused
                    ? require('../assets/feed_fill.png')
                    : require('../assets/feed.png')
                }
                style={{
                  width: 26,
                  height: 26,
                  resizeMode: 'contain',
                }}
              />
            );
          } else if (route.name === 'Settings') {
            return (
              // <FontAwesome
              //   name={focused ? 'user' : 'user-o'}
              //   size={23}
              //   color={color}
              // />
              <Image
                source={
                  focused
                    ? require('../assets/user_fill.png')
                    : require('../assets/user.png')
                }
                style={{
                  // tintColor: focused ? '#006203' : 'grey',
                  width: 26,
                  height: 26,
                  resizeMode: 'contain',
                }}
              />
            );
            iconName = 'profile';
          } else if (route.name === 'Topics') {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/topics_fill.png')
                    : require('../assets/topics.png')
                }
                style={{
                  width: 26,
                  height: 26,
                  resizeMode: 'contain',
                }}
              />
            );
          } else if (route.name === 'Explore') {
            return (
              <Image
                source={
                  focused
                    ? require('../assets/compass_fill.png')
                    : require('../assets/compass.png')
                }
                style={{
                  width: 26,
                  height: 26,
                  resizeMode: 'contain',
                }}
              />
              // <Ionicons
              //   name={focused ? 'compass' : 'compass-outline'}
              //   size={25}
              //   color={color}
              //   onPress={() => {
              //     console.log('thichyo rey thichyo');
              //   }}
              // />
            );
          }

          return <Icon name={iconName} size={26} color={color} />;
        },
      })}>
      <Tab.Screen
        name="HomeTab"
        children={() => <HomeDrawerNavigator />}
        options={{
          headerShown: false,

          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#171717' : 'grey',
                fontSize: 12,
                fontWeight: '500',
              }}>
              Feed
            </Text>
          ),
          tabBarInactiveTintColor: 'grey',
        }}
        // listeners={{
        //   tabPress: () => {
        //     navigation.replace('Curated');
        //   },
        // }}
      />
      <Tab.Screen
        name="Explore"
        children={() => <ExploreDrawerNavigator />}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#171717' : 'grey',
                fontSize: 12,
                fontWeight: '500',
              }}>
              Explore
            </Text>
          ),
          tabBarInactiveTintColor: 'grey',
        }}
        // listeners={{
        //   tabPress: () => {
        //     navigation.replace('Explore');
        //   },
        // }}
      />
      <Tab.Screen
        name="Topics"
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#171717' : 'grey',
                fontSize: 12,
                fontWeight: '500',
              }}>
              Topics
            </Text>
          ),
          tabBarInactiveTintColor: 'grey',
        }}
        // listeners={{
        //   tabPress: () => {
        //     navigation.replace('TopicsScreen');
        //   },
        // }}
        children={() => {
          return <TopicsStack />;
        }}
      />
      <Tab.Screen
        name="Settings"
        // component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#171717' : 'grey',
                fontSize: 12,
                fontWeight: '500',
              }}>
              Profile
            </Text>
          ),
          tabBarInactiveTintColor: 'grey',
        }}
        // listeners={{
        //   tabPress: () => {
        //     navigation.replace('Settings');
        //   },
        // }}
        children={() => {
          return <SettingStack />;
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
