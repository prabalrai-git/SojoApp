import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AndDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Text} from 'react-native';

import SettingsScreen from './../screens/SettingsScreen';
import {TopicsStack} from './Stacks';
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
        tabBarLabel: ({label, focused}) => (
          <CustomTabBarLabel label={label} focused={focused} />
        ),
        tabBarIndicatorStyle: {backgroundColor: 'transparent'},
        tabBarActiveTintColor: '#104626',
        tabBarLabelStyle: {
          fontSize: 12,
          textTransform: 'none',
        },
        tabBarAndroidRipple: {
          color: '#ECF9EF',
          radius: 50,
        },
        headerShown: false,

        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'HomeTab') {
            // iconName = 'home';
            return (
              <Ionicons
                name="md-newspaper-outline"
                size={23}
                color={color}
                onPress={() => {
                  console.log('thichyo rey thichyo');
                }}
              />
            );
          } else if (route.name === 'Settings') {
            return <FontAwesome name="user-o" size={23} color={color} />;
            iconName = 'profile';
          } else if (route.name === 'Topics') {
            return <AndDesign name="appstore-o" size={23} color={color} />;
          } else if (route.name === 'Explore') {
            iconName = 'compass';
          }

          return <Icon name={iconName} size={23} color={color} />;
        },
      })}>
      <Tab.Screen
        name="HomeTab"
        children={() => <HomeDrawerNavigator />}
        options={{
          tabBarLabel: 'Feed',
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
        options={{headerShown: false, tabBarLabel: 'Explore'}}
        listeners={{
          tabPress: () => {
            navigation.replace('Explore');
          },
        }}
      />
      <Tab.Screen
        name="Topics"
        options={{headerShown: false, tabBarLabel: 'Topics'}}
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
        component={SettingsScreen}
        options={{headerShown: false, tabBarLabel: 'Profile'}}
        // listeners={{
        //   tabPress: () => {
        //     navigation.replace('Settings');
        //   },
        // }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
