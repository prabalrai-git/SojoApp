import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

import Card from './../components/Card';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../components/SearchBar/SearchBar';
import HomeHeader from './../components/HomeHeader';
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../redux/features/HideTabBar';
import '../../globalThemColor';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import {BannerAd, TestIds} from 'react-native-google-mobile-ads';
import firestore from '@react-native-firebase/firestore';
import {FlashList} from '@shopify/flash-list';
import SurveyModalRedirectionToSettings from '../components/Surverys/SurveyModalRedirectionToSettings';
import Snackbar from 'react-native-snackbar';
import ShareOurAppModal from '../components/Surverys/ShareOurAppModal';

///

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
  const [todaysNewsLength, setTodaysNewsLength] = useState(null);

  //

  const dispatch = useDispatch();

  // after deploying new updates in stores please update firestore in firebase for triggering user prompts to update the app

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1); // Subtract one day
  const yesterday = currentDate.toISOString().split('T')[0]; // Format as "yyyy-mm-dd"

  useEffect(() => {
    if (news) {
      // const todaysNews = news.filter(
      //   item => item.createdAt.split('T')[0] === today,
      // );

      // setTodaysNewsLength(todaysNews.length);
      getTodaysNewsCount();
    }
  }, [news]);

  const getTodaysNewsCount = async (req, res) => {
    try {
      const res = await Axios.get('/news/count/numberOfNewsForToday', config);
      setTodaysNewsLength(res.data.countOfNewsToday);
    } catch (error) {
      console.log(error);
    }
  };

  function isNextDay(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return date1.getDate() !== date2.getDate();
  }

  useEffect(() => {
    async function setUserActivity() {
      // Make your API call here
      if (config) {
        try {
          await Axios.post('/users/profile/addUserActivity', {}, config);

          // Store the current timestamp in AsyncStorage
          AsyncStorage.setItem(
            'lastApiCallTimestamp',
            new Date().toISOString(),
          );
          // Handle the API response data
        } catch (error) {
          console.error('API Error:', error);
          if (error.response) {
            console.error('Response Data:', error.response.data);
          }
        }
      }
    }

    AsyncStorage.getItem('lastApiCallTimestamp')
      .then(lastApiCallTimestamp => {
        const currentTimestamp = new Date().toISOString();

        if (
          isNextDay(lastApiCallTimestamp, currentTimestamp) ||
          !lastApiCallTimestamp
        ) {
          setUserActivity();
        }
      })
      .catch(error => {
        console.error('AsyncStorage Error:', error);
      });
  }, [config]);

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
    } catch (error) {}
  };

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
  useEffect(() => {
    fetchToken();
    setFirstTime();
    getAdMobIdsFromFireStore();
    getBannerAdsIntervalFromFireStore();
  }, []);

  const getAdMobIdsFromFireStore = async () => {
    try {
      const ApIds = await firestore().collection('adMobIds').get();

      setAdMobIds(ApIds.docs);
    } catch (error) {}
  };

  const getBannerAdsIntervalFromFireStore = async () => {
    try {
      const interval = await firestore().collection('bannerAdsInterval').get();

      setAdInterval(interval.docs[0]._data.Interval);
    } catch (error) {}
  };

  useEffect(() => {
    // AsyncStorage.removeItem('token');
    if (navigation && !AsyncStorage.getItem('token')) {
      navigation.replace('WelcomeScreen');
    }
  }, [navigation]);

  useEffect(() => {
    if (config) {
      fetchProfile();
    }
  }, [config]);
  const fetchProfile = useCallback(async () => {
    try {
      const res = await Axios.get('/users/profile', config);

      if (!res.data.data.isComplete) {
        return navigation.replace('InfoScreen');
      }
      setProfile(res.data.data);
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        logout();
        setProfile(null);
        // return router.replace('/');
      }
    }
  }, [config, navigation]);

  const fetchNews = async pageNumber => {
    try {
      setLoading(true);

      const res = await Axios.get(
        `/users/news?page=${pageNumber}&id=${profile?.id}&limit=35`, // Adjust the limit as needed
        config,
      );
      const newData = res.data.data;

      setNews(prevData => {
        const uniqueItemIds = new Set(prevData.map(item => item.id));
        const filteredNewData = newData.filter(
          newItem => !uniqueItemIds.has(newItem.id),
        );
        return [...prevData, ...filteredNewData];
      });

      setLoading(false);
      setHasMore(res.data.pagination.nextPage !== null);
    } catch (err) {
      setLoading(false);

      // Handle errors
    }
  };

  useEffect(() => {
    const getUser = navigation.addListener('focus', () => {
      getUserType();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return getUser;
  }, [navigation]);

  const getUserType = async () => {
    await AsyncStorage.getItem('guestUser').then(value => {
      const data = JSON.parse(value);
      setIsGuest(Boolean(data));
    });
  };

  useEffect(() => {
    config && fetchNews(page);

    // Iterate through the fetched news to set 'showCaughtup'
  }, [config, page, profile]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
      fetchNews(page + 1);
    } else {
      setLoading(false);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" style={{marginVertical: 10}} />;
  };

  const BlogItem = React.memo(({item, index, navigation}) => {
    let showCaughtForToday = false;
    if (todaysNewsLength && index === todaysNewsLength - 1) {
      showCaughtForToday = true;
    }
    const commonContent = useMemo(
      () => (
        <>
          <Card
            item={item}
            key={item.id}
            profile={profile}
            isGuest={isGuest}
            showCaughtForToday={showCaughtForToday}
          />

          <View style={{height: 16}}></View>
        </>
      ),
      [item, profile, isGuest],
    );

    const shouldRenderAd =
      adInterval && (index + 1) % adInterval === 0 && adMobIds;
    const adIndex = (index + 1) / adInterval;
    const adItem = adMobIds && adMobIds[adIndex - 1];

    return (
      <>
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
                // unitId="ca-app-pub-7141466234997058/2292173803"
                // unitId={'ca-app-pub-3940256099942544/6300978111'}
                size="365x45"
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true,
                }}
              />
            )}
          </View>
        )}
        {commonContent}
      </>
    );
  });

  const renderItem = ({item, index}) => {
    return <BlogItem item={item} navigation={navigation} index={index} />;
  };

  const darkMode = useSelector(state => state.darkMode.value);
  const scrollRef = React.createRef();

  const onFabPress = () => {
    scrollRef.current?.scrollToOffset({animated: true, offset: 0});
  };
  // console.log(offlineNews, 'off');

  // useEffect(() => {
  //   NetInfo.fetch().then(state => {
  //     if (state.isConnected) {
  //       setIsConnectedToInternet(state.isConnected);
  //     }
  //   });
  // }, [offlineNews, news, isconnectedToInternet]);

  return (
    <>
      {/* <CustomAlert /> */}
      <ShareOurAppModal />
      <SurveyModalRedirectionToSettings profile={profile} />
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

        <FlashList
          ref={scrollRef}
          data={news}
          numColumns={DeviceInfo.isTablet() ? 2 : 1}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={news.length > 0 ? renderFooter : null}
          onEndReachedThreshold={0.4}
          showsHorizontalScrollIndicator={false}
          onEndReached={handleLoadMore}
          refreshing={page === 1 && loading}
          // onScroll={e => onScrollEvent(e)}
          onRefresh={() => {
            setNews([]);
            setPage(1);
            fetchNews(page);
            // navigation.replace('Curated');
            Snackbar.show({
              text: 'Your feed has been updated.',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: darkMode ? '#3F424A' : 'white',
              marginBottom: 97,
              textColor: darkMode ? 'white' : 'black',
              numberOfLines: 1,
            });
          }}
          estimatedItemSize={100}
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
