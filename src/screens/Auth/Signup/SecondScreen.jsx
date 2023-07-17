import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SecondScreen = ({navigation}) => {
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
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />

      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={'white'} />

        <View style={styles.content}>
          <Image
            source={require('./../../../assets/second_signup.png')}
            style={styles.image}
          />
          <Text style={styles.text}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro
            quaerat dolorem quis blanditiis et id harum beatae. Officia, iure
            facilis?
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <MaterialIcons
            name="chevron-left"
            size={30}
            color="#000"
            style={styles.left}
            onPress={() => {
              navigation.navigate('WelcomeSignup');
            }}
          />
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              navigation.push('ThirdSignupScreen');
            }}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SecondScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: '#26B160',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flex: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  left: {
    flex: 4,
  },
});
