import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SurveyModal() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [answerOne, setAnswerOne] = useState();
  const [answerTwo, setAnswerTwo] = useState();
  const [answerThree, setAnswerThree] = useState();
  const [review, setReview] = useState();
  const [error, setError] = useState(false);
  const [surveCompleted, setSurveyCompleted] = useState(null);

  useEffect(() => {
    getShowSurveyQuestion();
    getSurveyDataFromAsyncStorage();
    // funfun();
  }, []);

  const getShowSurveyQuestion = async () => {
    try {
      const showSurvey = await firestore()
        .collection('showSurveyQuestion')
        .get();
      setShowSurvey(showSurvey.docs[0]._data.show);
      if (showSurvey.docs[0]._data.show) {
        setModalVisible(true);
      }
      // console.log(showSurvey.docs[0]._data.show, 'hee haaaw');
    } catch (error) {}
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
          answer1: answerOne,
          answer2: answerTwo,
          answer3: answerThree,
          review: review,
        })
        .then(() => {
          console.log('Survey data added!');
          setModalVisible(false);
        });
      await AsyncStorage.setItem('surveyCompleted', 'true');
    } catch (error) {}
  };

  return (
    showSurvey &&
    surveCompleted === null && (
      <Modal
        isVisible={modalVisible}
        animationOut={'slideOutDown'}
        animationOutTiming={700}
        backdropTransitionOutTiming={700}>
        <View
          style={{
            display: 'flex',

            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ScrollView
            style={{
              height: 600,
              width: '90%',
              backgroundColor: 'white',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                margin: 20,
                fontWeight: 'bold',
              }}>
              These are the questions
            </Text>
            <View style={{margin: 12}}>
              <Text style={{color: 'black', marginBottom: 10}}>
                Question One?
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
                Question One?
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
                Question One?
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
              <Text style={{color: 'black', marginBottom: 10}}>Remarks</Text>
              <TextInput
                multiline={true}
                numberOfLines={4}
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
                onPress={() => setModalVisible(false)}
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
