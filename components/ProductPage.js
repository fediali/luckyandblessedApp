import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  InteractionManager,
  TextInput,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import Accordion from 'react-native-collapsible/Accordion';
import ModalDropdown from 'react-native-modal-dropdown';
import { Icon } from 'react-native-elements';
import Shimmer from 'react-native-shimmer';
import GetData from '../reusableComponents/API/GetData';
import HTMLView from 'react-native-htmlview';
import Toast from 'react-native-simple-toast';
import { Image as FastImage } from 'react-native';
import ProductPageSimilarListItem from '../reusableComponents/ProductPageSimilarListItem';
import StoreDataAsync from '../reusableComponents/AsyncStorage/StoreDataAsync';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import ZeroDataScreen from '../reusableComponents/ZeroDataScreen';
import Globals from '../Globals';

const SIMILARPRODUCTS_CATEGORY_ID = -3;
const SIMILARPRODUCTS_NAME = 'SIMILAR PRODUCTS';
const STORAGE_DEFAULTS = Globals.STORAGE_DEFAULTS;
const TEXTINPUT_COLOR = Globals.TEXT_INPUT_PLACEHOLDER_COLOR;

const baseUrl = Globals.baseUrl;
let DEFAULTS_OBJ = [];

export default class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      disableAddToCartButton: false,
      isReady: false,
      sections: [
        {
          id: 0,
          name: 'Description',
        },
        {
          id: 1,
          name: 'Size guide',
        },
      ],
      selectedQuantity: 0,
      pid: this.props.route.params.pid,
      cname: null,
      product_stock: 0,
      data: {
        productName: '',
        price: 0,
        mainImage: '',
        secondaryImages: [''],
        min_qty: 0,
        max_qty: 0,
        qty_step: 0,
        full_description: '',
        composition: '',
      },
      similarProducts: [],
      showZeroProductScreen: false,
    };
  }

  getData() {
    var promises = [];
    console.log("AAAAA", this.state.pid[0])
    promises.push(GetData(baseUrl + `api/products/${this.state.pid[0]}`));
    promises.push(GetData(baseUrl + `api/similarproducts/${this.state.pid[0]}`));
    Promise.all(promises)
      .then((promiseResponses) => {
        Promise.all(promiseResponses.map((res) => res.json()))
          .then((response) => {
            async function getArray() {
              const secondaryImagesArray = [];
              for (var key in response[0].image_pairs) {
                await secondaryImagesArray.push(
                  response[0].image_pairs[key].detailed.image_path,
                );
              }
              return secondaryImagesArray;
            }
            if (response[0].status == 404) {
              this.setState({
                showZeroProductScreen: true,
                isReady: true,
              });
            } else {
              this.setState({
                showZeroProductScreen: false,
              });
            }
            getArray()
              .then((secondaryImagesArray) => {
                secondaryImagesArray.unshift(
                  response[0].main_pair.detailed.image_path,
                );

                // Stroing History of objects
                RetrieveDataAsync('productHistoryList').then((value) => {
                  if (value == null) value = [];
                  else value = JSON.parse(value);
                  let historyObj = {
                    productName: response[0].product,
                    price: response[0].price,
                    base_price: response[0].base_price,

                    mainImage: response[0].main_pair.detailed.image_path,
                    pid: this.state.pid,
                    cname: response[0].category,
                    brand: response[0].brand,
                  };
                  if (
                    value.filter((obj) => obj.pid[0] === historyObj.pid[0])
                      .length == 0
                  ) {

                    value.unshift(historyObj);
                    if (value.length >= 10) value.pop();
                    StoreDataAsync('productHistoryList', value);
                  }
                });
                console.log("MAX", response[0].max_qty)

                this.setState({
                  isReady: true,
                  product_stock: parseInt(response[0].amount),
                  cname: response[0].category,
                  data: {
                    productName: response[0].product,
                    price: response[0].price,
                    mainImage: response[0].main_pair.detailed.image_path,
                    secondaryImages: secondaryImagesArray,
                    min_qty: Number(response[0].min_qty),
                    max_qty: 18,//FIXME: get from api. till now api is returning max=0 which is wrong.
                    qty_step: Number(response[0].qty_step),
                    full_description: response[0].full_description,
                    composition: response[0].composition,
                    qty_content: response[0].qty_content
                  },
                  similarProducts: response[1].products,
                  selectedQuantity: Number(response[0].min_qty),
                });
              })
              .catch((ex) => {
                console.log(ex);
                Toast.show(ex.toString())
              });
          })
          .catch((ex) => {
            console.log('Inner Promise', ex);
            Toast.show(ex.toString());
          });
      })
      .catch((ex) => {
        console.log('Outer Promise', ex);
        Toast.show(ex.toString());
      });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // "api/products/"+this.props.route.params.id
      //category will also come from this.props.route.params.category

      RetrieveDataAsync(STORAGE_DEFAULTS).then((defaults) => {
        DEFAULTS_OBJ = JSON.parse(defaults);
        this.getData();
      });
    });
  }

  _updateSections = (activeSections) => {
    this.setState({ activeSections });
  };
  _renderHeader = (section) => {
    return (
      <View style={styles.headerMainView}>
        <Text style={styles.headerMainText}>{section.name}</Text>
        {!this.state.activeSections.includes(section.id) ? (
          <Icon
            size={25}
            name="ios-arrow-forward"
            type="ionicon"
            color="#2d2d2f"
          />
        ) : (
            <Icon
              size={25}
              name="ios-arrow-down"
              type="ionicon"
              color="#2d2d2f"
            />
          )}
      </View>
    );
  };
  _renderContent = (section) => {
    if (section.name == 'Description') {
      return (
        <View style={{ paddingHorizontal: 20 }}>
          <HTMLView value={this.state.data.full_description} />
          <HTMLView value={this.state.data.composition} />
        </View>
      );
    } else {
      return (
        <View style={{ paddingHorizontal: 20, alignItems: 'center' }}>
          <FastImage
            style={{ width: '100%', height: 400 }}
            resizeMode={'contain'}
            source={require('../static/sizeGuide.png')}
          />
        </View>
      );
    }
  };

  appendImageToData = (val) => () => {
    this.setState({ data: { ...this.state.data, mainImage: val } });
  };

  navigateToCategoryScreen = (cid, cname) => () => {
    this.props.navigation.push('CategoriesProduct', { cid, cname, pid: this.state.pid });
  };

  onQuantityTextChange = (text) => {
    this.setState({ selectedQuantity: parseInt(text) || 0 });
  };

  onQuantityModalChange = (index) => {
    this.setState({ selectedQuantity: this.state.data.qty_content[index] });
  };

  addToCart = async () => {
    this.setState({ disableAddToCartButton: true })//to stop user from clicking multiple times before the API respond.
    Toast.show("Please wait..")
    if (this.state.data.min_qty > this.state.selectedQuantity) {
      Toast.show("Quantity must be greater than or equal to " + this.state.data.min_qty)
      this.setState({ disableAddToCartButton: false })
      return;
    }
    // Retriving the user_id
    if (this.state.product_stock > 0) {
      RetrieveDataAsync(Globals.STORAGE_USER).then((user) => {
        user = JSON.parse(user);

        let order = {
          products: {
            [this.state.pid]: {
              product_id: this.state.pid[0],
              amount: this.state.selectedQuantity,
            },
          },
          user_data: {
            user_id: user.user_id,
          },
        };
        PostData(baseUrl + `api/addcart`, order)
          .then((res) => res.json())
          .then((response) => {
            Globals.cartCount += Number(this.state.selectedQuantity)
            this.setState(this.state) //To trigger rerender
            Toast.show('Product added to cart');
            this.setState({ disableAddToCartButton: false })
          })
          .catch((err) => {
            alert(err)
            this.setState({ disableAddToCartButton: false })
          });
      });
    }
    else {
      Toast.show("Product is currently out of stock")
      this.setState({ disableAddToCartButton: false })
    }
  };

  render() {

    if (!this.state.isReady) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Shimmer>
            <FastImage
              style={{ height: 200, width: 200 }}
              resizeMode={'contain'}
              source={require('../static/logo-signIn.png')}
            />
          </Shimmer>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header
          centerText={this.state.cname}
          rightIcon="share"
          navigation={this.props.navigation}
        />
        {this.state.showZeroProductScreen ? (
          <View style={styles.completeScreen}>
            <ZeroDataScreen />
          </View>
        ) : (
            <ScrollView>
              <View style={styles.bottomMarginStyle}>
                <View style={[styles.subContainer]}>
                  <View style={styles.productView}>
                    <View>
                      <Text style={styles.itemNameText}>
                        {this.state.data.productName}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={[styles.itemNameText, styles.alignFlexEndStyle]}>
                        ${Number(this.state.data.price).toFixed(2)}
                      </Text>
                      <Text style={styles.subText}>
                        Prepack Price: $
                      {Number(
                        this.state.data.price * this.state.data.min_qty,
                      ).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View style={{}}>
                    <View style={[styles.mainPicture, styles.mainImageView]}>
                      <FastImage
                        style={styles.mainPicture}
                        source={{ uri: this.state.data.mainImage }}
                        resizeMode="contain"></FastImage>
                    </View>
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      contentContainerStyle={styles.verticalMarginStyle}>
                      {this.state.data.secondaryImages.map((val, num) => {
                        return (
                          <TouchableOpacity
                            key={num}
                            onPress={this.appendImageToData(val)}>
                            <FastImage
                              style={
                                this.state.data.mainImage == val
                                  ? [
                                    styles.thumbnail,
                                    styles.customThumbnailImage,
                                  ]
                                  : styles.thumbnail
                              }
                              source={{ uri: val }}></FastImage>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
                <View style={styles.productOptionsView}>
                  <View style={styles.rowView}>
                    <View style={styles.flexOneView}>
                      {!this.state.data.qty_content || this.state.data.qty_content.length == 1 || this.state.data.qty_content.length == 0 ? (
                        <TextInput
                          placeholderTextColor={TEXTINPUT_COLOR}
                          style={styles.valueText}
                          placeholder={'Quantity'}
                          keyboardType={'phone-pad'}
                          onChangeText={(text) => {
                            this.onQuantityTextChange(text);
                          }}
                        />
                      ) : (
                          <ModalDropdown
                            onSelect={(index) => {
                              this.onQuantityModalChange(

                                index,
                              );
                            }}
                            options={this.state.data.qty_content}
                            defaultValue={this.state.data.qty_content[0]}
                            style={styles.quantityModalStyle}
                            dropdownStyle={styles.quantityModalDropdownStyle}
                            textStyle={styles.quantityModalTextStyle}
                            renderRow={(option, index, isSelected) => {
                              return (
                                <Text style={styles.modalActualTextstyle}>
                                  {option}
                                </Text>
                              );
                            }}
                          />
                        )}
                    </View>

                    {/* <View style={{flex: 2, marginLeft: 20}}>
                    <ModalDropdown
                      options={['Male', 'Female', 'All']}
                      hexCode={'#000'}
                      defaultValue={'Green'}
                      style={styles.quantityModalStyle}
                      dropdownStyle={styles.colorModalDropdownStyle}
                      textStyle={styles.quantityModalTextStyle}
                      renderRow={(option, index, isSelected) => {
                        return (
                          <Text style={styles.modalActualTextstyle}>
                            {option}
                          </Text>
                        );
                      }}
                    />
                  </View> */}
                  </View>
                  <View style={styles.addToCartView}>
                    <Text style={styles.minQuantityText}>
                      Minimum quantity for "{this.state.data.productName}" is{' '}
                      {this.state.data.min_qty}.
                  </Text>
                    <TouchableOpacity
                      style={styles.addToCartTouch}
                      disabled={this.state.disableAddToCartButton}
                      onPress={this.addToCart}>
                      <Text style={styles.addToCartText}>Add to cart</Text>
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
                  expandMultiple={true}
                />

                <View style={[styles.headerView, styles.historyHeaderView]}>
                  <Text style={[styles.buttonText, styles.similarProductText]}>
                    Similar Products
                </Text>
                  <TouchableOpacity
                    style={styles.similarProductTouch}
                    onPress={this.navigateToCategoryScreen(
                      SIMILARPRODUCTS_CATEGORY_ID,
                      SIMILARPRODUCTS_NAME,
                    )}>
                    <Text style={[styles.showAllText]}>Show All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  keyExtractor={(item) => item.product_id}
                  data={this.state.similarProducts}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) =>
                    item.main_pair ? (
                      <ProductPageSimilarListItem
                        pid={[item.product_id]}
                        cname={this.state.cname}
                        imageUrl={item.main_pair.detailed.image_path}
                        name={item.product}
                        type={item.brand ? item.brand : DEFAULTS_OBJ.brand}
                        navigation={this.props.navigation}
                      />
                    ) : (
                        //If No product image
                        <ProductPageSimilarListItem
                          pid={item.product_id}
                          cname={this.state.cname}
                          imageUrl={
                            'https://www.dhresource.com/0x0/f2/albu/g9/M00/25/59/rBVaVVxvaJmAeWPpAAE-IYplWiA081.jpg'
                          }
                          name={item.product}
                          type={item.brand ? item.brand : DEFAULTS_OBJ.brand}
                          navigation={this.props.navigation}
                        />
                      )
                  }
                />
              </View>
            </ScrollView>
          )}
        <Footer Key={Math.random()} navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  completeScreen: {
    width: '100%',
    height: '100%',
  },
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
  },
  itemNameText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: '#2d2d2f',
    maxWidth: 0.54 * Width,
  },
  subText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    lineHeight: 18,
    color: '#8d8d8e',
    marginVertical: 8,
  },
  mainPicture: { width: Width * 0.893, height: Width * 0.893 },
  thumbnail: {
    width: Width * 0.28,
    height: Width * 0.28,
    borderRadius: 6,
    marginRight: 15,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Avenir-Book',
    lineHeight: 22,
    color: '#2d2d2f',
  },
  headerView: {
    width: Width,
    height: Height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 5,
  },
  showAllText: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'right',
    color: '#2967ff',
  },
  gridItemNameAndPriceText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2d2d2f',
  },
  gridImage: {
    width: Width * 0.427,
    height: Height * 0.28,
    borderRadius: 6,
  },
  valueText: {
    backgroundColor: '#fff',
    padding: 10,
    width: 0.25 * Width,
    borderRadius: 6,
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 20,
    justifyContent: 'center',
    textAlign: 'center',
  },
  headerMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerMainText: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    lineHeight: 22,
    color: '#2d2d2f',
  },
  bottomMarginStyle: {
    marginBottom: 10,
  },
  productView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignFlexEndStyle: {
    alignSelf: 'flex-end',
  },
  mainImageView: {
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
  },
  verticalMarginStyle: {
    marginVertical: 15,
    flexGrow: 1,
    justifyContent: 'center',
  },
  customThumbnailImage: {
    borderColor: '#2967ff',
    borderWidth: 2,
  },
  productOptionsView: {
    backgroundColor: '#f6f6f6',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  rowView: {
    flexDirection: 'row',
  },
  flexOneView: {
    flex: 1,
    alignItems: "center",
  },
  quantityModalStyle: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    width: 0.45 * Width //remove this when enable colour dropdown
  },
  quantityModalDropdownStyle: {
    width: 0.35 * Width, //0.25 width
    height: 134,
  },
  quantityModalTextStyle: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    lineHeight: 24,
    color: '#2d2d2f',
  },
  colorModalDropdownStyle: {
    width: 0.5 * Width,
    height: 134,
  },
  modalActualTextstyle: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    lineHeight: 24,
    color: '#2d2d2f',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addToCartView: {
    alignItems: 'center',
    marginTop: 17,
  },
  minQuantityText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Avenir-Book',
    lineHeight: 18,
    color: '#8d8d8e',
  },
  addToCartText: {
    color: '#fff',
    paddingVertical: 11,
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Montserrat-SemiBold',
  },
  addToCartTouch: {
    backgroundColor: '#2967ff',
    alignItems: 'center',
    width: '100%',
    borderRadius: 6,
    marginVertical: 15,
  },
  similarHeaderView: {
    marginTop: 20,
    marginBottom: 10,
  },
  similarProductText: {
    flex: 0.5,
    textAlign: 'left',
  },
  similarProductTouch: {
    flex: 0.5,
    textAlign: 'right',
  },
});
