import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from './../../../api/server';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  const handleLogin = async () => {
    try {
      const response = await Axios.post(`/auth/login`, {
        email,
        password,
      });

      const {token} = response.data.data;
      await AsyncStorage.setItem('token', token);
      navigation.reset({index: 0, routes: [{name: 'AuthHome'}]});
      // handle successful login, e.g. redirect to home screen
    } catch (error) {
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
  };

  const handleForgotPassword = () => {
    // handle forgot password logic
  };

  return (
    <>
      <StatusBar backgroundColor={'#f3f4f7'} />
      <View style={styles.container}>
        <Image
          source={require('../../../assets/logo.png')}
          style={[
            styles.signupIcon,
            {
              width: 200,
              height: 100,
              resizeMode: 'contain',
              tintColor: '#12ab51',
            },
          ]}
        />
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        <View style={styles.content}>
          <Text style={styles.label}>EMAIL</Text>
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

          {/* <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} />
          </TouchableOpacity> */}
          {/* <View style={styles.checkboxContainer}>
            <MaterialIcons
              name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
              size={20}
              // color="#000000"
              onPress={() => setRememberMe(!rememberMe)}
            />
            <Text style={styles.checkboxLabel}>Remember me</Text>
          </View> */}
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginText}>Sign in</Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
              style={styles.loginButtonIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('VerifyEmail')}
            style={styles.forgotPasswordBtn}>
            <Text style={[styles.loginText, {color: '#5eb87b'}]}>
              Forgot Password
            </Text>
            <FontAwesome
              name="question"
              size={20}
              color="#5eb87b"
              style={styles.loginButtonIcon}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -150} // adjust as needed
        >
          <TouchableOpacity style={styles.bottomContainer}>
            <Text style={[styles.forgotPassword, {color: '#176a3a'}]}>
              Create Account
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
              style={[styles.loginButtonIcon, {color: '#5eb87b'}]}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f3f4f7',
  },
  content: {
    width: '80%',
    maxWidth: 400,
    marginTop: 100,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: 'black',
    fontWeight: '500',
  },
  input: {
    // height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    paddingVertical: 10,

    // paddingLeft: 5,
    color: 'black',
  },
  inputContainer: {
    marginVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  iconWrapper: {
    padding: 10,
    backgroundColor: 'white',
  },
  passwordInput: {
    backgroundColor: 'white',
    borderColor: 'white',
    color: 'black',

    flex: 1,
    paddingVertical: 10,
    paddingLeft: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 8,
    color: '#919298',
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
    backgroundColor: '#12ab51',
  },

  forgotPasswordBtn: {
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButtonIcon: {
    marginLeft: 10,
    marginTop: 1,
  },
  errorMessage: {
    color: 'white',
    // marginTop: 10,
    fontSize: 14,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    width: '80%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#5eb87b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
