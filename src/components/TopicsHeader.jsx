import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {windowWidth} from '../helper/usefulConstants';
import {useSelector} from 'react-redux';

const HomeHeader = () => {
  const navigation = useNavigation();

  const darkMode = useSelector(state => state.darkMode.value);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkMode
            ? global.brandColorLightDark
            : global.brandColorLight,
        },
      ]}>
      <TouchableOpacity
        style={[
          styles.titleWrapper,
          {
            backgroundColor: darkMode
              ? global.brandColorLightDark
              : global.brandColorLight,
          },
        ]}
        onPress={() => {
          navigation.navigate('EditTopicsScreen');
        }}>
        <Icon
          name="edit"
          size={18}
          color="#FEFEFF"
          style={{marginTop: 2, marginRight: 6}}
        />
        <Text
          style={[
            styles.title,
            {
              backgroundColor: darkMode
                ? global.brandColorLightDark
                : global.brandColorLight,
            },
          ]}>
          Edit Topics
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingRight: 7,
    paddingLeft: 13,
    backgroundColor: '#53C180',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 8,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    color: '#D5EEDF',
    // marginRight: 3,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
