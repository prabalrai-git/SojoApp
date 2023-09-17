import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import Card from './../components/Card';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeHeader from '../components/HomeHeader';
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../redux/features/HideTabBar';
import {Image} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {FlashList} from '@shopify/flash-list';

const SearchScreen = ({navigation, route}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adMobIds, setAdMobIds] = useState();
  const [adInterval, setAdInterval] = useState();

  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(false);

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

  const dispatch = useDispatch();

  useEffect(() => {
    getAdMobIdsFromFireStore();
    getBannerAdsIntervalFromFireStore();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(showTabBar());
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // AsyncStorage.removeItem('token');
    if (navigation && !AsyncStorage.getItem('token')) {
      navigation.replace('WelcomeScreen');
    }
  }, [navigation]);

  const fetchBlogs = async () => {
    try {
      setBlogs();
      const res = await Axios.get(
        `/news/search/${route.params.term}?userId=${route.params.profile.id}`,
      );
      setBlogs(res.data.data);
      setLoading(false);
    } catch (err) {
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

  const BlogItem = React.memo(({item, index}) => {
    if (adInterval && (index + 1) % adInterval === 0 && adMobIds) {
      const adIndex = (index + 1) / adInterval;
      const adItem = adMobIds[adIndex - 1];
      return (
        <>
          <Card
            item={item}
            key={item.id}
            isGuest={route.params.profile.isGuestUser}
          />
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
          <Card
            item={item}
            key={item.id}
            isGuest={route.params.profile.isGuestUser}
          />
          <View style={{height: 16}}></View>
        </>
      );
    }
  });

  const renderItem = ({item, index}) => {
    return <BlogItem item={item} navigation={navigation} index={index} />;
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
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/arrow-left.png')}
              style={{
                tintColor: 'white',
                width: 25,
                height: 25,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <HomeHeader isShown={false} />
        </View>
        <SearchBar />
        <FlashList
          ListHeaderComponent={() => (
            <View>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '400',
                  color: darkMode ? 'white' : '#171A21',
                  textAlign: 'center',
                  borderBottomColor: darkMode ? '#3F424A' : '#ECEDEF',
                  borderBottomWidth: 1,
                  padding: 12,
                }}>
                Results for "{route.params.term}"
              </Text>
            </View>
          )}
          estimatedItemSize={100}
          data={blogs}
          renderItem={renderItem}
          numColumns={DeviceInfo.isTablet() ? 2 : 1}
          keyExtractor={item => item.id}
          ListFooterComponent={renderFooter}
          // onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          // onEndReached={handleLoadMore}
        />
      </SafeAreaView>
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#27B060',
    padding: 20,
    paddingVertical: 20.75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
});
