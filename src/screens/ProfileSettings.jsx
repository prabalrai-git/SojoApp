import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {PRIMARY_COLOR, windowWidth} from '../helper/usefulConstants';
import {logoutUser} from '../helper/auth';
import {Switch} from 'react-native-switch';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileSettings = ({navigation}) => {
  const [checked, setChecked] = useState(false);
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

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: '#27B060'}} />

      <SafeAreaView style={{flex: 1, backgroundColor: '#f3f4f7'}}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              paddingHorizontal: 15,
              padding: 6,
            }}
            onPress={() => navigation.pop()}>
            <Image
              source={require('../assets/arrow-left.png')}
              style={{tintColor: 'white', width: 20, height: 20}}
            />
          </TouchableOpacity>

          <View style={styles.container}>
            <TouchableOpacity
              style={styles.titleWrapper}
              onPress={() => {
                console.log('hello world');
              }}>
              <Icon
                name="save"
                size={18}
                color="#26B160"
                style={{marginTop: 2}}
              />
              <Text style={styles.title}>Save Changes</Text>
            </TouchableOpacity>
          </View>
          {/* 
        <TouchableOpacity style={styles.saveBtn}>
          <View>
            <Image
              source={require('../assets/floppy-disk.png')}
              style={{
                tintColor: '#27B161',
                width: 17,
                height: 17,
                resizeMode: 'contain',
                marginRight: 5,
              }}
            />
          </View>
          <View style={{alignSelf: 'center'}}>
            <Text style={styles.topBarText}>Save Changes</Text>
          </View>
        </TouchableOpacity> */}
        </View>
        <ScrollView>
          {/* Start of body/ content */}
          <View style={{paddingHorizontal: 15}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 15,
              }}>
              <View>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 22}}>
                  Settings
                </Text>
                <Text style={{color: 'grey'}}>sojo_news</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#b3e0bd',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 8,
                  height: 35,
                  borderRadius: 5,
                }}
                onPress={() => {
                  logoutUser();
                  navigation.navigate('MainScreen');
                }}>
                <Text style={{color: '#082313'}}>Sign Out</Text>
                <Image
                  source={require('../assets/logout.png')}
                  style={{
                    width: 14,
                    height: 14,
                    tintColor: '#082313',
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',
                backgroundColor: 'lightgrey',
                height: 1,
                marginBottom: 20,
              }}></View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>
                Send me push notifications
              </Text>
              <Switch
                // color="#296146"
                activeText={''}
                inActiveText={''}
                backgroundActive={'#27b060'}
                circleSize={30}
                // barHeight={34}
                switchWidthMultiplier={2}
                circleBorderWidth={0}
                outerCircleStyle={{}}
                backgroundInactive={'grey'}
                circleActiveColor={'white'}
                circleInActiveColor={'white'}
                value={checked}
                onValueChange={value => setChecked(value)}
              />
            </View>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontWeight: '500',
                  fontSize: 12,
                  marginTop: 10,
                }}>
                SEND ME NOTIFICATION FOR...
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  editable={false}
                  value={notiForValue}></TextInput>

                <TouchableOpacity
                  onPress={() => setModalVisible(prev => !prev)}
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: '25%',
                    padding: 5,
                  }}>
                  <Image
                    source={require('../assets/down.png')}
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
            <View>
              <Text style={{color: 'black', fontWeight: '500', fontSize: 12}}>
                NOTIFICATION FREQUENCY
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  editable={false}
                  value={notiFreqValue}></TextInput>

                <TouchableOpacity
                  onPress={() => setModalVisible(prev => !prev)}
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: '25%',
                    padding: 5,
                  }}>
                  <Image
                    source={require('../assets/down.png')}
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

            <View
              style={{
                width: '100%',
                backgroundColor: 'lightgrey',
                height: 1,
                marginVertical: 20,
              }}></View>

            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>
              Password
            </Text>

            <Text style={{color: 'black', fontSize: 16, marginVertical: 15}}>
              You changed your password 2 months ago
            </Text>
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnTxt}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnTxt}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                backgroundColor: 'lightgrey',
                height: 1,
                marginVertical: 20,
              }}></View>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: 20,
              }}>
              Account Settings
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#fecdd3',
                padding: 8,
                borderRadius: 8,
                width: '50%',
              }}>
              <Text
                style={{
                  color: '#881337',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Deactivate Account
              </Text>
            </TouchableOpacity>
          </View>
          {/* modal */}
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
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  container: {
    paddingVertical: 6,
    width: windowWidth * 0.35,
    // paddingRight: 7,
    paddingLeft: 13,
    backgroundColor: '#FEFEFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    // flex: 1,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    width: windowWidth * 0.3,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 13,
    color: '#26B160',
    fontWeight: 'bold',
    flex: 3,
    marginLeft: 10,
    textAlign: 'center',
  },

  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
    color: 'black',
    height: 40,
  },
  btnTxt: {
    textAlign: 'center',
    color: '#176a3a',
    fontWeight: 'bold',
  },
  iconContainer: {
    backgroundColor: '#53C180',
    paddingHorizontal: 10,
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  btn: {
    // backgroundColor: '#296146',
    width: '49%',
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
    borderColor: '#c2e4ca',
    borderWidth: 2,
  },
  btnContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 6,
  },
  topBar: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
  },
  topBarText: {
    color: '#27B161',
    fontWeight: '500',
    fontSize: 15,
    alignSelf: 'center',
  },
});
