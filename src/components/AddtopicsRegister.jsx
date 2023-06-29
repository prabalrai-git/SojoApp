import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Axios from './../api/server';

const AddtopicsRegister = ({item, config, setNewTopicAdded, userTopics}) => {
  const [loading, setLoading] = useState(false);

  console.log(item);

  const filtered = userTopics.filter(topic => topic.id === item.id);
  // console.log(filtered[0].id, 'mfmfmfmf');

  return (
    <TouchableOpacity style={styles.link} key={item.id}>
      <Text style={styles.linkTitle}>{item.name}</Text>
      {filtered[0]?.id ? (
        <Icon
          name={loading ? 'loader' : 'check'}
          size={26}
          color="#6B6F76"
          style={[styles.linkIcon, {backgroundColor: '#27B060', color: '#fff'}]}
          onPress={async () => {
            setLoading(true);
            try {
              await Axios.patch(`/users/profile/topic/${item.id}`, {}, config);
              setNewTopicAdded(prev => !prev);
              setLoading(false);
            } catch (error) {
              console.log(error);
            }
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
            try {
              await Axios.patch(`/users/profile/topic/${item.id}`, {}, config);
              setNewTopicAdded(prev => !prev);
              setLoading(false);
            } catch (error) {
              console.log(error);
            }
          }}
        />
      )}

      {/* <Icon
        name={filtered[0]?.id ? 'check' : 'plus'}
        size={26}
        color="#6B6F76"
        style={styles.linkIcon}
        onPress={async () => {
          setLoading(!loading);
          try {
            await Axios.patch(`/users/profile/topic/${item.id}`, {}, config);
            setNewTopicAdded(prev => !prev);
            setLoading(true);
          } catch (error) {
            console.log(error);
          }
          //   fetchProfile();
        }}
      /> */}
    </TouchableOpacity>
  );
};

export default AddtopicsRegister;

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#f3f4f7',
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
});
