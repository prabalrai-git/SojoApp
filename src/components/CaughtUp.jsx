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
          textTransform: 'capitalize',
          fontWeight: 'bold',
          fontSize: 15,
        }}>
        Congratulations !! you are done for the day.
      </Text>
    </View>
  );
}

export default CaughtUp;
