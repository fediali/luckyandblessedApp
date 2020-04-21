export default _retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);

        if (value !== null) {
            return (value)
        }
    } catch (error) {
        console.log(error)
    }
};