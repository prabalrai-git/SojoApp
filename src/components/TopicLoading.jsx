import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Axios from './../api/server';

const TopicLoading = ({item, selectedTopics, config, fetchProfile}) => {
  const [loading, setLoading] = useState('');
  return (
    <TouchableOpacity style={styles.link}>
      <Text style={styles.linkTitle}>{item.name}</Text>
      {selectedTopics?.includes(item.id) ? (
        <Icon
          name={loading ? 'loader' : 'check'}
          size={26}
          color="#6B6F76"
          style={[styles.linkIcon, {backgroundColor: '#27B060', color: '#fff'}]}
          onPress={async () => {
            setLoading(true);
            await Axios.patch(`/users/profile/topic/${item.id}`, {}, config);
            fetchProfile();
            setLoading(false);
          }}
        />
      ) : (
        <Icon
          name={loading ? 'loader' : 'plus'}
          size={26}
          color="#6B6F76"
          style={styles.linkIcon}
          onPress={async () => {
            setLoading(true);
            await Axios.patch(`/users/profile/topic/${item.id}`, {}, config);
            fetchProfile();
            setLoading(false);
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default TopicLoading;

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  linkTitle: {
    color: '#4B4D54',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 15,
    flex: 1,
  },
  linkIcon: {
    borderLeftWidth: 1,
    borderLeftColor: '#DEE1E5',
    padding: 17,
    paddingLeft: 20,
  },
  topBar: {
    backgroundColor: '#27B060',
    padding: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#919298',
    paddingLeft: 0,
    paddingVertical: 8,
  },
});
