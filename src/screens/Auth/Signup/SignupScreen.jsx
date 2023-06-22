import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from './../../../api/server';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {windowWidth} from '../../../helper/usefulConstants';
import CreateProfileHeader from '../../../components/CreateProfileHeader';
import {CheckBox} from 'react-native-elements';
import {log} from 'react-native-reanimated';

const SignupScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber, setPhonenumber] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  const handleSignup = async () => {
    try {
      if (rememberMe) {
        setLoading(true);

        const response = await Axios.post(`/auth/signup`, {
          username,
          email,
          password,
        });

        const {token} = response.data.data;
        // navigation.reset({index: 0, routes: [{name: 'AuthHome'}]});
        navigation.navigate('InfoScreen');
        setLoading(false);
      } else {
        setErrorMessage('You have to agree to our terms and conditions');
      }
      // handle successful login, e.g. redirect to home screen
    } catch (error) {
      console.error(error);
      error &&
        error.response &&
        error.response.data &&
        setErrorMessage(error.response.data.err);
      // handle login error, e.g. display error message
      setLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  return (
    <>
      <SafeAreaView
        style={{flex: 1, backgroundColor: '#f3f4f7', position: 'relative'}}>
        <StatusBar backgroundColor={'#f3f4f7'} />
        <ScrollView>
          <CreateProfileHeader />

          <Text
            style={{
              color: 'black',
              paddingHorizontal: 20,
              paddingLeft: 39,
              fontSize: 16,
              textAlign: 'left',
              marginTop: 30,
              fontWeight: '500',
            }}>
            Get personalized news stories every day. Create a free account now.
          </Text>
          <View style={styles.container}>
            {errorMessage && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            <View style={styles.content}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Text style={styles.label}>USERNAME</Text>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  placeholder="Enter your username"
                />
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="Enter your email"
                />
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={toggleShowPassword}
                      style={styles.iconWrapper}>
                      <FontAwesome
                        name={showPassword ? 'eye' : 'eye-slash'}
                        size={20}
                        color={'grey'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* <Text style={styles.label}>PHONE NUMBER</Text>
                <TextInput
                  value={phonenumber}
                  onChangeText={setPhonenumber}
                  style={styles.input}
                  placeholder="Enter your phone number"
                /> */}

                <View style={styles.checkboxContainer}>
                  <MaterialIcons
                    name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
                    size={25}
                    color="#000000"
                    onPress={() => setRememberMe(!rememberMe)}
                  />

                  <Text style={styles.checkboxLabel}>
                    I agree to{' '}
                    <Text style={{color: '#61c17f'}}> Privacy Policy</Text> &
                    <Text style={{color: '#61c17f'}}> Terms & Conditions</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    handleSignup();
                    // navigation.navigate('InfoScreen');
                    // if (!loading) {
                    //   handleSignup();
                    // }
                  }}
                  style={styles.loginButton}>
                  {loading ? (
                    <ActivityIndicator style={styles.loginText} color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.loginText}>Create Account</Text>
                      <MaterialIcons
                        name="arrow-forward"
                        size={20}
                        color="#FFFFFF"
                        style={styles.loginButtonIcon}
                      />
                    </>
                  )}
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    width: windowWidth,
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 6,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    // alignItems: 'flex-start',
    // backgroundColor: 'red',
  },
  container: {
    // flex: 1,
    alignItems: 'center',
    // position: 'relative',
  },
  content: {
    width: '80%',
    maxWidth: 400,
    marginTop: 25,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: 'black',
    fontWeight: '400',
  },
  input: {
    // height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    paddingVertical: 10,
    backgroundColor: 'white',
    // paddingLeft: 5,
    color: '#000000',
  },
  inputContainer: {
    marginVertical: 10,
    // backgroundColor: 'lightgrey',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  iconWrapper: {
    padding: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 5,
    backgroundColor: 'white',
    color: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
    color: 'black',
    paddingRight: 15,
    lineHeight: 18,
    marginTop: 10,
  },
  loginButton: {
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#26B160',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginButtonIcon: {
    marginLeft: 10,
    marginTop: 1,
  },
  errorMessage: {
    color: '#000000',
    marginTop: 10,
    fontSize: 14,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CDCFD3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
});

export default SignupScreen;
