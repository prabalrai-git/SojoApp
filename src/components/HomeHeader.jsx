import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
import Axios from './../api/server';
import {DrawerActions, useNavigation} from '@react-navigation/native';

const HomeHeader = ({id, isShown = true}) => {
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
          color="#FEFEFF"
          size={24}
          style={{flex: 1}}
        />
      </TouchableOpacity>
    </View>
  ) : (
    <></>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    // paddingRight: 7,
    paddingLeft: 13,
    backgroundColor: '#53C180',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    flex: 1.3,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: '#D5EEDF',
    // marginRight: 3,
    fontWeight: 'bold',
    flex: 3,
  },
});
