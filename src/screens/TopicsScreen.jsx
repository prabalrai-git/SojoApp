import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import Axios from './../api/server';
import CreateProfileHeader from '../components/CreateProfileHeader';
import {windowWidth} from '../helper/usefulConstants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddtopicsRegister from '../components/AddtopicsRegister';

const TopicsScreen = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const config = route?.params?.config;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get('/topics');
        setData(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [navigation]);

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#f3f4f7'}}>
        <CreateProfileHeader />
        <ScrollView stickyHeaderIndices={[2]}>
          <Text
            style={{
              color: 'black',
              paddingHorizontal: 20,
              // paddingLeft: 39,
              fontSize: 18,
              textAlign: 'left',
              marginTop: 10,
              fontWeight: '500',
            }}>
            Choose your topics.
          </Text>
          <Text
            style={{
              color: 'black',
              paddingHorizontal: 20,
              // paddingLeft: 39,
              fontSize: 16,
              textAlign: 'left',
              marginTop: 10,
              fontWeight: '500',
              marginBottom: 15,
            }}>
            Have your news be filtered out for by choosing the topics that you
            want to follow.
          </Text>
          <SearchBar />
          <View style={{paddingHorizontal: 20}}>
            {/* <Text style={{fontSize: 24, fontWeight: 'bold', color: '#6B6F76'}}>
          Explore Topics
        </Text> */}
            <View style={{marginTop: 20}}>
              {data?.map(item => {
                return <AddtopicsRegister item={item} config={config} />;
              })}
            </View>
            {/* <FlatList
          data={data}
          renderItem={({item}) => {
            return (
              <TopicLoading
                item={item}
                // selectedTopics={selectedTopics}
                // config={config}
                // fetchProfile={fetchProfile}
              />
            );
          }}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        /> */}
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Curated');
            // if (!loading) {
            //   handleFormSubmit();
            // }
          }}
          style={[styles.loginButton, {marginBottom: 5}]}>
          {loading1 ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.loginText}>Start Browsing</Text>
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
            if (!loading1) {
              handleFormSubmit();
            }
          }}
          style={[styles.loginButton, {backgroundColor: 'white'}]}>
          {loading1 ? (
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
    </>
  );
};

export default TopicsScreen;

const styles = StyleSheet.create({
  loginButton: {
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 35,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: windowWidth * 0.9,
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
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#f3f4f7',
  },
  linkTitle: {
    color: '#4B4D54',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 15,
    flex: 1,
  },
  linkIcon: {
    borderLeftWidth: 1,
    borderLeftColor: '#DEE1E5',
    padding: 17,
    paddingLeft: 20,
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CDCFD3',
    padding: 15,
    marginBottom: 15,
    borderBottomColor: '#CDCFD3',
    borderBottomWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E424B',
    flex: 3,
  },
});
