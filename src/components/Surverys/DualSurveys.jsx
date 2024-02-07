import React, {useEffect, useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {windowHeight} from '../../helper/usefulConstants';

import RadioGroup from 'react-native-radio-buttons-group';

import Share from 'react-native-share';
import {Platform} from 'react-native';

function DualSurveys() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [skipTimeFound, setSkipTimeFound] = useState(false);
  const [skipTimeStamp, setSkipTimeStamp] = useState();
  const [text, onChangeText] = useState('');

  const [firstPhasePassed, setFirstPhasePassed] = useState(false);
  const [shareOurModalData, setShareOurModalData] = useState();
  const [selectedId, setSelectedId] = useState();
  const [selectedId2, setSelectedId2] = useState();

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
  const sendFeedBack = async () => {
    try {
      firestore()
        .collection('surveyQuestions')
        .add({
          'Which feature do you like the most?': selectedId,
          'Where did you first learn about us?': selectedId2,
          'Do you want us to change or improve anything? (optional)': text,
        })
        .then(() => {
          onChangeText('');
        });
      const now = new Date().getTime();

      await AsyncStorage.setItem('surveyCompleted', 'true');
      await AsyncStorage.setItem('surveryCompletedTime', now.toString());
      await AsyncStorage.removeItem('surveySkipTimestamp');
    } catch (error) {}
  };

  const onSkip = async () => {
    if (firstPhasePassed) {
      return setModalVisible(false);
    }
    setFirstPhasePassed(true);

    const now = new Date().getTime();
    await AsyncStorage.setItem('surveySkipTimestamp', now.toString());
    await AsyncStorage.removeItem('completedTimestamp');
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
    if (firstPhasePassed) {
      Share.open(options);
      return setModalVisible(false);
    }
    setFirstPhasePassed(true);
    sendFeedBack();
  };
  const radioButtons2 = useMemo(
    () => [
      {
        id: 'Youtube', // acts as primary key, should be unique and non-empty string
        label: 'Youtube  ',
        value: 'Youtube ',
        size: 20,
        color: 'green',
      },
      {
        id: 'Facebook', // acts as primary key, should be unique and non-empty string
        label: 'Facebook',
        value: 'Facebook',
        size: 20,
        color: 'green',
      },
      {
        id: 'Twitter', // acts as primary key, should be unique and non-empty string
        label: 'Twitter     ',
        value: 'Twitter     ',
        size: 20,
        color: 'green',
      },
    ],
    [],
  );
  const radioButtons = useMemo(
    () => [
      {
        id: 'Robust Filter (One click filter)', // acts as primary key, should be unique and non-empty string
        label: 'Robust Filter (One click filter)',
        value: 'Robust Filter (One click filter)',
        size: 20,
        color: 'green',
      },
      {
        id: 'Short and Summarized news',
        size: 20,
        label: 'Short and Summarized news ',
        value: 'Short and Summarized news',
        color: 'green',
      },
    ],
    [],
  );
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
            display: 'flex',
            // flex: 0.9,
            // height: isKeyboardVisible ? '81%' : '51%',
            height: firstPhasePassed ? 210 : '70%',
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
            {firstPhasePassed ? (
              <>
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
                    marginTop: 50,
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
                    alignSelf: 'center',
                  }}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    {shareOurModalData?.buttonText}
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    margin: 20,
                    marginHorizontal: 0,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    marginTop: 35,
                    lineHeight: 20,
                  }}>
                  Hello there! Please help us improve by answering this.
                </Text>
                <Text
                  style={{
                    color: 'black',
                    paddingHorizontal: 12,
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: 8,
                  }}>
                  1) Which feature do you like the most?{' '}
                </Text>
                <RadioGroup
                  labelStyle={{color: 'black', fontSize: 14}}
                  containerStyle={{
                    alignSelf: 'flex-start',
                    paddingHorizontal: 10,
                    marginBottom: 10,
                  }}
                  radioButtons={radioButtons}
                  onPress={setSelectedId}
                  selectedId={selectedId}
                />
                <Text
                  style={{
                    color: 'black',
                    paddingHorizontal: 12,
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: 8,
                  }}>
                  2) Where did you first learn about us?{' '}
                </Text>
                <RadioGroup
                  labelStyle={{color: 'black', fontSize: 14}}
                  containerStyle={{
                    alignSelf: 'flex-start',
                    paddingHorizontal: 10,
                    marginBottom: 10,
                  }}
                  radioButtons={radioButtons2}
                  onPress={setSelectedId2}
                  selectedId={selectedId2}
                />
                <Text
                  style={{
                    color: 'black',
                    paddingHorizontal: 12,
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: 8,
                  }}>
                  3) Do you want us to change or improve anything? (optional)
                </Text>
                <TextInput
                  multiline={true}
                  placeholderTextColor={'grey'}
                  style={[
                    styles.input,
                    {
                      backgroundColor: 'lightgrey',
                      color: 'black',
                      //   paddingTop: 10,
                    },
                  ]}
                  onChangeText={onChangeText}
                  value={text}
                  placeholder="Your feedback..."
                />
                <View
                  style={{
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: 13,
                    marginBottom: 40,
                  }}>
                  <TouchableOpacity
                    onPress={() => onOkay()}
                    style={{
                      backgroundColor: global.brandColor,
                      padding: 10,
                      flex: 0.5,
                      borderRadius: 6,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      onSkip();
                    }}
                    style={{
                      backgroundColor: '#218da8',
                      padding: 12,
                      flex: 0.4,
                      borderRadius: 6,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Later
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    )
  );
}

export default DualSurveys;

const styles = StyleSheet.create({
  input: {
    width: '90%',
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 5,
    marginLeft: '4%',
    borderRadius: 5,
    color: 'black',
    height: 80,

    // verticalAlign: 'top',
    textAlignVertical: 'top',
    alignItems: 'center',
    padding: 12,
  },
});
