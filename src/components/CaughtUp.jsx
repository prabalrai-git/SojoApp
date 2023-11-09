import React from 'react';
import {Image, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

function CaughtUp() {
  const darkMode = useSelector(state => state.darkMode.value);

  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: darkMode ? global.backgroundColorDark : '#F3F4F7',
        paddingVertical: 15,
        elevation: 1,
        marginTop: -20,
      }}>
      <Image
        source={require('../assets/caughtup.png')}
        style={{width: 40, height: 40, resizeMode: 'contain', marginBottom: 10}}
      />
      <Text
        style={{
          color: darkMode ? 'white' : 'black',
          fontWeight: 'bold',
          fontSize: 15,
        }}>
        Congratulations on finishing your daily news feed!
      </Text>
      <Text
        style={{
          color: darkMode ? 'white' : 'black',
          fontWeight: 'bold',
          marginTop: 5,
          fontSize: 15,
        }}>
        Discover more in our Explore Feed.
      </Text>
    </View>
  );
}

export default CaughtUp;
