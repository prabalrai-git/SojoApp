import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({navigation}) => {
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
    <SafeAreaView style={styles.container}>
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
      <View style={styles.buttonContainer}>
        <MaterialIcons
          name="chevron-left"
          size={30}
          color="#000"
          style={styles.left}
          onPress={() => {
            navigation.navigate('MainScreen');
          }}
        />
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            navigation.push('OptionsLogin');
          }}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

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
