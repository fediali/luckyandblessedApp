import React, {Component} from 'react';
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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import Shimmer from 'react-native-shimmer';
import ModalDropdown from 'react-native-modal-dropdown';
import Swipeout from 'react-native-swipeout';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import styles from './Styles/Style';
import OrderFooter from '../reusableComponents/OrderFooter';
import ZeroDataScreen from '../reusableComponents/ZeroDataScreen';

import Globals from '../Globals';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';

const STORAGE_USER = Globals.STORAGE_USER;
const baseUrl = Globals.baseUrl;

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
      this.setState({activeRowKey: null});
    }
  };
  onDeleteOpen = () => {
    this.setState({activeRowKey: this.props.item.itemNum});
  };

  onDeletePress = () => {
    const deletingRow = this.state.activeRowKey;
    // http://dev.landbw.co/api/removecart
    // {
    //     "user_id": 4751,
    //     "cart_id": 2478863224 //cart_id is the item_id returned through GET API
    // }
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
            //Refresh FlatList !
            this.props.parentFlatList.refreshFlatList(deletingRow);
          },
        },
      ],
      {cancelable: true},
    );
  };

  onColorModalSelect = (index) => {
    this.setState({
      currentSelectedColor: this.props.item.availableColors[index],
    });
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
                source={{uri: this.props.item.path}}
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
                  SIZE: {this.props.item.sizes}
                </Text>
                <Text style={innerStyles.lightText}>
                  Color: {this.props.item.selectedColor}
                </Text>
                <Text style={innerStyles.lightText}>
                  Quantity: {this.props.item.quantity}
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
      totalCost: -1,
      finalCost: -1,
      totalCartProducts: -1,
      s_userAddress: '',
      b_userAddress: '',
      showZeroProductScreen: false,
      promocode: '',
      discount: 0,
      paymentLineItems: [],
      isReady: false,
      profile_id: null,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: false});
      // Retriving the user_id
      RetrieveDataAsync(STORAGE_USER).then((user) => {
        let gUser = JSON.parse(user);
        this.getData(gUser);
      });
    });
  }

  applyPromo = () => {
    //TODO: Apply promo
    // {
    //     "user_id":4751,
    //     "coupon_codes":"dummy" //dummy is the coupon code
    // }

    // http://dev.landbw.co/api/coupon

    RetrieveDataAsync(STORAGE_USER).then((user) => {
      gUser = JSON.parse(user);
      this.postPromoData(gUser);
    });
  };

  deleteItem = (index) => {
    this.state.itemList.splice(index, 1);
  };
  postPromoData = (user) => {
    let data = {
      user_id: user.user_id,
      coupen_codes: this.state.promocode,
    };
    PostData(baseUrl + 'api/coupon', data)
      .then((res) => res.json())
      .then((responses) => {
        if (responses.status == 'Success') {
          this.setState({
            discount: parseFloat(responses.discount).toFixed(2),
            finalCost: parseFloat(responses.total).toFixed(2),
          });
          alert('Promocode Successfully Added!!');
        } else {
          alert('Invalid Promocode');
        }
      })
      .catch((ex) => {
        console.log('Promise exception', ex);
        alert(ex);
      });
  };

  getData = (user) => {
    GetData(baseUrl + `api/carts/${user.user_id}`)
      .then((res) => res.json())
      .then((responses) => {
        let cartData = [];
        let productsLength = responses.products.length;
        let lineItems = [];
        let orderItems = [];
        console.log('Length of product', productsLength);

        if (productsLength == 0) {
          this.setState({
            showZeroProductScreen: true,
          });
        } else {
          var promises = [];

          for (let i = 0; i < productsLength; i++) {
            let product_id = responses.products[i].product_id;

            promises.push(GetData(baseUrl + `api/products/${product_id}`));
          }

          Promise.all(promises).then((promiseResponses) => {
            Promise.all(promiseResponses.map((res) => res.json()))
              .then((prod) => {
                for (let i = 0; i < productsLength; i++) {
                    let singleProduct = {};
                    let singleLineITem = {};
                    console.log('PROD ' + i, prod[i].product_id);
    
                    singleProduct = {
                      itemNum: responses.products[i].item_id,
                      name: responses.products[i].product,
                      price: (
                        parseFloat(responses.products[i].amount) *
                        parseFloat(responses.products[i].price)
                      ).toFixed(2),
                      unitPrice: parseFloat(responses.products[i].price).toFixed(2),
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
                    };
                    if ('detailed' in responses.products[i].extra.main_pair) {
                      singleProduct.path =
                        responses.products[i].extra.main_pair.detailed.image_path;
                    } else {
                      singleProduct.path = 'https://picsum.photos/200';
                    }
    
                    singleLineITem = {
                      itemId: responses.products[i].product_id,
                      name: responses.products[i].product,
                      description: 'n/a',
                      quantity: responses.products[i].amount,
                      unitPrice: parseFloat(responses.products[i].price).toFixed(2),
                    };
    
                    let singleOrderItem = {
                      [responses.products[i].product_id]: {
                        amount: responses.products[i].amount,
                      },
                    };
                    lineItems[i] = singleLineITem;
                    cartData[i] = singleProduct;
                    orderItems[i] = singleOrderItem;
    
                    console.log(`cart item ${i}`, cartData[i]);
                 
                }

                console.log('Dataasdad', cartData);

          this.setState({
            totalCost: responses.total,
            finalCost: responses.total,
            totalCartProducts: responses.cart_products,
            itemList: cartData,
            orderItems: orderItems,
            s_userAddress:
              responses.user_data.s_address + responses.user_data.s_address_2,
            b_userAddress:
              responses.user_data.b_address + responses.user_data.b_address_2,
            profile_id: responses.user_data.profile_id,
            paymentLineItems: lineItems,
            isReady: true,
          });

                })
              .catch((ex) =>
                console.log('Get Specific Product Exception ' + ex),
              );
          });

          
        }
      });
  };

  refreshFlatList = (deletedKey) => {
    this.setState((prevState) => {
      return {
        deletedRowKey: deletedKey,
      };
    });
  };

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
              style={[styles.input]}
              placeholder="Gift Or Promo code"
              onChangeText={(text) => {
                this.setState({promocode: text});
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
    console.log(this.state.s_userAddress + ',' + this.state.s_userAddress);
    if (this.state.s_userAddress || this.state.s_userAddress) {
      this.props.navigation.navigate('Payment', {
        //sending props to delivery screen to reuse values
        totalCost: this.state.totalCost,
        finalCost: this.state.finalCost,
        discount: this.state.discount,
        paymentLineItems: this.state.paymentLineItems,
        orderItems: this.state.orderItems,
        profile_id: this.state.profile_id,
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
      });
    }
  };

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
              renderItem={({item, index}) => {
                return (
                  <FlatListItem
                    item={item}
                    index={index}
                    parentFlatList={this}></FlatListItem>
                );
              }}
              ListHeaderComponent={this.renderFlatListHeader}
              ListFooterComponent={this.renderFlatListFooter}
            />
          </View>
        )}
        <Footer selected="Shop" navigation={this.props.navigation} />
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
  shippingText: {fontFamily: 'Avenir-Medium', fontSize: 16},
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
