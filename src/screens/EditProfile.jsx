import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {hideTabBar} from '../redux/features/HideTabBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {windowWidth} from '../helper/usefulConstants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import Axios from '../api/server';

const EditProfile = props => {
  const [skipPolitical, setSkipPolitical] = useState(false);
  const [skipNSFW, setSkipNSFW] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSelectionValues, setModalSelectionValues] = useState();
  const [filteredState, setFilteredState] = useState();
  const [occupationOptions, setOccupationOptions] = useState();
  const [statesOptions, setStatesOptions] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const [gender, setGender] = useState();
  const [state, setState] = useState();
  const [ageGroup, setAgeGroup] = useState();
  const [occupation, setOccupation] = useState();

  const genderOptions = [
    {id: 1, title: 'Male', type: 'gender'},
    {id: 2, title: 'Female', type: 'gender'},
    {id: 3, title: 'Others', type: 'gender'},
    // {id: 4, title: 'Transgender', type: 'gender'},
    // {id: 5, title: 'Prefer not to say', type: 'gender'},
  ];

  const ageOptions = [
    {id: 1, title: '14-20', type: 'age'},
    {id: 2, title: '21-35', type: 'age'},
    {id: 3, title: '36-50', type: 'age'},
    {id: 4, title: '51 & above', type: 'age'},
  ];

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {profile, config, setReloadProfileOnEdit} = props.route.params;

  useEffect(() => {
    setSkipNSFW(profile?.skipNSFW);
    setSkipPolitical(profile?.skipPolitical);
    setAgeGroup(profile?.ageGroup);
    setGender(profile?.gender);
    setOccupation(profile?.occupation?.name);
    setState(setStateTitle(profile?.stateId));
  }, [profile?.skipNSFW, profile?.skipPolitical]);

  useEffect(() => {
    getOccupation();
    getStates();
  }, []);
  const getStates = async () => {
    const res = await Axios.get('/states/getAllStates');
    let data = res.data.data;
    let newdata = [];
    data.map(item => {
      return newdata.push({id: item.id, title: item.name, type: 'state'});
    });
    setStatesOptions(newdata);
  };

  const getOccupation = async () => {
    const res = await Axios.get('/occupations');
    let data = res.data.data;
    let newdata = [];
    data.map(item => {
      return newdata.push({id: item.id, title: item.name, type: 'occupation'});
    });

    setOccupationOptions(newdata);
  };

  const openRequiredModal = item => {
    if (item === 'age') {
      setModalSelectionValues(ageOptions);
      setModalVisible(true);
    }
    if (item === 'gender') {
      setModalSelectionValues(genderOptions);
      setModalVisible(true);
    }
    if (item === 'occupation') {
      setModalSelectionValues(occupationOptions);
      setModalVisible(true);
    }
    if (item === 'state') {
      setModalSelectionValues(statesOptions);
      setModalVisible(true);
    }
  };
  const searchTopic = () => {
    const filtered = statesOptions?.filter(state => {
      return state?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredState(filtered);
  };

  const setInfoState = item => {
    if (item.type === 'gender') {
      setModalVisible(prev => !prev);
      return setGender(item.title);
    }
    if (item.type === 'age') {
      setModalVisible(prev => !prev);

      return setAgeGroup(item.title);
    }
    if (item.type === 'occupation') {
      setModalVisible(prev => !prev);

      return setOccupation(item.title);
    }
    if (item.type == 'state') {
      setModalVisible(prev => !prev);

      return setState(item.title);
    }
  };

  const setOccupationId = item => {
    if (item === 'Student') {
      return 1;
    }
    if (item === 'Employee') {
      return 2;
    }
    if (item === 'Employer') {
      return 3;
    }
    if (item === 'Business Owner') {
      return 4;
    }
    if (item === 'Others') {
      return 5;
    }
  };
  const setStateId = state => {
    if (statesOptions) {
      const filteredstate = statesOptions?.filter(item => item.title === state);

      return filteredstate[0]?.id;
    }
  };

  const setStateTitle = state => {
    if (statesOptions) {
      const filteredstate = statesOptions?.filter(item => item.id === state);

      return filteredstate[0]?.title;
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(hideTabBar());
    });

    return unsubscribe;
  }, [navigation]);

  const darkMode = useSelector(state => state.darkMode.value);
  const onBackPress = () => {
    navigation.pop();
  };
  const listData = [
    {id: 1, title: 'Self harm or physical violence'},
    {id: 2, title: 'Murder, death or genocide'},
    {id: 3, title: 'Rape or sexual harassment'},
    {id: 4, title: 'Mental or psychological torture'},
    {id: 5, title: `Anything that's not safe for work (NSFW)`},
  ];

  useEffect(() => {
    statesOptions && searchTopic();
  }, [searchTerm]);

  const onSubmitChanges = async () => {
    const data = {
      ageGroup,
      gender,
      occupation: setOccupationId(occupation),
      state: !state ? profile?.stateId : setStateId(state),
      skipNSFW,
      skipPolitical,
    };

    try {
      await Axios.patch('users/profile/details', data, config);
      setReloadProfileOnEdit(prev => !prev);
      onBackPress();
    } catch (error) {
      console.log(error);
    }
  };

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
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.titleWrapper}
              onPress={() => {
                onSubmitChanges();
              }}>
              <Icon name="save" size={16} color="#26B160" />
              <Text style={styles.title}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={{paddingHorizontal: 14}}>
          <View style={{marginTop: 20, marginBottom: 16}}>
            <Text
              style={{
                fontWeight: 'bold',
                color: darkMode ? 'white' : 'black',
                fontSize: 22,
                textTransform: 'capitalize',
              }}>
              Edit Profile
            </Text>
            <Text
              style={{
                color: 'grey',
                marginBottom: 5,
                textTransform: 'capitalize',
              }}>
              {profile?.username !== 'user' || null
                ? profile?.username
                : profile?.email}
            </Text>
          </View>

          <View
            style={{
              width: '100%',
              backgroundColor: darkMode ? '#3F424A' : 'lightgrey',
              height: 1,
              marginBottom: 15,
            }}></View>
          {/* {start of body} */}
          <View>
            {/* <View style={styles.eachInputContainer}>
              <Text style={styles.txt}>Email</Text>

              <TextInput
                value={profile?.email}
                editable={false}
                style={styles.txtinput}></TextInput>
            </View> */}
            <View
              style={[
                styles.eachInputContainer,
                {
                  backgroundColor: darkMode
                    ? global.backgroundColorDark
                    : '#f3f4f7',
                },
              ]}>
              <Text style={[styles.txt, {color: darkMode ? 'white' : 'black'}]}>
                AGE GROUP
              </Text>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  // position: 'relative',
                }}>
                <TextInput
                  value={ageGroup ? ageGroup : profile?.ageGroup}
                  editable={false}
                  style={[
                    styles.txtinput,
                    {
                      color: darkMode ? 'white' : 'black',
                      backgroundColor: darkMode
                        ? global.inputColorDark
                        : global.inputColor,
                    },
                  ]}></TextInput>

                <TouchableOpacity
                  onPress={item => {
                    var title = 'age';
                    openRequiredModal(title);
                  }}
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 10,
                    // backgroundColor: 'red',
                    paddingLeft: 290,
                    padding: 10,
                  }}>
                  <Image
                    source={require('../assets/down.png')}
                    style={{
                      width: 18,
                      height: 18,
                      resizeMode: 'contain',
                      tintColor: darkMode ? 'white' : 'black',
                      alignSelf: 'flex-end',
                      paddingLeft: 50,
                      paddingVertical: 10,
                      // paddingLeft: 500,
                      // paddingRight: 0,
                    }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.eachInputContainer,
                {
                  backgroundColor: darkMode
                    ? global.backgroundColorDark
                    : '#f3f4f7',
                },
              ]}>
              <Text style={[styles.txt, {color: darkMode ? 'white' : 'black'}]}>
                gender
              </Text>

              <TouchableOpacity
                onPress={() => {
                  var title = 'gender';
                  openRequiredModal(title);
                }}
                style={{flexDirection: 'row', position: 'relative'}}>
                <TextInput
                  value={gender ? gender : profile?.gender}
                  editable={false}
                  style={[
                    styles.txtinput,
                    {
                      color: darkMode ? 'white' : 'black',
                      backgroundColor: darkMode
                        ? global.inputColorDark
                        : global.inputColor,
                    },
                  ]}></TextInput>

                <TouchableOpacity
                  onPress={item => {
                    var title = 'gender';
                    openRequiredModal(title);
                  }}
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 10,
                    // backgroundColor: 'red',
                    paddingLeft: 290,
                    padding: 10,
                  }}>
                  <Image
                    source={require('../assets/down.png')}
                    style={{
                      width: 18,
                      height: 18,
                      resizeMode: 'contain',
                      tintColor: darkMode ? 'white' : 'black',
                      alignSelf: 'flex-end',
                      paddingLeft: 50,
                      paddingVertical: 10,
                      // paddingLeft: 500,
                      // paddingRight: 0,
                    }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.eachInputContainer,
                {
                  backgroundColor: darkMode
                    ? global.backgroundColorDark
                    : '#f3f4f7',
                },
              ]}>
              <Text style={[styles.txt, {color: darkMode ? 'white' : 'black'}]}>
                occupation
              </Text>

              <TouchableOpacity
                style={{flexDirection: 'row', position: 'relative'}}>
                <TextInput
                  value={occupation ? occupation : profile?.occupation?.name}
                  editable={false}
                  style={[
                    styles.txtinput,
                    {
                      color: darkMode ? 'white' : 'black',
                      backgroundColor: darkMode
                        ? global.inputColorDark
                        : global.inputColor,
                    },
                  ]}></TextInput>

                <TouchableOpacity
                  onPress={item => {
                    var title = 'occupation';
                    openRequiredModal(title);
                  }}
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 10,
                    // backgroundColor: 'red',
                    paddingLeft: 290,
                    padding: 10,
                  }}>
                  <Image
                    source={require('../assets/down.png')}
                    style={{
                      width: 18,
                      height: 18,
                      resizeMode: 'contain',
                      tintColor: darkMode ? 'white' : 'black',
                      alignSelf: 'flex-end',
                      paddingLeft: 50,
                      paddingVertical: 10,
                      // paddingLeft: 500,
                      // paddingRight: 0,
                    }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.eachInputContainer,
                {
                  backgroundColor: darkMode
                    ? global.backgroundColorDark
                    : '#f3f4f7',
                },
              ]}>
              <Text style={[styles.txt, {color: darkMode ? 'white' : 'black'}]}>
                state
              </Text>

              <TouchableOpacity
                style={{flexDirection: 'row', position: 'relative'}}>
                <TextInput
                  value={state ? state : setStateTitle(profile?.stateId)}
                  editable={false}
                  style={[
                    styles.txtinput,
                    {
                      color: darkMode ? 'white' : 'black',
                      backgroundColor: darkMode
                        ? global.inputColorDark
                        : global.inputColor,
                    },
                  ]}></TextInput>

                <TouchableOpacity
                  onPress={item => {
                    var title = 'state';
                    openRequiredModal(title);
                  }}
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 10,
                    // backgroundColor: 'red',
                    paddingLeft: 290,
                    padding: 10,
                  }}>
                  <Image
                    source={require('../assets/down.png')}
                    style={{
                      width: 18,
                      height: 18,
                      resizeMode: 'contain',
                      tintColor: darkMode ? 'white' : 'black',
                      alignSelf: 'flex-end',
                      paddingLeft: 50,
                      paddingVertical: 10,
                      // paddingLeft: 500,
                      // paddingRight: 0,
                    }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <View style={[styles.containers, {marginBottom: 35}]}>
              <MaterialIcons
                name={skipPolitical ? 'check-box' : 'check-box-outline-blank'}
                size={30}
                color={darkMode ? 'white' : 'black'}
                onPress={() => setSkipPolitical(!skipPolitical)}
              />
              <Text
                style={[styles.txts, {color: darkMode ? 'white' : 'black'}]}>
                Skip and avoid political news and anything political
              </Text>
            </View>
            <View style={styles.containers}>
              <MaterialIcons
                name={skipNSFW ? 'check-box' : 'check-box-outline-blank'}
                size={30}
                color={darkMode ? 'white' : 'black'}
                onPress={() => setSkipNSFW(!skipNSFW)}
              />
              <Text
                style={[styles.txts, {color: darkMode ? 'white' : 'black'}]}>
                Skip and avoid any stories that have the following:
              </Text>
            </View>
            <View style={[styles.points, {marginBottom: 60}]}>
              {listData.map(item => {
                return (
                  <View key={item.id}>
                    <Text
                      style={{
                        color: darkMode ? 'grey' : 'black',
                        fontWeight: '400',
                        marginVertical: 1,
                      }}>
                      ● {item.title}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
        <Modal
          isVisible={modalVisible}
          backdropOpacity={0.4}
          onBackdropPress={() => setModalVisible(false)}
          animationOut="fadeOutDown"
          backdropTransitionOutTiming={600}
          animationOutTiming={400}
          style={{
            position: 'relative',
            margin: 0,
          }}>
          <View
            style={{
              backgroundColor: darkMode ? global.backgroundColorDark : 'white',
              position: 'absolute',
              bottom: 0,
              height: 250,
              width: '100%',
              borderTopRightRadius: 20,
              paddingTop: 25,
              borderTopLeftRadius: 20,
            }}>
            <View
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
              }}>
              {modalSelectionValues &&
                modalSelectionValues[0].type === 'state' && (
                  <>
                    <TextInput
                      placeholderTextColor={'grey'}
                      placeholder="Search your state.."
                      onChangeText={setSearchTerm}
                      onSubmitEditing={searchTopic}
                      style={{
                        backgroundColor: darkMode
                          ? global.inputColorDark
                          : '#f3f4f7',
                        width: '95%',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: 5,
                        marginBottom: 10,
                        paddingLeft: 10,
                        color: darkMode ? 'white' : 'black',
                        height: 45,
                      }}></TextInput>
                    <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                        searchTopic();
                      }}>
                      <Icon
                        name="search"
                        size={22}
                        style={{
                          position: 'absolute',
                          right: 20,
                          top: 8,
                          padding: 5,
                        }}
                        color={'#A9A9A9'}
                      />
                    </TouchableOpacity>
                  </>
                )}
            </View>
            <ScrollView>
              {filteredState
                ? filteredState?.map(item => {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={{width: windowWidth}}
                        onPress={() => {
                          setInfoState(item);
                        }}>
                        <Text
                          style={{
                            color: darkMode ? 'white' : 'black',
                            marginHorizontal: 20,
                          }}>
                          {item.title}
                        </Text>
                        {filteredState.length > 1 && (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: 'lightgrey',
                              marginVertical: 18,

                              width: windowWidth,
                            }}></View>
                        )}
                      </TouchableOpacity>
                    );
                  })
                : modalSelectionValues?.map(item => {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={{width: windowWidth}}
                        onPress={() => {
                          setInfoState(item);
                        }}>
                        <Text
                          style={{
                            color: darkMode ? 'white' : 'black',
                            marginHorizontal: 20,
                          }}>
                          {item.title}
                        </Text>
                        <View
                          style={{
                            height: 1.2,
                            backgroundColor: darkMode ? '#545760' : 'lightgrey',
                            marginVertical: 18,

                            width: windowWidth,
                          }}></View>
                      </TouchableOpacity>
                    );
                  })}
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  points: {
    width: windowWidth * 0.7,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 4,
  },
  txts: {
    color: 'black',
    // textTransform: 'uppercase',
    width: windowWidth * 0.8,
    alignSelf: 'center',
    marginHorizontal: 5,
    fontWeight: '500',
  },
  img: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
    marginRight: 4,
  },
  containers: {
    width: windowWidth,
    paddingLeft: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  eachInputContainer: {
    flexDirection: 'column',
    width: windowWidth * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#f3f4f7',
    marginBottom: 20,
  },
  txtinput: {
    backgroundColor: 'white',
    flexDirection: 'row',
    width: '100%',
    height: 45,
    borderRadius: 6,
    marginTop: 5,
    color: 'black',
    paddingLeft: 14,
  },

  txt: {
    textTransform: 'uppercase',
    color: 'black',
    fontWeight: '600',
    fontSize: 13,
  },
  topBar: {
    backgroundColor: '#27B161',
    padding: 20,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FEFEFF',
    paddingVertical: 8,
    paddingRight: 7,
    paddingLeft: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 8,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#26B160',
    fontSize: 14,
    // marginRight: 3,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    marginLeft: 5,
  },
});
