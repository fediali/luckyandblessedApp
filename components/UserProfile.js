import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  InteractionManager,
  Clipboard,
  ImageBackground,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import {ScrollView} from 'react-native-gesture-handler';
import ProfileText from '../reusableComponents/UserProfileText';
import Accordion from 'react-native-collapsible/Accordion';
import {Icon} from 'react-native-elements';
import Shimmer from 'react-native-shimmer';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalStyles from './Styles/Style';
import FastImage from 'react-native-fast-image';
import ThemeContext from '../reusableComponents/ThemeContext';
import Globals from '../Globals';
import GetData from '../reusableComponents/API/GetData';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
var RNFS = require('react-native-fs');

const STORAGE_PRODUCT_HISTORY_CATEGORY =
  Globals.STORAGE_PRODUCT_HISTORY_CATEGORY;
const STORAGE_USER = Globals.STORAGE_USER;
const STORAGE_DEFAULTS = Globals.STORAGE_DEFAULTS;
const STORAGE_FCM_TOKEN = Globals.STORAGE_FCM_TOKEN;
const baseUrl = Globals.baseUrl;
const TEXTINPUT_COLOR = Globals.Colours.TEXT_INPUT_PLACEHOLDER_COLOR;
let DEFAULTS_OBJ = [];
export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection1: [],
      isReady: false,
      section1: [
        {
          id: 0,
          title: 'Referral Link',
          content: baseUrl + 'profiles-add.html?ref_code=',
        },
        {
          id: 1,
          title: 'Tax ID',
          content: '',
        },
      ],
      fullName: '',
      email: '',
      b_address_2: '',
      b_address: '',
      city: '',
      imageb64: Globals.placeHolderImage,
    };
  }
  static contextType = ThemeContext;

  componentDidMount() {
    this.onComponentFocus = this.props.navigation.addListener('focus', () => {
      RetrieveDataAsync(STORAGE_USER).then((user) => {
        GetData(baseUrl + `api/usersnew/${JSON.parse(user).user_id}`)
          .then((res) => res.json())
          .then((result) => {
            this.setState({
              fullName: JSON.parse(user).name,
              activeSection1: [],
              email: result.email,
              b_address_2: result.b_address_2 + ',',
              b_address: result.b_address,
              city: result.b_city,
              isReady: true,
              section1: [
                {
                  id: 0,
                  title: 'Referral Link',
                  content: `${baseUrl}profiles-add.html?ref_code=${result.ref_link}`,
                },
                {
                  id: 1,
                  title: 'Tax ID',
                  content: 'No content',
                },
              ],
              imageb64: result.profile_image.includes('.')
                ? baseUrl + result.profile_image
                : this.state.imageb64,
            });
          })
          .catch((error) => {
            this.logoutPressed;
          });
      });
    });

    InteractionManager.runAfterInteractions(() => {
      RetrieveDataAsync(STORAGE_USER).then((user) => {
        RetrieveDataAsync(STORAGE_DEFAULTS)
          .then((defaults) => {
            DEFAULTS_OBJ = JSON.parse(defaults);
            let taxIDUrl =
              baseUrl +
              `/api/salestaxid/${
                JSON.parse(user).user_id
              }&company_id=${DEFAULTS_OBJ.store_id.toString()}`;

            var promises = [];
            promises.push(
              GetData(
                baseUrl + baseUrl + `api/usersnew/${JSON.parse(user).user_id}`,
              ),
            );
            promises.push(GetData(taxIDUrl)); //Category id for store.
            Promise.all(promises).then((promiseResponses) => {
              Promise.all(promiseResponses.map((res) => res.json()))
                .then((responses) => {
                  this.setState({
                    fullName: JSON.parse(user).name,
                    email: responses[0].email,
                    b_address_2: responses[0].b_address_2 + ',',
                    b_address: responses[0].b_address,
                    city: responses[0].b_city,
                    isReady: true,
                    section1: [
                      {
                        id: 0,
                        title: 'Referral Link',
                        content: `${baseUrl}profiles-add.html?ref_code=${responses[0].ref_link}`,
                      },
                      {
                        id: 1,
                        title: 'Tax ID',
                        content: 'No content',
                      },
                    ],
                    imageb64: responses[0].profile_image.includes('.')
                      ? baseUrl + responses[0].profile_image
                      : this.state.imageb64,
                    taxIDFileName: responses[1].taxid_file,
                    taxIdDate: responses[1].date,
                  });
                  console.log('work');
                })
                .catch((error) => {
                  console.log('Inner', error);
                  Toast.show('An error occured. Please log in again');
                  this.logoutPressed();
                });
            });
          })
          .catch((error) => {
            console.log('Outer', error);
          });
      });
    });
  }
  _updateSection1 = (activeSection1) => {
    this.setState({activeSection1});
  };

  copyToClipboard = (content) => () => {
    Clipboard.setString(content.toString());
    Toast.show('Copied to clipboard');
  };
  _renderContent = (section, index) => {
    if (this.state.activeSection1.includes(index)) {
      console.log(this.state.activeSection1.includes(index), 'Section Index');
      if (section.title === 'Referral Link') {
        return (
          <TouchableOpacity onPress={this.copyToClipboard(section.content)}>
            <View
              style={[
                styles.descriptionTextView,
                {paddingLeft: 10, flexDirection: 'row', marginRight: 30},
              ]}>
              <TextInput
                placeholderTextColor={TEXTINPUT_COLOR}
                editable={false}
                multiline={true}
                style={styles.descriptionText}
                value={section.content}></TextInput>
              <Icon size={20} name="clipboard" type="font-awesome" />
            </View>
          </TouchableOpacity>
        );
      } else if (section.title === 'Tax ID') {
        console.log('Errorrrr');
        if (this.state.taxIDFileName) {
          return (
            <View>
              <Text style={styles.descriptionText}>
                File name:{' '}
                {'\t\t' +
                  this.state.taxIDFileName.substring(
                    this.state.taxIDFileName.lastIndexOf('/') + 1,
                  )}
              </Text>
              <Text style={styles.descriptionText}>
                Date submitted: {'\t\t' + this.state.taxIdDate}
              </Text>
            </View>
          );
        } else {
          console.log('We here');
          this.props.navigation.navigate('TaxID', {fromUserProfile: true});
        }
      }
    }
  };

  _renderHeader1 = (section) => {
    return (
      <View style={styles.userDetails}>
        <View style={styles.titleTextView}>
          <Text style={styles.keyText}>{section.title}</Text>
        </View>
        <View style={styles.iconStyle}>
          {!this.state.activeSection1.includes(section.id) ? (
            <Icon size={20} name="right" type="antdesign" />
          ) : (
            <Icon size={20} name="down" type="antdesign" />
          )}
        </View>
      </View>
    );
  };

  //To get the data from child component and update the state of main component. Expects a json object.

  customSetState(stateVal) {
    var key = Object.keys(stateVal)[0];
    this.setState({[key]: stateVal[key]});
  }

  logoutPressed = () => {
    AsyncStorage.removeItem(STORAGE_USER);
    AsyncStorage.removeItem(STORAGE_PRODUCT_HISTORY_CATEGORY);
    AsyncStorage.removeItem(STORAGE_FCM_TOKEN);
    Globals.cartCount = 0;
    this.context.setAuthenticated('');
  };
  onImageEditClick = () => {
    const options = {
      title: 'Upload from..',
      customButtons: [{name: 'remove', title: 'Remove Image'}],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // this.selectOneFile();
        this.setState({imageb64: Globals.placeHolderImage});
        RetrieveDataAsync(STORAGE_USER).then((user) => {
          PutData(baseUrl + `/api/usersnew/${JSON.parse(user).user_id}`, {
            profile_image: '',
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.message == 'User updated successfully') {
              } else {
                Toast.show('Failed to update');
              }
            });
        });
      } else {
        RNFS.readFile(response.uri, 'base64').then((fileBase64) => {
          // console.log(fileBase64)
          this.setState({
            imageb64: 'data:image/png;base64,' + fileBase64,
          });
          RetrieveDataAsync(STORAGE_USER).then((user) => {
            PutData(baseUrl + `/api/usersnew/${JSON.parse(user).user_id}`, {
              profile_image: 'data:image/png;base64,' + fileBase64,
            })
              .then((res) => res.json())
              .then((result) => {
                if (result.message == 'User updated successfully') {
                } else {
                  Toast.show('Failed to update');
                }
              })
              .catch((ex) => {
                console.log(ex);
                Toast.show(ex.toString());
              });
          });
        });
      }
    });
  };
  render() {
    if (!this.state.isReady) {
      return (
        <View style={GlobalStyles.loader}>
          <Shimmer>
            <FastImage
              style={GlobalStyles.logoImageLoader}
              resizeMode={'contain'}
              source={require('../static/logo-signIn.png')}
            />
          </Shimmer>
        </View>
      );
    }

    return (
      <SafeAreaView style={GlobalStyles.parentContainer}>
        {/* <Header centerText="Account" navigation={this.props.navigation} /> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewStyles}>
          <View style={styles.logoView}>
            <FastImage
              source={require('../static/logo-main.png')}
              style={styles.logomain}
              resizeMode="contain"
            />
          </View>
          <View style={{...styles.tabContainer}}>
            <TouchableOpacity
              // onPress={() => this.props.navigation.navigate('TaxID')}
              style={styles.activeTab}>
              <Text style={styles.activeTabText}>PROFILE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              //   onPress={this.props.navigation.navigate('TaxID', {})}
              onPress={() => this.props.navigation.navigate('TaxID')}
              style={styles.activeTab}>
              <Text style={styles.inactiveTabText}>TAX ID</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('TrackOrders')}
              style={styles.activeTab}>
              <Text style={styles.inactiveTabText}>MY ORDERS</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subContainer}>
            <ImageBackground
              source={{uri: this.state.imageb64}}
              style={styles.displayPicture}
              imageStyle={{borderRadius: 88}}>
              <TouchableOpacity onPress={this.onImageEditClick}>
                <View style={{marginTop: 60, marginLeft: 50}}>
                  <Icon
                    reverse
                    size={10}
                    name="edit"
                    type="entypo"
                    color="#1bbfc7"
                  />
                </View>
              </TouchableOpacity>
            </ImageBackground>

            <Text style={styles.userNameText}>{this.state.fullName}</Text>
            <Text style={styles.userAddress}>{this.state.b_address}</Text>
            <Text style={styles.userAddress}>
              {this.state.b_address_2} {this.state.city}
            </Text>
            <View style={styles.divideProfile}></View>
            <View style={styles.divider}></View>
          </View>

          <ProfileText
            keyText="Full Name"
            valueText={this.state.fullName}
            stateKey="fullName"
            customSetState={(stateVal) => {
              this.customSetState(stateVal);
            }}></ProfileText>
          <ProfileText
            keyText="Email"
            valueText={this.state.email}
            stateKey="email"
            customSetState={(stateVal) => {
              this.customSetState(stateVal);
            }}></ProfileText>
          <ProfileText
            navigation={this.props.navigation}
            keyText="Address"
            containIcon={true}></ProfileText>
          <View style={styles.divider}></View>

          <Accordion
            underlayColor="#fff"
            sections={this.state.section1}
            activeSections={this.state.activeSection1}
            renderHeader={this._renderHeader1}
            renderContent={this._renderContent}
            onChange={this._updateSection1}
            expandMultiple={true}
          />

          <ProfileText
            navigation={this.props.navigation}
            keyText="My orders"
            containIcon={true}></ProfileText>
          <View style={styles.divider}></View>
          {/* <ProfileText keyText="Return Request" containIcon={true}></ProfileText>
          <ProfileText keyText="Settings" containIcon={true}></ProfileText> */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonSignIn}
              onPress={this.logoutPressed}>
              <View style={styles.logOutButton}>
                <Text style={styles.buttonText}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Footer selected="Person" navigation={this.props.navigation} />
      </SafeAreaView>
    );
    console.log(this._renderContent, 'asdsasadsadsadsad');
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  logoView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logomain: {
    width: '50%',
    height: 100,
  },
  inactiveTabText: {
    fontSize: 15,
    color: '#ccc',
    textTransform: 'uppercase',
    fontFamily: 'Montserrat-Bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  activeTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  activeTabText: {
    color: '#000',
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: 'Montserrat-Bold',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
    // marginBottom:150
  },
  divideProfile: {marginTop: 50},
  scrollViewStyles: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  userNameText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 24,
    lineHeight: 28,
    marginTop: 35,
    marginBottom: 9,
  },
  userAddress: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    width: Width * 0.6,
  },
  divider: {
    height: Height * 0.01,
    width: Width,
    backgroundColor: '#f6f6f6',
  },
  buttonSignIn: {
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
    color: '#ffffff',
    // paddingVertical: 11,
    width: Width * 0.8,
  },
  descriptionText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    color: '#2d2d2f',
    textAlign: 'justify',
    marginHorizontal: 20,
  },
  descriptionTextView: {justifyContent: 'center'},
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  keyText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#2d2d2f',
  },
  iconStyle: {
    marginVertical: 18,
    marginRight: 6,
    marginLeft: 19.5,
  },
  displayPicture: {height: 88, width: 88},
  bottomContainer: {paddingBottom: 60, backgroundColor: '#f6f6f6'},
  logOutButton: {
    height: Height * 0.074,
    width: '60%',
    backgroundColor: '#000',
    alignItems: 'center',
    borderRadius: 6,
    justifyContent: 'center',
    textTransform: 'uppercase',
  },
  titleTextView: {paddingVertical: 19},
});
