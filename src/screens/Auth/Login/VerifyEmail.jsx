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
import React, {useState} from 'react';
import CreateProfileHeader from '../../../components/CreateProfileHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const VerifyEmail = ({navigation}) => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);

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
            marginTop: 20,
            fontWeight: '500',
            marginBottom: 25,
          }}>
          Please type in your email address to recover your account.
        </Text>
        <View style={{paddingHorizontal: 30}}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            placeholder="Enter your email address.."
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('VerifyOtp');
              // if (!loading) {
              //   handleSignup();
              // }
            }}
            style={styles.loginButton}>
            {loading ? (
              <ActivityIndicator style={styles.loginText} color="#fff" />
            ) : (
              <>
                <Text style={styles.loginText}>Verify Email Address</Text>
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

export default VerifyEmail;

const styles = StyleSheet.create({
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
});
