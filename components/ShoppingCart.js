import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  YellowBox,
  Dimensions,
  Alert,
  InteractionManager,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import Shimmer from 'react-native-shimmer';
import ModalDropdown from 'react-native-modal-dropdown';
import Swipeout from 'react-native-swipeout';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import styles from './Styles/Style';
import OrderFooter from '../reusableComponents/OrderFooter';
import ZeroDataScreen from '../reusableComponents/ZeroDataScreen';
import PutData from '../reusableComponents/API/PutData';
import Globals from '../Globals';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import GetData from '../reusableComponents/API/GetData';

const STORAGE_USER = Globals.STORAGE_USER;
const TEXTINPUT_COLOR = Globals.Colours.TEXT_INPUT_PLACEHOLDER_COLOR;

const baseUrl = Globals.baseUrl;
let gUser = null;
YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
]);

class FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRowKey: null,
      currentSelectedColor: this.props.item.hexColor,
    };
  }

  onDeleteClose = () => {
    if (this.state.activeRowKey != null) {
      this.setState({ activeRowKey: null });
    }
  };
  onDeleteOpen = () => {
    this.setState({ activeRowKey: this.props.item.itemNum });
  };

  onDeletePress = () => {
    const deletingRow = this.state.activeRowKey;

    Alert.alert(
      'Alert',
      'Are you sure you want to delete ?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.props.parentFlatList.deleteItem(this.props.index);
            // this.state.itemList.splice(this.props.index, 1);
            let deleteData = {
              user_id: gUser.user_id,
              cart_id: deletingRow, //cart_id is the item_id returned through GET API
            };

            PostData(baseUrl + `api/removecart`, deleteData)
              .then((res) => res.json())
              .then((response) => {
                Toast.show(response.message.toString());
                //Refresh FlatList !

                //Also delete the data from relevant places..
                let tempPaymentLineItems = this.props.parentFlatList.state.paymentLineItems;
                tempPaymentLineItems.splice(this.props.index, 1);
                let tempOrderItems = this.props.parentFlatList.state.orderItems;
                tempOrderItems.splice(this.props.index, 1);

                this.props.parentFlatList.setState({
                  totalCost: parseFloat(response.cart.display_subtotal).toFixed(2),
                  totalCartProducts: response.cart.amount,
                  finalCost: parseFloat(response.cart.total).toFixed(2),
                  paymentLineItems: tempPaymentLineItems,
                  orderItems: tempOrderItems
                })
                Globals.cartCount = parseInt(this.props.parentFlatList.state.totalCartProducts);
                this.props.parentFlatList.refreshFlatList(deletingRow);
              });
          },
        },
      ],
      { cancelable: true },
    );
  };

  onColorModalSelect = (index) => {
    this.setState({
      currentSelectedColor: this.props.item.availableColors[index],
    });
  };

  onAvailableSizesModalSelect = (index, option, item) => {
    Globals.cartCount += (option - item.quantity)
    var data = {
      products: {
        [item.product_id]: {
          product_id: item.product_id,
          amount: option,
        },
      },
      user_data: {
        user_id: gUser.user_id,
      },
    };

    PutData(baseUrl + "api/addcart/" + this.props.item.itemNum, data)
      .then((res) => res.json())
      .then((response) => {
        var productKey = Object.keys(response.cart_content.product_groups[0].products)[0]

        //to update the individual list item when quantity is changed inside cart
        let tempItemList = this.props.parentFlatList.state.itemList;
        tempItemList[this.props.index].price = (
          parseFloat(response.cart_content.product_groups[0].products[productKey].amount) *
          parseFloat(response.cart_content.product_groups[0].products[productKey].price)
        ).toFixed(2),
          tempItemList[this.props.index].quantity = response.cart_content.product_groups[0].products[productKey].amount

        //update the line items too for payment purpose..
        let tempPaymentLineItems = this.props.parentFlatList.state.paymentLineItems;
        tempPaymentLineItems[this.props.index].quantity = response.cart_content.product_groups[0].products[productKey].amount

        this.props.parentFlatList.setState({
          totalCost: parseFloat(response.cart_content.display_subtotal).toFixed(2),//FIXME: assumed that display_subtotal = totalCost.... And total = FinalCost
          totalCartProducts: response.cart_content.amount,
          finalCost: parseFloat(response.cart_content.total).toFixed(2),
          itemList: tempItemList,
          paymentLineItems: tempPaymentLineItems
        })
        Globals.cartCount = parseInt(this.props.parentFlatList.state.totalCartProducts);
        Toast.show(`${item.name} quantity updated`);
      });
    // this.setState({ stateText: usStates[index] , s_country: usStates[index], b_country: usStates[index]});
  };

  render() {
    const swipeSettings = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {
        this.onDeleteClose();
      },
      onOpen: (secId, rowId, direction) => {
        this.onDeleteOpen();
      },
      right: [
        {
          autoClose: true,
          onPress: () => {
            this.onDeletePress();
          },
          text: 'Delete',
          type: 'delete',
        },
      ],
      rowId: this.props.index,
      sectionId: 1,
    };

    return (
      <Swipeout {...swipeSettings}>
        <View style={[innerStyles.itemView, innerStyles.whiteBackground]}>
          <View style={innerStyles.listMainView}>
            <View style={innerStyles.listInnerView}>
              <Image
                style={[innerStyles.itemImage]}
                resizeMode="contain"
                source={{ uri: (this.props.item.path) ? this.props.item.path : Globals.noImageFoundURL }}
              />
              <View style={innerStyles.listTextsContainerView}>
                <View style={innerStyles.listRowView}>
                  <Text
                    style={[
                      innerStyles.itemNameText,
                      innerStyles.listRowNameText,
                    ]}>
                    {this.props.item.name}
                  </Text>
                  <Text
                    style={[
                      innerStyles.itemNameText,
                      innerStyles.listRowPriceText,
                    ]}>
                    ${this.props.item.price}
                  </Text>
                </View>
                <View style={innerStyles.listRowView}>
                  <Text
                    style={[
                      innerStyles.itemUnitPriceText,
                      innerStyles.listRowNameText,
                    ]}>
                    Unit price
                  </Text>
                  <Text
                    style={[
                      innerStyles.lightText,
                      innerStyles.listRowPriceText,
                    ]}>
                    ${this.props.item.unitPrice}
                  </Text>
                </View>
                <Text style={innerStyles.lightText}>
                  Color: {this.props.item.selectedColor}
                </Text>
                <Text style={innerStyles.lightText}>
                  Quantity: {this.props.item.quantity}
                </Text>
                <Text style={innerStyles.lightText}>
                  Size: {this.props.item.sizes}
                </Text>
              </View>
            </View>

            <View style={[innerStyles.horizontalView]}>
              <TouchableOpacity
                style={[innerStyles.bottomSelectors, innerStyles.halfFlex]}>
                <View style={innerStyles.modalView}>
                  <ModalDropdown
                    options={this.props.item.availableSizes}
                    defaultValue={this.props.item.unknownNum}
                    style={innerStyles.modalStyle}
                    dropdownStyle={innerStyles.modalDropdownStyle}
                    textStyle={innerStyles.modalTextStyle}
                    onSelect={(index, option = this.props.item) => {
                      this.onAvailableSizesModalSelect(
                        index,
                        option,
                        this.props.item,
                      );
                    }}
                    renderRow={(option, index, isSelected) => {
                      return (
                        <Text style={[innerStyles.numText]}>{option}</Text>
                      );
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* Product colour not available rn */}
              {/* <TouchableOpacity style={[innerStyles.bottomSelectors, innerStyles.colorModalTouch]}>
                                <View style={innerStyles.modalView}>

                                    <ModalDropdown
                                        hexCode={this.state.currentSelectedColor}
                                        onSelect={(index) => { this.onColorModalSelect(index) }}
                                        options={this.props.item.availableColors}
                                        defaultValue={this.props.item.selectedColor}
                                        style={innerStyles.modalStyle}
                                        dropdownStyle={innerStyles.modalDropdownStyle}
                                        textStyle={innerStyles.modalColorTextStyle}
                                        renderRow={(option, index, isSelected) => {
                                            return (
                                                <View>
                                                    <View style={[innerStyles.modalInnerView, { backgroundColor: option }]} />
                                                </View>
                                            )

                                        }}
                                    />
                                </View>
                            </TouchableOpacity> */}
            </View>
          </View>
          <View style={[styles.line, innerStyles.viewMargin]} />
        </View>
      </Swipeout>
    );
  }
}

class ShoppingCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deletedRowKey: null,
      itemList: [],
      orderItems: [],
      totalCost: 0,//does not include promo cost
      finalCost: 0,//calculated after promo added
      totalCartProducts: 0,
      s_userAddress: '',
      b_userAddress: '',
      b_userAddress_1: '', //storing it seperate, as its needed by payment screen
      b_userAddress_2: '',
      b_zipCode: '',
      b_country: '',
      showZeroProductScreen: false,
      promocode: '',
      discount: 0,
      paymentLineItems: [],
      isReady: false,
      profile_id: null,
      isFetching: false,

    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // Retriving the user_id
      RetrieveDataAsync(STORAGE_USER).then((user) => {
        gUser = JSON.parse(user);
        this.getData(gUser);
      });
    });
  }

  applyPromo = () => {
    RetrieveDataAsync(STORAGE_USER).then((user) => {
      gUser = JSON.parse(user);
      this.postPromoData(gUser);
    });
  };

  deleteItem = (index) => {
    Globals.cartCount -= this.state.itemList[index].quantity
    this.state.itemList.splice(index, 1);

  };
  postPromoData = (user) => {
    let couponUrl = baseUrl + `custom-api/coupon/${this.state.promocode}?user_id=${user.user_id}`
    console.log("AAAAAAAAAAABBBB", couponUrl)
    GetData(couponUrl)
      .then((res) => res.json())
      .then((responses) => {
        console.log(responses);
        if (responses.status == 200) {
          this.setState({
            discount: parseFloat(responses.data.cart.subtotal_discount).toFixed(2),
            finalCost: parseFloat(responses.data.cart.total).toFixed(2),
          });
          alert('Promocode Successfully Added!!');
        } else {
          alert('Error ' + responses.message);
        }
      })
      .catch((ex) => {
        console.log('Promise exception', ex);
        Toast.show(ex.toString());
      });
  };

  getData = (user) => {
    GetData(baseUrl + `api/carts/${user.user_id}`)
      .then((res) => res.json())
      .then((responses) => {
        let cartData = [];
        let productsLength = null;
        let lineItems = [];
        let orderItems = [];

        if (responses.status == 404) {
          // console.log('No product found');
          this.setState({
            isReady: true,
            isFetching: false
          });
        } else {
          var promises = [];
          productsLength = responses.products.length;

          for (let i = 0; i < productsLength; i++) {
            let product_id = responses.products[i].product_id;

            promises.push(GetData(baseUrl + `api/products/${product_id}`));
          }
          for (let i = 0; i < productsLength; i++) {
            let product_id = responses.products[i].product_id;
            promises.push(GetData(baseUrl + `api/options?product_id=${product_id}`));
          }

          Promise.all(promises).then((promiseResponses) => {
            Promise.all(promiseResponses.map((res) => res.json()))
              .then((prod) => {
                for (let i = 0; i < productsLength; i++) {
                  let singleProduct = {};
                  let singleLineITem = {};
                  console.log("OO", prod[productsLength+i])
                  let productSizes = this.extractSizes(prod[productsLength+i])
                  console.log(productSizes)
                  singleProduct = {
                    itemNum: responses.products[i].item_id,
                    product_id: responses.products[i].product_id,
                    name: responses.products[i].product,
                    price: (
                      parseFloat(responses.products[i].amount) *
                      parseFloat(responses.products[i].price)
                    ).toFixed(2),
                    unitPrice: parseFloat(responses.products[i].price).toFixed(
                      2,
                    ),
                    sizes: 'Not available',
                    selectedColor: 'Turquoise', //
                    availableColors: [
                      '#eb4034',
                      '#05c2bd',
                      '#f4f719',
                      '#0caac9',
                      '#e629df',
                    ], //
                    availableSizes: prod[i].qty_content, //
                    quantity: responses.products[i].amount,
                    unknownNum: responses.products[i].amount,
                    hexColor: '#05c2bd', //
                    sizes:productSizes

                  };
                  if ('detailed' in responses.products[i].extra.main_pair) {
                    singleProduct.path =
                      responses.products[i].extra.main_pair.detailed.image_path;
                  } else {
                    singleProduct.path = Globals.noImageFoundURL;
                  }
                  singleLineITem = {
                    itemId: responses.products[i].product_id,
                    name: responses.products[i].product,
                    description: 'n/a',
                    quantity: responses.products[i].amount,
                    unitPrice: parseFloat(responses.products[i].price).toFixed(
                      2,
                    ),
                  };

                  let singleOrderItem = {
                    [responses.products[i].product_id]: {
                      amount: responses.products[i].amount,
                    },
                  };
                  lineItems[i] = singleLineITem;
                  cartData[i] = singleProduct;
                  orderItems[i] = singleOrderItem;
                }
                Globals.cartCount = parseInt(responses.cart_products);
                
                this.setState({
                  totalCost: responses.total,
                  finalCost: responses.total,
                  totalCartProducts: responses.cart_products,
                  itemList: cartData,
                  orderItems: orderItems,
                  s_userAddress:
                    responses.user_data.s_address +
                    responses.user_data.s_address_2,
                  b_userAddress:
                    responses.user_data.b_address +
                    responses.user_data.b_address_2,
                  b_userAddress_1: responses.user_data.b_address,
                  b_userAddress_2: responses.user_data.b_address_2,
                  b_zipCode: responses.user_data.b_zipcode,
                  b_country: responses.user_data.b_country,
                  profile_id: responses.user_data.profile_id,
                  paymentLineItems: lineItems,
                  isReady: true,
                  isFetching: false
                });

              })
              .catch((ex) => {
                console.log('Get Specific Product Exception ' + ex);
                Toast.show(ex.toString())
              }
              );
          });
        }
      }).catch(e => { Toast.show(e.toString()); console.log(e) });
  };

  refreshFlatList = (deletedKey) => {
    this.setState((prevState) => {
      return {
        deletedRowKey: deletedKey,
      };
    });
  };

  extractSizes = (data) => {

    console.log("extract sizes")
    let keys = Object.keys(data);
    console.log(keys[0])
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      console.log("Hi", data[key].option_name)
      console.log(data[key].option_name, 'SIZE')
      if (data[key].option_name === 'SIZE') {
        console.log("extracting", data[key].product_id)
        let variantKeys = Object.keys(data[key].variants);
        console.log(variantKeys)
        console.log("SIZES", data[key].variants[variantKeys[0]].variant_name)
        return data[key].variants[variantKeys[0]].variant_name
      }
    };
    return "Not Available"

  }
  renderFlatListHeader = () => {
    var listHeader = (
      <View>
        <View style={innerStyles.listHeaderPad}>
          <Text style={innerStyles.mainTextBold}>Your bag</Text>
          <Text style={innerStyles.lightText}>
            You have {this.state.totalCartProducts} items in your bag
          </Text>
        </View>
        <View style={[styles.line, innerStyles.viewMargin]} />
      </View>
    );
    return listHeader;
  };

  renderFlatListFooter = () => {
    var listFooter = (
      <View style={innerStyles.listFooterPad}>
        <View style={innerStyles.promoView}>
          <View style={styles.inputView}>
            <TextInput
              placeholderTextColor={TEXTINPUT_COLOR}
              style={[styles.input]}
              placeholder="Gift Or Promo code"
              onChangeText={(text) => {
                this.setState({ promocode: text });
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              style={[innerStyles.giftButton]}
              onPress={() => {
                this.applyPromo();
              }}>
              <Text style={[styles.buttonText, innerStyles.giftButtonText]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.line, innerStyles.viewMargin]} />
        <Text style={innerStyles.checkoutInfoText}>
          After this screen you will get another screen before you place your
          order
        </Text>
        <OrderFooter
          totalCost={this.state.totalCost}
          finalCost={this.state.finalCost}
          discount={this.state.discount}
          couponCode={this.state.promocode}
        />
        <View style={[styles.buttonContainer, innerStyles.orderButtonView]}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[innerStyles.buttonPaymentMethod]}
            onPress={this.navigateToNextScreen}>
            <Text style={[styles.buttonText, innerStyles.orderButtonText]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return listFooter;
  };
  //Receive and forward lineitems to payment screen.. from delivery to payment.
  navigateToNextScreen = () => {
    if (this.state.finalCost < 100) Toast.show('Minimum order in $100');
    else {
      if (this.state.s_userAddress || this.state.s_userAddress) {
        this.props.navigation.navigate('Payment', {
          //sending props to delivery screen to reuse values
          totalCost: this.state.totalCost,
          finalCost: this.state.finalCost,
          discount: this.state.discount,
          paymentLineItems: this.state.paymentLineItems,
          orderItems: this.state.orderItems,
          profile_id: this.state.profile_id,
          b_userAddress_1: this.state.b_userAddress_1,
          b_userAddress_2: this.state.b_userAddress_2,
          b_zipCode: this.state.b_zipCode,
          b_country: this.state.b_country,
        });
      } else {
        this.props.navigation.navigate('Delivery', {
          //sending props to delivery screen to reuse values
          totalCost: this.state.totalCost,
          finalCost: this.state.finalCost,
          discount: this.state.discount,
          paymentLineItems: this.state.paymentLineItems,
          orderItems: this.state.orderItems,
          profile_id: this.state.profile_id,
          b_userAddress_1: this.state.b_userAddress_1,
          b_userAddress_2: this.state.b_userAddress_2,
          b_zipCode: this.state.b_zipCode,
          b_country: this.state.b_country,
        });
      }
    }
  };
  onRefresh = () => {
    this.setState({ isFetching: true, }, () => {
      RetrieveDataAsync(STORAGE_USER).then((user) => {
        gUser = JSON.parse(user);
        this.getData(gUser);
      });
    });
  }
  render() {
    if (!this.state.isReady) {
      return (
        <View style={styles.loader}>
          <Shimmer>
            <Image
              style={styles.logoImageLoader}
              resizeMode={'contain'}
              source={require('../static/logo-signIn.png')}
            />
          </Shimmer>
        </View>
      );
    }

    return (
      <SafeAreaView style={innerStyles.itemView}>
        <Header navigation={this.props.navigation} />
        {this.state.showZeroProductScreen ? (
          <ZeroDataScreen />
        ) : (
            <View style={styles.parentContainer}>
              <FlatList
                keyExtractor={(item) => item.itemNum.toString()}
                data={this.state.itemList}
                numColumns={1}
                renderItem={({ item, index }) => {
                  return (
                    <FlatListItem
                      item={item}
                      index={index}
                      parentFlatList={this}></FlatListItem>
                  );
                }}
                ListHeaderComponent={this.renderFlatListHeader}
                ListFooterComponent={this.renderFlatListFooter}
                onRefresh={this.onRefresh}
                refreshing={this.state.isFetching}
              />
            </View>
          )}
        <Footer selected="Shop" Key={Math.random()} navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
  mainTextBold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    fontStyle: 'normal',
    lineHeight: 45,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2d2d2f',
    marginTop: 10,
  },
  lightText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 1,
    color: '#8d8d8e',
  },
  itemView: {
    flex: 1,
  },
  itemImage: {
    width: Width * 0.2,
    height: Height * 0.15,
    alignSelf: 'center',
  },
  rowStyling: {
    backgroundColor: '#ffffff',
    shadowColor: '#e6e6e7',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
  },
  itemNameText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: '#2d2d2f',
  },
  itemUnitPriceText: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: '#2967ff',
  },
  horizontalView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  bottomSelectors: {
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
  },
  numText: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    color: '#2d2d2f',
    textAlign: 'left',
    marginStart: 15,
    marginVertical: 10,
  },
  promoView: {
    height: Height * 0.073,
    width: Width,
    backgroundColor: '#ffffff',
    shadowColor: '#e6e6e7',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
    marginVertical: 5,
  },
  giftButton: {
    height: Height * 0.073,
    width: Width * 0.267,
    borderRadius: 6,
    backgroundColor: '#ffa601',
    marginStart: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutInfoText: {
    fontFamily: 'Avenir',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#8d8d8e',
    padding: 30,
  },
  showOrderView: {
    paddingTop: 15,
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    backgroundColor: '#f6f6f6',
  },
  buttonPaymentMethod: {
    width: '100%',
    backgroundColor: '#2967ff',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  whiteBackground: {
    backgroundColor: '#ffffff',
  },
  listMainView: {
    flexDirection: 'column',
    padding: 15,
  },
  listInnerView: {
    flexDirection: 'row',
  },
  listTextsContainerView: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  listRowView: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  listRowNameText: {
    textAlign: 'left',
    flex: 2,
  },
  listRowPriceText: {
    textAlign: 'right',
    flex: 1,
  },
  halfFlex: {
    flex: 0.5,
  },
  modalView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalStyle: {
    flex: 1,
    padding: 5,
    borderRadius: 6,
  },
  modalDropdownStyle: {
    width: '30%',
  },
  modalColorTextStyle: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    lineHeight: 24,
    color: '#2d2d2f',
    paddingRight: 10,
    maxWidth: '65%',
  },
  modalTextStyle: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    lineHeight: 24,
    color: '#2d2d2f',
    paddingRight: 10,
  },
  modalInnerView: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 25,
    alignSelf: 'center',
  },
  viewMargin: {
    marginTop: 15,
  },
  colorModalTouch: {
    flex: 0.5,
    marginStart: 40,
  },
  giftButtonText: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 22,
  },
  listHeaderPad: {
    paddingHorizontal: 20,
  },
  listFooterPad: {
    paddingBottom: 60,
  },
  orderRowView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  orderAmountText: {
    fontSize: 18,
    lineHeight: 30,
  },
  orderAmountValueText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 30,
    textAlign: 'right',
  },
  shippingText: { fontFamily: 'Avenir-Medium', fontSize: 16 },
  orderGiftText: {
    lineHeight: 30,
  },
  orderButtonView: {
    paddingHorizontal: 30,
    width: '100%',
    backgroundColor: '#f6f6f6',
    paddingBottom: 20,
  },
  orderButtonText: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 22,
  },
});
export default ShoppingCart;
