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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {logoutUser} from './../helper/auth';
import {useNavigation} from '@react-navigation/native';
import {PRIMARY_COLOR, windowWidth} from '../helper/usefulConstants';
import Axios from './../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlogCard from '../components/Card';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [config, setConfig] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);

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
    fetchNews();
  }, [config]);

  const fetchNews = async () => {
    try {
      const res = await Axios.get(`/users/news?page=${page}`, config);

      news.length > 0
        ? setNews(prevData => [...prevData, ...res.data.data])
        : setNews(res.data.data);
      setLoading(false);
      setHasMore(res.data.pagination.nextPage !== null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      StatusBar.setBackgroundColor('#27B161');
    }, 1); // set a small delay here (in milliseconds)

    return () => clearTimeout(timeout);
  }, [navigation]);

  const BlogItem = React.memo(({item, navigation}) => {
    return <BlogCard item={item} navigation={navigation} key={item.id} />;
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

  return (
    <View>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>My Profile</Text>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('ProfileSettings')}>
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

      <ScrollView>
        <View style={{paddingHorizontal: 15, marginTop: 10, marginBottom: -15}}>
          <Text style={{fontWeight: 'bold', color: 'black', fontSize: 22}}>
            Albert Flores
          </Text>
          <Text style={{color: 'grey', marginBottom: 15}}>Student</Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnTxt}>Choose Your Topics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnTxt}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '100%',
              backgroundColor: 'lightgrey',
              height: 1,
              marginBottom: 20,
            }}></View>

          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>
            Saved stories
          </Text>
        </View>

        {news.map(item => {
          return <BlogItem item={item} navigation={navigation} />;
        })}
        {/* <FlatList
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
        /> */}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  btnTxt: {
    textAlign: 'center',
    color: 'white',
  },
  iconContainer: {
    backgroundColor: '#53C180',
    paddingHorizontal: 10,
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#296146',
    width: '49%',
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
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
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
  },
});
