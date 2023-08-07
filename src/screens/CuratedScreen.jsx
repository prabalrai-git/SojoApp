import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
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

const HomeScreen = ({navigation}) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState(null);

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
    return <Card item={item} key={item.id} profile={profile} />;
  });

  const renderItem = ({item}) => {
    return <BlogItem item={item} navigation={navigation} />;
  };

  // function App() {
  //   useEffect(() => {
  //     const unsubscribe = messaging().onMessage(async remoteMessage => {
  //       Alert.alert(
  //         'A new FCM message arrived!',
  //         JSON.stringify(remoteMessage),
  //       );
  //     });

  //     return unsubscribe;
  //   }, []);
  // }

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
