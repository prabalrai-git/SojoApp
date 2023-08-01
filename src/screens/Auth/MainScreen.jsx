import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import {windowHeight, windowWidth} from '../../helper/usefulConstants';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth, {firebase} from '@react-native-firebase/auth';
import Axios from '../../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import '../../../globalThemColor';
import {useSelector} from 'react-redux';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import jwt_decode from 'jwt-decode';

const MainScreen = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const navigation = useNavigation();

  const darkMode = useSelector(state => state.darkMode.value);

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '142214910872-ood34gsap8s56mvs9q7ookv3kn626382.apps.googleusercontent.com',
    });
  }, []);

  async function onAppleButtonPressAndroid() {
    const rawNonce = uuid();
    const state = uuid();

    appleAuthAndroid.configure({
      clientId: 'com.sojonewsappforweb',

      redirectUri: 'https://sojonews.com/',

      responseType: appleAuthAndroid.ResponseType.ALL,

      scope: appleAuthAndroid.Scope.ALL,

      nonce: rawNonce,

      state,
    });

    const response = await appleAuthAndroid.signIn();

    const credentials = jwt_decode(response.id_token);

    const {email} = credentials;

    try {
      const response = await Axios.post('/auth/applePhoneLogin', {
        username: 'user',
        email: email,
      });
      // fetch('https://backendv1.sojonews.com/api/v1/auth/applePhoneLogin', {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     username: 'user',
      //     email: email,
      //   }),
      // })
      //   .then(response => response.json())
      //   .then(responseJson => {
      //     console.log(responseJson);
      //   });

      // console.log('====================================');
      // console.log(response.data);
      // console.log('====================================');

      const {token, userAlereadyExits} = response.data.data;
      await AsyncStorage.setItem('token', token);
      if (userAlereadyExits) {
        navigation.replace('AuthHome', {
          screen: 'HomeTab',
          params: {screen: 'Home'},
        });
      } else {
        navigation.navigate('InfoScreen');
      }
    } catch (error) {}
  }

  async function onAppleButtonPress() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const {identityToken, nonce} = appleAuthRequestResponse;

    if (identityToken) {
      const appleCredential = firebase.auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      const userCredential = await firebase
        .auth()
        .signInWithCredential(appleCredential);

      const {email, displayName} = userCredential.user._user;

      try {
        const response =
          email &&
          (await Axios.post('/auth/applePhoneLogin', {
            username: displayName ? displayName : 'user',
            email: email,
          }));

        const {token, userAlereadyExits} = response.data.data;
        await AsyncStorage.setItem('token', token);
        if (userAlereadyExits) {
          navigation.replace('AuthHome', {
            screen: 'HomeTab',
            params: {screen: 'Home'},
          });
        } else {
          navigation.navigate('InfoScreen');
        }
      } catch (error) {}
    } else {
      // handle this - retry?
    }
  }
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken, user} = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      try {
        const response = await Axios.post(`/auth/googlePhoneLogin`, {
          username: user.name,
          email: user.email,
        });
        // return console.log(response);

        const {token, userAlereadyExits} = response.data.data;
        await AsyncStorage.setItem('token', token);
        if (userAlereadyExits) {
          navigation.replace('AuthHome', {
            screen: 'HomeTab',
            params: {screen: 'Home'},
          });
        } else {
          navigation.navigate('InfoScreen');
        }
      } catch (error) {
        setErrorMessage('Email already in use by other sign in method !');
        return signOut();
        console.error(error);
        if (error && error.response && error.response.data) {
          if (error.response.data.err === 'not_active') {
            navigation.push('Verify', {
              email,
            });
          } else {
            setErrorMessage(error.response.data.err);
          }
        }
      }
    } catch (error) {
      signOut();
      console.log(error);
      // setErrorMessage(error.Error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log(error);
      } else {
        // some other error happened
        console.log(error);
      }
    }
  };
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const signInWithoutCredentials = async () => {
    try {
      const response = await Axios.post('auth/guestLogin');

      const {token} = response.data.data;
      await AsyncStorage.setItem('token', token);

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const topics = await Axios.get('/topics');

      for (const item of topics.data.data) {
        await Axios.patch(`/users/profile/topic/${item.id}`, {}, config);
      }

      navigation.replace('AuthHome', {
        screen: 'HomeTab',
        params: {screen: 'Home'},
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  };

  return (
    <View
      style={[
        styles.bottomContainer,
        {
          backgroundColor: darkMode
            ? global.backgroundColorDark
            : global.backgroundColor,
        },
      ]}>
      <StatusBar
        backgroundColor={
          darkMode ? global.backgroundColorDark : global.backgroundColor
        }
      />

      <View
        style={[
          styles.top,
          {
            backgroundColor: darkMode
              ? global.backgroundColorDark
              : global.backgroundColor,
          },
        ]}>
        <Image
          source={require('../../assets/logoLogin.png')}
          style={[
            styles.signupIcon,
            {
              width: 250,
              height: 150,
              resizeMode: 'contain',
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.bottom,
          {
            backgroundColor: darkMode
              ? global.brandColorDark2
              : global.brandColor,
            // position: 'relative',
          },
        ]}>
        {errorMessage && (
          <Text
            style={{
              color: '#C94425',
              fontWeight: '600',
              position: 'absolute',
              left: 0,
              right: 0,
              top: 20,
              textAlign: 'center',
            }}>
            {errorMessage}
          </Text>
        )}
        <ScrollView>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (Platform.OS === 'android') {
                return onAppleButtonPressAndroid();
              } else if (Platform.OS === 'ios') {
                return onAppleButtonPress();
              }
            }}>
            <Image
              source={require('../../assets/apple-logo.png')}
              style={styles.signupIcon}
            />
            <Text style={[styles.buttonText, styles.midText]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => signIn()}>
            <Image
              source={require('../../assets/google.png')}
              style={styles.signupIcon}
            />
            <Text style={[styles.buttonText, styles.midText]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'android' && (
            <TouchableOpacity
              style={[styles.button, {height: 50}]}
              onPress={() => signInWithoutCredentials()}>
              <Image
                source={require('../../assets/enter.png')}
                style={styles.signupIcon}
              />
              <Text
                style={[
                  styles.buttonText,
                  styles.midText,
                  {marginRight: '23%'},
                ]}>
                Continue Without Signing In
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  midText: {
    marginRight: '30%',
  },
  signupIcon: {
    width: 25,
    height: 25,
  },
  top: {
    flex: 0.1,
  },
  bottom: {
    flex: 0.3,
    width: windowWidth,
    backgroundColor: '#12ab51',
    borderTopEndRadius: 35,
    borderTopLeftRadius: 35,
    paddingTop: 60,
    height: windowHeight * 0.35,
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    padding: 9,
    backgroundColor: '#E7E7E8',
    borderRadius: 8,
    marginBottom: 20,
  },

  buttonText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
