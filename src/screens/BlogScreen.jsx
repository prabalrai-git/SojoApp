import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  FlatList,
  Pressable,
} from 'react-native';
import Axios from './../api/server';
import HTML from 'react-native-render-html';
import moment from 'moment';
import Card from '../components/Card';
import FastImage from 'react-native-fast-image';
import {PRIMARY_COLOR, windowWidth} from '../helper/usefulConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {toggle} from '../redux/features/ReloadNewsSlice';
import Share from 'react-native-share';
import {useDispatch, useSelector} from 'react-redux';
import {hideTabBar, showTabBar} from '../redux/features/HideTabBar';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const BlogScreen = ({route}) => {
  const scrollRef = useRef(null);
  const {id, fromBookmarks, isGuest} = route.params;
  const [data, setData] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [config, setConfig] = useState();
  const [refetch, setRefetch] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [image, setImage] = useState();
  const [loaded, setLoaded] = useState(false);

  const [profile, setProfile] = useState();

  const {width} = useWindowDimensions();

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const interstitial = InterstitialAd.createForAdRequest(
    'ca-app-pub-7141466234997058/2285141810',
    {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['fashion', 'clothing'],
    },
  );

  useEffect(() => {
    if (data?.image) {
      const w = Math.floor(width - 5 / 100);
      const resizedImageUrl = data?.image?.replace(
        '/upload/',
        `/upload/w_${w.toString()},h_250,c_fill,q_auto/`,
      );
      setImage(resizedImageUrl);
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(hideTabBar());
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

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [data]);

  // Start loading the interstitial straight away

  // Unsubscribe from events on unmount

  // useEffect(() => {
  //   if (loaded) {
  //     interstitial.show();
  //   }
  // }, [loaded]);

  const fetchData = async () => {
    try {
      const res = await Axios.get(`/news/${id}?userId=${profile?.id}`);
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({offset: 0, animated: true});
    }
  };

  useEffect(() => {
    // single blog featured removed from the similar blogs array

    scrollToTop();
    const filteredArray = similarBlogs?.filter(item => item.id !== id);
    setSimilarBlogs(filteredArray);
  }, [data]);

  const fetchSimilarBlogs = async () => {
    try {
      const res = await Axios.get(`/news/similar/${data.id}?page=${page}`);
      // setSimilarBlogs(res.data.data);
      const newData = res.data.data;
      similarBlogs.length > 0
        ? setSimilarBlogs(prevData => {
            const filteredData = prevData.filter(item => {
              return !newData.some(newItem => newItem.id === item.id);
            });
            //  filteredData.forEach(item=>console.log(item[0].id,'from loop'));
            return [...filteredData, ...newData];
          })
        : setSimilarBlogs(res.data.data);
      setLoading(false);
      setHasMore(res.data.pagination.nextPage !== null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    id && profile && fetchData();
  }, [id, refetch, profile]);

  useEffect(() => {
    data && fetchSimilarBlogs();
  }, [data, page]);

  // if (!data) {
  //   return <ActivityIndicator />;
  // }

  const toggleBookmark = async () => {
    try {
      const res = await Axios.post(
        '/users/bookmarks/toggleOrAddBookmark',
        {userId: profile?.id, newsId: id},
        config,
      );

      setRefetch(prev => !prev);
      dispatch(toggle());
    } catch (error) {
      console.log(error);
    }
  };

  const url = `https://sojonews.com/news/${id}`;
  const title = `${data?.title}`;
  const message = 'Please check this out.';
  const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
  const options = Platform.select({
    ios: {
      activityItemSources: [
        {
          // For sharing url with custom title.
          placeholderItem: {type: 'url', content: url},
          item: {
            default: {type: 'url', content: url},
          },
          subject: {
            default: title,
          },
          linkMetadata: {originalUrl: url, url, title},
        },
        {
          // For sharing text.
          placeholderItem: {type: 'text', content: message},
          item: {
            default: {type: 'text', content: message},
            message: null, // Specify no text to share via Messages app.
          },
          linkMetadata: {
            // For showing app icon on share preview.
            title: message,
          },
        },
        {
          // For using custom icon instead of default text icon at share preview when sharing with message.
          placeholderItem: {
            type: 'url',
            content: icon,
          },
          item: {
            default: {
              type: 'text',
              content: `${message} ${url}`,
            },
          },
          linkMetadata: {
            title: message,
            icon: icon,
          },
        },
      ],
    },
    default: {
      title,
      subject: title,
      message: `${message} ${url}`,
    },
  });

  const onClickShare = () => {
    Share.open(options);
  };

  const onBackPress = () => {
    if (fromBookmarks) {
      navigation.navigate('SettingsScreen');
    } else {
      navigation.pop();
    }
  };

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

  const darkMode = useSelector(state => state.darkMode.value);

  const markdownStyles = {
    p: {
      fontSize: 16,
      lineHeight: 24,
      color: darkMode ? '#9B9EA5' : '#3F424A',
      textAlign: 'left',
    },
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
    a: {
      textDecorationLine: 'underline',
    },
    heading1: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    heading2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    heading3: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    heading4: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    heading5: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    heading6: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  };

  ///
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
      <Card item={item} key={item.id} profile={profile} isGuest={isGuest} />
    );
  });

  const renderItem = ({item}) => {
    return <BlogItem item={item} navigation={navigation} />;
  };

  const MemoizedRenderHtml = React.memo(HTML);

  // const WebDisplay = React.memo(function WebDisplay() {
  //   return (
  //     <HTML
  //       source={{html: data.news}}
  //       contentWidth={width}
  //       tagsStyles={markdownStyles}
  //     />
  //   );
  // });
  // const scrollToTop = () => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollToOffset({offset: 0, animated: true});
  //   }
  // };

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
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              paddingHorizontal: 15,
              padding: 6,
            }}
            onPress={() => {
              onBackPress();
            }}>
            <Image
              source={require('../assets/arrow-left.png')}
              style={{
                tintColor: 'white',
                width: 20,
                height: 20,
              }}
            />
          </TouchableOpacity>
          {!isGuest && (
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              {data?.isBookmarkedByUser ? (
                <TouchableOpacity onPress={() => toggleBookmark()}>
                  <Image
                    source={require('../assets/whitemarking.png')}
                    style={{
                      resizeMode: 'contain',
                      width: 116,
                      height: 35,
                      // marginRight: 5,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: darkMode
                      ? global.brandColorLightDark
                      : global.brandColorLight,
                    padding: 6,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                  }}
                  onPress={() => toggleBookmark()}>
                  <Image
                    source={require('../assets/saved.png')}
                    style={{
                      tintColor: 'white',
                      resizeMode: 'contain',
                      width: 18,
                      height: 18,
                      marginRight: 6,
                      alignSelf: 'center',
                    }}
                  />
                  <Text
                    style={{
                      color: 'white',
                      alignSelf: 'center',
                      fontWeight: '500',
                      fontSize: 12,
                    }}>
                    Add Bookmark
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => onClickShare()}
                style={{
                  marginLeft: 10,
                  backgroundColor: darkMode
                    ? global.brandColorLightDark
                    : global.brandColorLight,
                  padding: 6,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                }}>
                <Image
                  source={require('../assets/share.png')}
                  style={{
                    tintColor: 'white',
                    resizeMode: 'contain',
                    width: 23,
                    height: 23,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* 
        <TouchableOpacity style={styles.saveBtn}>
          <View>
            <Image
              source={require('../assets/floppy-disk.png')}
              style={{
                tintColor: '#27B161',
                width: 17,
                height: 17,
                resizeMode: 'contain',
                marginRight: 5,
              }}
            />
          </View>
          <View style={{alignSelf: 'center'}}>
            <Text style={styles.topBarText}>Save Changes</Text>
          </View>
        </TouchableOpacity> */}
        </View>
        <FlatList
          ref={scrollRef}
          data={[null]}
          renderItem={() => {
            return data ? (
              <View style={{flex: 1}}>
                <View
                  // scrollEnabled={false}
                  style={[
                    styles.container,
                    {
                      backgroundColor: darkMode
                        ? global.backgroundColorDark
                        : global.backgroundColor,
                    },
                  ]}
                  showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <BannerAd
                      unitId={'ca-app-pub-7141466234997058/1521088001'}
                      size="365x45"
                      requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                      }}
                    />
                  </View>

                  <View style={styles.blog}>
                    <Text
                      style={[
                        styles.title,
                        {color: darkMode ? 'white' : 'black'},
                      ]}>
                      {data.title}
                    </Text>
                    <View style={styles.categories}>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Image
                          source={require('../assets/Sn.png')}
                          style={{
                            width: 28,
                            height: 28,
                            resizeMode: 'contain',
                            alignSelf: 'center',
                          }}
                        />
                        <View
                          style={{display: 'flex', flexDirection: 'column'}}>
                          <Text
                            style={[
                              styles.date,
                              {
                                color: darkMode ? 'white' : 'black',
                                fontSize: 12,
                              },
                            ]}>
                            Sojo News Team
                          </Text>
                          <Text
                            style={[
                              styles.date,
                              {color: darkMode ? '#9B9EA5' : '#3F424A'},
                            ]}>
                            {moment(data.createdAt).format('DD MMM YYYY')}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.topic,
                          {flex: DeviceInfo.isTablet() ? 0.3 : 0.6},
                        ]}>
                        {data.topics[0].name}
                      </Text>
                    </View>
                    {/* <Image source={{uri: data.image}} style={styles.image} /> */}
                    <FastImage
                      source={{uri: image ? image : null}}
                      style={[
                        styles.image,
                        {height: DeviceInfo.isTablet() ? 450 : 260},
                      ]}
                      resizeMode={FastImage.resizeMode.cover}
                      priority={FastImage.priority.high}
                    />
                    <Text
                      style={[
                        styles.previewText,
                        {color: darkMode ? '#9B9EA5' : '#3F424A'},
                      ]}>
                      {data.previewText}
                    </Text>

                    <MemoizedRenderHtml
                      source={{html: data.news}}
                      contentWidth={width}
                      tagsStyles={markdownStyles}
                    />

                    {/* <View style={styles.shareWrapper}>
           <Text style={styles.shareTitle}>Share this story</Text>
         </View> */}
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}>
                      <BannerAd
                        unitId={'ca-app-pub-7141466234997058/4147251345'}
                        size="365x45"
                        requestOptions={{
                          requestNonPersonalizedAdsOnly: true,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: 'bold',
                        marginTop: 15,
                        marginBottom: 15,
                        color: darkMode ? 'white' : '#3F424A',
                      }}>
                      Similar News
                    </Text>
                  </View>
                  {/* <View
               style={{
                 flex: 1,
                 marginBottom: 35,
                 flexDirection: 'row',
                 flexWrap: 'wrap',
               }}> */}
                  {/* {similarBlogs.map(item => {
                 return <Card key={item.id} item={item} />;
               })} */}
                  {/* </View> */}
                  <FlatList
                    data={similarBlogs}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListFooterComponent={renderFooter}
                    onEndReachedThreshold={0.5}
                    showsHorizontalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    numColumns={DeviceInfo.isTablet() ? 2 : 1}
                    refreshing={page === 1 && loading}
                    onRefresh={() => {
                      setPage(1);
                      setSimilarBlogs([]);
                    }}
                  />
                </View>
              </View>
            ) : (
              <View style={{marginTop: 50}}>
                <ActivityIndicator size="large" />
              </View>
            );
          }}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 24,
  },
  blog: {
    paddingHorizontal: 14,
  },
  categories: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
    marginTop: 8,
    justifyContent: 'space-between',

    alignItems: 'center',
  },
  date: {
    marginLeft: 8,
    flex: 2,
    color: '#3F424A',
    fontSize: 12,
  },
  topic: {
    flex: 0.5,
    backgroundColor: '#b3e0bd',
    color: '#237344',
    fontWeight: 'bold',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    textAlign: 'center',
    overflow: 'hidden',
  },
  image: {
    height: 260,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#171A21',
  },
  previewText: {
    fontSize: 16,
    marginBottom: 0,
    lineHeight: 24,
    color: '#3F424A',
    textAlign: 'justify',
  },
});

export default BlogScreen;
