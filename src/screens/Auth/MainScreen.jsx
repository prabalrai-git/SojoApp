import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {windowHeight, windowWidth} from '../../helper/usefulConstants';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Axios from '../../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

const MainScreen = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const navigation = useNavigation();

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
        '550042982411-7dedsj7l7oe7v7kut8vopdn284sgnjh6.apps.googleusercontent.com',
    });
  }, []);

  // useEffect(() => {
  //   signOut();
  // });
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

        // return console.log(response.data.data);

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
        // navigation.reset({index: 0, routes: [{name: 'AuthHome'}]});
        // handle successful login, e.g. redirect to home screen
      } catch (error) {
        console.log(error);
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

  return (
    <View style={styles.bottomContainer}>
      <StatusBar backgroundColor={'white'} />

      <View style={styles.top}>
        <Image
          source={require('../../assets/logo.png')}
          style={[
            styles.signupIcon,
            {
              width: 250,
              height: 120,
              resizeMode: 'contain',
            },
          ]}
        />
      </View>
      <View style={styles.bottom}>
        {/*  <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.push('WelcomeLogin');
          }}>
          <FontAwesome name="google" size={24} color="#545760" /> 
          <Text style={styles.buttonText}>Continue by logging in</Text>
        </TouchableOpacity>*/}
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../assets/apple-logo.png')}
            style={styles.signupIcon}
          />
          <Text style={[styles.buttonText, styles.midText]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
        <ScrollView>
          {errorMessage && (
            <Text style={{color: 'red', fontWeight: '600'}}>
              {errorMessage}
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={() => signIn()}>
            <Image
              source={require('../../assets/google.png')}
              style={styles.signupIcon}
            />
            <Text style={[styles.buttonText, styles.midText]}>
              Continue with Google
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button} onPress={() => signOut()}>
            <Image
              source={require('../../assets/google.png')}
              style={styles.signupIcon}
            />
            <Text style={[styles.buttonText, styles.midText]}>Sign OUt</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.push('Login');
            }}>
            <MaterialIcons name="email" size={24} color="#545760" />
            <Image
              source={require('../../assets/email.png')}
              style={styles.signupIcon}
            />
            <Text style={[styles.buttonText, styles.midText]}>
              Continue with Email
            </Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: '#12ab51',
                borderWidth: 2,
                borderColor: 'white',
                alignItems: 'flex-start',
                marginTop: 30,
                padding: 13,
              },
            ]}
            onPress={() => {
              return console.log('clicked');
              navigation.push('Signup');
            }}>
            <MaterialIcons name="email" size={24} color="#545760" />
            <Text style={[styles.buttonText, {color: 'white'}]}>
              Create an account
            </Text>
            <Image
              source={require('../../assets/right-arrow.png')}
              style={[
                styles.signupIcon,
                {width: 20, height: 20, tintColor: 'white'},
              ]}
            />
          </TouchableOpacity> */}
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
    paddingTop: 110,
    height: windowHeight * 0.35,
    position: 'absolute',
    bottom: 0,
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flex: 1,
    backgroundColor: 'white',
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
    // elevation: 1,
    // borderWidth: 1,
    // borderColor: '',

    marginBottom: 20,
  },

  buttonText: {
    // marginLeft: 10,
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
