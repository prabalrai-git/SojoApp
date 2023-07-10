import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import Card from './../components/Card';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalHeader from '../components/GlobalHeader';
import HomeHeader from '../components/HomeHeader';
import ExploreCard from '../components/CardExplore';
import {useDispatch} from 'react-redux';
import {showTabBar} from '../redux/features/HideTabBar';

const SearchScreen = ({navigation, route}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [config, setConfig] = useState();
  const [profile, setProfile] = useState();

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     StatusBar.setBackgroundColor('#27B060'); // Set the specific color when the screen is focused
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(showTabBar());
    });

    return unsubscribe;
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

  useEffect(() => {
    // AsyncStorage.removeItem('token');
    if (navigation && !AsyncStorage.getItem('token')) {
      navigation.replace('WelcomeScreen');
    }
  }, [navigation]);

  const fetchBlogs = async () => {
    try {
      setBlogs();
      const res = await Axios.get(`/news/search/${route.params.term}?userId=${route.params.profile.id}`);
      setBlogs(res.data.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    route.params.term && fetchBlogs();
  }, [route.params.term]);

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" style={{marginVertical: 20}} />;
  };

  const BlogItem = React.memo(({item, navigation}) => {
    return (
      <ExploreCard
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
    <View style={{flex: 1}}>
      <View style={styles.topBar}>
        <Text style={[styles.title]}>Explore</Text>
        <GlobalHeader isShown={false} />
      </View>
      <SearchBar />
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <Text
              style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: '#171A21',
                textAlign: 'center',
                borderBottomColor: '#ECEDEF',
                borderBottomWidth: 1,
                padding: 15,
              }}>
              Results for "{route.params.term}"
            </Text>
          </View>
        )}
        data={blogs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={renderFooter}
        // onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        // onEndReached={handleLoadMore}
      />
    </View>
  );
};

export default SearchScreen;

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
  },
});
