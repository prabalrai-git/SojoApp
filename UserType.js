const {
  default: AsyncStorage,
} = require('@react-native-async-storage/async-storage');

const getUserType = async () => {
  return await AsyncStorage.getItem('guestUser');
};
export const isGuest = getUserType();
