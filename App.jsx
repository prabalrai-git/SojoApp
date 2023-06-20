import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './src/navigation/AppNavigation';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';
export default function App() {
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
