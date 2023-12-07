import React, {useEffect, useState} from 'react';
import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Share from 'react-native-share';
import {Platform} from 'react-native';

function ShareOurAppModal() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [skipTimeFound, setSkipTimeFound] = useState(false);
  const [skipTimeStamp, setSkipTimeStamp] = useState();
  const [shareOurModalData, setShareOurModalData] = useState();

  useEffect(() => {
    getShareOurAppModal();
  }, []);

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
      'surveryCompletedTime1',
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
    const skipTimestamp = await AsyncStorage.getItem('surveySkipTimestamp1');
    setSkipTimeStamp(skipTimestamp || null);

    if (skipTimestamp) {
      const currentTime = new Date().getTime();
      const skipTime = parseInt(skipTimestamp, 10);
      const daysElasped = (currentTime - skipTime) / (1000 * 60 * 60 * 24);

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
        }, 240000);
      }
      // console.log(showSurvey.docs[0]._data.show, 'hee haaaw');
    } catch (error) {}
    // }
  };

  const getShareOurAppModal = async () => {
    try {
      const data = await firestore()
        .collection('shareOurAppModal')
        .doc('KIYuVe7jf5kOkJWCH7rt')
        .get();
      setShareOurModalData(data._data);
    } catch (error) {
      // console.log(error);
    }
  };

  const onSkip = async () => {
    setModalVisible(false);
    const now = new Date().getTime();
    await AsyncStorage.setItem('surveySkipTimestamp1', now.toString());
    await AsyncStorage.removeItem('completedTimestamp1');
  };

  const url = 'https://sojonews.com';
  const title = '';
  const message =
    'Check out Sojonews app. I found it best for reading short summarized news.';
  const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
  const options = Platform.select({
    ios: {
      activityItemSources: [
        {
          // For sharing url with custom title.
          placeholderItem: {type: 'url', content: url},
          item: {
            default: {type: 'url', content: url},
          },
          subject: {
            default: title,
          },
          linkMetadata: {originalUrl: url, url, title},
        },
        {
          // For sharing text.
          placeholderItem: {type: 'text', content: message},
          item: {
            default: {type: 'text', content: message},
            message: null, // Specify no text to share via Messages app.
          },
          linkMetadata: {
            // For showing app icon on share preview.
            title: message,
          },
        },
        {
          // For using custom icon instead of default text icon at share preview when sharing with message.
          placeholderItem: {
            type: 'url',
            content: icon,
          },
          item: {
            default: {
              type: 'text',
              content: `${message} ${url}`,
            },
          },
          linkMetadata: {
            title: message,
            icon: icon,
          },
        },
      ],
    },
    default: {
      title,
      subject: title,
      message: `${message} ${url}`,
    },
  });

  const onOkay = async () => {
    Share.open(options);
    setModalVisible(false);
    const now = new Date().getTime();

    await AsyncStorage.setItem('surveryCompletedTime1', now.toString());
    await AsyncStorage.removeItem('surveySkipTimestamp1');
    // await AsyncStorage.setItem('surveySkipTimestamp1', now.toString());
  };
  return (
    showSurvey &&
    skipTimeFound && (
      <Modal
        isVisible={modalVisible}
        // style={{flex: Platform.OS === 'ios' ? 0.6 : 0.6}}
        animationOut={'fadeOut'}
        animationOutTiming={300}
        backdropOpacity={0.2}
        backdropTransitionOutTiming={300}>
        {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: Platform.OS === 'ios' ? 0.9 : 1}}
        enabled>
                </KeyboardAvoidingView> */}

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 20,
              elevation: 10,
              borderRadius: 8,
              position: 'relative',
            }}>
            <View
              style={{
                position: 'absolute',
                zIndex: 10,
                top: -25,
                marginHorizontal: 'auto',
                paddingHorizontal: 10,
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
            <TouchableOpacity
              onPress={() => onSkip()}
              style={{position: 'absolute', right: 10, top: 10}}>
              <Image
                source={require('../../assets/close.png')}
                style={{width: 30, height: 30, objectFit: 'contain'}}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: 'black',
                marginTop: 25,
                marginRight: 0,
                marginLeft: 0,
                textAlign: 'center',
                lineHeight: 20,
              }}>
              {shareOurModalData?.text}
            </Text>
            <Pressable
              onPress={() => {
                onOkay();
              }}
              style={{
                backgroundColor: global.brandColor,
                width: '90%',
                paddingVertical: 8,
                marginTop: 20,
                elevation: 5,
                borderRadius: 8,
              }}>
              <Text style={{color: 'white', textAlign: 'center'}}>
                {shareOurModalData?.buttonText}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  );
}

export default ShareOurAppModal;
