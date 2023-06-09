import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import Axios from './../api/server';
import Icon from 'react-native-vector-icons/Feather';

const TopicsScreen = ({navigation}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get('/topics');
        setData(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [navigation]);

  return (
    <ScrollView style={{flex: 1}}>
      <SearchBar />
      <View style={{padding: 20}}>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: '#6B6F76'}}>
          Explore Topics
        </Text>
        <View style={{marginTop: 20}}>
          {data?.map(item => {
            return (
              <TouchableOpacity
                style={styles.item}
                key={item.id}
                onPress={() => {
                  navigation.push('Category', {
                    id: item.id,
                  });
                }}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Icon name="arrow-right" size={22} color="#3E424B" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default TopicsScreen;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CDCFD3',
    padding: 15,
    marginBottom: 15,
    borderBottomColor: '#CDCFD3',
    borderBottomWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E424B',
    flex: 3,
  },
});
