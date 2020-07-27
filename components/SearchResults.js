import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Dimensions,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import SearchResultListItem from '../reusableComponents/SearchResultListItem';
import ZeroDataScreen from '../reusableComponents/ZeroDataScreen';
import Globals from "../Globals"
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
import Toast from 'react-native-simple-toast';

const baseUrl = Globals.baseUrl;
const STORAGE_DEFAULTS = Globals.STORAGE_DEFAULTS;
const TEXTINPUT_COLOR = Globals.Colours.TEXT_INPUT_PLACEHOLDER_COLOR;

let DEFAULTS_OBJ = [];

export default class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iteratedPage: 1,
      products: [],
      isReady: false,
      totalProducts: 0,
      totalItemsPerRequest: 0,
      isLoadingMoreListData: false,
      searchText: null,
      showZeroProductScreen: false,
    };
  }

  componentDidMount() {


    this.onComponentFocus = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params) {
        this.setState({ searchText: this.props.route.params.barcode.data }, () => this.searchText())
      }
    });
    InteractionManager.runAfterInteractions(() => {
      RetrieveDataAsync(STORAGE_DEFAULTS).then((defaults) => {
        DEFAULTS_OBJ = JSON.parse(defaults);
      });
    });
  }

  renderSeparator = (item) => {
    return <View style={styles.seperator} />;
  };

  searchTextBoxClicked = () => {
    this.setState({
      iteratedPage: 1,
      products: [],
      isReady: false,
      totalProducts: 0,
      totalItemsPerRequest: 0,
      isLoadingMoreListData: false,
    });
  };

  searchText = () => {
    var promises = [];
    if (this.state.searchText != null && this.state.searchText.length > 0) {
      promises.push(
        GetData(
          baseUrl +
          `api/products?q=${this.state.searchText}&search_app=Y&page=${this.state.iteratedPage}&status=A`,
        ),
      );
      let itr = this.state.iteratedPage;
      Promise.all(promises)
        .then((promiseResponses) => {
          Promise.all(promiseResponses.map((res) => res.json()))
            .then((responses) => {
              let parseProducts = async () => {
                const tempProducts = [];
                if (responses[0].products.length == 0) {
                  this.setState(
                    {
                      showZeroProductScreen: true,
                    }
                  );
                } else {
                  this.setState(
                    {
                      showZeroProductScreen: false,
                    }
                  );
                  for (let i = 0; i < responses[0].products.length; i++) {
                    if (responses[0].products[i].main_pair == null) {
                      continue;
                    }

                    await tempProducts.push({
                      product: responses[0].products[i].product,
                      product_id: responses[0].products[i].product_id,
                      price: parseFloat(responses[0].products[i].price).toFixed(
                        2,
                      ),
                      base_price: parseFloat(
                        responses[0].products[i].base_price,
                      ).toFixed(2),
                      imageUrl:
                        responses[0].products[i].main_pair.detailed.image_path,
                      product_brand: responses[0].products[i].brand
                        ? responses[0].products[i].brand
                        : DEFAULTS_OBJ.brand,
                    });
                  }
                }

                return tempProducts;
              };
              parseProducts().then((prod) => {
                this.setState({
                  totalProducts: parseFloat(
                    responses[0].params.total_items,
                  ).toFixed(0),
                  totalItemsPerRequest: parseFloat(
                    responses[0].params.items_per_page,
                  ).toFixed(0),
                  isReady: true,
                  products: [...this.state.products, ...prod],
                  isLoadingMoreListData: false,
                });
              });
            })
            .catch((ex) => {
              console.log('Exception: Inner Promise', ex);
              Toast.show(ex.toString());
              this.setState({
                showZeroProductScreen: true,
              });
            });
        })
        .catch((ex) => {
          console.log('Exception: Outer Promise', ex);
          Toast.show(ex.toString());
          this.setState({
            showZeroProductScreen: true,
          });
        });
    }
  };

  handleLoadMore = () => {
    if (this.state.isLoadingMoreListData == false) {
      if (
        this.state.iteratedPage <
        Math.ceil(this.state.totalProducts / this.state.totalItemsPerRequest)
      ) {
        this.setState(
          {
            iteratedPage: this.state.iteratedPage + 1,
            isLoadingMoreListData: true,
          },
          () => this.searchText(),
        );
      }
    }
  };

  ListFooter = () => {
    var listFooter = (
      <View style={styles.listFooter}>
        {this.state.isLoadingMoreListData ? (
          <ActivityIndicator size="large" />
        ) : null}
      </View>
    );
    return listFooter;
  };

  render() {
    if (this.state.showZeroProductScreen) {
    }

    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header centerText="Search" navigation={this.props.navigation} rightIcon="scanner" />
        <View style={styles.mainView}>
          <View style={styles.inputView}>
            <View style={styles.innerView}>
              <Icon
                size={20}
                name="ios-search"
                type="ionicon"
                color="#bababa"
              />
            </View>

            <TextInput
              placeholderTextColor={TEXTINPUT_COLOR}
              style={styles.inputText}
              placeholder="Search"
              returnKeyType="search"
              selectTextOnFocus={true}
              value={this.state.searchText}
              onFocus={this.searchTextBoxClicked}
              onChangeText={(searchText) => this.setState({ searchText })}
              onEndEditing={this.searchText}
            />
          </View>

          {this.state.showZeroProductScreen ? (

            <ZeroDataScreen />
          ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.marTop15}
                data={this.state.products}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <SearchResultListItem
                    key={item.product_id}
                    pid={item.product_id}
                    navigation={this.props.navigation}
                    imageUrl={{ uri: item.imageUrl }}
                    name1={item.product}
                    price1={'$' + item.price}
                  />
                )}
                ItemSeparatorComponent={this.renderSeparator}
                onEndReachedThreshold={0.01}
                onEndReached={this.handleLoadMore}
                ListFooterComponent={this.ListFooter}
              />
            )}
        </View>
        <Footer navigation={this.props.navigation} />
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
  mainView: {
    marginHorizontal: 20,
    flex: 1
  },
  innerView: {
    marginVertical: 9.8,
    marginLeft: 20.8,
    marginRight: 10.8,
  },
  inputText: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    lineHeight: 22,
    color: '#2d2d2f',
    paddingVertical: 7,
    width: Width * 0.893,
  },
  inputView: {
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 20,
    borderRadius: 18,
    marginTop: 4,
    marginBottom: 8,
  },
  thumbnailImage: {
    height: 110,
    width: 110,
    borderRadius: 6,
  },
  itemNameText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: '#2d2d2f',
  },
  categoriesText: {
    color: '#2967ff',
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 7,
  },
  priceText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: '#2d2d2f',
    marginTop: 6,
  },
  marTop15: { marginTop: 15 },
  marBottom60: {
    marginBottom: 100,
  },
  listFooter: {
    marginBottom: 108,
    height: 100,
  },
  seperator: { paddingBottom: 20 },
});
