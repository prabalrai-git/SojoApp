import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import Axios from './../api/server';
import {windowWidth} from '../helper/usefulConstants';

const GlobalHeader = ({id, isShown = true}) => {
  const navigation = useNavigation();

  const [topic, setTopic] = useState(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await Axios.get(`/topics/${id}`);
        setTopic(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    id && fetchTopic();
  }, [id]);

  return isShown ? (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleWrapper}
        onPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}>
        <Text style={styles.title}>{!topic ? 'All Feed' : topic.name}</Text>
        <Icon
          name="keyboard-arrow-down"
          size={24}
          style={{flex: 1}}
          color="#FEFEFF"
        />
      </TouchableOpacity>
    </View>
  ) : (
    <></>
  );
};

export default GlobalHeader;

const styles = StyleSheet.create({
  container: {
    // paddingRight: 7,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-around',

    flex: 1,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: '#52c080',
    borderRadius: 8,
    marginRight: 10,

    paddingVertical: 6,

    justifyContent: 'space-around',

    width: windowWidth * 0.36,
  },
  title: {
    fontSize: 14,
    color: '#D5EEDF',
    // marginRight: 5,
    fontWeight: 'bold',
    flex: 3,
  },
});
