import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Axios from './../api/server';
import Card from './../components/Card';
import {useNavigation, useRoute} from '@react-navigation/native';
import HomeHeader from '../components/HomeHeader';
import SearchBar from '../components/SearchBar/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Category = () => {
  const [data, setData] = useState([]);
  const [topic, setTopic] = useState(null);
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const fetchData = async page => {
    try {
      const res = await Axios.get(
        `/news/categories/${route.params.id}?page=${page}&userId=${profile?.id}`,
        // config,
      );

      // return console.log(res.data.data);
      setData(prevData => [...prevData, ...res.data.data]);
      setHasMore(res.data.pagination.nextPage !== null);
      setLoading(false);
    } catch (err) {
      console.log(err);
      if (err.response.status === 404) {
        navigation.replace('Home');
      }
    }
  };

  // fetch single topic
  const fetchTopic = async () => {
    try {
      const res = await Axios.get(`/topics/${route.params.id}`);
      setTopic(res.data.data);
    } catch (err) {
      console.log(err);
      if (err.response.status === 404) {
        navigation.replace('Home');
      }
    }
  };

  useEffect(() => {
    fetchTopic();
  }, []);

  useEffect(() => {
    if (topic && profile) {
      if (page === 1) {
        setData([]);
      }
      fetchData(page);
    }
  }, [topic, page, route.params.id, profile]);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const config = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };

        setConfig(config);
      }
    };
    fetchToken();
  }, []);
  const fetchProfile = async () => {
    try {
      const res = await Axios.get('/users/profile', config);

      if (!res.data.data.isComplete) {
        return navigation.navigate('Auth', {screen: 'InfoScreen'});
      }
      setProfile(res.data.data);
    } catch (err) {
      console.log(err);
      if (err && err.response && err.response.status === 401) {
        logout();
        setProfile(null);
        // return router.replace('/');
      }
    }
  };
  useEffect(() => {
    if (config) {
      fetchProfile();
    }
  }, [config]);

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" style={{marginVertical: 20}} />;
  };

  const BlogItem = React.memo(({item, navigation}) => {
    return (
      <Card
        item={item}
        navigation={navigation}
        key={item.id}
        profile={profile}
      />
    );
  });

  const renderItem = ({item}) => {
    return <BlogItem item={item} navigation={navigation} />;
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
      setLoading(true);
    }
  };

  return topic ? (
    <View style={{flex: 1}}>
      <View style={styles.topBar}>
        <Text style={styles.title}>My Feed</Text>
        {route.params && route.params.id ? (
          <HomeHeader id={route.params.id} />
        ) : (
          <HomeHeader />
        )}
      </View>
      <SearchBar />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        refreshing={page === 1 && loading}
        onRefresh={() => {
          navigation.replace('CategoryScreen', {
            id: route.params.id,
          });
        }}
      />
    </View>
  ) : (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#6B6F76" />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#26B160',
    padding: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 2,
  },
});
