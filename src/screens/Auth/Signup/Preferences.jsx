import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import CreateProfileHeader from '../../../components/CreateProfileHeader';
import {windowWidth} from '../../../helper/usefulConstants';
import {Image} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from './../../../api/server';
import {useSelector} from 'react-redux';

const Preferences = ({navigation, route}) => {
  // const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [skipPolitical, setSkipPolitical] = useState(false);
  const [skipNSFW, setSkipNSFW] = useState(false);
  const [config, setConfig] = useState(null);

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

  const listData = [
    {id: 1, title: 'Self harm or physical violence'},
    {id: 2, title: 'Murder, death or genocide'},
    {id: 3, title: 'Rape or sexual harassment'},
    {id: 4, title: 'Mental or psychological torture'},
    {id: 5, title: `Anything that's not safe for work (NSFW)`},
  ];

  const completeProfile = async () => {
    if (route.params.data) {
      const {ageGroup, gender, occupation, state} = route.params.data;
      const data = {
        gender,
        occupation,
        ageGroup,
        skipPolitical,
        skipNSFW,
        state,
      };
      try {
        setLoading(true);
        const res = await Axios.post('/users/profile/complete', data, config);
        navigation.navigate('TopicsScreenLogin', {
          config: config,
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
        if (err && err.response && err.response.data) {
          console.log(err.response.data);
          console.log(err.response.data.err);
        }
      }
    }
  };

  const skipProfile = async () => {
    const data = {
      gender: route?.params?.data?.gender ? route.params.data.gender : null,
      ageGroup: route?.params?.data?.ageGroup
        ? route.params.data.ageGroup
        : null,
      occupation: route?.params?.data?.occupation
        ? route?.params?.data?.occupation
        : null,
      skipPolitical,
      skipNSFW,
      state: route?.params?.data?.state ? route?.params?.data?.state : null,
    };

    try {
      setLoading(true);
      const res = await Axios.post(
        '/users/profile/skipCompleteProfile',
        data,
        config,
      );

      navigation.navigate('TopicsScreenLogin', {
        config: config,
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      // if (err && err.response && err.response.data) {
      //   console.log(err.response.data);
      //   console.log(err.response.data.err);
      // }
    }
  };
  const darkMode = useSelector(state => state.darkMode.value);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: darkMode
          ? global.backgroundColorDark
          : global.backgroundColor,
      }}>
      <CreateProfileHeader />
      <Text
        style={{
          color: darkMode ? 'white' : 'black',
          paddingHorizontal: 20,
          paddingLeft: 39,
          fontSize: 18,
          textAlign: 'left',
          fontWeight: 'bold',
        }}>
        Your preferences.
      </Text>
      <Text
        style={{
          color: darkMode ? 'white' : 'black',
          paddingHorizontal: 20,
          paddingLeft: 39,
          fontSize: 16,
          textAlign: 'left',
          marginTop: 10,
          fontWeight: 'bold',
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
        <Text style={[styles.txt, {color: darkMode ? 'white' : 'black'}]}>
          Skip and avoid political news and anything political
        </Text>
        <MaterialIcons
          name={skipPolitical ? 'check-box' : 'check-box-outline-blank'}
          size={30}
          color={darkMode ? 'white' : 'black'}
          onPress={() => setSkipPolitical(!skipPolitical)}
        />
      </View>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/alert1.png')}
          style={[styles.img]}
        />
        <Text style={[styles.txt, {color: darkMode ? 'white' : 'black'}]}>
          Skip and avoid any stories that have the following:
        </Text>
        <MaterialIcons
          name={skipNSFW ? 'check-box' : 'check-box-outline-blank'}
          size={30}
          color={darkMode ? 'white' : 'black'}
          onPress={() => setSkipNSFW(!skipNSFW)}
        />
      </View>
      <View style={styles.points}>
        {listData.map(item => {
          return (
            <View key={item.id}>
              <Text
                style={{
                  color: darkMode ? 'white' : 'black',
                  fontWeight: '400',
                  marginVertical: 3,
                }}>
                ● {item.title}
              </Text>
            </View>
          );
        })}
      </View>
      <TouchableOpacity
        onPress={() => {
          skipProfile();
          // if (!loading) {
          //   handleFormSubmit();
          // }
        }}
        style={[
          styles.loginButton,
          {backgroundColor: darkMode ? '#286146' : global.brandColor},
        ]}>
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
          return skipProfile();
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
    marginBottom: 0,
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
    marginVertical: 8,
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
    width: windowWidth * 0.6,
    marginHorizontal: 5,
    fontWeight: '500',
  },
});
