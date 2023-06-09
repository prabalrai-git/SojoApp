import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OptionsScreen = ({navigation}) => {
  useEffect(() => {
    const checkIsLoggedIn = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.replace('AuthHome');
      }
    };
    navigation && checkIsLoggedIn();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('./../../../assets/ion_earth-outline.png')}
          style={styles.image}
        />
        <Text style={styles.text}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro
          quaerat dolorem quis blanditiis et id harum beatae. Officia, iure
          facilis?
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button}>
          <FontAwesome name="google" size={24} color="#545760" />
          <Text style={styles.buttonText}>Login with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.push('Login');
          }}>
          <MaterialIcons name="email" size={24} color="#545760" />
          <Text style={styles.buttonText}>Login with Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// OptionsScreen.navigationOptions = {
//   tabBarVisible: false,
// };

export default OptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    width: '90%',
    color: '#545760',
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 13,
    backgroundColor: '#E7E7E8',
    borderRadius: 8,
    // elevation: 1,
    // borderWidth: 1,
    // borderColor: '',

    marginBottom: 20,
  },

  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#545760',
  },
});
