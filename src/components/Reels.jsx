import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useRef, useState} from 'react';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import {windowHeight, windowWidth} from '../helper/usefulConstants';
import {StatusBar} from 'react-native';
const Reels = ({item, index, selectedIndex, setSelectedIndex}) => {
  const [liked, setLiked] = useState(false);
  const videoRef = useRef(null);

  const onEnd = () => {
    if (videoRef.current) {
      console.log('on end fuction');
      videoRef.current.seek(0); // rewind to the beginning
    }
  };
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />

      <View style={styles.topContainer}>
        <Video
          ref={videoRef}
          controls={false}
          reapeat={true}
          paused={selectedIndex == index ? false : true}
          // onEnd={onEnd}
          style={styles.videoContainer}
          source={item.uri}
          resizeMode={'cover'}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,.2)', 'rgba(0,0,0,.9)']}
          style={styles.linearGradient}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => {
              if (selectedIndex == -1) {
                setSelectedIndex(index);
              } else {
                setSelectedIndex(-1);
              }
            }}>
            {selectedIndex == -1 ? (
              <Image
                source={require('../assets/pause1.png')}
                tintColor={'rgba(255,255,255,1)'}
                style={styles.pauseBtn}
              />
            ) : null}
            <View style={styles.soundInfo}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/music.png')}
                  style={{
                    width: 15,
                    height: 15,
                    objectFit: 'contain',
                    alignSelf: 'flex-end',
                    marginRight: 8,
                  }}
                />
                <Text style={{color: 'white', alignSelf: 'flex-end'}}>
                  Original sound
                </Text>
              </View>
              <Image
                source={require('../assets/app.png')}
                style={{
                  width: 35,
                  height: 35,
                  alignSelf: 'center',
                  objectFit: 'contain',
                  borderRadius: 10,
                }}
              />
            </View>
            <View
              style={{
                width: '80%',

                position: 'absolute',
                bottom: 90,
                right: '3%',
                left: '3%',
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Text style={{color: 'white', fontWeight: '500'}}>
                {item.description}
              </Text>
            </View>
            <View
              style={{
                width: '80%',

                position: 'absolute',
                bottom: 115,
                right: '3%',
                left: '3%',
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/app.png')}
                style={{
                  width: 35,
                  height: 35,
                  alignSelf: 'center',
                  objectFit: 'contain',
                  borderRadius: 25,
                }}
              />
              <Text
                style={{
                  color: 'white',
                  marginLeft: 4,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                }}>
                @{item.creator}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                right: 15,
                bottom: 160,
                zIndex: 999,
              }}>
              <TouchableOpacity
                style={{
                  paddingLeft: 30,
                  paddingTop: 20,
                }}
                onPress={() => setLiked(!liked)}>
                <Image
                  source={
                    liked
                      ? require('../assets/liked.png')
                      : require('../assets/heart.png')
                  }
                  style={{width: 31, height: 31, objectFit: 'contain'}}
                />
                <Text
                  style={{
                    color: 'white',
                    marginTop: 4,
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  3.4K
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingLeft: 30,
                  paddingTop: 20,
                }}>
                <Image
                  source={require('../assets/comment.png')}
                  style={{
                    width: 35,
                    height: 35,
                    objectFit: 'contain',
                    marginTop: 20,
                  }}
                />
                <Text
                  style={{
                    color: 'white',
                    marginTop: 4,
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  4.4K
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingLeft: 30,
                  paddingTop: 20,
                }}>
                <Image
                  source={require('../assets/send.png')}
                  style={{
                    width: 30,
                    height: 30,
                    objectFit: 'contain',
                    marginTop: 20,
                  }}
                />
                <Text style={{color: 'white', marginTop: 4, fontSize: 12}}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: 'absolute',
                top: 40,
                left: 20,
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'white',

                  fontSize: 27,
                  fontWeight: '800',
                }}>
                SoJo Reels
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </>
  );
};

export default Reels;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    right: 0,
    left: 0,
    right: 0,
    // paddingLeft: 15,
    // paddingRight: 15,
    borderRadius: 5,
    zIndex: 300,
  },
  soundInfo: {
    width: '92%',
    position: 'absolute',
    bottom: 60,
    right: '5%',
    left: '3%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topContainer: {
    width: windowWidth,
    height: windowHeight,
  },
  videoContainer: {
    flex: 1,
  },
  overlay: {
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBtn: {
    width: 20,
    height: 20,
    // backgroundColor: 'white',
    // borderRadius: 50,
    padding: 22,
    objectFit: 'cover',
  },
});
