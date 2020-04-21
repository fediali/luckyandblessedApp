import AsyncStorage from '@react-native-community/async-storage';


export default async function  _storeData (key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Error saving data
    console.log(error);
  }
};
