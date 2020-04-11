import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import Accordion from 'react-native-collapsible/Accordion';
import ModalDropdown from 'react-native-modal-dropdown';
import { Icon } from 'react-native-elements'

export default class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      sections: [
        {
          id: 0,
          name: "Description"
        },
        {
          id: 1,
          name: "Size guide"
        }
      ],
      data: {
        category: 'Jeans',
        itemName1: 'RED MINT AZTEC BELL',
        itemName2: 'SLEEVE BLAZER',
        totalPrice: '$48.99',
        unitPrice: '$19.40',
        color: ['Turquoise', 'Green Snake'],
        minQuantity: 6,
        Quanitities: [6, 12, 18],
        imageURL: [
          { img1: 'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg' },
          { img2: 'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg' },
          { img3: 'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg' },
        ],

        description: {
          details:
            "This women's tank top is designed to help you stay cool. It's made of stretchy and breathable fabric that moves heat away from your skin",
          composition: '84% nylon, 16% elastane',
          sizes: '2XS, XS, S, M, L, XL',
          gender: 'Women',
          country: 'Indonesia',
          code: 'EC142690002',
        },
      },
    };
  }
  _updateSections = activeSections => {
    // console.log(activeSections)
    this.setState({ activeSections });
  };
  _renderHeader = section => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 10 }}>
        <Text style={{ fontSize: 18, fontFamily: "Montserrat-SemiBold", lineHeight: 22, color: "#2d2d2f" }}>
          {section.name}
        </Text>
        {
          !this.state.activeSections.includes(section.id) ?
            < Icon
              size={25}
              name='ios-arrow-forward'
              type='ionicon'
              color='#2d2d2f'
            /> :
            < Icon
              size={25}
              name='ios-arrow-down'
              type='ionicon'
              color='#2d2d2f'
            /> 
        }

      </View>
    )
  }
  _renderContent = section => {
    return (
      <View>
        <Text>sectiion</Text>
      </View>
    )
  }
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header centerText={this.state.data.category} rightIcon="share" />
        <ScrollView>
          <View style={{ marginBottom: 160 }}>
            <View style={[styles.subContainer,]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.itemNameText}>
                    {this.state.data.itemName1}
                  </Text>
                  <Text style={styles.itemNameText}>
                    {this.state.data.itemName2}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.itemNameText, { alignSelf: "flex-end" }]}>
                    {this.state.data.unitPrice}
                  </Text>
                  <Text style={styles.subText}>
                    Prepack Price: {this.state.data.totalPrice}
                  </Text>
                </View>
              </View>
              <View style={{}}>

                <Image style={styles.mainPicture} source={require('../static/demoimg1-walkthrough.png')}></Image>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={{ marginVertical: 15, }}>
                  <Image style={styles.thumbnail} source={require('../static/demoimg2-walkthrough.png')}></Image>
                  <Image style={styles.thumbnail} source={require('../static/demoimg2-walkthrough.png')}></Image>
                  <Image style={styles.thumbnail} source={require('../static/demoimg2-walkthrough.png')}></Image>
                  <Image style={styles.thumbnail} source={require('../static/demoimg2-walkthrough.png')}></Image>
                  <Image style={styles.thumbnail} source={require('../static/demoimg2-walkthrough.png')}></Image>
                </ScrollView>
              </View>

            </View>
            <View style={{ backgroundColor: "#f6f6f6", paddingTop: 20, paddingHorizontal: 20 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <ModalDropdown
                    onSelect={(index) => { console.log(index) }}
                    options={["5", '5.5', "6", "6.5", '7', "8"]}
                    defaultValue={"5"}
                    style={{ padding: 10, backgroundColor: "#fff", borderRadius: 6 }}
                    dropdownStyle={{ width: "25%", height: 134 }}
                    textStyle={{ fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f" }}
                    renderRow={(option, index, isSelected) => {
                      return (
                        <Text style={{ fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f", paddingHorizontal: 20, paddingVertical: 10 }}>{option}</Text>
                      )
                    }}
                  />
                </View>

                <View style={{ flex: 2, marginLeft: 20 }}>
                  <ModalDropdown options={["Male", 'Female', "All"]}
                    hexCode={"#000"}
                    defaultValue={"Green"}
                    style={{ padding: 10, backgroundColor: "#fff", borderRadius: 6 }}
                    dropdownStyle={{ width: "50%", height: 134 }}
                    textStyle={{ fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f" }}
                    renderRow={(option, index, isSelected) => {
                      return (
                        <Text style={{ fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f", paddingHorizontal: 20, paddingVertical: 10 }}>{option}</Text>
                      )
                    }}
                  />
                </View>
              </View>
              <View style={{ alignItems: "center", marginTop: 17 }}>
                <Text style={{ textAlign: "center", fontSize: 14, fontFamily: "Avenir-Book", lineHeight: 18, color: "#8d8d8e" }}>Minimum quantity for "RED MINT AZTEC BELL SLEEVE BLAZER" is 6.</Text>
                <TouchableOpacity style={{ backgroundColor: "#2967ff", alignItems: "center", width: "100%", borderRadius: 6, marginVertical: 15 }}>
                  <Text style={{ color: "#fff", paddingVertical: 11, fontSize: 18, lineHeight: 22, fontFamily: "Montserrat-SemiBold" }}>
                    Add to cart
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Accordion
              style={{ marginBottom: 0, paddingBottom: 0 }}
              underlayColor="#fff"
              sections={this.state.sections}
              activeSections={this.state.activeSections}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              onChange={this._updateSections}
              // touchableComponent={(props) => <TouchableOpacity {...props} />}
              expandMultiple={true}

            />
          </View>
        </ScrollView>
        <Footer />
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
    marginHorizontal: 20,
    marginTop: 14,
    // marginBottom: 20
  },
  itemNameText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: '#2d2d2f',
  },
  subText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    lineHeight: 18,
    color: '#8d8d8e',
    marginVertical: 8
  },
  mainPicture: { width: Width * 0.893, height: Width * 0.893, borderRadius: 6 },
  thumbnail: { width: Width * 0.28, height: Width * 0.28, borderRadius: 6, marginRight: 15 }
});
