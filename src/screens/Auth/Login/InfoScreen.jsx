import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from './../../../api/server';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import CreateProfileHeader from '../../../components/CreateProfileHeader';
import {windowWidth} from '../../../helper/usefulConstants';
import {Image} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';

const InfoScreen = ({navigation}) => {
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState(null);
  const [gender, setGender] = useState(null);
  const [occupation, setOccupation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [occupationOptions, setOccupationOptions] = useState();
  const [statesOptions, setStatesOptions] = useState();
  const [state, setState] = useState();
  const [modalSelectionValues, setModalSelectionValues] = useState();
  const [errorMsg, setErrorMsg] = useState(false);
  const [searchTerm, setSearchTerm] = useState();
  const [filteredState, setFilteredState] = useState();

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
  useEffect(() => {
    getOccupation();
    getStates();
  }, []);

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setErrorMsg(false);
      }, 5000);
    }
  }, [errorMsg]);

  const searchTopic = () => {
    const filtered = statesOptions?.filter(state => {
      return state.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredState(filtered);
  };

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
    const filteredstate = statesOptions?.filter(item => item.title === state);
    return filteredstate[0].id;
  };

  const handleFormSubmit = async () => {
    // setLoading(true);

    if (!ageGroup || !gender || !occupation) {
      return setErrorMsg(true);
    } else {
      setErrorMsg(false);
      const data = {
        ageGroup,
        gender,
        occupation: setOccupationId(occupation),
        state: setStateId(state),
      };
      return navigation.navigate('Preferences', {data});
    }
  };

  const skipBtnPressed = () => {
    return navigation.navigate('Preferences');
  };

  // handle error message display
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // set config

  useEffect(() => {
    // AsyncStorage.removeItem('token');
    if (navigation && !AsyncStorage.getItem('token')) {
      navigation.replace('WelcomeScreen');
    }
  }, [navigation]);

  // fetch profile
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const res = await Axios.get('/users/profile', config);
  //       setProfile(res.data.data);
  //       if (res.data.data.isComplete) {
  //         navigation.reset({index: 0, routes: [{name: 'Curated'}]});
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       if (err && err.response && err.response.status === 401) {
  //         logout();
  //         setIsLoggedIn(false);
  //         setProfile(null);
  //         navigation.reset({index: 0, routes: [{name: 'Auth'}]});
  //       }
  //     }
  //   };
  //   if (config) {
  //     fetchProfile();
  //   }
  // }, [config]);

  // useEffect(() => {
  //   searchTopic();
  // }, [searchTerm]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredState();
    }
    setFilteredState();
  }, [searchTerm, modalVisible]);
  const darkMode = useSelector(state => state.darkMode.value);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: darkMode
            ? global.backgroundColorDark
            : global.backgroundColor,
        }}>
        <ScrollView>
          <CreateProfileHeader />
          <Text
            style={{
              color: darkMode ? 'white' : 'black',
              paddingHorizontal: 10,
              // paddingLeft: 20,
              fontSize: 18,
              textAlign: 'left',
              width: windowWidth * 0.94,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 0,
              fontWeight: '500',
            }}>
            Tell us about you.
          </Text>
          <Text
            style={{
              color: darkMode ? 'white' : 'black',
              paddingHorizontal: 10,
              // paddingLeft: 20,
              fontSize: 16,
              width: windowWidth * 0.94,
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'left',
              marginTop: 10,
              fontWeight: '500',
              marginBottom: 35,
            }}>
            Inform us about yourself so we can curate news stories that are
            relevant to you.
          </Text>

          <View
            style={[
              styles.eachInputContainer,
              {
                backgroundColor: darkMode
                  ? global.backgroundColorDark
                  : global.backgroundColor,
              },
            ]}>
            <Text style={[styles.txt, {color: darkMode ? 'white' : 'black'}]}>
              what age group do you belong to?
            </Text>

            <TouchableOpacity
              style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput
                value={ageGroup}
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
                  source={require('../../../assets/down.png')}
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
                  : global.backgroundColor,
              },
            ]}>
            <Text style={[styles.txt, {color: darkMode ? 'white' : 'black'}]}>
              what is your gender?
            </Text>

            <TouchableOpacity
              style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput
                value={gender}
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
                  source={require('../../../assets/down.png')}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: darkMode ? 'white' : 'black',
                    alignSelf: 'flex-end',
                    paddingLeft: 50,
                    paddingVertical: 10,
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
                  : global.backgroundColor,
              },
            ]}>
            <Text style={[styles.txt, {color: darkMode ? 'white' : 'black'}]}>
              what occupation are you in?
            </Text>

            <TouchableOpacity
              style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput
                value={occupation}
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
                  source={require('../../../assets/down.png')}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: darkMode ? 'white' : 'black',
                    alignSelf: 'flex-end',
                    paddingLeft: 50,
                    paddingVertical: 10,
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
                  : global.backgroundColor,
              },
            ]}>
            <Text style={[styles.txt, {color: darkMode ? 'white' : 'black'}]}>
              Which state do you live in?
            </Text>

            <TouchableOpacity
              style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput
                value={state}
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
                  source={require('../../../assets/down.png')}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: darkMode ? 'white' : 'black',
                    alignSelf: 'flex-end',
                    paddingLeft: 50,
                    paddingVertical: 10,
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          {errorMsg && (
            <Text
              style={{
                color: 'red',
                fontWeight: '600',
                textAlign: 'center',
                paddingHorizontal: 25,
              }}>
              Please select options for all fields to continue or skip.
            </Text>
          )}
          <View
            style={[
              styles.eachInputContainer,
              {
                backgroundColor: darkMode
                  ? global.backgroundColorDark
                  : global.backgroundColor,
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                handleFormSubmit();
              }}
              style={[
                styles.loginButton,
                {backgroundColor: darkMode ? '#286146' : global.brandColor},
              ]}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginText}>Continue</Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={20}
                    color="#FFFFFF"
                    style={styles.loginButtonIcon}
                  />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                return skipBtnPressed();
              }}
              style={[
                styles.loginButton,
                {
                  backgroundColor: darkMode
                    ? global.inputColorDark
                    : global.inputColor,
                },
              ]}>
              {loading ? (
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
            </TouchableOpacity>
          </View>
          <Modal
            isVisible={modalVisible}
            onBackdropPress={() => setModalVisible(false)}
            animationOut="fadeOutDown"
            backdropTransitionOutTiming={700}
            animationOutTiming={500}
            style={{
              position: 'relative',
              margin: 0,
            }}>
            <View
              style={{
                backgroundColor: darkMode
                  ? global.backgroundColorDark
                  : global.backgroundColor,
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
                            : global.inputColor,
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
                              height: 1,
                              backgroundColor: 'lightgrey',
                              marginVertical: 18,

                              width: windowWidth,
                            }}></View>
                        </TouchableOpacity>
                      );
                    })}
              </ScrollView>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  txtinput: {
    backgroundColor: 'white',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderRadius: 6,
    marginTop: 5,
    color: 'black',
    paddingLeft: 14,
  },

  txt: {
    textTransform: 'uppercase',
    color: 'black',
    fontWeight: '500',
  },
  inputContainer: {
    width: windowWidth * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#f3f4f7',
  },
  eachInputContainer: {
    flexDirection: 'column',
    width: windowWidth * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#f3f4f7',
    marginBottom: 20,
  },
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f7',
  },
  content: {
    width: '80%',
    maxWidth: 400,

    // marginTop: 30,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: 'black',
    fontWeight: '500',
    textTransform: 'uppercase',
  },

  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
    color: 'black',
  },
  // input: {
  //   // height: 40,
  //   borderColor: '#CDCFD3',
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   marginBottom: 15,
  //   paddingLeft: 10,
  //   paddingVertical: 10,
  //   // paddingLeft: 5,
  //   color: '#000000',
  // },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  iconWrapper: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 8,
    color: '#919298',
  },
  loginButton: {
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#26B160',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginButtonIcon: {
    marginLeft: 10,
    marginTop: 1,
  },
  errorMessage: {
    color: '#000000',
    marginTop: 10,
    fontSize: 14,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CDCFD3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
});

export default InfoScreen;
