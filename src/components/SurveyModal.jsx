import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {windowHeight} from '../helper/usefulConstants';
import {Platform} from 'react-native';

function SurveyModal() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [answerOne, setAnswerOne] = useState();
  const [answerTwo, setAnswerTwo] = useState();
  const [answerThree, setAnswerThree] = useState();
  const [review, setReview] = useState();
  const [error, setError] = useState(false);
  const [surveCompleted, setSurveyCompleted] = useState(null);
  const [lastSkipTime, setLastSkipTime] = useState(null);

  useEffect(() => {
    getSurveyDataFromAsyncStorage();
    getShowSurveyQuestion();

    // funfun();
  }, []);

  const getShowSurveyQuestion = async () => {
    const skipTimestamp = await AsyncStorage.getItem('surveySkipTimestamp');
    if (!skipTimestamp) {
      try {
        const showSurvey = await firestore()
          .collection('showSurveyQuestion')
          .get();
        setTimeout(() => {
          setShowSurvey(showSurvey.docs[0]._data.show);
        }, 4000);
        if (showSurvey.docs[0]._data.show) {
          setModalVisible(true);
        }
        // console.log(showSurvey.docs[0]._data.show, 'hee haaaw');
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }, [error]);

  const getSurveyDataFromAsyncStorage = async () => {
    const surveyCompleted = await AsyncStorage.getItem('surveyCompleted');
    setSurveyCompleted(surveyCompleted);
  };

  const funfun = async () => {
    try {
      await AsyncStorage.removeItem('surveyCompleted');
      return true;
    } catch (exception) {
      return false;
    }
  };

  const onSubmit = async () => {
    if (!answerOne || !answerTwo || !answerThree || !review) {
      return setError(true);
    }

    try {
      firestore()
        .collection('surveyQuestions')
        .add({
          'On a scale of 1 to 10, how satisfied are you with the news content provided by our app?':
            answerOne,
          'Do you find our negativity filters effective in rducing unwanted content? (Yes/No)':
            answerTwo,
          'Would you recommend our app to a friend or family member? (Yes/No)':
            answerThree,
          'Please write us short note': review,
        })
        .then(() => {
          setModalVisible(false);
        });
      await AsyncStorage.setItem('surveyCompleted', 'true');
    } catch (error) {}
  };

  useEffect(() => {
    // Check if the user has previously skipped the survey
    const checkSurveySkipTimestamp = async () => {
      const skipTimestamp = await AsyncStorage.getItem('surveySkipTimestamp');
      if (skipTimestamp) {
        const currentTime = new Date().getTime();
        const skipTime = parseInt(skipTimestamp, 10);
        const minutesElapsed = (currentTime - skipTime) / (1000 * 60 * 60);

        // Set the last skip time
        setLastSkipTime(skipTime);

        // Show the survey modal again after 1 minute
        if (minutesElapsed >= 48) {
          // Change this to 1 minute
          setShowSurvey(true);
          setModalVisible(true);
        }
      }
    };

    checkSurveySkipTimestamp();
  }, []);

  const onSkip = async () => {
    setModalVisible(false);
    const now = new Date().getTime();
    await AsyncStorage.setItem('surveySkipTimestamp', now.toString());
    setLastSkipTime(now);
  };

  return (
    showSurvey &&
    surveCompleted === null && (
      <Modal
        isVisible={modalVisible}
        style={{flex: Platform.OS === 'ios' ? 0.9 : 1}}
        animationOut={'fadeOut'}
        animationOutTiming={300}
        backdropTransitionOutTiming={300}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: Platform.OS === 'ios' ? 0.9 : 1}}
          enabled>
          <View
            style={{
              display: 'flex',
              // flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ScrollView
              style={{
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 5,

                height: '100%',
              }}
              // contentContainerStyle={{justifyContent: 'flex-end'}}
            >
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  margin: 20,
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                Please Answer all the questions:
              </Text>
              <View style={{margin: 12}}>
                <Text style={{color: 'black', marginBottom: 10}}>
                  On a scale of 1 to 10, how satisfied are you with the news
                  content provided by our app?
                </Text>
                <TextInput
                  style={{
                    height: 40,
                    borderWidth: 0.5,
                    padding: 10,
                    borderRadius: 6,
                    color: 'black',
                  }}
                  onChangeText={text => setAnswerOne(text)}
                  value={answerOne}
                />
              </View>
              <View style={{margin: 12}}>
                <Text style={{color: 'black', marginBottom: 10}}>
                  Do you find our negativity filters effective in rducing
                  unwanted content? (Yes/ No)
                </Text>
                <TextInput
                  style={{
                    height: 40,
                    borderWidth: 0.5,
                    padding: 10,
                    borderRadius: 6,
                    color: 'black',
                  }}
                  onChangeText={text => setAnswerTwo(text)}
                  value={answerTwo}
                />
              </View>
              <View style={{margin: 12}}>
                <Text style={{color: 'black', marginBottom: 10}}>
                  Would you recommend our app to a friend or family member?
                  (Yes/ No)
                </Text>
                <TextInput
                  style={{
                    height: 40,
                    borderWidth: 0.5,
                    padding: 10,
                    borderRadius: 6,
                    color: 'black',
                  }}
                  onChangeText={text => setAnswerThree(text)}
                  value={answerThree}
                />
              </View>
              <View style={{margin: 12}}>
                <Text style={{color: 'black', marginBottom: 10}}>
                  Please write us short note
                </Text>
                <TextInput
                  multiline={true}
                  numberOfLines={7}
                  style={{
                    //   height: 40,
                    textAlignVertical: 'top',
                    borderWidth: 0.5,
                    padding: 10,
                    borderRadius: 6,
                    color: 'black',
                  }}
                  onChangeText={text => setReview(text)}
                  value={review}
                />
              </View>
              {error && (
                <Text style={{color: 'red', textAlign: 'center'}}>
                  Please, Answer all the question of the survey!
                </Text>
              )}
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 20,
                  marginBottom: 40,
                }}>
                <TouchableOpacity
                  onPress={() => onSubmit()}
                  style={{
                    backgroundColor: '#26b160',
                    padding: 10,
                    flex: 0.5,
                    borderRadius: 6,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onSkip();
                  }}
                  style={{
                    backgroundColor: '#EA4335',
                    padding: 12,
                    flex: 0.4,
                    borderRadius: 6,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}>
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  );
}

export default SurveyModal;
