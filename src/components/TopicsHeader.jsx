import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const HomeHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleWrapper}
        onPress={() => {
          navigation.navigate('EditTopicsScreen');
        }}>
        <Icon name="edit" size={18} color="#FEFEFF" style={{marginTop: 2}} />
        <Text style={styles.title}>Edit Topics</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingRight: 7,
    paddingLeft: 7,
    backgroundColor: '#52c080',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    flex: 1.1,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: '#D5EEDF',
    marginLeft: 10,
    flex: 3,
    fontWeight: 'bold',
  },
});
