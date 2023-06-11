import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {windowHeight, windowWidth} from '../../helper/usefulConstants';

const MainScreen = ({navigation}) => {
  return (
    <View style={styles.bottomContainer}>
      <StatusBar backgroundColor={'#2a2d35'} />

      <View style={styles.top}>
        <Image
          source={require('../../assets/logo.png')}
          style={[
            styles.signupIcon,
            {width: 200, height: 100, resizeMode: 'contain'},
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
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../assets/google.png')}
            style={styles.signupIcon}
          />
          <Text style={[styles.buttonText, styles.midText]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.push('Login');
          }}>
          {/* <MaterialIcons name="email" size=5{24} color="#545760" /> */}
          <Image
            source={require('../../assets/email.png')}
            style={styles.signupIcon}
          />
          <Text style={[styles.buttonText, styles.midText]}>
            Continue with Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: '#3d594f',
              borderWidth: 0.5,
              borderColor: 'white',
              alignItems: 'flex-start',
              marginTop: 30,
              padding: 13,
            },
          ]}
          onPress={() => {
            return console.log('clicked');
            navigation.push('WelcomeSignup');
          }}>
          {/* <MaterialIcons name="email" size={24} color="#545760" /> */}
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
        </TouchableOpacity>
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
    flex: 0.4,
  },
  bottom: {
    flex: 0.6,
    width: windowWidth,
    backgroundColor: '#25453a',
    borderTopEndRadius: 35,
    borderTopLeftRadius: 35,
    paddingTop: 110,
    height: windowHeight * 0.55,
    position: 'absolute',
    bottom: 0,
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flex: 1,
    backgroundColor: '#2a2d35',
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
