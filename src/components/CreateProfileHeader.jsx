import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {windowWidth} from '../helper/usefulConstants';
const CreateProfileHeader = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.popToTop()}
        style={{
          padding: 10,
          alignSelf: 'center',
        }}>
        <Image
          source={require('../assets/arrow-left.png')}
          style={{
            tintColor: 'black',
            width: 25,
            height: 25,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
      <View style={{alignSelf: 'flex-start'}}>
        <Image
          source={require('../assets/logo.png')}
          style={{
            tintColor: 'black',
            width: 150,
            height: 50,
            marginRight: '25%',
            resizeMode: 'contain',
            tintColor: '#27b060',
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateProfileHeader;

const styles = StyleSheet.create({
  header: {
    width: windowWidth,
    backgroundColor: '#f3f4f7',
    flexDirection: 'row',
    padding: 6,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    marginBottom: 10,
    // alignItems: 'flex-start',
    // backgroundColor: 'red',
  },
});
