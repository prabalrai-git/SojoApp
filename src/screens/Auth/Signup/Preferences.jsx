import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import React, {useState} from 'react';
import CreateProfileHeader from '../../../components/CreateProfileHeader';
import {windowWidth} from '../../../helper/usefulConstants';
import {Image} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Preferences = ({navigation}) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const listData = [
    {id: 1, title: 'Self harm or physical violence'},
    {id: 2, title: 'Murder, death or genocide'},
    {id: 3, title: 'Rape or sexual harassment'},
    {id: 4, title: 'Mental or psychological torture'},
    {id: 5, title: 'Anything that’s not safe for work (NSFW)'},
  ];

  return (
    <View style={{flex: 1, backgroundColor: '#f3f4f7'}}>
      <CreateProfileHeader />
      <Text
        style={{
          color: 'black',
          paddingHorizontal: 20,
          paddingLeft: 39,
          fontSize: 18,
          textAlign: 'left',
          marginTop: 10,
          fontWeight: 'bold',
        }}>
        Your preferences.
      </Text>
      <Text
        style={{
          color: 'black',
          paddingHorizontal: 20,
          paddingLeft: 39,
          fontSize: 16,
          textAlign: 'left',
          marginTop: 10,
          fontWeight: '500',
          marginBottom: 35,
        }}>
        Some users might want to avoid certain types of stories, and you can do
        so by setting your boundaries.
      </Text>
      <View style={[styles.container, {marginBottom: 35}]}>
        <Image
          source={require('../../../assets/alert.png')}
          style={[styles.img]}
        />
        <Text style={styles.txt}>
          Skip and avoid political news and anything political
        </Text>
        <MaterialIcons
          name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
          size={30}
          color="#000000"
          onPress={() => setRememberMe(!rememberMe)}
        />
      </View>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/alert1.png')}
          style={[styles.img]}
        />
        <Text style={styles.txt}>
          Skip and avoid any stories that have the following:
        </Text>
        <MaterialIcons
          name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
          size={30}
          color="#000000"
          onPress={() => setRememberMe(!rememberMe)}
        />
      </View>
      <View style={styles.points}>
        {listData.map(item => {
          return (
            <View key={item.id}>
              <Text style={{color: 'black', fontWeight: '300'}}>
                ● {item.title}
              </Text>
            </View>
          );
        })}
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('TopicsScreenLogin');
          // if (!loading) {
          //   handleFormSubmit();
          // }
        }}
        style={styles.loginButton}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.loginText}>Save Preferences</Text>
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
  );
};

export default Preferences;

const styles = StyleSheet.create({
  loginButtonIcon: {
    marginLeft: 10,
    marginTop: 1,
  },
  loginButton: {
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: windowWidth * 0.85,
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
  points: {
    width: windowWidth * 0.7,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    width: windowWidth,
    paddingHorizontal: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  img: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
    marginRight: 4,
  },
  txt: {
    color: 'black',
    textTransform: 'uppercase',
    width: windowWidth * 0.65,
    marginHorizontal: 5,
    fontWeight: '400',
  },
});
