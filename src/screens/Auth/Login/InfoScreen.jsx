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

  const genderOptions = [
    {id: 1, title: 'Male', type: 'gender'},
    {id: 2, title: 'Female', type: 'gender'},
    {id: 3, title: 'Others', type: 'gender'},
    {id: 4, title: 'Transgender', type: 'gender'},
    {id: 5, title: 'Prefer not to say', type: 'gender'},
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
    const filteredstate = statesOptions.filter(item => item.title === state);
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
      // return console.log(data);
      return navigation.replace('Preferences', {data});
    }
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

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#f3f4f7'}}>
        <ScrollView>
          <CreateProfileHeader />
          <Text
            style={{
              color: 'black',
              paddingHorizontal: 10,
              paddingLeft: 20,
              fontSize: 18,
              textAlign: 'left',
              marginTop: 0,
              fontWeight: '500',
            }}>
            Tell us about you.
          </Text>
          <Text
            style={{
              color: 'black',
              paddingHorizontal: 10,
              paddingLeft: 20,
              fontSize: 16,
              textAlign: 'left',
              marginTop: 10,
              fontWeight: '500',
              marginBottom: 35,
            }}>
            Inform us about yourself so we can curate news stories that are
            relevant to you.
          </Text>

          <View style={styles.eachInputContainer}>
            <Text style={styles.txt}>what age group do you belong to?</Text>

            <TouchableOpacity
              onPress={() => {
                var title = 'age';
                openRequiredModal(title);
              }}
              style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput
                value={ageGroup}
                editable={false}
                style={styles.txtinput}></TextInput>

              <View
                style={{
                  position: 'absolute',
                  right: 5,
                  top: 15,
                  // backgroundColor: 'red',
                  padding: 10,
                }}>
                <Image
                  source={require('../../../assets/down.png')}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: 'black',
                    alignSelf: 'flex-end',
                    paddingLeft: 50,
                    paddingVertical: 10,
                    // paddingLeft: 500,
                    // paddingRight: 0,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.eachInputContainer}>
            <Text style={styles.txt}>what is your gender?</Text>

            <TouchableOpacity
              onPress={() => {
                var title = 'gender';
                openRequiredModal(title);
              }}
              style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput
                value={gender}
                editable={false}
                style={styles.txtinput}></TextInput>

              <View
                style={{
                  position: 'absolute',
                  right: 5,
                  top: 15,
                  // backgroundColor: 'red',
                  padding: 10,
                }}>
                <Image
                  source={require('../../../assets/down.png')}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: 'black',
                    alignSelf: 'flex-end',
                    paddingLeft: 50,
                    paddingVertical: 10,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.eachInputContainer}>
            <Text style={styles.txt}>what occupation are you in?</Text>

            <TouchableOpacity
              onPress={item => {
                var title = 'occupation';
                openRequiredModal(title);
              }}
              style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput
                value={occupation}
                editable={false}
                style={styles.txtinput}></TextInput>

              <View
                style={{
                  position: 'absolute',
                  right: 5,
                  top: 15,
                  // backgroundColor: 'red',
                  padding: 10,
                }}>
                <Image
                  source={require('../../../assets/down.png')}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: 'black',
                    alignSelf: 'flex-end',
                    paddingLeft: 50,
                    paddingVertical: 10,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.eachInputContainer}>
            <Text style={styles.txt}>Which state do you live in?</Text>

            <TouchableOpacity
              onPress={item => {
                var title = 'state';
                openRequiredModal(title);
              }}
              style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput
                value={state}
                editable={false}
                style={styles.txtinput}></TextInput>

              <View
                style={{
                  position: 'absolute',
                  right: 5,
                  top: 15,
                  // backgroundColor: 'red',
                  padding: 10,
                }}>
                <Image
                  source={require('../../../assets/down.png')}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: 'black',
                    alignSelf: 'flex-end',
                    paddingLeft: 50,
                    paddingVertical: 10,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          {errorMsg && (
            <Text
              style={{color: 'red', fontWeight: '600', textAlign: 'center'}}>
              Please select options for all fields.
            </Text>
          )}
          <View style={styles.eachInputContainer}>
            <TouchableOpacity
              onPress={() => {
                handleFormSubmit();
              }}
              style={styles.loginButton}>
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
            {/* 
            <TouchableOpacity
              onPress={() => {
                return console.log('hello');
                handleFormSubmit();
              }}
              style={[styles.loginButton, {backgroundColor: 'white'}]}>
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
            </TouchableOpacity> */}
          </View>
          <Modal
            isVisible={modalVisible}
            style={{
              position: 'relative',
              margin: 0,
            }}>
            <View
              style={{
                backgroundColor: 'white',
                position: 'absolute',
                bottom: 0,
                height: 250,
                width: '100%',
                borderTopRightRadius: 20,
                paddingTop: 25,
                borderTopLeftRadius: 20,
              }}>
              <ScrollView>
                {modalSelectionValues?.map(item => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={{width: windowWidth}}
                      onPress={() => {
                        setInfoState(item);
                      }}>
                      <Text style={{color: 'black', marginHorizontal: 20}}>
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
    height: 55,
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
    marginBottom: 10,
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
