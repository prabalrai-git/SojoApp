import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, View, Dimensions, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import Axios from './../api/server';

import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BlogCard = ({item, navigation}) => {
  // console.log('this is the item', item?.isBookmarkedByUser);
  const [image, setImage] = useState('');
  const {width} = Dimensions.get('window');
  const [toggled, setToggled] = useState(
    item?.isBookmarkedByUser ? item.isBookmarkedByUser : false,
  );
  const [config, setConfig] = useState();

  useEffect(() => {
    const w = Math.floor(width - 5 / 100);
    const resizedImageUrl = item?.image.replace(
      '/upload/',
      `/upload/w_${w.toString()},h_250,c_fill/`,
    );
    setImage(resizedImageUrl);
  }, [item?.image]);

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
        const res = await Axios.post(
          '/users/bookmarks/toggleOrAddBookmark',
          {userId: 4, newsId: item.id},
          config,
        );

        // console.log(
        //   'this is the log',
        //   res.data,
        //   '11111111111111111111111111111111111111',
        // );
        setToggled(prev => !prev);
      } catch (err) {
        console.log(err);
      }
    };
    toggleBookmark();
  };
  return (
    image && (
      <TouchableOpacity
        style={{marginTop: 30}}
        onPress={() => {
          navigation.navigate('Blog', {id: item?.id});
        }}>
        <View style={styles.cardContainer}>
          <View style={styles.wrapper}>
            <View>
              <FastImage
                source={{uri: image}}
                style={[styles.cardImage, {position: 'relative'}]}
                resizeMode={FastImage.resizeMode.cover}>
                <TouchableOpacity onPress={() => bookmarkPressed()}>
                  <Image
                    source={
                      toggled
                        ? require('../assets/marked.png')
                        : require('../assets/unmarked.png')
                    }
                    style={{
                      width: 45,
                      height: 45,
                      resizeMode: 'contain',
                      position: 'absolute',
                      top: 190,
                      left: 10,
                    }}
                  />
                </TouchableOpacity>
              </FastImage>
            </View>
            <Text
              style={styles.cardTitle}
              numberOfLines={2}
              ellipsizeMode="tail">
              {item?.title}
            </Text>

            <Text
              style={styles.cardText}
              numberOfLines={4}
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
                <Text style={styles.linkText}>Continue Reading</Text>
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
    )
  );
};

export default BlogCard;

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
