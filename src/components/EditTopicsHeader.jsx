import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';

const HomeHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleWrapper}
        onPress={() => {
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{name: 'TopicsScreen'}],
          });
          navigation.dispatch(resetAction);
        }}>
        <Icon name="save" size={18} color="#26B160" style={{marginTop: 2}} />
        <Text style={styles.title}>Save Topics</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    // paddingRight: 7,
    paddingLeft: 13,
    backgroundColor: '#FEFEFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    flex: 1,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 13,
    color: '#26B160',
    fontWeight: 'bold',
    flex: 3,
    marginLeft: 10,
  },
});
