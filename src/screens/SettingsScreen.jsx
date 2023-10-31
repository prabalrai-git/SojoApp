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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {logoutUser} from './../helper/auth';
import {useNavigation} from '@react-navigation/native';
import {PRIMARY_COLOR, windowWidth} from '../helper/usefulConstants';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlogCard from '../components/Card';
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../redux/features/HideTabBar';
import DeviceInfo from 'react-native-device-info';
import {BannerAd, TestIds} from 'react-native-google-mobile-ads';
import messaging from '@react-native-firebase/messaging';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [news, setNews] = useState();
  const [page, setPage] = useState(1);
  const [config, setConfig] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [profile, setProfile] = useState();
  const [renderBookmarked, setRenderBookmarked] = useState(false);
  const [reloadProfileOnEdit, setReloadProfileOnEdit] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const [loading, setLoading] = useState(true);
  const reload = useSelector(state => state.reloadNews.value);

  const dispatch = useDispatch();

  async function requestUserPermissionNotificationIOS() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(showTabBar());
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    if (Platform.OS === 'ios') {
      requestUserPermissionNotificationIOS();
    }
    getUserType();
  }, []);

  const getUserType = async () => {
    await AsyncStorage.getItem('guestUser').then(value => {
      const data = JSON.parse(value);
      setIsGuest(Boolean(data));
    });
  };

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
  }, [config, reloadProfileOnEdit]);

  const fetchNews = async () => {
    try {
      const res = await Axios.get(
        '/users/bookmarks/getBookmarkedNews',

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
        <View
          style={[
            styles.topBar,
            {
              backgroundColor: darkMode
                ? global.brandColorDark
                : global.brandColor,
            },
          ]}>
          <Text style={styles.topBarText}>My Profile</Text>

          <TouchableOpacity
            style={[
              styles.iconContainer,
              {
                backgroundColor: darkMode
                  ? global.brandColorLightDark
                  : global.brandColorLight,
              },
            ]}
            onPress={() =>
              navigation.navigate('ProfileSettings', {
                isGuestUser: profile?.isGuestUser ? profile.isGuestUser : false,
              })
            }>
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

        <View style={{paddingHorizontal: 15, marginTop: 10}}>
          <Text
            style={{
              fontWeight: 'bold',
              color: darkMode ? 'white' : 'black',
              fontSize: 22,
              textTransform: 'capitalize',
            }}>
            {profile?.username !== 'user' || null
              ? profile?.username
              : profile?.email}
          </Text>
          <Text style={{color: 'grey', marginBottom: 15}}>
            {profile?.occupation?.name}
          </Text>

          <View style={styles.btnContainer}>
            {!isGuest && (
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: darkMode
                      ? global.brandColorDark2
                      : global.backgroundColor,
                    borderColor: darkMode ? global.brandColorDark2 : '#b3e0bd',
                  },
                ]}
                onPress={() =>
                  navigation.navigate('Topics', {screen: 'EditTopicsScreen'})
                }>
                <Text
                  style={[
                    styles.btnTxt,
                    {color: darkMode ? 'white' : '#1d6e3f'},
                  ]}>
                  Choose Your Topics
                </Text>
              </TouchableOpacity>
            )}
            {!profile?.isGuestUser && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditProfile', {
                    profile: profile,
                    config: config,
                    setReloadProfileOnEdit: setReloadProfileOnEdit,
                  })
                }
                style={[
                  styles.btn,
                  {
                    backgroundColor: darkMode
                      ? global.brandColorDark2
                      : global.backgroundColor,
                    borderColor: darkMode ? global.brandColorDark2 : '#b3e0bd',
                  },
                ]}>
                <Text
                  style={[
                    styles.btnTxt,
                    {color: darkMode ? 'white' : '#1d6e3f'},
                  ]}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              width: '100%',
              backgroundColor: darkMode ? '#3F424A' : 'lightgrey',
              height: 1,
              marginBottom: 20,
            }}></View>
        </View>
        {isGuest ? (
          <>
            <Image
              source={require('../assets/sign.png')}
              style={{
                width: 180,
                height: 180,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginTop: 40,
              }}
            />
            <Text
              style={{
                color: darkMode ? global.iconColorDark : global.inputColorDark,
                fontWeight: '500',
                textAlign: 'center',
                marginTop: 40,
                marginHorizontal: 20,
                textTransform: 'capitalize',
                fontSize: 16,
                lineHeight: 24,
              }}>
              Please Sign in for other features like: bookmarks, curated news
              topics, and much more !
            </Text>
          </>
        ) : (
          <>
            {news?.length > 0 && (
              <>
                {/* <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <BannerAd
                    unitId={'ca-app-pub-7141466234997058/7599411198'}
                    size="365x45"
                    requestOptions={{
                      requestNonPersonalizedAdsOnly: true,
                    }}
                  />
                </View> */}

                <Text
                  style={{
                    color: darkMode ? 'white' : 'black',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginBottom: 10,
                    marginLeft: 15,
                  }}>
                  Saved stories
                </Text>
              </>
            )}
            <ScrollView>
              {news?.length > 0 ? (
                <View
                  style={{
                    flex: 1,
                    marginBottom: 35,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {news?.map(item => {
                    return (
                      <>
                        <BlogItem
                          key={item?.id}
                          item={item}
                          navigation={navigation}
                        />
                      </>
                    );
                  })}
                </View>
              ) : (
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: darkMode
                        ? global.iconColorDark
                        : global.inputColorDark,
                      fontWeight: '600',
                      textAlign: 'center',
                      marginTop: 40,
                    }}>
                    No Any Bookmarks!!
                  </Text>
                </View>
              )}
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  btnTxt: {
    textAlign: 'center',
    color: '#1d6e3f',
    fontWeight: '500',
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
    flex: 1,
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
    paddingVertical: 13.0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
  },
});
