import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {windowHeight} from '../../helper/usefulConstants';
import {useNavigation} from '@react-navigation/native';

function SurveyModalRedirectionToSettings({profile}) {
  const [showSurvey, setShowSurvey] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [skipTimeFound, setSkipTimeFound] = useState(false);
  const [skipTimeStamp, setSkipTimeStamp] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    // Check if the user has previously skipped the survey

    checkSurveySkipTimestamp();
    if (skipTimeStamp === null) {
      checkSurveyCompletedTimestamp();
    }
    getShowSurveyQuestion();
  }, [skipTimeStamp]);

  const checkSurveyCompletedTimestamp = async () => {
    const completedTimestamp = await AsyncStorage.getItem(
      'surveryCompletedTime',
    );
    if (completedTimestamp) {
      const currentTime = new Date().getTime();
      const completeTime = parseInt(completedTimestamp, 10);
      const daysElapsed = (currentTime - completeTime) / (1000 * 60 * 60 * 24);
      const fdata = await firestore()
        .collection('howManyDaysToShowPromptAgain')
        .get();
      const days = fdata.docs[0]._data.Days;
      if (daysElapsed >= days) {
        setSkipTimeFound(true);
      }
    } else if (!completedTimestamp && skipTimeStamp === null) {
      setSkipTimeFound(true);
    }
  };

  const checkSurveySkipTimestamp = async () => {
    const skipTimestamp = await AsyncStorage.getItem('surveySkipTimestamp');
    setSkipTimeStamp(skipTimestamp || null);

    if (skipTimestamp) {
      const currentTime = new Date().getTime();
      const skipTime = parseInt(skipTimestamp, 10);
      const hoursElapsed = (currentTime - skipTime) / (1000 * 60 * 60 * 24);

      const askAgainDays = await firestore()
        .collection('askFeedbackAgainIfSkipped')
        .get();

      // Show the survey modal again after certain days
      if (daysElasped >= Number(askAgainDays.docs[0]._data.days)) {
        // Change this to 1 minute
        setSkipTimeFound(true);
      }
    }
  };

  const getShowSurveyQuestion = async () => {
    // const skipTimestamp = await AsyncStorage.getItem('surveySkipTimestamp');
    // if (!skipTimestamp) {
    try {
      const showSurvey = await firestore()
        .collection('showSurveyQuestion')
        .get();
      setTimeout(() => {
        setShowSurvey(showSurvey.docs[0]._data.show);
      }, 4000);
      if (showSurvey.docs[0]._data.show) {
        setTimeout(() => {
          setModalVisible(true);
        }, 120000);
      }
      // console.log(showSurvey.docs[0]._data.show, 'hee haaaw');
    } catch (error) {}
    // }
  };

  const onSkip = async () => {
    setModalVisible(false);
    const now = new Date().getTime();
    await AsyncStorage.setItem('surveySkipTimestamp', now.toString());
    await AsyncStorage.removeItem('completedTimestamp');
  };

  const onOkay = async () => {
    navigation.navigate('ProfileSettings', {
      isGuestUser: profile?.isGuestUser ? profile.isGuestUser : false,
    });
    setModalVisible(false);
    const now = new Date().getTime();

    await AsyncStorage.setItem('surveySkipTimestamp', now.toString());
  };
  return (
    showSurvey &&
    skipTimeFound && (
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
            // height: isKeyboardVisible ? '81%' : '51%',
            height: 150,
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
              source={require('../../assets/feedback.png')}
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
            {/*
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
            </View> */}
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
            {/* {error && (
              <Text style={{color: 'red', textAlign: 'center'}}>
                Please, Answer all the question of the survey!
              </Text>
            )} */}
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 13,
                // marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={() => onOkay()}
                style={{
                  backgroundColor: '#3da066',
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
                  Sure
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onSkip();
                }}
                style={{
                  backgroundColor: '#b53327',
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
                  Later
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  );
}

export default SurveyModalRedirectionToSettings;
