import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';

import Card from './../components/Card';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../components/SearchBar/SearchBar';
import GlobalHeader from '../components/GlobalHeader';
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../redux/features/HideTabBar';

const HomeScreen = ({navigation}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [config, setConfig] = useState(null);

  const [profile, setProfile] = useState();

  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(showTabBar());
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (config) {
      fetchProfile();
    }
  }, [config]);

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
      const res = await Axios.get(
        `/users/news/global?page=${page}&id=${profile?.id}`,
        config,
      );
      const newData = res.data.data;
      blogs.length > 0
        ? setBlogs(prevData => {
            const filteredData = prevData.filter(item => {
              // return console.log(item.id,'from fiilter explore');
              return !newData.some(newItem => newItem.id === item.id);
            });
            return [...filteredData, ...newData];
          })
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
    return <Card item={item} key={item.id} />;
  });

  const renderItem = ({item}) => {
    return <BlogItem key={item.id} item={item} navigation={navigation} />;
  };
  const darkMode = useSelector(state => state.darkMode.value);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: darkMode ? global.brandColorDark : global.brandColor,
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: darkMode
            ? global.backgroundColorDark
            : global.backgroundColor,
        }}>
        <StatusBar backgroundColor={'#27B161'} />
        <View>
          <View style={styles.topBar}>
            <Text style={styles.title}>Explore</Text>
            <GlobalHeader />
          </View>
          <SearchBar />
          <View style={{marginBottom: 288}}>
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
        </View>
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
    backgroundColor: '#27B161',
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
