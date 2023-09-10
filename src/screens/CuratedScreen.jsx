import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';

import Card from './../components/Card';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../components/SearchBar/SearchBar';
import HomeHeader from './../components/HomeHeader';
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../redux/features/HideTabBar';
import messaging from '@react-native-firebase/messaging';
import '../../globalThemColor';
import {PermissionsAndroid} from 'react-native';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({navigation}) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [adMobIds, setAdMobIds] = useState();
  const [adInterval, setAdInterval] = useState();

  const dispatch = useDispatch();

  // after deploying new updates in stores please update firestore in firebase for triggering user prompts to update the app

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(showTabBar());
    });

    return unsubscribe;
  }, [navigation]);

  // to show hoarding board only for first time
  const setFirstTime = async () => {
    try {
      await AsyncStorage.setItem('notFirstTime', 'yes');
    } catch (error) {
      console.log(error);
    }
  };
  async function requestUserPermissionNotificationIOS() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    if (Platform.OS === 'ios') {
      requestUserPermissionNotificationIOS();
    }
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
    setFirstTime();
    getAdMobIdsFromFireStore();
    getBannerAdsIntervalFromFireStore();
  }, []);

  const getAdMobIdsFromFireStore = async () => {
    try {
      const ApIds = await firestore().collection('adMobIds').get();

      setAdMobIds(ApIds.docs);
    } catch (error) {
      console.log(error);
    }
  };

  const getBannerAdsIntervalFromFireStore = async () => {
    try {
      const interval = await firestore().collection('bannerAdsInterval').get();

      setAdInterval(interval.docs[0]._data.Interval);
    } catch (error) {
      console.log(error);
    }
  };

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
        return navigation.replace('InfoScreen');
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
      const newData = res.data.data;
      news.length > 0
        ? setNews(prevData => {
            const filteredData = prevData.filter(item => {
              return !newData.some(newItem => newItem.id === item.id);
            });
            //  filteredData.forEach(item=>console.log(item[0].id,'from loop'));
            return [...filteredData, ...newData];
          })
        : setNews(res.data.data);
      setLoading(false);
      setHasMore(res.data.pagination.nextPage !== null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserType();
  }, []);

  const getUserType = async () => {
    await AsyncStorage.getItem('guestUser').then(value => {
      const data = JSON.parse(value);
      setIsGuest(Boolean(data));
    });
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

  const BlogItem = React.memo(({item, index, navigation}) => {
    const commonContent = useMemo(
      () => (
        <>
          <Card item={item} key={item.id} profile={profile} isGuest={isGuest} />
          <View style={{height: 16}}></View>
        </>
      ),
      [item, profile, isGuest],
    );

    const shouldRenderAd =
      adInterval && (index + 1) % adInterval === 0 && adMobIds;
    const adIndex = (index + 1) / adInterval;
    const adItem = adMobIds[adIndex - 1];

    return (
      <>
        {commonContent}
        {shouldRenderAd && (
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
        )}
      </>
    );
    // if (adInterval && (index + 1) % adInterval === 0 && adMobIds) {
    //   const adIndex = (index + 1) / adInterval;
    //   const adItem = adMobIds[adIndex - 1];
    //   return (
    //     <>
    //       {commonContent}
    //       <View
    //         style={{
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           height: 16,
    //         }}>
    //         {adItem && (
    //           <BannerAd
    //             unitId={adItem._data.adId}
    //             size="365x45"
    //             requestOptions={{
    //               requestNonPersonalizedAdsOnly: true,
    //             }}
    //           />
    //         )}
    //       </View>
    //     </>
    //   );
    // } else {
    //   return commonContent;
    // }
  });

  const renderItem = ({item, index}) => {
    return <BlogItem item={item} navigation={navigation} index={index} />;
  };

  const darkMode = useSelector(state => state.darkMode.value);
  const scrollRef = React.createRef();

  const onFabPress = useCallback(() => {
    scrollRef.current?.scrollToOffset({animated: true, offset: 0});
  }, []);

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
        <StatusBar
          backgroundColor={darkMode ? global.brandColorDark : global.brandColor}
        />

        <View
          style={[
            styles.topBar,
            {
              backgroundColor: darkMode
                ? global.brandColorDark
                : global.brandColor,
            },
          ]}>
          <Text style={styles.title}>My Feed</Text>

          <HomeHeader />
        </View>

        <SearchBar />

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
          }}>
          <View style={{}}>
            <Image
              source={require('../assets/up.png')}
              style={{
                width: 48,
                height: 48,
                resizeMode: 'contain',
                borderRadius: 50,
              }}
            />
          </View>
        </TouchableOpacity>
        <FlatList
          ref={scrollRef}
          data={news}
          numColumns={DeviceInfo.isTablet() ? 2 : 1}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.5}
          showsHorizontalScrollIndicator={false}
          onEndReached={handleLoadMore}
          refreshing={page === 1 && loading}
          // onScroll={e => onScrollEvent(e)}
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
