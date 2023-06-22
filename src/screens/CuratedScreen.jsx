import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  Button,
} from 'react-native';

import Card from './../components/Card';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../components/SearchBar/SearchBar';
import HomeHeader from './../components/HomeHeader';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState(null);

  // console.log(reload, 'yoyoyoyoyoyoy');

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     StatusBar.setBackgroundColor('#27B161');
  //   }, 1); // set a small delay here (in milliseconds)

  //   return () => clearTimeout(timeout);
  // }, [isFocused]);

  // const isFocused = useIsFocused();

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
  // fetch profile
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

  // fetch user news
  const fetchNews = async () => {
    try {
      const res = await Axios.get(
        `/users/news?page=${page}&id=${profile?.id}`,
        config,
      );
      // return console.log(res.data.data);
      news.length > 0
        ? setNews(prevData => [...prevData, ...res.data.data])
        : setNews(res.data.data);
      setLoading(false);
      setHasMore(res.data.pagination.nextPage !== null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    config && fetchNews(page);
  }, [config, page, profile]);

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

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

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: '#27B060'}} />
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#27B060" />
        <View style={styles.topBar}>
          <Text style={styles.title}>My Feed</Text>
          <HomeHeader />
        </View>
        <SearchBar />
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.5}
          showsHorizontalScrollIndicator={false}
          onEndReached={handleLoadMore}
          refreshing={page === 1 && loading}
          onRefresh={() => {
            setPage(1);
            setNews([]);
            navigation.replace('Curated');
          }}
        />
      </SafeAreaView>
    </>
  );
};

HomeScreen.navigationOptions = {
  header: null,
};

export default HomeScreen;

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#27B060',
    // height: 50,
    // alignItems: 'center',
    padding: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    flex: 2,
    fontWeight: 'bold',
  },
});
