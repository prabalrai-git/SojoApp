import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Axios from './../api/server';

const AddtopicsRegister = ({item, config}) => {
  const [loading, setLoading] = useState(false);

  return (
    <TouchableOpacity style={styles.link} key={item.id}>
      <Text style={styles.linkTitle}>{item.name}</Text>

      <Icon
        name={loading ? 'check' : 'plus'}
        size={26}
        color="#6B6F76"
        style={styles.linkIcon}
        onPress={async () => {
          setLoading(!loading);
          try {
            await Axios.patch(`/users/profile/topic/${item.id}`, {}, config);
            setLoading(true);
          } catch (error) {
            console.log(error);
          }
          //   fetchProfile();
        }}
      />
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
