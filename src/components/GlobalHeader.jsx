import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import Axios from './../api/server';
import {windowWidth} from '../helper/usefulConstants';
import {useSelector} from 'react-redux';

const GlobalHeader = ({id, isShown = true}) => {
  const navigation = useNavigation();

  const [topic, setTopic] = useState(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await Axios.get(`/topics/${id}`);
        setTopic(res.data.data);
      } catch (err) {}
    };
    id && fetchTopic();
  }, [id]);

  const darkMode = useSelector(state => state.darkMode.value);

  return isShown ? (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkMode
            ? global.brandColorLightDark
            : brandColorLight,
        },
      ]}>
      <TouchableOpacity
        style={styles.titleWrapper}
        onPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}>
        <Text style={styles.title}>{!topic ? 'All Feed' : topic.name}</Text>
        <Icon
          name="keyboard-arrow-down"
          size={24}
          // style={{flex: 1}}
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
    paddingVertical: 6,
    paddingRight: 7,
    paddingLeft: 13,
    backgroundColor: '#53C180',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 8,
    // flex: 1,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    // width: windowWidth * 0.36,
  },
  title: {
    fontSize: 14,
    color: '#D5EEDF',
    // marginRight: 3,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
