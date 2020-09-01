import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  InteractionManager,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import { Icon } from 'react-native-elements';
import CategoriesProductListSingleItem from '../reusableComponents/CategoriesProductListSingleItem';
import CategoriesProductListDoubleItem from '../reusableComponents/CategoriesProductListDoubleItem';
import FastImage from 'react-native-fast-image'
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import ZeroDataScreen from '../reusableComponents/ZeroDataScreen';
import Globals from '../Globals';
import Toast from 'react-native-simple-toast';
import GetData from '../reusableComponents/API/GetData';

const baseUrl = Globals.baseUrl;
const STORAGE_DEFAULTS = Globals.STORAGE_DEFAULTS;
let DEFAULTS_OBJ = [];
const HISTORY_CATEGORY_ID = -2;
const SIMILARPRODUCTS_CATEGORY_ID = -3;
const SALE_NAME = 'SALE';

class CategoriesProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iteratedPage: 1,

      cid: this.props.route.params.cid,
      cname: this.props.route.params.cname,
      selected: 0, //Here 0,1,2,3 corresponds to NewArrivals,LookBook,Kids,Sale
      products: [],
      singleItem: true,
      isReady: false,
      totalProducts: 0,
      totalItemsPerRequest: 0,
      isLoadingMoreListData: false,
      showZeroProductScreen: false,
      filters: null
    };
  }

  loadData = (cid, cname) => {
    if (cid == HISTORY_CATEGORY_ID) {
      //Cid of HISTORY
      var historyItems = this.props.route.params.items;
      this.setState({
        totalProducts: historyItems.length,
        totalItemsPerRequest: 10, //TOTAL 10 items in case of history
      });

      async function parseProducts() {
        const tempProducts = [];
        for (let i = 0; i < historyItems.length; i++) {
          await tempProducts.push({
            product: historyItems[i].productName,
            product_id: historyItems[i].pid[0],
            price: parseFloat(historyItems[i].price).toFixed(2),
            base_price: parseFloat(historyItems[i].base_price).toFixed(2),
            imageUrl: historyItems[i].mainImage,
            product_brand: DEFAULTS_OBJ.brand,
            cname: historyItems[i].cname,
          });
        }

        return tempProducts;
      }
      parseProducts().then((prod) => {
        this.setState({
          isReady: true,
          products: [...this.state.products, ...prod],
          isLoadingMoreListData: false,
        });
      });
    } else {
      var catName = this.state.cname;
      var promises = [];
      if (cid == SIMILARPRODUCTS_CATEGORY_ID) {
        //-3 is cid of SIMILAR PRODUCTS
        promises.push(GetData(baseUrl + `api/similarproducts/${this.props.route.params.pid}&status=A&page=${this.state.iteratedPage}`));
      } else {
        if (this.state.filters) {
          promises.push(GetData(baseUrl + `api/products?cid=${cid}&status=A${this.state.filters}&page=${this.state.iteratedPage}`));
        }
        else if (cname.includes(SALE_NAME)) {
          //extraproducts API returns search instead of params
          promises.push(GetData(baseUrl + `/api/extraproducts/?mode=on_sale&status=A&page=${this.state.iteratedPage}`))
        }
        else
          promises.push(GetData(baseUrl + `api/products?cid=${cid}&status=A&page=${this.state.iteratedPage}`));
      }
      let itr = this.state.iteratedPage;
      Promise.all(promises)
        .then((promiseResponses) => {
          Promise.all(promiseResponses.map((res) => res.json()))
            .then((responses) => {
              if (cname.includes(SALE_NAME)) {
                // console.log(responses[0].products)
                this.setState({
                  totalProducts: parseFloat(
                    responses[0].search.total_items,
                  ).toFixed(0),
                  totalItemsPerRequest: parseFloat(
                    responses[0].search.items_per_page,
                  ).toFixed(0),
                });
              }
              else {
                this.setState({
                  totalProducts: parseFloat(
                    responses[0].params.total_items,
                  ).toFixed(0),
                  totalItemsPerRequest: parseFloat(
                    responses[0].params.items_per_page,
                  ).toFixed(0),
                });
              }
              async function parseProducts() {
                const tempProducts = [];
                for (let i = 0; i < responses[0].products.length; i++) {
                  if (responses[0].products[i].main_pair ) {
                    await tempProducts.push({
                      product: responses[0].products[i].product,
                      product_id: responses[0].products[i].product_id,
                      price: parseFloat(responses[0].products[i].price).toFixed(2),
                      base_price: parseFloat(
                        responses[0].products[i].base_price,
                      ).toFixed(2),
                      list_price: responses[0].products[i].list_price && responses[0].products[i].list_price != 0 ? responses[0].products[i].list_price : null,
                      imageUrl: Globals.noImageFoundURL,
                      product_brand: responses[0].products[i].brand
                        ? responses[0].products[i].brand
                        : DEFAULTS_OBJ.brand,
                      cname: catName, //Category name would be the same here.
                    });
                  } else {
                    await tempProducts.push({
                      product: responses[0].products[i].product,
                      product_id: responses[0].products[i].product_id,
                      price: parseFloat(responses[0].products[i].price).toFixed(2),
                      base_price: parseFloat(
                        responses[0].products[i].base_price,
                      ).toFixed(2),
                      list_price: responses[0].products[i].list_price && responses[0].products[i].list_price != 0 ? responses[0].products[i].list_price : null,
                      imageUrl:
                        responses[0].products[i].main_pair.detailed.image_path,
                      product_brand: responses[0].products[i].brand
                        ? responses[0].products[i].brand
                        : DEFAULTS_OBJ.brand,
                      cname: catName, //Category name would be the same here.
                    });
                  }

                  
                }

                return tempProducts;
              }
              parseProducts().then((prod) => {
                let allProducts = [...this.state.products, ...prod];
                if (allProducts.length == 0) {
                  this.setState({
                    showZeroProductScreen: true,
                    isReady: true,
                  });
                } else {
                  this.setState({
                    showZeroProductScreen: false,
                    isReady: true,
                    products: allProducts,
                    isLoadingMoreListData: false,
                  });
                }
              });
            })
            .catch((ex) => {
              console.log('Inner Promise', ex);
              Toast.show(ex.toString());
            });
        })
        .catch((ex) => {
          console.log('Outer Promise', ex);
          Toast(ex);
        });
    }
  };

  handleLoadMore = () => {
    if (
      this.state.iteratedPage <
      Math.ceil(this.state.totalProducts / this.state.totalItemsPerRequest)
    ) {
      //59/10 = 5.9~6

      this.setState(
        {
          iteratedPage: this.state.iteratedPage + 1,
          isLoadingMoreListData: true,
        },
        () => this.loadData(this.state.cid, this.state.cname),
      );
    }
  };

  componentDidMount() {
    this.onComponentFocus = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params.url) {
        this.setState(
          {
            filters: this.props.route.params.url,
            products: [],
            isReady: false,
            totalProducts: 0,
            totalItemsPerRequest: 0,
            isLoadingMoreListData: false,
            showZeroProductScreen: false,
            iteratedPage: 1,
          },
          () => {
            this.loadData(this.state.cid, this.state.cname);
          },
        );
      }
    });

    InteractionManager.runAfterInteractions(() => {
      RetrieveDataAsync(STORAGE_DEFAULTS).then((defaults) => {
        DEFAULTS_OBJ = JSON.parse(defaults);

        this.loadData(this.state.cid, this.state.cname);
      });
    });
  }

  changeTextColor(item) {
    this.setState({ selected: item });
  }
  renderSeparator = (item) => {
    return <View style={styles.renderSeparator} />;
  };

  ListFooter = () => {
    var listFooter = this.state.isLoadingMoreListData ? (
      <View style={styles.listFooter}>
        <ActivityIndicator size="large" />
      </View>
    ) : null;
    return listFooter;
  };
  renderSingleItem = ({ item }) => {
    return (
      <CategoriesProductListSingleItem
        key={item.product_id}
        pid={item.product_id}
        cname={item.cname}
        navigation={this.props.navigation}
        imageUrl={{ uri: (item.imageUrl) ? item.imageUrl : "" }}
        name1={item.product}
        price1={'$' + item.price}
        price2={'$' + item.base_price}
        list_price={item.list_price}
      />
    );
  };

  renderGridItems = ({ item }) => {
    return (
      <CategoriesProductListDoubleItem
        key={item.product_id}
        pid={item.product_id}
        cname={item.cname}
        navigation={this.props.navigation}
        imageUrl={{ uri: (item.imageUrl) ? item.imageUrl : "" }}
        name1={item.product}
        price1={'$' + item.price}
        price2={'$' + item.base_price}
        list_price={item.list_price}

      />
    );
  };

  navigateToFilter = () => {
    this.props.navigation.navigate('Filter');
  };
  render() {
    console.log("AAAAAA\n\n", this.state.products[0])
    return (
      <SafeAreaView style={styles.superMainContainer}>
        <Header navigation={this.props.navigation} rightIcon="search" />
        {!this.state.isReady ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
            <View style={styles.mainContainer}>
              {this.state.showZeroProductScreen ? (
                <View style={styles.completeScreen}>
                  <ZeroDataScreen />
                </View>
              ) : (
                  <>
                    <View style={styles.paddingHorizontal}>
                      <Text style={styles.categoryNameText}>
                        {this.state.cname}
                      </Text>
                      <Text style={styles.numCategoryText}>
                        {this.state.totalProducts} products
                  </Text>
                    </View>
                    <View style={styles.horizontalImagesView}>
                      {/* <FastImage
                        style={styles.imageList}
                        source={require('../static/listIcon.png')}
                      /> */}

                      {/* <Text style={styles.sortingText}>Sorting</Text> */}
                      <View style={styles.rightImages}>
                        <TouchableOpacity
                          style={styles.paddingLeftView}
                          activeOpacity={0.99}
                          onPress={() => {
                            this.setState({ singleItem: false });
                          }}>
                          {this.state.singleItem ? (
                            <Icon
                              size={25}
                              name="grid"
                              type="feather"
                              color="#2d2d2f"
                            />
                          ) : (
                              <Icon
                                size={25}
                                name="grid"
                                type="feather"
                                color="#2967ff"
                              />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.paddingLeftView}
                          activeOpacity={0.99}
                          onPress={() => {
                            this.setState({ singleItem: true });
                          }}>
                          {this.state.singleItem ? (
                            <Icon
                              style={styles.iconRight}
                              size={25}
                              name="square"
                              type="feather"
                              color="#2967ff"
                            />
                          ) : (
                              <Icon
                                style={styles.iconRight}
                                size={25}
                                name="square"
                                type="feather"
                                color="#2d2d2f"
                              />
                            )}
                        </TouchableOpacity>
                        {!this.state.cname.includes(SALE_NAME) && (
                          <TouchableOpacity
                          style={styles.paddingLeftView}
                          onPress={this.navigateToFilter}>
                          <FastImage
                            style={styles.filterImage}
                            source={require('../static/Filter.png')}
                          />
                        </TouchableOpacity>
                        )}
                        
                      </View>
                    </View>
                  </>
                )}

              {/* Checking whether the Flatlist should render single item row or double item row */}
              {this.state.singleItem ? (
                // changing Key to rerender the FlatList component as chaning numColumn require rerender
                // Single Item row FlatList
                <FlatList
                  key={this.state.singleItem ? 'h' : 'v'}
                  data={this.state.products}
                  contentContainerStyle={styles.container}
                  keyExtractor={(item, index) => item.product_id}
                  renderItem={this.renderSingleItem}
                  ItemSeparatorComponent={this.renderSeparator}
                  onEndReached={this.handleLoadMore}
                  onEndReachedThreshold={5}
                  ListFooterComponent={this.ListFooter}
                  maxToRenderPerBatch={4}
                  initialNumToRender={2}
                  windowSize={8}
                />
              ) : (
                  /*
                                product,
                                product_id,
                                price,
                                base_price,
                                products.main_pair.detailed.image_path
                                */
                  // Double Item row FlatList
                  <FlatList
                    key={this.state.singleItem ? 'h' : 'v'}
                    data={this.state.products}
                    contentContainerStyle={styles.container}
                    numColumns={2}
                    keyExtractor={(item, index) => item.product_id}
                    renderItem={this.renderGridItems}
                    ItemSeparatorComponent={this.renderSeparator}
                    columnWrapperStyle={styles.multiRowStyling}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={5}
                    ListFooterComponent={this.ListFooter}
                    maxToRenderPerBatch={6}
                    initialNumToRender={6}
                    windowSize={12}
                  />
                )}
            </View>
          )}
        <Footer Key={Math.random()} navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  completeScreen: {
    width: '100%',
    height: '100%',
  },
  superMainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
  },
  mainContainer: {
    flex: 1,
    paddingBottom: 50,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
  multiRowStyling: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  paddingHorizontal: { paddingHorizontal: 20 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  categoryNameText: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: 'Montserrat-Bold',
    color: '#2d2d2f',
  },
  numCategoryText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#8d8d8e',
    fontFamily: 'Avenir-Book',
  },
  horizontalImagesView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  imageList: { width: 23, height: 23 },
  sortingText: {
    paddingLeft: 13,
    fontSize: 16,
    lineHeight: 20,
    color: '#2d2d2f',
    fontFamily: 'Montserrat-Medium',
  },
  rightImages: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  paddingLeftView: { paddingLeft: 10 },
  renderSeparator: {
    paddingBottom: 15,
  },
  listFooter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconRight: { alignSelf: 'flex-end' },
  filterImage: { height: 22, width: 22 },
});

export default CategoriesProduct;
