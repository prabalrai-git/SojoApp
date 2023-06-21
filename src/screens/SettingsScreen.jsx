import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {logoutUser} from './../helper/auth';
import {useNavigation} from '@react-navigation/native';
import {PRIMARY_COLOR, windowWidth} from '../helper/usefulConstants';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlogCard from '../components/Card';
import {useSelector} from 'react-redux';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [news, setNews] = useState();
  const [page, setPage] = useState(1);
  const [config, setConfig] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [profile, setProfile] = useState();
  const [renderBookmarked, setRenderBookmarked] = useState(false);

  const [loading, setLoading] = useState(true);
  const reload = useSelector(state => state.reloadNews.value);

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    fetchNews();
  }, [config, renderBookmarked, profile, reload]);

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

  const fetchProfile = async () => {
    try {
      const res = await Axios.get('/users/profile', config);

      if (!res.data.data.isComplete) {
        // return navigation.navigate('Auth', {screen: 'InfoScreen'});
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

  const fetchNews = async () => {
    try {
      const res = await Axios.post(
        '/users/bookmarks/getBookmarkedNews',
        {userId: profile?.id},
        config,
      );

      // return console.log('this is the log', res.data.bookmarkedNews);
      // console.log(res.data.bookmarkedNews, '111111111111111111111111111111');

      setNews(res.data.bookmarkedNews);
      setLoading(false);
      setHasMore(res.data.pagination?.nextPage !== null);
      // if (news.length > 0) {
      // }
      // ? setNews(prevData => [...prevData, ...res.data.bookmarkedNews])
      // :
    } catch (err) {
      console.log(err);
      setNews();
    }
  };

  // useEffect(() => console.log(news, 'this updated news'), [news]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     StatusBar.setBackgroundColor('#27B161');
  //   }, 1); // set a small delay here (in milliseconds)

  //   return () => clearTimeout(timeout);
  // }, [navigation]);

  const BlogItem = React.memo(({item, navigation}) => {
    return (
      <BlogCard
        item={item}
        navigation={navigation}
        profile={profile}
        key={item?.id}
        fromBookmarks={true}
        setRenderBookmarked={setRenderBookmarked}
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
    } else {
      setLoading(false);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" style={{marginVertical: 20}} />;
  };

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: '#27B060'}} />

      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>My Profile</Text>

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('ProfileSettings')}>
            <Image
              source={require('../assets/settings.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                tintColor: 'white',
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </View>

        {/* start of content/ body */}

        <ScrollView>
          <View
            style={{paddingHorizontal: 15, marginTop: 10, marginBottom: -15}}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: 22,
                textTransform: 'capitalize',
              }}>
              {profile?.username}
            </Text>
            <Text style={{color: 'grey', marginBottom: 15}}>
              {/* {profile?.occupation} */}
            </Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnTxt}>Choose Your Topics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnTxt}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',
                backgroundColor: 'lightgrey',
                height: 1,
                marginBottom: 20,
              }}></View>
            {news && (
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>
                Saved stories
              </Text>
            )}
          </View>

          {news ? (
            news?.map(item => {
              return (
                <>
                  <BlogItem item={item} navigation={navigation} />
                </>
              );
            })
          ) : (
            <View>
              <Text
                style={{
                  color: 'black',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginTop: 40,
                }}>
                No Any Bookmarks!!
              </Text>
            </View>
          )}
          {/* <FlatList
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
        /> */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  btnTxt: {
    textAlign: 'center',
    color: '#1d6e3f',
    fontWeight: 'bold',
  },
  iconContainer: {
    backgroundColor: '#53C180',
    paddingHorizontal: 10,
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  btn: {
    // backgroundColor: '#296146',
    width: '49%',
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
    borderColor: '#b3e0bd',
    borderWidth: 2,
  },
  btnContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  topBarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
  },
  topBar: {
    backgroundColor: PRIMARY_COLOR,
    padding: 20,
    paddingVertical: 13.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
  },
});
