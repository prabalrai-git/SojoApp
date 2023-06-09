import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import {PRIMARY_COLOR, windowWidth} from '../helper/usefulConstants';
import {logoutUser} from '../helper/auth';
import {Switch} from 'react-native-switch';
import Modal from 'react-native-modal';
const ProfileSettings = ({navigation}) => {
  const [checked, setChecked] = useState(false);

  const notificationFor = [
    {id: 1, title: 'New stories on topic I follow'},
    {id: 2, title: 'Featured stories on topics I follow'},
    {id: 3, title: 'Top stories aggregated by Sojo news'},
  ];
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => navigation.pop()}>
          <Image
            source={require('../assets/arrow-left.png')}
            style={{tintColor: 'white', width: 20, height: 20}}
          />
        </TouchableOpacity>

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
        </TouchableOpacity>
      </View>
      {/* Start of body/ content */}
      <View style={{paddingHorizontal: 15}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 15,
          }}>
          <View>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 22}}>
              Settings
            </Text>
            <Text style={{color: 'grey'}}>sojo_news</Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#296146',
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
            <Text style={{color: 'white'}}>Sign Out</Text>
            <Image
              source={require('../assets/logout.png')}
              style={{
                width: 14,
                height: 14,
                tintColor: 'white',
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>
            Send me push notifications
          </Text>
          <Switch
            // color="#296146"
            activeText={''}
            inActiveText={''}
            backgroundActive={'#296146'}
            circleSize={30}
            // barHeight={34}
            switchWidthMultiplier={2}
            circleBorderWidth={0}
            outerCircleStyle={{}}
            backgroundInactive={'#3f424a'}
            circleActiveColor={'grey'}
            circleInActiveColor={'lightgrey'}
            value={checked}
            onValueChange={value => setChecked(value)}
          />
        </View>
        <View>
          <Text style={{color: 'black', fontWeight: '500', fontSize: 14}}>
            SEND ME NOTIFICATION FOR...
          </Text>
        </View>
        <View>
          <Text style={{color: 'black', fontWeight: '500', fontSize: 14}}>
            NOTIFICATION FREQUENCY
          </Text>
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

        <Text style={{color: 'grey', fontSize: 16, marginVertical: 15}}>
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
            backgroundColor: 'black',
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
            backgroundColor: '#7b3446',
            padding: 8,
            borderRadius: 8,
            width: '50%',
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
            }}>
            Deactivate Account
          </Text>
        </TouchableOpacity>
      </View>
      {/* modal */}
      <Modal
        isVisible={true}
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
            paddingVertical: 30,
            borderTopLeftRadius: 20,
          }}>
          {notificationFor.map(item => {
            return (
              <View key={item.id} style={{width: windowWidth}}>
                <Text style={{color: 'black'}}>{item.title}</Text>
                <View
                  style={{
                    height: 1,
                    backgroundColor: 'lightgrey',
                    marginVertical: 18,
                    width: windowWidth,
                  }}></View>
              </View>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

export default ProfileSettings;

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
