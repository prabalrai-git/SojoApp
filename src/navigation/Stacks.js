import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

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
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="WelcomeSignup" component={WelcomeScreenSignup} />
        <Stack.Screen
          name="SecondSignupScreen"
          component={SecondSignupScreen}
        />
        <Stack.Screen name="ThirdSignupScreen" component={ThirdSignupScreen} />
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

        <Stack.Screen
          name="OptionsScreenSignup"
          component={OptionsScreenSignup}
        />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        <Stack.Screen name="Preferences" component={Preferences} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
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
        detachInactiveScreens={true}
        screenOptions={{}}>
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

        <Stack.Screen
          name="Blog"
          component={BlogScreen}
          options={{headerShown: false}}
        />

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

        <Stack.Screen
          name="Blog"
          component={BlogScreen}
          options={{headerShown: false}}
        />

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
import ProfileSettings from '../screens/ProfileSettings';
import SettingsScreen from '../screens/SettingsScreen';
import SplashScreen from '../screens/Auth/SplashScreen';
import Preferences from '../screens/Auth/Signup/Preferences';
import VerifyEmail from '../screens/Auth/Login/VerifyEmail';
import VerifyOtp from '../screens/Auth/Login/VerifyOtp';
import ChangePassword from '../screens/Auth/Login/ChangePassword';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

// import Category from './../screens/Category';

export const TopicsStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="TopicsScreen"
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}>
        <Stack.Screen name="TopicsScreen" component={TopicsScreen} />
        <Stack.Screen name="EditTopicsScreen" component={EditTopicsScreen} />
        <Stack.Screen name="HomeScreen" component={HomeDrawerNavigator} />
        <Stack.Screen name="ExploreScreen" component={HomeDrawerNavigator} />
      </Stack.Navigator>
    </>
  );
};
export const SettingStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="SettingsScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen
          name="Blog"
          component={BlogScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </>
  );
};

// to maintain the bad code of navigation by other developer :(
export const TabAndAuthStack = () => {
  const navigation = useNavigation();
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.data.id,
      );

      navigation.navigate('Blog', {id: Number(remoteMessage.data.id)});
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.data.id,
          );
          navigation.navigate('Blog', {id: Number(remoteMessage.data.id)});
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }, []);
  return (
    <>
      <Stack.Navigator
        initialRouteName="Tab"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tab" component={TabNavigator} />
        <Stack.Screen
          name="Blog"
          component={BlogScreen}
          options={{headerShown: false, gestureEnabled: false}}
        />

        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="AuthHome" component={TabNavigator} />
        <Stack.Screen name="InfoScreen" component={InfoScreen} />
        <Stack.Screen name="Preferences" component={Preferences} />
        <Stack.Screen name="TopicsScreenLogin" component={TopicsScreenLogin} />
      </Stack.Navigator>
    </>
  );
};
