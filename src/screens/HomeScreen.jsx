import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';

import Card from './../components/Card';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../components/SearchBar/SearchBar';
import GlobalHeader from '../components/GlobalHeader';

const HomeScreen = ({navigation}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      StatusBar.setBackgroundColor('#27B161');
    }, 1); // set a small delay here (in milliseconds)

    return () => clearTimeout(timeout);
  }, [navigation]);

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

  useEffect(() => {
    // AsyncStorage.removeItem('token');
    if (navigation && !AsyncStorage.getItem('token')) {
      navigation.replace('WelcomeScreen');
    }
  }, [navigation]);

  const fetchBlogs = async () => {
    try {
      const res = await Axios.get(`/users/news/global?page=${page}`, config);
      blogs.length > 0
        ? setBlogs(prevData => [...prevData, ...res.data.data])
        : setBlogs(res.data.data);
      setHasMore(res.data.pagination.nextPage !== null);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    config && fetchBlogs(page);
  }, [config, page]);

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
      setLoading(true);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" style={{marginVertical: 20}} />;
  };

  const BlogItem = React.memo(({item, navigation}) => {
    return <Card item={item} navigation={navigation} key={item.id} />;
  });

  const renderItem = ({item}) => {
    return <BlogItem item={item} navigation={navigation} />;
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Explore</Text>
        <GlobalHeader />
      </View>
      <SearchBar />
      <FlatList
        data={blogs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        refreshing={page === 1 && loading}
        onRefresh={() => {
          setPage(1);
          setBlogs([]);
          navigation.replace('Explore');
        }}
      />
    </View>
  );
};

HomeScreen.navigationOptions = {
  header: null,
};

export default HomeScreen;

const styles = StyleSheet.create({
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
    flex: 2,
  },
});
