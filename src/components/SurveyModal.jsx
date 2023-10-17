import React, {useEffect, useState} from 'react';
import {
  Image,
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
import {Keyboard} from 'react-native';
import {Alert} from 'react-native';

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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    getSurveyDataFromAsyncStorage();
    getShowSurveyQuestion();

    // funfun();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
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
    if (!answerOne || !answerTwo) {
      return setError(true);
    }

    try {
      firestore()
        .collection('surveyQuestions')
        .add({
          'Where did you first learn about us?': answerOne,
          'Let us know what you want us to change?': answerTwo,
          // 'Would you recommend our app to a friend or family member? (Yes/No)':
          //   answerThree,
          // 'Please write us short note': review,
        })
        .then(() => {
          setModalVisible(false);
        });
      await AsyncStorage.setItem('surveyCompleted', 'true');
      Alert.alert('Thank You!', 'We appreciate your feedback!', [
        // {
        //   text: 'Cancel',
        //   onPress: () => console.log('Cancel Pressed'),
        //   style: 'cancel',
        // },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
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
        // style={{flex: Platform.OS === 'ios' ? 0.6 : 0.6}}
        animationOut={'fadeOut'}
        animationOutTiming={300}
        backdropTransitionOutTiming={300}>
        {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: Platform.OS === 'ios' ? 0.9 : 1}}
        enabled>
                </KeyboardAvoidingView> */}

        <View
          style={{
            display: 'flex',
            // flex: 1,
            height: isKeyboardVisible ? '81%' : '51%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
          <View
            style={{
              position: 'absolute',
              zIndex: 10,
              top: -25,
              marginHorizontal: 'auto',
              // left: '40%',
              backgroundColor: 'white',
              width: 60,
              height: 60,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
            }}>
            <Image
              source={require('../assets/feedback.png')}
              style={{
                width: 35,
                height: 35,
                resizeMode: 'contain',
              }}
            />
          </View>
          <ScrollView
            style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 5,
              height: windowHeight,

              // height: '100%',
            }}
            contentContainerStyle={{flexGrow: 1}}
            // contentContainerStyle={{justifyContent: 'flex-end'}}
          >
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                margin: 20,
                marginHorizontal: 0,
                fontWeight: '600',
                fontSize: 16,
                marginTop: 35,
              }}>
              Please, Help us improve with your feedback.
            </Text>
            <View style={{margin: 12}}>
              <Text style={{color: 'black', marginBottom: 10}}>
                Where did you first learn about us?
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
                Let us know what you want us to change?
              </Text>
              <TextInput
                multiline={true}
                // numberOfLines={4}
                style={{
                  height: 80,
                  textAlignVertical: 'top',

                  borderWidth: 0.5,
                  padding: 10,
                  borderRadius: 6,
                  color: 'black',
                }}
                onChangeText={text => setAnswerTwo(text)}
                value={answerTwo}
              />
            </View>
            {/* <View style={{margin: 12}}>
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
              </View> */}
            {/* <View style={{margin: 12}}>
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
              </View>  */}
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
                marginHorizontal: 13,
                // marginBottom: 10,
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
      </Modal>
    )
  );
}

export default SurveyModal;
