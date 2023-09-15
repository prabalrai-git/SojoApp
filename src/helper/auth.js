import AsyncStorage from '@react-native-async-storage/async-storage';

export const logoutUser = async () => {
  try {
    // remove token from async storage
    await AsyncStorage.removeItem('token');
  } catch (error) {}
};
