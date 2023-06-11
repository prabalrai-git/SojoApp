import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AndDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Image, Text} from 'react-native';

import SettingsScreen from './../screens/SettingsScreen';
import {SettingStack, TopicsStack} from './Stacks';
import {HomeDrawerNavigator, ExploreDrawerNavigator} from './Drawer';
import {useNavigation} from '@react-navigation/native';
const Tab = createMaterialTopTabNavigator();

function CustomTabBarLabel({label, focused}) {
  return (
    <Text
      style={{
        fontSize: 22,
        fontWeight: focused ? 'bold' : 'normal',
        display: 'none',
      }}>
      {label}
    </Text>
  );
}

const TabNavigator = () => {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      keyboardHidesTabBar={true}
      tabBarPosition="bottom"
      screenOptions={({route}) => ({
        tabBarLabel: ({label, size, focused}) => (
          <CustomTabBarLabel label={label} focused={focused} />
        ),
        tabBarIndicatorStyle: {backgroundColor: 'transparent'},
        tabBarActiveTintColor: '#006203',
        tabBarLabelStyle: {
          fontSize: 12,
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
              <Ionicons
                name={focused ? 'md-newspaper' : 'md-newspaper-outline'}
                size={23}
                color={color}
                onPress={() => {
                  console.log('thichyo rey thichyo');
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
                  tintColor: focused ? '#006203' : 'grey',
                  width: 23,
                  height: 23,
                  resizeMode: 'contain',
                }}
              />
            );
            iconName = 'profile';
          } else if (route.name === 'Topics') {
            return (
              <AndDesign
                name={focused ? 'appstore1' : 'appstore-o'}
                size={23}
                color={color}
              />
            );
          } else if (route.name === 'Explore') {
            return (
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                size={25}
                color={color}
                onPress={() => {
                  console.log('thichyo rey thichyo');
                }}
              />
            );
          }

          return <Icon name={iconName} size={23} color={color} />;
        },
      })}>
      <Tab.Screen
        name="HomeTab"
        children={() => <HomeDrawerNavigator />}
        options={{
          tabBarLabel: 'Feed',
          tabBarInactiveTintColor: 'grey',
        }}
        listeners={{
          tabPress: () => {
            navigation.replace('Curated');
          },
        }}
      />
      <Tab.Screen
        name="Explore"
        children={() => <ExploreDrawerNavigator />}
        options={{
          headerShown: false,
          tabBarLabel: 'Explore',
          tabBarInactiveTintColor: 'grey',
        }}
        listeners={{
          tabPress: () => {
            navigation.replace('Explore');
          },
        }}
      />
      <Tab.Screen
        name="Topics"
        options={{
          headerShown: false,
          tabBarLabel: 'Topics',
          tabBarInactiveTintColor: 'grey',
        }}
        listeners={{
          tabPress: () => {
            navigation.replace('TopicsScreen');
          },
        }}
        children={() => {
          return <TopicsStack />;
        }}
      />
      <Tab.Screen
        name="Settings"
        // component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
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
