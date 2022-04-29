import {StyleSheet} from 'react-native';

//Main Container, logoImageLoader and Loader are used throughout
export default StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subParentContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#ebebeb',
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    color: '#606060',
  },
  customTextBold: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2d2d2f',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '80%',
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
  },
  inputView: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.3,
    alignSelf: 'stretch',
  },
  smallLogoImage: {
    width: '20%',
    height: '15%',
    marginTop: 10,
  },
  logoImageLoader: {height: 200, width: 200},
  loader: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
