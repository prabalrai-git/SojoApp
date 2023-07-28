import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const HomeHeader = () => {
  const navigation = useNavigation();
  const darkMode = useSelector(state => state.darkMode.value);

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={styles.titleWrapper}
        onPress={() => {
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{name: 'TopicsScreen'}],
          });
          navigation.dispatch(resetAction);
        }}>
        <Icon name="save" size={18} color="#26B160" />
        <Text style={styles.title}>Save Topics</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEFEFF',
    paddingVertical: 6,
    paddingRight: 7,
    paddingLeft: 13,
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
    color: '#26B160',
    fontSize: 14,
    // marginRight: 3,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    marginLeft: 5,
  },
});
