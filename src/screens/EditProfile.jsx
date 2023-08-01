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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {hideTabBar} from '../redux/features/HideTabBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {windowWidth} from '../helper/usefulConstants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EditProfile = props => {
  const [skipPolitical, setSkipPolitical] = useState(false);
  const [skipNSFW, setSkipNSFW] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {profile} = props.route.params;

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
                navigation.goBack();
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
            <Text style={{color: 'grey', marginBottom: 5}}>
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
                onPress={() => {}}
                style={{flexDirection: 'row', position: 'relative'}}>
                <TextInput
                  value={profile?.ageGroup}
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

                <View
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 10,
                    // backgroundColor: 'red',
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
                </View>
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
                onPress={() => {}}
                style={{flexDirection: 'row', position: 'relative'}}>
                <TextInput
                  value={profile?.gender}
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

                <View
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 10,
                    // backgroundColor: 'red',
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
                </View>
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
                onPress={() => {}}
                style={{flexDirection: 'row', position: 'relative'}}>
                <TextInput
                  value={profile?.occupation?.name}
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

                <View
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 10,
                    // backgroundColor: 'red',
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
                </View>
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
                onPress={() => {}}
                style={{flexDirection: 'row', position: 'relative'}}>
                <TextInput
                  value={profile?.stateId?.toString()}
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

                <View
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 10,
                    // backgroundColor: 'red',
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
                </View>
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
