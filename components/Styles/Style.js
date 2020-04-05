import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginBottom: 100
  },
  subParentContainer: {
    alignItems: 'center',
    backgroundColor: "#fff"
  },
  input: {
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
    flex: 1,
    paddingHorizontal: 15,
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    color: '#2d2d2f',
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
    width: '100%'
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
  },
  inputView: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.3,
    alignSelf: 'stretch'
  },
  smallLogoImage: {
    width: '20%',
    height: '15%',
    marginTop: 10,
  },
});
