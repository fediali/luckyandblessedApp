import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  InteractionManager,
  TextInput
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import Accordion from 'react-native-collapsible/Accordion';
import ModalDropdown from 'react-native-modal-dropdown';
import { Icon } from 'react-native-elements'
import { _categoryList, _collections, _newArrivals, _trending, _history } from '../data/MainPageData'
import Shimmer from 'react-native-shimmer';
import GetData from "../reusableComponents/API/GetData"
import HTML from 'react-native-render-html';
import FastImage from 'react-native-fast-image'

const baseUrl = "http://dev.landbw.co/";

export default class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recentProducts: _history,
      activeSections: [],
      isReady: false,
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
      selectedQuantity: 0,
      pid: this.props.route.params.pid,
      data: {
        productName: "",
        price: 0,
        mainImage: "",
        secondaryImages: [""],
        min_qty: 0,
        max_qty: 0,
        qty_step: 0,
        full_description: "",
        composition: "",
      }
      // data: {
      //   category: 'Jeans',
      //   itemName1: 'RED MINT AZTEC BELL',
      //   itemName2: 'SLEEVE BLAZER',
      //   totalPrice: '$48.99',
      //   unitPrice: '$19.40',
      //   color: ['Turquoise', 'Green Snake'],
      //   minQuantity: 6,
      //   Quanitities: [6, 12, 18],
      //   imageURL: [
      //     { img1: 'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg' },
      //     { img2: 'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg' },
      //     { img3: 'http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg' },
      //   ],

      //   description: {
      //     details:
      //       "This women's tank top is designed to help you stay cool. It's made of stretchy and breathable fabric that moves heat away from your skin",
      //     composition: '84% nylon, 16% elastane',
      //     sizes: '2XS, XS, S, M, L, XL',
      //     gender: 'Women',
      //     country: 'Indonesia',
      //     code: 'EC142690002',
      //   },
      // },
      // mainImage: {require('../static/demoimg1-walkthrough.png'},

    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // "api/products/"+this.props.route.params.id
      //category will also come from this.props.route.params.category

      GetData(baseUrl + `api/products/${this.state.pid}`).then(res => res.json()).then(
        (response) => {
          console.log(response)
          async function getArray() {
            const secondaryImagesArray = []
            for (var key in response.image_pairs) {
              console.log(response.image_pairs[key].detailed.image_path)
              await secondaryImagesArray.push(response.image_pairs[key].detailed.image_path)
            }
            return secondaryImagesArray
          }
          getArray().then((secondaryImagesArray) => {
            // console.log(secondaryImagesArray)
            this.setState({
              isReady: true,
              data: {
                productName: response.product,
                price: response.price,
                mainImage: response.main_pair.detailed.image_path,
                secondaryImages: secondaryImagesArray,
                min_qty: Number(response.min_qty),
                max_qty: 18,//TODO: Number(response.max_qty) currently 0 from api
                qty_step: Number(response.qty_step),
                full_description: response.full_description,
                composition: response.composition,
              }

            })
          })

        })
    })
  };

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
    console.log(section)
    if (section.name == "Description") {
      return (
        <View style={{ paddingHorizontal: 20 }}>
          <HTML html={this.state.data.full_description} imagesMaxWidth={Dimensions.get('window').width} />
          <HTML html={this.state.data.composition} tagsStyles={this.state.tagsStyles} imagesMaxWidth={Dimensions.get('window').width} />

          {/* <Text style={[styles.descriptionText, { paddingBottom: 20 }]}>{this.state.data.description}</Text>
          <View style={{ flexDirection: "row" }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ height: 5, width: 5, borderRadius: 5, backgroundColor: "#000", marginRight: 10 }}></View>
                <Text style={styles.descriptionText}>Composition  </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ height: 5, width: 5, borderRadius: 5, backgroundColor: "#000", marginRight: 10 }}></View>
                <Text style={styles.descriptionText}>Sizes  </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ height: 5, width: 5, borderRadius: 5, backgroundColor: "#000", marginRight: 10 }}></View>
                <Text style={styles.descriptionText}>Gender  </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ height: 5, width: 5, borderRadius: 5, backgroundColor: "#000", marginRight: 10 }}></View>
                <Text style={styles.descriptionText}>Country  </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ height: 5, width: 5, borderRadius: 5, backgroundColor: "#000", marginRight: 10 }}></View>
                <Text style={styles.descriptionText}>Code  </Text>
              </View>
            </View>
            <View> */}
          {/* <Text style={styles.descriptionText}>{this.state.data.description.composition}</Text>
              <Text style={styles.descriptionText}>{this.state.data.description.sizes}</Text>
              <Text style={styles.descriptionText}>{this.state.data.description.gender}</Text>
              <Text style={styles.descriptionText}>{this.state.data.description.country}</Text>
              <Text style={styles.descriptionText}>{this.state.data.description.code}</Text> */}

          {/* </View> */}
          {/* </View> */}

        </View>
      )
    }
    else {
      return (
        <View style={{ paddingHorizontal: 20, alignItems: "center" }}>
          <FastImage style={{ width: "100%", height: 400 }} resizeMode={"contain"} source={require("../static/sizeGuide.png")} />
        </View>
      )
    }

  }
  render() {

    console.log(this.state.data.composition)
    var quantityOptionsArray = []
    if (Number(this.state.data.min_qty) > 1) {
      for (let i = this.state.data.qty_step; i <= this.state.data.max_qty; i += this.state.data.qty_step) {
        quantityOptionsArray.push(i.toString())
      }
    }

    // console.log("_______"+this.state.data.mainImage)
    if (!this.state.isReady) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
          <Shimmer>
            <FastImage style={{ height: 200, width: 200 }} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
          </Shimmer>
        </View>
      )

    }
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header centerText={this.state.data.category} rightIcon="share" navigation={this.props.navigation} />
        <ScrollView>
          <View style={{ marginBottom: 10 }}>
            <View style={[styles.subContainer,]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.itemNameText}>
                    {this.state.data.productName}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.itemNameText, { alignSelf: "flex-end" }]}>
                    ${Number(this.state.data.price).toFixed(2)}
                  </Text>
                  <Text style={styles.subText}>
                    Prepack Price: ${Number(this.state.data.price*this.state.data.min_qty).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={{}}>

                <View style={[styles.mainPicture,{backgroundColor:"#f6f6f6",borderRadius:6}]}>
                  <FastImage style={styles.mainPicture} source={{ uri: this.state.data.mainImage }} resizeMode="contain"></FastImage>

                </View>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={{ marginVertical: 15, }}>
                  {this.state.data.secondaryImages.map((val, num) => {
                    return (
                      <TouchableOpacity key={num} onPress={() => { this.setState({ data: { ...this.state.data, mainImage: val } }) }}>

                        <FastImage style={this.state.data.mainImage == val ? [styles.thumbnail, { borderColor: "#2967ff", borderWidth: 2 }] : styles.thumbnail} source={{ uri: val }}></FastImage>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View>

            </View>
            <View style={{ backgroundColor: "#f6f6f6", paddingTop: 20, paddingHorizontal: 20 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  {
                    this.state.data.min_qty == 1 ?
                      <TextInput
                        style={styles.valueText}
                        placeholder={"Quantity"}
                        onChangeText={text => this.setState({ selectedQuantity: text })}

                      />
                      :
                      <ModalDropdown
                        onSelect={(index) => { this.setState({ selectedQuantity: quantityOptionsArray[index] }) }}
                        options={quantityOptionsArray}
                        defaultValue={this.state.data.min_qty}
                        style={{ padding: 10, backgroundColor: "#fff", borderRadius: 6 }}
                        dropdownStyle={{ width: 0.25 * Width, height: 134 }}
                        textStyle={{ fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f" }}
                        renderRow={(option, index, isSelected) => {
                          return (
                            <Text style={{ fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f", paddingHorizontal: 20, paddingVertical: 10 }}>{option}</Text>
                          )
                        }}
                      />
                  }

                </View>

                <View style={{ flex: 2, marginLeft: 20 }}>
                  <ModalDropdown options={["Male", 'Female', "All"]}
                    hexCode={"#000"}
                    defaultValue={"Green"}
                    style={{ padding: 10, backgroundColor: "#fff", borderRadius: 6 }}
                    dropdownStyle={{ width: 0.5 * Width, height: 134 }}
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
                <Text style={{ textAlign: "center", fontSize: 14, fontFamily: "Avenir-Book", lineHeight: 18, color: "#8d8d8e" }}>Minimum quantity for "{this.state.data.productName}" is {this.state.data.min_qty}.</Text>
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
            {/* history header*/}
            <View style={[styles.headerView, { marginTop: 20, marginBottom: 10 }]}>
              <Text style={[styles.buttonText, { flex: 0.5, textAlign: 'left' }]}>Similar Products</Text>
              <TouchableOpacity style={{ flex: 0.5, textAlign: 'right' }}>
                <Text style={[styles.showAllText]}>Show All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              data={this.state.recentProducts}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity style={{ flexDirection: 'column', paddingHorizontal: 10, marginBottom: 50 }}>
                  <FastImage
                    style={styles.gridImage}
                    source={item.imageUrl}
                  />
                  <Text style={styles.gridItemNameAndPriceText}>{item.name}</Text>
                  <Text style={[styles.showAllText, { fontSize: 14, lineHeight: 18, textAlign: "left", marginTop: 5 }]}>{item.type}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
        <Footer navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
  },
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
    maxWidth: 0.54 * Width
  },
  subText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    lineHeight: 18,
    color: '#8d8d8e',
    marginVertical: 8
  },
  mainPicture: { width: Width * 0.893, height: Width * 0.893 },
  thumbnail: { width: Width * 0.28, height: Width * 0.28, borderRadius: 6, marginRight: 15 },
  descriptionText: { fontSize: 16, fontFamily: "Avenir-Book", lineHeight: 22, color: "#2d2d2f" },
  headerView: {
    width: Width,
    height: Height * 0.06,
    // backgroundColor: '#344565',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 5,
  },
  showAllText: {
    fontFamily: "Avenir-Book",
    fontSize: 18,
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "right",
    color: '#2967ff'
  },
  gridItemNameAndPriceText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "left",
    color: '#2d2d2f'
  },
  gridImage: {
    width: Width * 0.427,
    height: Height * 0.28,
    borderRadius: 6,
  },
  valueText: {
    backgroundColor: "#fff",
    padding: 10,
    width: 0.25 * Width,
    borderRadius: 6,
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    lineHeight: 20,
    justifyContent: "center",
    textAlign: "center"

  }

});
