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
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ChangePassword = ({navigation}) => {
  const [newPassword, setNewPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#f3f4f7'}}>
        <StatusBar backgroundColor={'#f3f4f7'} />
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
            marginBottom: 35,
          }}>
          Congratulations, your email has been verified! You can now set a new
          password.
        </Text>
        <View style={{paddingHorizontal: 30}}>
          <Text style={styles.label}>NEW PASSWORD</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              style={styles.passwordInput}
              placeholder="Enter your new password"
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

          <Text style={{color: 'grey', marginBottom: 10}}>
            Your password should be at least 8 characters long and consist of
            alphabets, numbers and special characters. Spaces are not allowed.
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login');
              // if (!loading) {
              //   handleSignup();
              // }
            }}
            style={styles.loginButton}>
            {loading ? (
              <ActivityIndicator style={styles.loginText} color="#fff" />
            ) : (
              <>
                <Text style={styles.loginText}>Upadate Password</Text>
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

export default ChangePassword;

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 5,
    backgroundColor: 'white',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginBottom: 5,
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
