import {Linking, StatusBar, StyleSheet} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Axios from './../api/server';

import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useSelector, useDispatch} from 'react-redux';
import {toggle} from '../redux/features/ReloadNewsSlice';
// import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {windowWidth} from '../helper/usefulConstants';
import {ImagePreview} from 'react-native-images-preview';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const ExploreCard = ({item, navigation, profile, isGuest}) => {
  const {width} = Dimensions.get('window');
  const [toggled, setToggled] = useState(
    item?.isBookmarkedByUser ? true : false,
  );
  const [config, setConfig] = useState();
  // console.log(item.id, 'item from explore');

  const dispatch = useDispatch();

  // useEffect(() => {
  //   const w = Math.floor(width - 5 / 100);
  //   const resizedImageUrl = item?.image.replace(
  //     '/upload/',
  //     `/upload/w_${w.toString()},h_250,c_fill/`,
  //   );
  //   setImage(resizedImageUrl);
  // }, [item?.image]);
  const resizedImageUrl = useMemo(() => {
    const w = Math.floor(width - 5 / 100);
    return item?.image?.replace(
      '/upload/',
      `/upload/w_${w.toString()},h_250,c_fill,q_auto/`,
    );
  }, [item?.image, width]);

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

  const bookmarkPressed = () => {
    const toggleBookmark = async () => {
      try {
        // return console.log({userId: profile?.id, newsId: item.id});
        // return console.log({userId: profile?.id, newsId: item.id});
        const res = await Axios.post(
          '/users/bookmarks/toggleOrAddBookmark',
          {userId: profile?.id, newsId: item.id},
          config,
        );
        // console.log(res.data);
        setToggled(prev => !prev);

        dispatch(toggle());
      } catch (err) {}
    };
    toggleBookmark();
  };
  const darkMode = useSelector(state => state.darkMode.value);

  if (!resizedImageUrl) {
    return null;
  }
  const openBrowser = async url => {
    try {
      // return console.log(Boolean(InAppBrowser.isAvailable()), 'hi');
      const isAvailable = await InAppBrowser.isAvailable();

      if (Boolean(isAvailable)) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#18AD56',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: false,
          enableBarCollapsing: true,
          // Android Properties
          showTitle: true,
          toolbarColor: '#18AD56',
          secondaryToolbarColor: 'white',
          navigationBarColor: 'white',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: false,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {item?.isPaid ? (
        <TouchableOpacity
          key={item?.id}
          style={{
            marginTop: 30,

            // height: 440,
            width: DeviceInfo.isTablet() ? windowWidth * 0.5 : windowWidth,
          }}
          onPress={() => openBrowser(item?.sponsorURL)}>
          <View
            style={[
              styles.cardContainer,
              {
                backgroundColor: darkMode
                  ? global.backgroundColorDark
                  : global.backgroundColor,
                borderBottomColor: darkMode ? '#3F424A' : '#DADADD',
              },
            ]}>
            <View
              style={{
                backgroundColor: '#efd98c',
                position: 'absolute',
                top: 10,
                left: 15,
                zIndex: 20,
                paddingHorizontal: 9,
                paddingVertical: 3,
                borderRadius: 6,
              }}>
              <Text style={{color: '#685203', fontWeight: 'bold'}}>
                Sponsored
              </Text>
            </View>
            <View style={styles.wrapper}>
              <View>
                <Image
                  source={{uri: resizedImageUrl}}
                  style={[
                    styles.cardImage,
                    {
                      position: 'relative',
                      borderColor: '#f7e39a',
                      borderWidth: 2,
                    },
                  ]}
                  resizeMode={FastImage.resizeMode.cover}
                  priority={FastImage.priority.high}
                />
                {!isGuest && (
                  <Pressable onPress={() => bookmarkPressed()}>
                    <Image
                      source={
                        toggled
                          ? require('../assets/marking.png')
                          : require('../assets/inmarking.png')
                      }
                      style={{
                        width: toggled ? 140 : 165,
                        height: 55,
                        resizeMode: 'contain',
                        position: 'absolute',
                        top: -60,
                        left: 10,
                        zIndex: 25,
                      }}
                    />
                  </Pressable>
                )}
              </View>
              <Text
                style={[
                  styles.cardTitle,
                  {color: darkMode ? 'white' : 'black'},
                ]}
                numberOfLines={DeviceInfo.isTablet() ? 1 : 2}
                ellipsizeMode="tail">
                {item?.title}
              </Text>

              <Text
                style={[
                  styles.cardText,
                  {color: darkMode ? '#9B9EA5' : '#3F424A'},
                ]}
                // numberOfLines={2}
                ellipsizeMode="tail">
                {item?.previewText}
              </Text>

              <View style={styles.footer}>
                <Text style={styles.category}>
                  {
                    item?.topics?.sort(
                      (a, b) => a.news_topic.order - b.news_topic.order,
                    )[0].name
                  }
                </Text>
                <View style={styles.link}>
                  <Text style={styles.linkText}>Read Full Story</Text>
                  <Icon
                    name="keyboard-arrow-right"
                    size={20}
                    color="#5AC087"
                    style={styles.linkIcon}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          key={item?.id}
          style={{
            marginTop: 30,
            // height: 440,
            width: DeviceInfo.isTablet() ? windowWidth * 0.5 : windowWidth,
          }}
          onPress={() => {
            navigation.navigate('Blog', {
              id: item?.id,
              isBookmarked: item?.isBookmarkedByUser,
              isGuest: isGuest,
            });
            // if (scrollRef)
            //   scrollRef.current?.scrollToOffset({animated: true, y: 0});
          }}>
          <View
            style={[
              styles.cardContainer,
              {
                backgroundColor: darkMode
                  ? global.backgroundColorDark
                  : global.backgroundColor,
                borderBottomColor: darkMode ? '#3F424A' : '#DADADD',
              },
            ]}>
            <View style={styles.wrapper}>
              <View>
                <Image
                  source={{uri: resizedImageUrl}}
                  style={[styles.cardImage, {position: 'relative'}]}
                  resizeMode={FastImage.resizeMode.contain}
                  priority={FastImage.priority.high}></Image>

                {!isGuest && (
                  <Pressable onPress={() => bookmarkPressed()}>
                    <Image
                      source={
                        toggled
                          ? require('../assets/marking.png')
                          : require('../assets/inmarking.png')
                      }
                      style={{
                        width: toggled ? 140 : 165,
                        height: 55,
                        resizeMode: 'contain',
                        position: 'absolute',
                        top: 190,
                        left: 10,
                      }}
                    />
                  </Pressable>
                )}
              </View>
              <Text
                style={[
                  styles.cardTitle,
                  {color: darkMode ? 'white' : 'black'},
                ]}
                numberOfLines={DeviceInfo.isTablet() ? 1 : 2}
                ellipsizeMode="tail">
                {item?.title}
              </Text>

              <Text
                style={[
                  styles.cardText,
                  {color: darkMode ? '#9B9EA5' : '#3F424A'},
                ]}
                // numberOfLines={2}
                ellipsizeMode="tail">
                {item?.previewText}
              </Text>

              <View style={styles.footer}>
                <Text style={styles.category}>
                  {
                    item?.topics?.sort(
                      (a, b) => a.news_topic.order - b.news_topic.order,
                    )[0].name
                  }
                </Text>
                <View style={styles.link}>
                  <Text style={styles.linkText}>Read Full Story</Text>
                  <Icon
                    name="keyboard-arrow-right"
                    size={20}
                    color="#5AC087"
                    style={styles.linkIcon}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ExploreCard;

const styles = StyleSheet.create({
  cardContainer: {
    overflow: 'hidden',
    width: '100%',
    borderBottomWidth: 3,
    borderBottomColor: '#DADADD',
    paddingBottom: 25,
    backgroundColor: '#F3F4F7',
  },
  wrapper: {
    paddingHorizontal: 15,
  },
  cardImage: {
    height: 250,
    width: '100%',
    borderRadius: 10,
  },
  cardTitle: {
    marginTop: 10,
    marginBottom: 7,
    textAlign: 'left',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
    color: '#171A21',
  },
  cardText: {
    textAlign: 'left',
    color: '#3F424A',
    fontSize: 15,
    lineHeight: 20,
    // fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
  },

  category: {
    backgroundColor: '#B2E1BD',
    // paddingHorizontal: 5,
    borderRadius: 12,
    paddingVertical: 5,
    color: '#2A784B',
    fontWeight: 'bold',
    // flex: 1,
    textAlign: 'center',
    fontSize: 12,
    flex: 1.1,
    overflow: 'hidden',
    paddingHorizontal: 5,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    flex: 2,
  },

  linkText: {
    fontSize: 12,
    paddingBottom: 2,
    borderBottomColor: '#5AC087',
    borderBottomWidth: 1,
    color: '#5AC087',
    fontWeight: 'bold',

    justifyContent: 'flex-end',
  },
  linkIcon: {
    marginTop: 1,
  },
});
