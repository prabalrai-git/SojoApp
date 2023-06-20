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
import {Modal} from 'react-native';

const InfoScreen = ({navigation}) => {
  const [profile, setProfile] = useState(null);
  const [config, setConfig] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [occupations, setOccupations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [ageGroup, setAgeGroup] = useState('14-20');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [skipPolitical, setSkipPolitical] = useState(false);
  const [skipNSFW, setSkipNSFW] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [notiForValue, setNotiForValue] = useState(null);
  const [notiFreqValue, setNotiFreqValue] = useState(null);

  const notificationFor = [
    {id: 1, title: 'New stories on topic I follow'},
    {id: 2, title: 'Featured stories on topics I follow'},
    {id: 3, title: 'Top stories aggregated by Sojo news'},
  ];

  const notificationFrequency = [
    {id: 1, title: 'Every morning at 8AM'},
    {id: 2, title: 'Every evening at 6PM'},
    {id: 3, title: 'Every two days'},
    {id: 4, title: 'Once a week'},
  ];

  const handleFormSubmit = async () => {
    setLoading(true);
    const data = {
      ageGroup,
      gender,
      occupation,
      skipPolitical,
      skipNSFW,
    };
    try {
      const res = await Axios.post('/users/profile/complete', data, config);
      console.log(res);
      setLoading(false);
      navigation.replace('TopicsScreenLogin');
    } catch (err) {
      setLoading(false);
      console.log(err);
      if (err && err.response && err.response.data) {
        console.log(err.response.data);
        console.log(err.response.data.err);
        setErrorMessage(err.response.data.err);
      }
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

  // fetch occupations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get('/occupations');
        setOccupations(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // set config
  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
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
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await Axios.get('/users/profile', config);
        setProfile(res.data.data);
        if (res.data.data.isComplete) {
          navigation.reset({index: 0, routes: [{name: 'Curated'}]});
        }
      } catch (err) {
        console.log(err);
        if (err && err.response && err.response.status === 401) {
          logout();
          setIsLoggedIn(false);
          setProfile(null);
          navigation.reset({index: 0, routes: [{name: 'Auth'}]});
        }
      }
    };
    if (config) {
      fetchProfile();
    }
  }, [config]);

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
              marginTop: 30,
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
          {/* <View style={styles.container}>
            {errorMessage && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            <View style={styles.content}>
              <Text style={styles.label}>
                What age group do you belong to ?
              </Text>
              <Picker
                style={styles.inputContainer}
                selectedValue={ageGroup}
                onValueChange={itemValue => setAgeGroup(itemValue)}>
                <Picker.Item label="14-20" value="14-20" />
                <Picker.Item label="21-35" value="21-35" />
                <Picker.Item label="36-50" value="36-50" />
                <Picker.Item label="51 & above" value="51 & above" />
              </Picker>
            </View>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontWeight: '500',
                  fontSize: 12,
                  marginTop: 10,
                }}>
                What age group do you belong to ?
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  editable={false}
                  value={'yo'}></TextInput>

                <TouchableOpacity
                  onPress={() => setModalVisible(prev => !prev)}
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: '25%',
                    padding: 5,
                  }}>
                  <Image
                    source={require('../../../assets/down.png')}
                    style={{
                      width: 18,
                      height: 18,
                      resizeMode: 'contain',
                      tintColor: 'black',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>What is your gender ?</Text>
              <Picker
                style={styles.inputContainer}
                selectedValue={gender}
                onValueChange={itemValue => setGender(itemValue)}>
                <Picker.Item label="Prefer not to say" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>What occupation are you in ?</Text>
              <Picker
                style={styles.inputContainer}
                selectedValue={occupation}
                onValueChange={itemValue => setOccupation(itemValue)}>
                {occupations.map(item => {
                  return (
                    <Picker.Item
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  );
                })}
              </Picker>

              <View style={styles.checkboxContainer}>
                <MaterialIcons
                  name={skipNSFW ? 'check-box' : 'check-box-outline-blank'}
                  size={20}
                  // color="#000000"
                  onPress={() => setSkipNSFW(!skipNSFW)}
                />
                <Text style={styles.checkboxLabel}>
                  Skip everything that is NSFW
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Preferences');
                  // if (!loading) {
                  //   handleFormSubmit();
                  // }
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

              <TouchableOpacity
                onPress={() => {
                  if (!loading) {
                    handleFormSubmit();
                  }
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
              </TouchableOpacity>
            </View>
          </View> */}
          {/* <Modal
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
                // height: 200,
                width: '100%',
                borderTopRightRadius: 20,
                paddingTop: 25,
                borderTopLeftRadius: 20,
              }}>
              {notificationFrequency.map(item => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={{width: windowWidth}}
                    onPress={() => {
                      setModalVisible(prev => !prev);
                      setNotiFreqValue(item.title);
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
            </View>
          </Modal> */}

          <View style={styles.eachInputContainer}>
            <Text style={styles.txt}>what age group do you belong to?</Text>

            <View style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput style={styles.txtinput}></TextInput>

              <TouchableOpacity
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
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.eachInputContainer}>
            <Text style={styles.txt}>what is your gender?</Text>

            <View style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput style={styles.txtinput}></TextInput>

              <TouchableOpacity
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
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.eachInputContainer}>
            <Text style={styles.txt}>what occupation are you in?</Text>

            <View style={{flexDirection: 'row', position: 'relative'}}>
              <TextInput style={styles.txtinput}></TextInput>

              <TouchableOpacity
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
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.eachInputContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Preferences');
                // if (!loading) {
                //   handleFormSubmit();
                // }
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

            <TouchableOpacity
              onPress={() => {
                if (!loading) {
                  handleFormSubmit();
                }
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
            </TouchableOpacity>
          </View>
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
