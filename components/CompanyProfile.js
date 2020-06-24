import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  InteractionManager,
  ToastAndroid
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import {ScrollView} from 'react-native-gesture-handler';
import ProfileText from '../reusableComponents/CompanyProfileText';
import Accordion from 'react-native-collapsible/Accordion';
import {Icon} from 'react-native-elements';
import Shimmer from 'react-native-shimmer';
import GetData from '../reusableComponents/API/GetData';
import Globals from '../Globals';
import Toast from 'react-native-simple-toast';

const baseUrl = Globals.baseUrl
export default class CompanyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection1: [],
      activeSection2: [],
      isReady: false,
      address_1: null,
      address_2: null,
      address_3: null,
      section1: [
        {
          id: 0,
          title: 'Company',
          content:
            'Howdy! L&B is a Texan based lifestyle brand with a dash of sass. Keen on a sense of style, we are always looking for the next trend in western, boho, contemporary fashion while always providing the basic needs for our clients. At L&B, we are inclusive to all ages, shapes, and sizes. We strive to provide excellent customer service and convenience to all. Our background provides the best fit and flare, glitz and glamour to the most successful boutiques in the nation. Not to mention, we also do business with thousands of retailers all across the world. As a company, we own, operate, and manage all areas of the supply chain. This includes textile, design, manufacturing, distribution, and sales. Come on down and take a look around. We are L&B. We are Lucky & Blessed. Experience the sense of style that holds the name of L&B. High-graded premium denim, bold custom vintage prints with aesthetic traditional lace, and rich striking solid-hued elegant attire. A western background with a crossover to the young contemporary knowledge that makes the perfect overall collection. Leading the industry with the most trending apparel in the market. Hitting all main components from quality to precise designing, we keep our customers satisfied with every purchase.',
        },
        {
          id: 1,
          title: 'Locations',
          content: 'Jackets',
        },
        {
          id: 2,
          title: 'Wholesale Info',
          content: 'Addidas,Puma,Reebok',
        },
        {
          id: 3,
          title: 'Use and Sales TX ID form',
          content: 'M,L',
        },
      ],

      section2: [
        {
          id: 0,
          title: 'Return Policy',
          content: 'ALL',
        },
        {
          id: 1,
          title: 'FAQs',
          content: 'Jackets',
        },
        {
          id: 2,
          title: 'Upcoming Tradeshows',
          content: 'Addidas,Puma,Reebok',
        },
      ],
      call: null,
      email: null
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {

        GetData(baseUrl + 'api/companyprofile')
        .then(res => res.json())
        .then(response => {
          this.setState({
            isReady: true,
            address_1: response.address_1,
            address_2: response.address_2,
            address_3: response.address_3,
            call: response.call,
            email: response.email,
            section1: [
              {
                id: 0,
                title: 'Company',
                content: response.about_us
              },
              {
                  id: 2,
                  title: 'Wholesale Info',
                  content: response.wholesale_info,
              },
            ],
              section2: [
                {
                  id: 0,
                  title: 'Return Policy',
                  content: response.return_policy,
                },
                {
                  id: 1,
                  title: 'FAQs',
                  content: response.faq,
                },
              ],
          })


        }).catch(err => {console.log(err); Toast.show(err.toString())})
    })
}

  _updateSection1 = (activeSection1) => {
    this.setState({activeSection1});
  };

  _updateSection2 = (activeSection2) => {
    this.setState({activeSection2});
  };

  _renderContent = (section) => {
    return (
      <View style={styles.justifyCenter}>
        <Text style={styles.descriptionText}>
          {section.content}
        </Text>
      </View>
    );
  };

  _renderHeader1 = (section) => {
    return (
      <View>
        <View style={styles.userDetails}>
          <View style={styles.paddingVertical}>
            <Text style={styles.keyText}>{section.title}</Text>
          </View>
          <View style={styles.flexDirectionRow}>
            <View
              style={styles.headerViewStyle}>
              {!this.state.activeSection1.includes(section.id) ? (
                <Icon size={20} name="right" type="antdesign" />
              ) : (
                <Icon size={20} name="down" type="antdesign" />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  _renderHeader2 = (section) => {
    return (
      <View>
        <View style={styles.userDetails}>
          <View style={styles.paddingVertical}>
            <Text style={styles.keyText}>{section.title}</Text>
          </View>
          <View style={styles.flexDirectionRow}>
            <View
              style={styles.headerViewStyle}>
              {!this.state.activeSection2.includes(section.id) ? (
                <Icon size={20} name="right" type="antdesign" />
              ) : (
                <Icon size={20} name="down" type="antdesign" />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;
    if (!this.state.isReady) {
      return (
          <View style={styles.loader}>
              <Shimmer>
                  <Image style={styles.logoImage} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
              </Shimmer>
          </View>
      )

  }
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header centerText="Help & Info"  navigation={this.props.navigation}/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View style={styles.subContainer}>
            <Image
              style={styles.topProfileLogo}
              source={require('../static/logo-companyProfile.png')}></Image>

            <Text style={styles.userAddress}>
              {this.state.address_1}
            </Text>
            <Text style={styles.userAddress}>
              {this.state.address_2}
            </Text>
            <Text style={styles.userAddress}>
              {this.state.address_3}
            </Text>
            <View style={styles.marginTop}></View>
            <View style={styles.divider}></View>
          </View>

          <ProfileText
            keyText="Call"
            valueText={this.state.call}></ProfileText>
          <ProfileText
            keyText="Email"
            valueText={this.state.email}></ProfileText>
          {/* <ProfileText
            keyText="Online Orders"
            valueText={this.state.shortAddress}></ProfileText> */}

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

          <View style={styles.divider}></View>
          <Accordion
            underlayColor="#fff"
            sections={this.state.section2}
            activeSections={this.state.activeSection2}
            renderHeader={this._renderHeader2}
            renderContent={this._renderContent}
            onChange={this._updateSection2}
            expandMultiple={true}
          />

          {/* Below view is useless */}
          <View style={styles.belowPaddingView}></View>
        </ScrollView>

        <Footer selected="Info"  navigation={this.props.navigation}/>
      </SafeAreaView>
    );
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 33.1,
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
  },
  divider: {
    height: Height * 0.01,
    width: Width,
    backgroundColor: '#f6f6f6',
  },
  buttonSignIn: {
    backgroundColor: '#2967ff',
    borderRadius: 6,
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
    paddingVertical: 11,
    paddingHorizontal: 131.5,
  },
  descriptionText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    color: '#2d2d2f',
    textAlign: 'justify',
    marginHorizontal: 20
  },
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
  paddingVertical:{paddingVertical: 19},
  headerViewStyle:{
    marginVertical: 18,
    marginRight: 6,
    marginLeft: 19.5,
  },
  flexDirectionRow:{flexDirection: 'row'},
  logoImage:{ height: 200, width: 200 },
  loader:{ flex: 1, alignItems: "center", justifyContent: "center", },
  scrollView:{
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topProfileLogo:{height: 168.9, width: 198.7, marginBottom: 26},
  marginTop:{marginTop: 33},
  belowPaddingView:{paddingBottom: 60, backgroundColor: '#ffffff'},
  justifyCenter:{justifyContent: 'center'}
});
