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
import {useSelector} from 'react-redux';
const CreateProfileHeader = ({chooseTopics}) => {
  const navigation = useNavigation();
  const darkMode = useSelector(state => state.darkMode.value);

  return (
    <SafeAreaView
      style={[
        styles.header,
        {
          backgroundColor: darkMode
            ? global.backgroundColorDark
            : global.backgroundColor,
          // backgroundColor: 'red',
        },
      ]}>
      {!chooseTopics && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 10,
            alignSelf: 'center',
            position: 'absolute',
            left: 10,
          }}>
          <Image
            source={require('../assets/arrow-left.png')}
            style={{
              tintColor: darkMode ? 'white' : 'black',
              width: 25,
              height: 25,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      )}
      <View style={{alignSelf: 'flex-start'}}>
        <Image
          source={require('../assets/logoline.png')}
          style={{
            width: 160,
            height: 120,
            // marginRight: chooseTopics ? '26%' : '25%',
            resizeMode: 'contain',
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
    justifyContent: 'center',
    marginBottom: 1,
    // alignItems: 'flex-start',
    // backgroundColor: 'red',
  },
});
