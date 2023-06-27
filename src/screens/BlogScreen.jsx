import {useState, useEffect, useRef} from 'react';
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
  BackHandler,
} from 'react-native';
import Axios from './../api/server';
import HTML from 'react-native-render-html';
import moment from 'moment';
import Card from '../components/Card';
import FastImage from 'react-native-fast-image';
import {PRIMARY_COLOR, windowWidth} from '../helper/usefulConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {toggle} from '../redux/features/ReloadNewsSlice';
import Share from 'react-native-share';
import {hideTabBar, showTabBar} from '../redux/features/HideTabBar';

const BlogScreen = ({route, navigation}) => {
  const scrollRef = useRef(null);
  const {id, profile} = route.params;
  const [data, setData] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [config, setConfig] = useState();
  const [refetch, setRefetch] = useState(false);

  const {width} = useWindowDimensions();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hideTabBar());
  }, []);

  BackHandler.addEventListener('hardwareBackPress', () => {
    dispatch(showTabBar());
  });

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

  const fetchData = async () => {
    try {
      const res = await Axios.get(`/news/${id}?userId=${profile.id}`);
      setData(res.data.data);
      scrollRef.current.scrollTo({y: 0, animated: true});
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSimilarBlogs = async () => {
    try {
      const res = await Axios.get(`/news/similar/${data.id}`);
      setSimilarBlogs(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    id && fetchData();
  }, [id, refetch]);

  useEffect(() => {
    data && fetchSimilarBlogs();
  }, [data]);

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
    dispatch(showTabBar());
    navigation.pop();
  };

  return (
    <>
      <SafeAreaView style={{backgroundColor: '#26B160'}}>
        <View style={styles.topBar}>
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
              style={{tintColor: 'white', width: 20, height: 20}}
            />
          </TouchableOpacity>

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
                  backgroundColor: '#52c080',
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
                    width: 20,
                    height: 20,
                    marginRight: 5,
                  }}
                />
                <Text style={{color: 'white'}}>Bookmark</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => onClickShare()}
              style={{
                marginLeft: 10,
                backgroundColor: '#52c080',
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
        {data ? (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.blog}>
              <Text style={styles.title}>{data.title}</Text>
              <View style={styles.categories}>
                <Text style={styles.topic}>{data.topics[0].name}</Text>
                <Text style={styles.date}>
                  Posted on {moment(data.createdAt).format('DD MMM YYYY')}
                </Text>
              </View>
              {/* <Image source={{uri: data.image}} style={styles.image} /> */}
              <FastImage
                source={{uri: data.image}}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={styles.previewText}>{data.previewText}</Text>

              <HTML
                source={{html: data.news}}
                contentWidth={width}
                tagsStyles={markdownStyles}
              />

              {/* <View style={styles.shareWrapper}>
          <Text style={styles.shareTitle}>Share this story</Text>
        </View> */}

              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  marginTop: 15,
                  marginBottom: 30,
                  color: '#2B2D34',
                }}>
                Similar News
              </Text>
            </View>
            <View style={{flex: 1, marginBottom: 35}}>
              {similarBlogs.map(item => {
                return (
                  <Card
                    key={item.id}
                    item={item}
                    navigation={navigation}
                    profile={profile}
                  />
                );
              })}
            </View>
          </ScrollView>
        ) : (
          <ActivityIndicator />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   paddingVertical: 6,
  //   // paddingRight: 7,
  //   paddingLeft: 13,
  //   backgroundColor: '#FEFEFF',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   borderRadius: 8,
  //   flex: 1,
  // },
  // titleWrapper: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   flex: 1,
  // },
  // titleS: {
  //   fontSize: 13,
  //   color: '#26B160',
  //   fontWeight: 'bold',
  //   flex: 3,
  //   marginLeft: 10,
  // },
  topBar: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    paddingVertical: 15,
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
    gap: 10,
    marginBottom: 30,
    marginTop: 8,
    alignItems: 'center',
  },
  date: {
    marginLeft: 8,
    flex: 2,
    color: '#3F424A',
    fontSize: 15,
  },
  topic: {
    flex: 1,
    backgroundColor: '#b3e0bd',
    color: '#237344',
    fontWeight: 'bold',
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 4,
    textAlign: 'center',
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
    marginBottom: 5,
    lineHeight: 24,
    color: '#3F424A',
  },
});

const markdownStyles = StyleSheet.create({
  p: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3F424A',
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
});

export default BlogScreen;
