import React, {useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Feather';
import {Image, Text} from 'react-native';

import SettingsScreen from './../screens/SettingsScreen';
import {SettingStack, TopicsStack} from './Stacks';
import {HomeDrawerNavigator, ExploreDrawerNavigator} from './Drawer';

import {windowWidth} from '../helper/usefulConstants';
import {useDispatch, useSelector} from 'react-redux';

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
  const hideTabBar = useSelector(state => state.hideTabBar.value);

  return (
    <Tab.Navigator
      keyboardHidesTabBar={true}
      tabBarPosition="bottom"
      screenOptions={({route}) => ({
        tabBarLabel: ({label, size, focused}) => {
          return <CustomTabBarLabel label={label} focused={focused} />;
        },
        tabBarStyle: {height: hideTabBar ? 0 : 77},
        tabBarIndicatorStyle: {
          backgroundColor: '#ECF9EF',
          height: '74%',
          marginBottom: 17,
          width: windowWidth * 0.22,
          marginLeft: 8,
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
              <Image
                source={
                  focused
                    ? require('../assets/user_fill.png')
                    : require('../assets/user.png')
                }
                style={{
                  width: 26,
                  height: 26,
                  resizeMode: 'contain',
                }}
              />
            );
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
