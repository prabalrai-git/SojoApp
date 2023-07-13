import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './src/navigation/AppNavigation';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';

import messaging from '@react-native-firebase/messaging';

export default function App() {

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <MainNavigation />
        </NavigationContainer>
      </Provider>
    </>
  );
}
