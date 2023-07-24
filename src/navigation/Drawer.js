import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  StatusBar,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Axios from './../api/server';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {ExploreStack, HomeStack} from './Stacks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useNavigation,
  useIsFocused,
  DrawerActions,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {showTabBar} from '../redux/features/HideTabBar';

const Drawer = createDrawerNavigator();

const CustomHeader = ({setFilteredTopics, navigation}) => {
  const [topics, setTopics] = useState([]);
  const [term, setTerm] = useState('');

  // useEffect(() => {
  //   if (term.length > 0) {
  //     // const delay = setTimeout(() => {
  //     //   searchTopic();
  //     // }, 500);
  //     // return () => clearTimeout(delay);
  //   } else {
  //     setFilteredTopics(topics);
  //   }
  // }, []);

  // fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await Axios.get('/topics');
        setTopics(res.data.data);
        setFilteredTopics(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTopics();
  }, []);
  const isFocused = useIsFocused();

  const searchTopic = () => {
    const filtered = topics.filter(topic => {
      return topic.name.toLowerCase().includes(term.toLowerCase());
    });

    setFilteredTopics(filtered);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (!isFocused) {
      navigation.closeDrawer();
    }
  }, [isFocused]);
  const darkMode = useSelector(state => state.darkMode.value);
  return (
    <SafeAreaView
      style={{
        backgroundColor: darkMode ? global.brandColorDark : global.brandColor,
      }}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: darkMode
              ? global.backgroundColorDark
              : global.backgroundColor,
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            setTerm('');
            setFilteredTopics(topics);
            navigation.closeDrawer();
          }}>
          <MaterialIcon name="arrow-back" size={22} color="#3F424A" />
        </TouchableOpacity>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: darkMode
                ? global.inputColorDark
                : global.inputColor,
            },
          ]}>
          <TextInput
            placeholder="Search for a topic"
            placeholderTextColor="#A9A9A9"
            style={[
              styles.input,
              {
                color: darkMode ? 'white' : 'black',
                backgroundColor: darkMode
                  ? global.inputColorDark
                  : global.inputColor,
              },
            ]}
            onChangeText={setTerm}
            // onChangeText={newText => setText(newText)}
            defaultValue={term}
          />
          <FontAwesomeIcon
            name="search"
            size={22}
            color="#7C8089"
            style={styles.searchIcon}
            onPress={() => {
              searchTopic();
              Keyboard.dismiss();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export const HomeDrawerNavigator = () => {
  const isFocused = useIsFocused();
  const [topics, setTopics] = useState([]);
  const [term, setTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [profile, setProfile] = useState(null);
  const [config, setConfig] = useState(null);
  const navigation = useNavigation();

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     StatusBar.setBackgroundColor('#27B060'); // Set the specific color when the screen is focused
  //   });

  //   return unsubscribe;
  // }, [navigation]);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(showTabBar());
    });

    return unsubscribe();
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
        return navigation.navigate('Auth', {screen: 'InfoScreen'});
      }
      setTopics(res.data.data.topics);
      setFilteredTopics(res.data.data.topics);
      setProfile(res.data.data);
    } catch (err) {
      console.log(err);
      if (err && err.response && err.response.status === 401) {
        logout();
        setProfile(null);
        return router.replace('/');
      }
    }
  };

  useEffect(() => {
    if (config) {
      fetchProfile();
    }
  }, [config]);
  useEffect(() => {
    if (config) {
      const unsubscribe = navigation.addListener('focus', async () => {
        await fetchProfile();
      });

      return unsubscribe;
    }
  }, [config, navigation]);

  // const searchTopic = () => {
  //   const filtered = topics.filter(topic => {
  //     return topic.name.toLowerCase().includes(term.toLowerCase());
  //   });
  //   setFilteredTopics(filtered);
  // };

  // useEffect(() => {
  //   if (term.length > 0) {
  //     const delay = setTimeout(() => {
  //       searchTopic();
  //     }, 500);
  //     return () => clearTimeout(delay);
  //   } else {
  //     setFilteredTopics(topics);
  //   }
  // }, []);

  const darkMode = useSelector(state => state.darkMode.value);

  const CustomHomeDrawerComponent = ({navigation}) => {
    useEffect(() => {
      if (!isFocused) {
        navigation.closeDrawer();
      }
    }, [isFocused]);

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: darkMode
            ? global.backgroundColorDark
            : global.backgroundColor,
        }}>
        <DrawerContentScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            style={styles.container}
            onPress={() => {
              navigation.navigate('Curated');
              navigation.closeDrawer();
            }}>
            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.labelText,
                  {color: darkMode ? 'white' : '#41424B'},
                ]}>
                All Topics
              </Text>
              <Icon
                name="arrowright"
                color={darkMode ? 'white' : '#161B21'}
                size={22}
                style={[
                  styles.drawerItemIcon,
                  {borderLeftColor: darkMode ? '#3f424a' : '#DEE0E4'},
                ]}
              />
            </View>
          </TouchableOpacity>
          <ScrollView>
            {filteredTopics.map(item => {
              return (
                <TouchableOpacity
                  style={styles.container}
                  key={item.id}
                  onPress={() => {
                    navigation.navigate('CategoryScreen', {
                      id: item.id,
                    });
                    navigation.closeDrawer();
                  }}>
                  <View style={styles.labelContainer}>
                    <Text
                      style={[
                        styles.labelText,
                        {color: darkMode ? 'white' : '#41424B'},
                      ]}>
                      {item.name}
                    </Text>
                    <Icon
                      name="arrowright"
                      color={darkMode ? 'white' : '#161B21'}
                      size={22}
                      style={[
                        styles.drawerItemIcon,
                        {borderLeftColor: darkMode ? '#3f424a' : '#DEE0E4'},
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </DrawerContentScrollView>
      </SafeAreaView>
    );
  };
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawerStyle,
        drawerPosition: 'right',
        swipeEnabled: false,
      }}
      drawerContent={props => {
        return (
          <>
            <CustomHeader {...props} setFilteredTopics={setFilteredTopics} />
            <CustomHomeDrawerComponent {...props} />
          </>
        );
      }}>
      {/* <Drawer.Screen name="Home" component={HomeStack} /> */}
      <Drawer.Screen name="Home">
        {() => <HomeStack fetchProfile={fetchProfile} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const CustomExploreHeader = ({setFilteredTopics, navigation}) => {
  const [topics, setTopics] = useState([]);
  const [term, setTerm] = useState('');

  // useEffect(() => {
  //   if (term.length > 0) {
  //     // const delay = setTimeout(() => {
  //     //   searchTopic();
  //     // }, 500);
  //     // return () => clearTimeout(delay);
  //   } else {
  //     setFilteredTopics(topics);
  //   }
  // }, []);

  // fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await Axios.get('/topics');
        setTopics(res.data.data);
        setFilteredTopics(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTopics();
  }, []);
  const isFocused = useIsFocused();

  const searchTopic = () => {
    const filtered = topics.filter(topic => {
      return topic.name.toLowerCase().includes(term.toLowerCase());
    });

    setFilteredTopics(filtered);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (!isFocused) {
      navigation.closeDrawer();
    }
  }, [isFocused]);
  const darkMode = useSelector(state => state.darkMode.value);

  return (
    <SafeAreaView
      style={{
        backgroundColor: darkMode ? global.brandColorDark : global.brandColor,
      }}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: darkMode
              ? global.backgroundColorDark
              : global.backgroundColor,
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            setTerm('');
            setFilteredTopics(topics);
            navigation.closeDrawer();
          }}>
          <MaterialIcon name="arrow-back" size={22} color="#3F424A" />
        </TouchableOpacity>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: darkMode
                ? global.inputColorDark
                : global.inputColor,
            },
          ]}>
          <TextInput
            placeholder="Search for a topic"
            placeholderTextColor="#A9A9A9"
            style={[
              styles.input,
              {
                color: darkMode ? 'white' : 'black',

                backgroundColor: darkMode
                  ? global.inputColorDark
                  : global.inputColor,
              },
            ]}
            defaultValue={term}
            onChangeText={setTerm}
            // onSubmitEditing={() => searchTopic()}
          />
          <FontAwesomeIcon
            name="search"
            size={22}
            color="#7C8089"
            style={styles.searchIcon}
            onPress={() => {
              searchTopic();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export const ExploreDrawerNavigator = () => {
  const [topics, setTopics] = useState([]);
  const [term, setTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);

  // useEffect(() => {
  //   if (term.length > 0) {
  //     // const delay = setTimeout(() => {
  //     //   searchTopic();
  //     // }, 500);
  //     // return () => clearTimeout(delay);
  //   } else {
  //     setFilteredTopics(topics);
  //   }
  // }, []);

  // fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await Axios.get('/topics');
        setTopics(res.data.data);
        setFilteredTopics(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTopics();
  }, []);

  const darkMode = useSelector(state => state.darkMode.value);

  const CustomExploreDrawerComponent = ({navigation}) => {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: darkMode
            ? global.backgroundColorDark
            : global.backgroundColor,
        }}>
        <DrawerContentScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            style={styles.container}
            onPress={() => {
              navigation.push('Explore');
              navigation.closeDrawer();
            }}>
            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.labelText,
                  {color: darkMode ? 'white' : '#41424B'},
                ]}>
                All Topics
              </Text>
              <Icon
                name="arrowright"
                color={darkMode ? 'white' : '#161B21'}
                size={22}
                style={[
                  styles.drawerItemIcon,
                  {borderLeftColor: darkMode ? '#3f424a' : '#DEE0E4'},
                ]}
              />
            </View>
          </TouchableOpacity>
          {filteredTopics.map(item => {
            return (
              <TouchableOpacity
                style={styles.container}
                key={item.id}
                onPress={() => {
                  navigation.push('ExploreCategory', {
                    id: item.id,
                  });
                  navigation.closeDrawer();
                }}>
                <View style={styles.labelContainer}>
                  <Text
                    style={[
                      styles.labelText,
                      {color: darkMode ? 'white' : '#41424B'},
                    ]}>
                    {item.name}
                  </Text>
                  <Icon
                    name="arrowright"
                    color={darkMode ? 'white' : '#161B21'}
                    size={22}
                    style={[
                      styles.drawerItemIcon,
                      {borderLeftColor: darkMode ? '#3f424a' : '#DEE0E4'},
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </DrawerContentScrollView>
      </SafeAreaView>
    );
  };

  return (
    <Drawer.Navigator
      initialRouteName="ExploreScreen"
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawerStyle,
        drawerPosition: 'right',
        swipeEnabled: false,
      }}
      drawerContent={props => {
        return (
          <>
            <CustomExploreHeader
              {...props}
              setFilteredTopics={setFilteredTopics}
            />
            <CustomExploreDrawerComponent {...props} />
          </>
        );
      }}>
      <Drawer.Screen name="ExploreScreen" component={ExploreStack} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerStyle: {
    backgroundColor: '#F3F4F7',
    width: '100%',
  },

  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 0,
    paddingLeft: 18,
    color: '#41424B',
  },
  drawerItemIcon: {
    borderLeftWidth: 1,
    padding: 18,
    // paddingVertical: 15,
    borderLeftColor: '#DEE0E4',
  },

  header: {
    backgroundColor: '#F3F4F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
  },

  inputContainer: {
    flex: 1,
    backgroundColor: '#E6E6E8',
    borderRadius: 5,
    flexDirection: 'row', // align items in row
    alignItems: 'center', // align items vertically
    marginLeft: 10,

    height: 43,
    paddingHorizontal: 10,
    color: '#A8ACB3',
  },
  input: {
    flex: 1, // take up remaining space
    color: '#000',
  },
  searchIcon: {
    marginLeft: 10,
  },
});
