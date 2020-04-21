import AsyncStorage from '@react-native-community/async-storage';

export default async function _retrieveData(key) {
    try {
        const value = await AsyncStorage.getItem(key);
            return (value)
    } catch (error) {
        console.log(error)
    }
};