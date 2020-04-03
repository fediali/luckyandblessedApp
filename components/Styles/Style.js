import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subParentContainer: {
    flex: 3,
    alignItems: 'center',
  },
  input: {
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
    flex: 1,
    paddingHorizontal: '5%',
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    color: '#2d2d2f',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
  },
  inputView: {
    flexDirection: 'row',
    paddingHorizontal: '11%',
    marginTop: '3%',
  },
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    alignSelf:'stretch'
  }
});
