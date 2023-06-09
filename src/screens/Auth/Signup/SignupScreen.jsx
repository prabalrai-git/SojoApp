import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from './../../../api/server';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SignupScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        navigation.push('Verify', {
          email,
        });
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
      <View style={styles.container}>
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        <View style={styles.content}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholder="Enter your username"
            />
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Enter your email"
            />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
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
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.checkboxContainer}>
              <MaterialIcons
                name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
                size={20}
                // color="#000000"
                onPress={() => setRememberMe(!rememberMe)}
              />
              <Text style={styles.checkboxLabel}>
                I agree to Privacy Policy & Terms & Conditions
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (!loading) {
                  handleSignup();
                }
              }}
              style={styles.loginButton}>
              {loading ? (
                <ActivityIndicator style={styles.loginText} color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginText}>Continue</Text>
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
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    width: '80%',
    maxWidth: 400,
    marginTop: 100,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#919298',
    fontWeight: 'bold',
  },
  input: {
    // height: 40,
    borderColor: '#CDCFD3',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    paddingVertical: 10,
    // paddingLeft: 5,
    color: '#000000',
  },
  inputContainer: {
    marginVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  iconWrapper: {
    padding: 10,
  },
  passwordInput: {
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
    justifyContent: 'center',
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
