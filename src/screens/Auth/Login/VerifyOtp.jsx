import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CreateProfileHeader from '../../../components/CreateProfileHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {windowWidth} from '../../../helper/usefulConstants';

const VerifyOtp = ({navigation}) => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [resendCount, setResendCount] = useState(60);
  const [resendDisabled, setresendDisabled] = useState(true);

  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setResendCount(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (resendCount <= 0) {
      clearInterval(timerRef.current);
      setresendDisabled(false);
    }
  }, [resendCount]);

  return (
    <>
      <StatusBar backgroundColor={'#f3f4f7'} />
      <SafeAreaView style={{flex: 1, backgroundColor: '#f3f4f7'}}>
        <CreateProfileHeader />
        <Text
          style={{
            color: 'black',
            paddingHorizontal: 20,
            paddingLeft: 33,
            fontSize: 16,
            textAlign: 'left',
            marginTop: 10,
            fontWeight: '500',
            marginBottom: 20,
          }}>
          We have sent you the OTP code to your email address.
        </Text>
        <View style={{paddingHorizontal: 30}}>
          <Text style={styles.label}>OTP Code</Text>
          {/* <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            placeholder="Enter your email address.."
          /> */}
          <OTPInputView
            style={{
              width: '100%',
              height: 50,
              backgroundColor: 'white',
              color: '#50d9a7',
            }}
            pinCount={5}
            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            // onCodeChanged = {code => { this.setState({code})}}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              console.log(`Code is ${code}, you are good to go!`);
            }}
          />
          <Text style={{color: 'grey', marginVertical: 10}}>
            Resend code after{' '}
            <Text style={{color: 'black', fontWeight: 'bold '}}>
              {resendCount}
            </Text>{' '}
            seconds?
          </Text>
          {!resendDisabled && (
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                borderColor: '#b3e0bd',
                borderWidth: 2,
                width: 115,
                borderRadius: 6,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#176a3a',
                  padding: 10,
                  fontWeight: '500',
                }}>
                Resend Code
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChangePassword');
              // if (!loading) {
              //   handleSignup();
              // }
            }}
            style={styles.loginButton}>
            {loading ? (
              <ActivityIndicator style={styles.loginText} color="#fff" />
            ) : (
              <>
                <Text style={styles.loginText}>Verify OTP</Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={20}
                  color="#FFFFFF"
                  style={styles.loginButtonIcon}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#34d399',
  },

  underlineStyleBase: {
    width: windowWidth * 0.17,
    height: 55,
    borderWidth: 2,
    // borderBottomWidth: 2,
  },

  underlineStyleHighLighted: {
    borderColor: '#34d399',
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
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: 'black',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  input: {
    // height: 40,
    borderColor: '#CDCFD3',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    paddingVertical: 10,
    backgroundColor: 'lightgrey',
    // paddingLeft: 5,
    color: '#000000',
  },
});
