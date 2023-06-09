import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

// auth screens
import MainScreen from '../screens/Auth/MainScreen';
import WelcomeScreenLogin from '../screens/Auth/Login/WelcomeScreen';
import OptionsScreenLogin from '../screens/Auth/Login/OptionsScreen';
import LoginScreen from '../screens/Auth/Login/LoginScreen';
import InfoScreen from '../screens/Auth/Login/InfoScreen';
import TopicsScreenLogin from './../screens/TopicsScreen';

// signup
import WelcomeScreenSignup from '../screens/Auth/Signup/WelcomeScreen';
import SecondSignupScreen from '../screens/Auth/Signup/SecondScreen';
import ThirdSignupScreen from '../screens/Auth/Signup/ThirdScreen';
import OptionsScreenSignup from '../screens/Auth/Signup/OptionsScreen';
import SignupScreen from '../screens/Auth/Signup/SignupScreen';
import VerifyScreen from '../screens/Auth/Signup/VerifyScreen';
import CategoryScreen from './../screens/Category';
import ExploreCategoryScreen from './../screens/ExploreCategoryScreen';
import EditTopicsScreen from './../screens/Topics/EditTopicsScreen';

export const AuthStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="MainScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="AuthHome" component={TabNavigator} />
        <Stack.Screen
          name="WelcomeLogin"
          component={WelcomeScreenLogin}
          options={{
            title: 'Login',
          }}
        />
        <Stack.Screen
          name="OptionsLogin"
          component={OptionsScreenLogin}
          options={{
            title: 'Login',
          }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="InfoScreen" component={InfoScreen} />
        <Stack.Screen name="TopicsScreenLogin" component={TopicsScreenLogin} />

        {/* signup */}
        <Stack.Screen name="WelcomeSignup" component={WelcomeScreenSignup} />
        <Stack.Screen
          name="SecondSignupScreen"
          component={SecondSignupScreen}
        />
        <Stack.Screen name="ThirdSignupScreen" component={ThirdSignupScreen} />
        <Stack.Screen
          name="OptionsScreenSignup"
          component={OptionsScreenSignup}
        />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
      </Stack.Navigator>
    </>
  );
};

// home screens
import HomeScreen from './../screens/HomeScreen';
import CuratedScreen from './../screens/CuratedScreen';
import SearchScreen from './../screens/SearchScreen';
import ExploreSearchScreen from './../screens/ExploreSearchScreen';
import BlogScreen from './../screens/BlogScreen';

export const HomeStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName={'Curated'}
        detachInactiveScreens={true}>
        <Stack.Screen
          name="Curated"
          component={CuratedScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="CategoryScreen"
          component={CategoryScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen name="Blog" component={BlogScreen} />

        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export const ExploreStack = () => {
  return (
    <>
      <Stack.Navigator initialRouteName={'Explore'}>
        <Stack.Screen
          name="Explore"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ExploreCategory"
          component={ExploreCategoryScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen name="Blog" component={BlogScreen} />

        <Stack.Screen
          name="SearchScreen"
          component={ExploreSearchScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
};

// topics screens
import TopicsScreen from './../screens/Topics/TopicsScreen';
import TabNavigator from './Tab';
import {HomeDrawerNavigator} from './Drawer';
// import Category from './../screens/Category';

export const TopicsStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="TopicsScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="TopicsScreen" component={TopicsScreen} />
        <Stack.Screen name="EditTopicsScreen" component={EditTopicsScreen} />
        <Stack.Screen name="HomeScreen" component={HomeDrawerNavigator} />
        <Stack.Screen name="ExploreScreen" component={HomeDrawerNavigator} />
      </Stack.Navigator>
    </>
  );
};
