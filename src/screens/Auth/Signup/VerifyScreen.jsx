import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from './../../../api/server';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const VerifyScreen = ({navigation, route}) => {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await Axios.post(`/auth/verify`, {
        token,
      });
      await AsyncStorage.setItem('token', response.data.data.token);
      navigation.reset({index: 0, routes: [{name: 'InfoScreen'}]});
    } catch (error) {
      setLoading(false);
      console.error(error);
      error &&
        error.response &&
        error.response.data &&
        setErrorMessage(error.response.data.err);
      // handle login error, e.g. display error message
    }
  };

  // hide error message
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  const resend = async () => {
    setResendLoading(true);
    try {
      const res = await Axios.post('/auth/resend', {
        email: route.params.email,
      });
      if (res.status === 200) {
        setResendLoading(false);
        Alert.alert('Token sent successfully !');
        // toast.success('Resent verification token', {
        //   theme: 'colored',
        // });
      }
    } catch (err) {
      setResendLoading(false);
      setErrorMessage(err.response.data.err);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        <View style={styles.content}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Text style={styles.label}>Token</Text>
            <TextInput
              value={token}
              onChangeText={setToken}
              style={styles.input}
              placeholder="Enter the token"
            />

            <TouchableOpacity
              onPress={() => {
                if (!resendLoading) {
                  resend();
                }
              }}>
              {resendLoading ? (
                <ActivityIndicator />
              ) : (
                <Text>Resend Token</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!loading) {
                  handleSubmit();
                }
              }}
              style={styles.loginButton}>
              {loading ? (
                <ActivityIndicator style={styles.loginText} />
              ) : (
                <Text style={styles.loginText}>Verify</Text>
              )}
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
                style={styles.loginButtonIcon}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
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

export default VerifyScreen;
