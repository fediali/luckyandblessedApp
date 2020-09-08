import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  InteractionManager,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import styles from './Styles/Style';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import GetData from '../reusableComponents/API/GetData';
import Shimmer from 'react-native-shimmer';
import HeaderHorizontalListItem from '../reusableComponents/HeaderHorizontalListItem';
import MainPageCollection from '../reusableComponents/MainPageCollections';
import MainPageHistoryListItem from '../reusableComponents/MainPageHistoryListItem';
import MainPageTrendingListItem from '../reusableComponents/MainPageTrendingListItem';
import StoreDataAsync from '../reusableComponents/AsyncStorage/StoreDataAsync';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import FastImage from 'react-native-fast-image';
import ThemeContext from '../reusableComponents/ThemeContext';
import Globals from '../Globals';
import Toast from 'react-native-simple-toast';

const baseUrl = Globals.baseUrl;
const SELECTED_CATEGORY_ALL = -1;
const LOOKBOOK_CATEGORY_ID = -2;
const STORAGE_PRODUCT_HISTORY_CATEGORY =
  Globals.STORAGE_PRODUCT_HISTORY_CATEGORY;
const STORAGE_DEFAULTS = Globals.STORAGE_DEFAULTS;
const NEW_ARRIVAL_NAME = 'New Arrivals';
const TRENDING_NAME = 'Trending';
const HISTORY_NAME = 'History';
const SALE_NAME = 'SALE';
const HISTORY_CATEGORY_ID = -2;
const STORAGE_USER = Globals.STORAGE_USER;
const TEXTINPUT_COLOR = Globals.Colours.TEXT_INPUT_PLACEHOLDER_COLOR;
const HEADER_ORDER = ["ALL", "New Arrivals", "Women's", "Women's Plus", "Men's", "Men's Plus", "SALE", "Accessories", "Kids", "Footwear", "Lookbook"]
class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewsletter: false,
      selectedCategory: SELECTED_CATEGORY_ALL,
      categoryList: null,
      collections: null,
      newArrivals: null,
      newArrivals_cid: null,
      trending: null,
      trending_cid: null,
      history: null,
      isReady: false,
      default: null,
    };
  }

  componentDidMount() {
    this.onComponentFocus = this.props.navigation.addListener('focus', () => {
      RetrieveDataAsync(STORAGE_PRODUCT_HISTORY_CATEGORY).then((value) => {
        this.setState({ history: JSON.parse(value) });
      });
    });

    InteractionManager.runAfterInteractions(() => {
      var promises = [];
      promises.push(GetData(baseUrl + 'api/mobile'));
      promises.push(
        GetData(baseUrl + 'api/categories?visible=1&category_id=33&status=A'),
      ); //Category id for store.
      Promise.all(promises)
        .then((promiseResponses) => {
          Promise.all(promiseResponses.map((res) => res.json()))
            .then((responses) => {
              var promisesNew = [];
              promisesNew.push(
                GetData(
                  baseUrl +
                  `api/products?cid=${responses[0].home.logged.new_arrivals.category_id}&status=A&items_per_page=4`,
                ),
              );
              promisesNew.push(
                GetData(
                  baseUrl +
                  `api/products?cid=${responses[0].home.logged.trending.category_id}&status=A&items_per_page=6`,
                ),
              ); //Category id for store.
              Promise.all(promisesNew)
                .then((promiseResponsesNew) => {
                  Promise.all(
                    promiseResponsesNew.map((res) => res.json()),
                  ).then((responsesNew) => {
                    responses[1].categories.unshift({
                      category_id: '-1',
                      category: 'All',
                    });
                    responses[1].categories.push({
                      category_id: '-2',
                      category: 'Lookbook',
                    });
                    responses[1].categories.push({
                      category_id: responses[0].home.logged.new_arrivals.category_id,
                      category: 'New Arrivals',
                    });
                    responses[1].categories=responses[1].categories.slice().sort(function(a, b){ 
                      return HEADER_ORDER.indexOf(a.category) - HEADER_ORDER.indexOf(b.category);
                    });
                    this.setState(
                      {
                        collections: responses[0].home.logged.sliders,
                        newArrivals: responsesNew[0].products,
                        newArrivals_cid:
                          responses[0].home.logged.new_arrivals.category_id,
                        trending: responsesNew[1].products,
                        trending_cid:
                          responses[0].home.logged.trending.category_id,
                        defaults: responses[0].defaults,
                        categoryList: responses[1].categories,
                      },
                      () => {
                        this.mapTrendingList(this.state.trending, 3);
                      },
                    );

                    //Storing defaults obtained through API
                    StoreDataAsync(
                      STORAGE_DEFAULTS,
                      responses[0].defaults,
                    ).then();
                    RetrieveDataAsync(STORAGE_USER).then((user) => {
                      GetData(baseUrl + `api/carts/${JSON.parse(user).user_id}`)
                        .then((res) => res.json())
                        .then((responses) => {
                          if (responses.status == 404) {
                            Globals.cartCount = 0;
                          } else {
                            Globals.cartCount = Number(responses.cart_products);
                          }
                          this.setState({ isReady: true });
                        });
                    });
                  });
                })
                .catch((ex) => {
                  Toast.show(ex.toString()), console.log('Nested Promise', ex);
                });

              //Adding "All" to categories response
            })
            .catch((ex) => {
              Toast.show(ex.toString()), console.log('Inner Promise', ex);
            });
        })
        .catch((ex) => {
          console.log('Outer Promise', ex);
          Toast.show(ex.toString());
        });
    });
  }
  onCategorySelect = (cid, cname) => {
    if (cname.includes(SALE_NAME)) {
      this.setState({ isReady: false });
      this.props.navigation.navigate('CategoriesProduct', { cid, cname });
    }
    else if (cid == LOOKBOOK_CATEGORY_ID) {
      this.setState({ isReady: false });

      GetData(baseUrl + 'api/pages?page_id=67&visible=true&status=A&items_per_page=20')
        .then(res => res.json())
        .then(response => {
          this.props.navigation.navigate('Categories', {
            cid: cid,
            cname: cname,
            subCats: response.pages.reverse(),
            categoryList: this.state.categoryList,
          }); //SubCat of the selected category and categoryList is main categories
        })

    }
    else if (cid != SELECTED_CATEGORY_ALL) {
      this.setState({ isReady: false });
      GetData(
        baseUrl +
        `api/categories?visible=1&category_id=${cid}&get_images=true&status=A&items_per_page=20`,
      )
        .then((res) => res.json())
        .then((responses) => {
          if (responses.categories.length > 0) {
            var subCat = responses.categories;
            this.props.navigation.navigate('Categories', {
              cid: cid,
              cname: cname,
              subCats: subCat,
              categoryList: this.state.categoryList,
            }); //SubCat of the selected category and categoryList is main categories
          } else
            this.props.navigation.navigate('CategoriesProduct', { cid, cname });
          // setting isReady to true after 1s, so after comming back it is not on loading
        })
        .catch((ex) => {
          console.log('Outer Promise', ex);
          Toast.show(ex.toString());
          this.setState({ isReady: true });
        });
    }

    setTimeout(() => {
      this.setState({ isReady: true });
    }, 1000);
  };

  onShowAllPressed(cid, cname) {
    this.props.onShowAllPressed(cid, cname);
  }

  enableNewsLetter = (flag) => () => {
    this.setState({ showNewsletter: flag });
  };

  navigateToCategoryScreen = (cid, cname) => () => {
    this.props.navigation.navigate('CategoriesProduct', { cid, cname });
  };

  navigateToHistoryCategoryScreen = (cid, cname, items) => () => {
    this.props.navigation.navigate('CategoriesProduct', { cid, cname, items });
  };

  navigateToProductScreen = (pid, cname) => () => {
    this.props.navigation.navigate('ProductPage', { pid, cname });
  };

  mapTrendingList(tList, sliceValue) {
    let tempList = [];

    for (var i = 0; i < tList.length / sliceValue; i++) {
      tempList.push(tList.slice(i * sliceValue, i * sliceValue + sliceValue));
    }
    this.setState({ trending: tempList });
  }

  render() {
    const contextType = ThemeContext;
    if (!this.state.isReady) {
      return (
        <View style={styles.loader}>
          <Shimmer>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            <FastImage
              style={styles.logoImageLoader}
              resizeMode={'contain'}
              source={require('../static/logo-signIn.png')}
            />
          </Shimmer>
        </View>
      );
    }
    return (
      <SafeAreaView style={[styles.parentContainer]}>
        <Header
          navigation={this.props.navigation}
          centerText="Welcome"
          homepage={true}
          person={contextType._currentValue.username}
          rightIcon="search"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={innerStyles.scrollContainer}>
          <View style={styles.subParentContainer}>
            <FlatList
              keyExtractor={(item) => item.category_id}
              data={this.state.categoryList}
              horizontal={true}
              extraData={this.selectedCategory}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <HeaderHorizontalListItem
                  cid={this.state.selectedCategory}
                  index={index}
                  item={item}
                  onCategorySelect={this.onCategorySelect}
                />
              )}
            />
            <FlatList
              keyExtractor={(item) => item.background.image}
              data={this.state.collections}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <MainPageCollection
                  navigation={this.props.navigation}
                  imageUrl={item.background.image}
                  text={item.text}
                  cid={item.background.category_id}
                />
              )}
            />

            <View style={innerStyles.headerView}>
              <Text
                style={[
                  styles.buttonText,
                  innerStyles.halfFlex,
                  innerStyles.textAlignLeft,
                ]}>
                New Arrivals
              </Text>
              <TouchableOpacity
                style={[innerStyles.halfFlex, innerStyles.textAlignRight]}
                onPress={this.navigateToCategoryScreen(
                  [this.state.newArrivals_cid],
                  NEW_ARRIVAL_NAME,
                )}>
                <Text style={[innerStyles.showAllText]}>Show All</Text>
              </TouchableOpacity>
            </View>
            <View style={innerStyles.gridView}>
              <View style={innerStyles.gridCell}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={innerStyles.newArrivalGridTouch}
                  onPress={this.navigateToProductScreen(
                    [this.state.newArrivals[0].product_id],
                    NEW_ARRIVAL_NAME,
                  )}>
                  <FastImage
                    style={innerStyles.gridImage}
                    // resizeMode='contain'
                    source={{
                      uri: (this.state.newArrivals[0].main_pair) ?
                        this.state.newArrivals[0].main_pair.detailed.image_path
                        : Globals.noImageFoundURL
                    }}
                  />
                  <Text
                    numberOfLines={2}
                    style={innerStyles.gridItemNameAndPriceText}>
                    {this.state.newArrivals[0].product}
                  </Text>
                  <Text style={innerStyles.gridItemNameAndPriceText}>
                    ${parseFloat(this.state.newArrivals[0].price).toFixed(2)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={innerStyles.newArrivalGridTouch}
                  onPress={this.navigateToProductScreen(
                    [this.state.newArrivals[1].product_id],
                    NEW_ARRIVAL_NAME,
                  )}>
                  <FastImage
                    style={innerStyles.gridImage}
                    source={{
                      uri: this.state.newArrivals[1].main_pair.detailed
                        .image_path
                        ? this.state.newArrivals[1].main_pair.detailed
                          .image_path
                        : Globals.noImageFoundURL
                    }}
                  />
                  <Text
                    numberOfLines={2}
                    style={innerStyles.gridItemNameAndPriceText}>
                    {this.state.newArrivals[1].product}
                  </Text>
                  <Text style={innerStyles.gridItemNameAndPriceText}>
                    ${parseFloat(this.state.newArrivals[1].price).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={innerStyles.gridCell}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={innerStyles.newArrivalGridTouch}
                  onPress={this.navigateToProductScreen(
                    [this.state.newArrivals[2].product_id],
                    NEW_ARRIVAL_NAME,
                  )}>
                  <FastImage
                    style={innerStyles.gridImage}
                    source={{
                      uri: this.state.newArrivals[2].main_pair.detailed
                        .image_path
                        ? this.state.newArrivals[2].main_pair.detailed
                          .image_path
                        : Globals.noImageFoundURL
                    }}
                  />
                  <Text
                    numberOfLines={2}
                    style={innerStyles.gridItemNameAndPriceText}>
                    {this.state.newArrivals[2].product}
                  </Text>
                  <Text style={innerStyles.gridItemNameAndPriceText}>
                    ${parseFloat(this.state.newArrivals[2].price).toFixed(2)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={innerStyles.newArrivalGridTouch}
                  onPress={this.navigateToProductScreen(
                    [this.state.newArrivals[3].product_id],
                    NEW_ARRIVAL_NAME,
                  )}>
                  <FastImage
                    style={innerStyles.gridImage}
                    source={{
                      uri: this.state.newArrivals[3].main_pair.detailed
                        .image_path
                        ? this.state.newArrivals[3].main_pair.detailed
                          .image_path
                        : Globals.noImageFoundURL
                    }}
                  />
                  <Text
                    numberOfLines={2}
                    style={innerStyles.gridItemNameAndPriceText}>
                    {this.state.newArrivals[3].product}
                  </Text>
                  <Text style={innerStyles.gridItemNameAndPriceText}>
                    ${parseFloat(this.state.newArrivals[3].price).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/*trending header*/}
            <View style={innerStyles.headerViewTrending}>
              <Text
                style={[
                  styles.buttonText,
                  innerStyles.halfFlex,
                  innerStyles.textAlignLeft,
                ]}>
                What’s trending
              </Text>
              <TouchableOpacity
                onPress={this.navigateToCategoryScreen(
                  [this.state.trending_cid],
                  TRENDING_NAME,
                )}>
                <Text style={[innerStyles.showAllText]}>Show All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              keyExtractor={(item) => item[0].product_id.toString()}
              data={this.state.trending}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <MainPageTrendingListItem
                    listItem={item}
                    navigation={this.props.navigation}
                  />
                );
              }}
            />
            {/* history header*/}
            {this.state.history != null ? (
              <>
                <View style={innerStyles.headerView}>
                  <Text
                    style={[
                      styles.buttonText,
                      innerStyles.halfFlex,
                      innerStyles.textAlignLeft,
                    ]}>
                    History
                  </Text>
                  <TouchableOpacity
                    style={[innerStyles.halfFlex, innerStyles.textAlignRight]}
                    onPress={this.navigateToHistoryCategoryScreen(
                      HISTORY_CATEGORY_ID,
                      HISTORY_NAME,
                      this.state.history,
                    )}>
                    <Text style={[innerStyles.showAllText]}>Show All</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  keyExtractor={(item) => item.pid[0]}
                  data={this.state.history}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <MainPageHistoryListItem
                      pid={item.pid[0]}
                      cname={item.cname}
                      imageUrl={item.mainImage}
                      name={item.productName}
                      price={Number(item.price).toFixed(2)}
                      navigation={this.props.navigation}
                    />
                  )}
                />
              </>
            ) : (
                <></>
              )}
            {this.state.showNewsletter == true ? (
              <View style={innerStyles.newsLetterMainView}>
                <View style={innerStyles.newsLetterInnerView}>
                  <Text style={[styles.buttonText, innerStyles.newsLetterText]}>
                    Newsletter
                  </Text>
                  <TouchableOpacity onPress={this.enableNewsLetter(false)}>
                    <FastImage
                      style={innerStyles.newsLetterCloseButtonImage}
                      resizeMode="contain"
                      source={require('../static/icon_close.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[styles.inputView, { paddingHorizontal: 10 }]}>
                  <TextInput
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    placeholderTextColor={TEXTINPUT_COLOR}
                    style={[styles.input, innerStyles.whiteBackgroundTextInput]}
                    placeholder="Email"
                  />
                </View>
                <View
                  style={[
                    styles.buttonContainer,
                    innerStyles.subscribeButtonView,
                  ]}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[innerStyles.buttonSubmit]}>
                    <Text
                      style={[
                        styles.buttonText,
                        innerStyles.subscribeButtonText,
                      ]}>
                      Subscribe
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={innerStyles.centeredView}>
                  <Text style={innerStyles.lightText}>
                    By clicking on Subscribe button you agree to accept Privacy
                    Policy
                  </Text>
                </View>
              </View>
            ) : (
                <View></View>
              )}
          </View>
        </ScrollView>
        <Footer
          Key={Math.random()}
          selected="Home"
          navigation={this.props.navigation}
        />
      </SafeAreaView>
    );
  }
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  halfFlex: {
    flex: 0.5,
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  textAlignRight: {
    textAlign: 'right',
  },
  headerView: {
    width: Width,
    height: Height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 5,
  },
  headerViewTrending: {
    width: Width,
    // height: Height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 40,
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
  brandText: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'left',
    marginTop: 5,
  },
  newsLetterMainView: {
    width: '100%',
    height: Height * 0.4,
    backgroundColor: '#f6f6f6',
    marginVertical: 15,
  },
  newsLetterInnerView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newsLetterCloseButtonImage: {
    flex: 0.5,
    width: 17,
    height: 17,
    alignContent: 'flex-end',
    marginEnd: 10,
  },
  whiteBackgroundTextInput: {
    backgroundColor: '#ffffff',
  },
  subscribeButtonView: {
    paddingHorizontal: 10,
    width: '100%',
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  newsLetterText: {
    flex: 0.5,
    textAlign: 'left',
    marginStart: 10,
    marginVertical: 10,
  },
  centeredView: {
    width: '100%',
    alignItems: 'center',
  },
  newArrivalGridTouch: {
    flexDirection: 'column',
    marginEnd: 5,
  },
  gridView: {
    flexDirection: 'column',
    width: Width,
    height: Height * 0.8,
  },
  gridCell: {
    width: Width,
    height: Height * 0.43,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  gridImage: {
    width: Width * 0.427,
    height: Height * 0.28,
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
  },
  gridItemNameAndPriceText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2d2d2f',
    width: Width * 0.427,
    // maxHeight: '15%',
    // maxWidth: '80%',
  },
  buttonSubmit: {
    width: '100%',
    backgroundColor: '#2967ff',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  lightText: {
    width: Width * 0.8,
    height: Height * 0.06,
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 1,
    color: '#8d8d8e',
    textAlign: 'center',
    margin: 30,
  },
});

export default MainPage;
