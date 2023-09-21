import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Axios from './../api/server';
import Card from './../components/Card';
import {useNavigation, useRoute} from '@react-navigation/native';
import GlobalHeader from '../components/GlobalHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../redux/features/HideTabBar';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {FlashList} from '@shopify/flash-list';

const Category = () => {
  const [data, setData] = useState([]);
  const [topic, setTopic] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [profile, setProfile] = useState();
  const [config, setConfig] = useState();
  const [isGuest, setIsGuest] = useState(false);
  const [adMobIds, setAdMobIds] = useState();
  const [adInterval, setAdInterval] = useState();

  const route = useRoute();

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(showTabBar());
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    getUserType();
    getAdMobIdsFromFireStore();
    getBannerAdsIntervalFromFireStore();
  }, []);

  const getUserType = async () => {
    await AsyncStorage.getItem('guestUser').then(value => {
      const data = JSON.parse(value);
      setIsGuest(Boolean(data));
    });
  };

  const getBannerAdsIntervalFromFireStore = async () => {
    try {
      const interval = await firestore().collection('bannerAdsInterval').get();

      setAdInterval(interval.docs[0]._data.Interval);
    } catch (error) {}
  };

  const getAdMobIdsFromFireStore = async () => {
    try {
      const ApIds = await firestore().collection('adMobIds').get();

      setAdMobIds(ApIds.docs);
    } catch (error) {}
  };

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     StatusBar.setBackgroundColor('#27B060'); // Set the specific color when the screen is focused
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const fetchData = async page => {
    try {
      const res = await Axios.get(
        `/news/categories/${route.params.id}?page=${page}&userId=${profile.id}&limit=22`,
        // config,
      );
      setData(prevData => [...prevData, ...res.data.data]);
      setHasMore(res.data.pagination.nextPage !== null);
      setLoading(false);
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.status &&
        err.response.status === 404
      ) {
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
  }, [topic, page, profile]);

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

  const BlogItem = React.memo(({item, navigation, index}) => {
    if (adInterval && (index + 1) % adInterval === 0 && adMobIds) {
      const adIndex = (index + 1) / adInterval;
      const adItem = adMobIds[adIndex - 1];
      return (
        <>
          <Card item={item} key={item.id} isGuest={isGuest} />
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 16,
            }}>
            {adItem && (
              <BannerAd
                unitId={adItem._data.adId}
                size="365x45"
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true,
                }}
              />
            )}
          </View>
        </>
      );
    } else {
      return (
        <>
          <Card item={item} key={item.id} isGuest={isGuest} />
          <View style={{height: 16}}></View>
        </>
      );
    }
  });

  const renderItem = ({item, index}) => {
    return <BlogItem item={item} navigation={navigation} index={index} />;
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
      setLoading(true);
    }
  };
  const darkMode = useSelector(state => state.darkMode.value);
  const scrollRef = React.createRef();

  const onFabPress = () => {
    scrollRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  return topic ? (
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
        <View style={styles.topBar}>
          <Text style={[styles.title]}>Explore</Text>
          {route.params && route.params.id ? (
            <GlobalHeader id={route.params.id} />
          ) : (
            <GlobalHeader />
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            onFabPress();
          }}
          style={{
            elevation: 0,
            position: 'absolute',
            bottom: 20,
            right: 20,
            zIndex: 100,
            // shadowColor: '#000',
            // shadowOffset: {width: 0, height: 0},
            // shadowOpacity: 0.1,
            // shadowRadius: 1,
          }}>
          <View style={{}}>
            <Image
              source={require('../assets/up.png')}
              style={{
                width: 45,
                height: 45,
              }}
            />
          </View>
        </TouchableOpacity>
        <FlatList
          data={data}
          ref={scrollRef}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          numColumns={DeviceInfo.isTablet() ? 2 : 1}
          refreshing={page === 1 && loading}
          onRefresh={() => {
            // navigation.replace('ExploreCategory', {
            //   id: route.params.id,
            // });
            setData([]);
            fetchData(page);
          }}
        />
      </SafeAreaView>
    </>
  ) : (
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
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: darkMode
            ? global.backgroundColorDark
            : global.backgroundColor,
        }}>
        <ActivityIndicator size="large" color="#6B6F76" />
      </SafeAreaView>
    </>
  );
};

export default Category;

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
    fontSize: 20,
    fontWeight: 'bold',
    flex: 2,
  },
});
