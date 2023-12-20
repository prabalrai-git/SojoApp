import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, StatusBar, StyleSheet, View} from 'react-native';
import Reels from '../components/Reels';
import Axios from './../api/server';
import {videos} from '../../dummyData';

import {windowHeight} from '../helper/usefulConstants';
import axios from 'axios';

function SojoReels() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  // const [videos, setVideos] = useState();

  // useEffect(() => {
  //   getReels();
  // }, []);

  // const getReels = async () => {
  //   try {
  //     const res = await axios.get(
  //       'http://192.168.1.69:3030/api/v1/reels/getAllReels',
  //     );
  //     setVideos(res.data.data);
  //   } catch (error) {}
  // };

  return (
    <>
      {/* <StatusBar translucent backgroundColor="transparent" /> */}
      <View style={styles.topContainer}>
        <FlatList
          pagingEnabled
          // style={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          data={videos}
          onScroll={e => {
            setSelectedIndex(
              Math.round(
                e.nativeEvent.contentOffset.y.toFixed(0) / windowHeight,
              ),
            );
          }}
          renderItem={({item, index}) => {
            return (
              <Reels
                item={item}
                index={index}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
              />
            );
          }}></FlatList>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 2,
  },
});

export default SojoReels;
