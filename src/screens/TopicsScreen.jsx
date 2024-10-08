import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Axios from './../api/server';
import CreateProfileHeader from '../components/CreateProfileHeader';
import {windowWidth} from '../helper/usefulConstants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddtopicsRegister from '../components/AddtopicsRegister';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

const TopicsScreen = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [term, setTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState(data);
  const [userTopics, setUserTopics] = useState(null);
  const [newTopicAdded, setNewTopicAdded] = useState(false);

  const config = route?.params?.config;

  // const getAdMobIdsFromFireStore = async () => {
  //   try {
  //     const ApIds = await firestore().collection('adMobIds').get();

  //     setAdMobIds(ApIds.docs);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getBannerAdsIntervalFromFireStore = async () => {
  //   try {
  //     const interval = await firestore().collection('bannerAdsInterval').get();

  //     setAdInterval(interval.docs[0]._data.Interval);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getAdMobIdsFromFireStore();
  //   getBannerAdsIntervalFromFireStore();
  // }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await Axios.get('/users/profile', config);
        // console.log(res.data.data.topics);
        setUserTopics(res.data.data.topics);
      } catch (err) {}
    };
    fetchUserData();
  }, [newTopicAdded]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get('/topics');
        setData(res.data.data);
        setFilteredTopics(res.data.data);
      } catch (err) {}
    };
    fetchData();
  }, [navigation]);

  useEffect(() => {
    if (term === '') {
      setFilteredTopics(data);
    }
  }, [term]);

  const searchTopic = () => {
    if (term === '') {
      setFilteredTopics(data);
    } else {
      const filtered = data.filter(topic => {
        return topic.name.toLowerCase().includes(term.toLowerCase());
      });
      setFilteredTopics(filtered);
    }
  };
  const darkMode = useSelector(state => state.darkMode.value);

  return (
    <>
      <AlertNotificationRoot theme="white">
        <View
          style={{
            flex: 1,
            backgroundColor: darkMode
              ? global.backgroundColorDark
              : global.backgroundColor,
          }}>
          <CreateProfileHeader chooseTopics={true} />
          <ScrollView stickyHeaderIndices={[2]}>
            <Text
              style={{
                color: darkMode ? 'white' : 'black',
                paddingHorizontal: 20,
                // paddingLeft: 39,
                fontSize: 18,
                textAlign: 'left',
                fontWeight: '500',
              }}>
              Choose your topics.
            </Text>
            <Text
              style={{
                color: darkMode ? 'white' : 'black',
                paddingHorizontal: 20,
                // paddingLeft: 39,
                fontSize: 16,
                textAlign: 'left',
                marginTop: 10,
                fontWeight: '500',
                marginBottom: 15,
              }}>
              Have your news be filtered out for by choosing the topics that you
              want to follow.
            </Text>
            {/* <SearchBar /> */}
            <View
              style={{
                backgroundColor: darkMode
                  ? global.backgroundColorDark
                  : global.backgroundColor,
              }}>
              <View
                style={[
                  styles.container,
                  {
                    backgroundColor: darkMode
                      ? global.inputColorDark
                      : global.inputColor,
                  },
                ]}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: darkMode ? 'white' : 'black',

                      backgroundColor: darkMode
                        ? global.inputColorDark
                        : global.inputColor,
                    },
                  ]}
                  placeholder="Search for a topic..."
                  placeholderTextColor="#A9A9A9"
                  value={term}
                  onChangeText={setTerm}
                  onSubmitEditing={searchTopic}
                />
                <Icon
                  name="search"
                  size={20}
                  color={darkMode ? 'white' : '#000'}
                  onPress={() => {
                    Keyboard.dismiss();
                    if (term.trim().length > 0) {
                      searchTopic();
                    } else {
                      setFilteredTopics(data);
                    }
                  }}
                />
              </View>
            </View>
            <View style={{paddingHorizontal: 20}}>
              {/* <Text style={{fontSize: 24, fontWeight: 'bold', color: '#6B6F76'}}>
          Explore Topics
        </Text> */}
              <View style={{marginTop: 20}}>
                {filteredTopics?.map((item, index) => {
                  return (
                    <AddtopicsRegister
                      key={item?.id}
                      item={item}
                      config={config}
                      setNewTopicAdded={setNewTopicAdded}
                      userTopics={userTopics}
                    />
                  );
                })}
              </View>
              {/* <FlatList
          data={data}
          renderItem={({item}) => {
            return (
              <TopicLoading
                item={item}
                // selectedTopics={selectedTopics}
                // config={config}
                // fetchProfile={fetchProfile}
              />
            );
          }}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        /> */}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              if (userTopics.length < 3) {
                return Toast.show({
                  autoClose: 2000,
                  onPress: () => Toast.hide(),
                  type: ALERT_TYPE.WARNING,
                  textBody: 'Please choose at least 3 topics!',
                });
              }
              navigation.replace('AuthHome');
              // if (!loading) {
              //   handleFormSubmit();
              // }
            }}
            style={[
              styles.loginButton,
              {
                marginBottom: 35,
                backgroundColor: darkMode ? '#286146' : global.brandColor,
              },
            ]}>
            {loading1 ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginText}>Start Browsing</Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={20}
                  color="#FFFFFF"
                  style={styles.loginButtonIcon}
                />
              </>
            )}
          </TouchableOpacity>
          {/* 
        <TouchableOpacity
          onPress={() => {
            return console.log('hello');
            if (!loading1) {
              handleFormSubmit();
            }
          }}
          style={[styles.loginButton, {backgroundColor: 'white'}]}>
          {loading1 ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={[styles.loginText, {color: '#5fbc7d'}]}>
                Skip for now
              </Text>
              <MaterialIcons
                name="block-flipped"
                size={20}
                color="#5fbc7d"
                style={styles.loginButtonIcon}
              />
            </>
          )}
        </TouchableOpacity> */}
        </View>
      </AlertNotificationRoot>
    </>
  );
};

export default TopicsScreen;

const styles = StyleSheet.create({
  loginButton: {
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 35,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: windowWidth * 0.95,
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#26B160',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#f3f4f7',
  },
  linkTitle: {
    color: '#4B4D54',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 15,
    flex: 1,
  },
  linkIcon: {
    borderLeftWidth: 1,
    borderLeftColor: '#DEE1E5',
    padding: 17,
    paddingLeft: 20,
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CDCFD3',
    padding: 15,
    marginBottom: 15,
    borderBottomColor: '#CDCFD3',
    borderBottomWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E424B',
    flex: 3,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#919298',
    paddingLeft: 0,
    paddingVertical: 8,
    // backgroundColor: '#E6E6E8',
  },
});
