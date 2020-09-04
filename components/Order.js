    import React, { Component } from 'react';
    import {
        Text,
        View,
        StyleSheet,
        Dimensions,
        InteractionManager,
        Image,
        ActivityIndicator,
        
    } from 'react-native';
    import Header from '../reusableComponents/Header';
    import Footer from '../reusableComponents/Footer';
    import { SafeAreaView } from 'react-native-safe-area-context';
    import { TouchableOpacity, ScrollView, FlatList } from 'react-native-gesture-handler';
    import OrderProducts from '../reusableComponents/OrdersProduct';
    import Shimmer from 'react-native-shimmer';
    import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync';
    import Globals from '../Globals';
    import Toast from 'react-native-simple-toast';
    import GlobalStyles from './Styles/Style';
    import { ThemeProvider } from 'react-native-elements';

    const baseUrl = Globals.baseUrl;
    const STORAGE_USER = Globals.STORAGE_USER;


    export default class Order extends Component {

        constructor(props) {
            super(props);
            this.state = {
                activeSections: [],
                iteratedPage: 1,
                orders: [],
                isReady: false,
                // totalOrders: 0,
                // totalItemsPerRequest: 0,
                isLoadingMoreListData: false,
                showZeroProductScreen: false,
                customOrders: [],
                order_id: this.props.route.params.oid
            };
        }
        getTrackingData = (shipmentID, index) => {
            var promises = [];
            promises.push(GetData(baseUrl + `api/shipments/${shipmentID}`));
            Promise.all(promises)
                .then((promiseResponses) => {
                    Promise.all(promiseResponses.map((res) => res.json()))
                        .then((responses) => {
                            this.setState({
                                trackingNumber: responses[0].tracking_number,
                                trackingURL: responses[0].carrier_info.tracking_url,
                            });
                        })
                        .catch((ex) => {
                            console.log('Inner Promise', ex);
                            // Toast.show(ex.toString())
                        });
                })
                .catch((ex) => {
                    console.log('Outer Promise', ex);
                    Toast.show(ex.toString());
                });
        };

        getDataCustom = () => {
            var promises = [];
            console.log("URLLLLL", baseUrl + `api/orders/${this.state.order_id}?page=${this.state.iteratedPage}`)
            promises.push(GetData(baseUrl + `api/orders/${this.state.order_id}?page=${this.state.iteratedPage}`));
            Promise.all(promises)
                .then((promiseResponses) => {
                    Promise.all(promiseResponses.map((res) => res.json()))
                        .then((responses) => {
                            productGroupKeys = Object.keys(
                                responses[0].product_groups[0].products,
                            );
                            let productArray = [];
                            let jsonProducts = {};
                            if (productGroupKeys.length == 0) {
                                this.setState(
                                    {
                                        showZeroProductScreen: true,
                                    }
                                );
                            } else {
                                //TODO: No Size attribute in response.
                                //TODO: No Color attribute in response.
                                for (var i = 0; i < productGroupKeys.length; i++) {
                                    var currentProduct = responses[0].product_groups[0].products[productGroupKeys[i]]
                                    console.log(currentProduct.product_id)
                                    jsonProducts['itemNum'] = productGroupKeys[i].toString();
                                    jsonProducts['totalPrice'] = currentProduct.price * currentProduct.amount;
                                    jsonProducts['itemName'] = currentProduct.product;
                                    jsonProducts['size'] = this.extractSizes(responses[0].products[productGroupKeys[i]].extra.product_options_value);
                                    jsonProducts['color'] = 'Not available';
                                    jsonProducts['quantity'] = currentProduct.amount;
                                    jsonProducts['unitPrice'] = currentProduct.price;
                                    if (
                                        'detailed' in
                                        responses[0].product_groups[0].products[productGroupKeys[i]]
                                            .main_pair
                                    ) {
                                        jsonProducts['imageUrl'] =
                                            responses[0].product_groups[0].products[
                                                productGroupKeys[i]
                                            ].main_pair.detailed.image_path;
                                    } else {
                                        jsonProducts['imageUrl'] = Globals.noImageFoundURL;
                                    }
                                    if (responses[0].shipment_ids.length > 0) {
                                        jsonProducts['shipment_id'] = responses[0].shipment_ids;
                                        this.setState({ isTrackingReady: false });
                                        this.getTrackingData(jsonProducts['shipment_id'], i);
                                    } else {
                                        this.setState({ isTrackingReady: true });
                                    }
                                    productArray[i] = jsonProducts;
                                    jsonProducts = {};
                                }

                                this.setState({
                                    customOrders: [...this.state.customOrders, ...productArray],
                                    isReady: true,
                                    customIsReady: true
                                });

                            }
                        })
                        .catch((ex) => {
                            console.log('Inner Promise', ex);
                            Toast.show(ex.toString())
                        });
                })
                .catch((ex) => {
                    console.log('Outer Promise', ex);
                    Toast.show(ex.toString());
                });
        };

        extractSizes = (data) => {
            console.log(data )
            //FIXME: Why data is incomplete?
            for (var i = 0; i < data.length; i++) {
                console.log(data[i])
                if (data[i].option_name === "SIZE"){
                    console.log("SIZEss", data[i].variant_name)
                    return data[i].variant_name
                }
            }
            return "Not Available"
        
        }

        _renderContent = (section, index) => {


            return (
                
                <OrderProducts
                    orderId={section.order_id}
                    orders={this.state.customOrders}
                    trackingNumber={this.state.trackingNumber}
                    trackingURL={this.state.trackingURL}
                    isReady={this.state.customIsReady}
                />
            );





        };

        // handleLoadMore(){

        // }

        componentDidMount() {
            InteractionManager.runAfterInteractions(() => {
                this.setState({ isReady: false });

                // Retriving the user_id
                RetrieveDataAsync(STORAGE_USER).then((user) => {
                    this.getDataCustom();
                });
            });
        }


        

        render() {
            if (!this.state.isReady) {
                return (
                <View style={GlobalStyles.loader}>
                    <ActivityIndicator animating={true} size={"large"}></ActivityIndicator>
                </View>
                );
            }
            return (
                <SafeAreaView style={GlobalStyles.parentContainer}>
                    <Header
                        centerText={"ORDER #"+this.state.order_id}
                        navigation={this.props.navigation}
                        rightIcon = {(this.state.trackingURL) ? "trackOrder" : null}
                        trackingURL = {(this.state.trackingURL) ? this.state.trackingURL : null}
                    />

                    {this.state.showZeroProductScreen ?
                        <ZeroDataScreen />
                        :
                        <FlatList
                            data={this.state.customOrders}
                            keyExtractor={(item, index) => item.itemNum}
                            renderItem={this._renderContent}
                            onEndReached={this.handleLoadMore}
                            onEndReachedThreshold={10}
                        />
                    }
                    <View style={styles.bottomContainer}></View>

                    <Footer selected="Van" navigation={this.props.navigation} />
                </SafeAreaView>
            )
        }
    }

    const styles = StyleSheet.create({
        bottomContainer: { paddingBottom: 59, backgroundColor: '#ffffff' },
        seperator: { backgroundColor: '#f6f6f6', paddingTop: 1 },

    })