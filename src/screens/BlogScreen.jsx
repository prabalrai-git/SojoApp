import {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import Axios from './../api/server';
import HTML from 'react-native-render-html';
import moment from 'moment';
import Card from '../components/Card';
import FastImage from 'react-native-fast-image';

const BlogScreen = ({route, navigation}) => {
  const scrollRef = useRef(null);
  const {id} = route.params;
  const [data, setData] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const {width} = useWindowDimensions();

  const fetchData = async () => {
    try {
      const res = await Axios.get(`/news/${id}`);
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
  }, [id]);

  useEffect(() => {
    data && fetchSimilarBlogs();
  }, [data]);

  if (!data) {
    return <ActivityIndicator />;
  }

  return data ? (
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
      <View style={{flex: 1}}>
        {similarBlogs.map(item => {
          return <Card key={item.id} item={item} navigation={navigation} />;
        })}
      </View>
    </ScrollView>
  ) : (
    <ActivityIndicator />
  );
};

const styles = StyleSheet.create({
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
    color: '#6F7076',
    fontSize: 15,
  },
  topic: {
    flex: 1,
    backgroundColor: '#247144',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 7,
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
    color: '#757680',
  },
  previewText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: '#A3A4AB',
  },
});

const markdownStyles = StyleSheet.create({
  p: {
    fontSize: 16,
    lineHeight: 24,
    color: '#A3A4AB',
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
