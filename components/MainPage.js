import React, { Component } from 'react'
import {
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    FlatList,
    ImageBackground,
    ActivityIndicator,
    InteractionManager,
    YellowBox,
    SafeAreaView,
    BackHandler,
    Alert
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

import styles from './Styles/Style'
import Header from '../reusableComponents/Header'
import Footer from '../reusableComponents/Footer'
import { _categoryList, _collections, _newArrivals, _trending, _history } from '../data/MainPageData'
import GetData from "../reusableComponents/API/GetData"
import Shimmer from 'react-native-shimmer';
import HeaderHorizontalListItem from "../reusableComponents/HeaderHorizontalListItem"
import MainPageCollection from "../reusableComponents/MainPageCollections"
import MainPageHistoryListItem from "../reusableComponents/MainPageHistoryListItem"
import MainPageTrendingListItem from "../reusableComponents/MainPageTrendingListItem"
import StoreDataAsync from '../reusableComponents/AsyncStorage/StoreDataAsync'
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync'
import FastImage from 'react-native-fast-image'
YellowBox.ignoreWarnings([
    'Require cycle:'
])

const baseUrl = "http://dev.landbw.co/";
const SELECTED_CATEGORY_ALL = -1
const STORAGE_PRODUCT_HISTORY_CATEGORY="productHistoryList"
const STORAGE_DEFAULTS="defaults"
class MainPage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            showNewsletter: true,
            selectedCategory: SELECTED_CATEGORY_ALL,
            categoryList: null,
            collections: null,
            newArrivals: null,
            trending: null,
            history: null,
            isReady: false,
            default: null
        }

    }

    backAction = () => {
        console.log(this.props.navigation)
        if (this.props.navigation.isFocused()) {
            Alert.alert("Hold on!", "Are you sure you want to go back?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        }
    };

    componentWillUnmount() {
        this.backHandler.remove();
    }
    componentDidMount() {

        InteractionManager.runAfterInteractions(() => {
            var prodHistory;
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
            var promises = []
            promises.push(GetData(baseUrl + 'api/mobile'))
            promises.push(GetData(baseUrl + 'api/categories?visible=1&category_id=33'))
            // Retriving the user_id
            // this._retrieveData('user_id').then(value => {
            //     console.log("THIS IS VALUE", value)
            // });
            Promise.all(promises).then((promiseResponses) => {
                Promise.all(promiseResponses.map(res => res.json())).then((responses) => {

                    //Adding "All" to categories response
                    responses[1].categories.unshift({ category_id: "-1", category: "All" })
                    RetrieveDataAsync(STORAGE_PRODUCT_HISTORY_CATEGORY).then(value => {
                        console.log("Product History: ", value)
                        this.setState({
                            collections: responses[0].home.logged.sliders,
                            newArrivals: responses[0].home.logged.new_arrivals.products,
                            trending: responses[0].home.logged.trending.products,
                            defaults: responses[0].defaults,
                            categoryList: responses[1].categories,
                            history: JSON.parse(value)
                        }, () => { this.mapTrendingList(this.state.trending, 3) })
                    });
                    //Storing defaults obtained through API
                    StoreDataAsync(STORAGE_DEFAULTS, responses[0].defaults).then(
                        console.log("Defaults saved in storage")
                    )
                   

                }).catch(ex => { console.log("Inner Promise", ex) })
            }).catch(ex => { console.log("Outer Promise", ex); alert(ex); this.props.navigation.navigate("SignIn") })

        })
    }
    onCategorySelect = (cid, cname) => {
        // this.setState({ selectedCategory: index })
        // console.log(cid)
        this.setState({ isReady: false })
        GetData(baseUrl + `api/categories?visible=1&category_id=${cid}&get_images=true`).then(res => res.json()).then(
            (responses) => {
                // console.log(responses)
                if (responses.categories.length > 0) {
                    var subCat = responses.categories;
                    // console.log(subCat)
                    this.props.navigation.navigate("Categories", { cid: cid, cname: cname, subCats: subCat, categoryList: this.state.categoryList }); //SubCat of the selected category and categoryList is main categories
                    this.backHandler.remove();

                }

                else
                    this.props.navigation.navigate("CategoriesProduct", { cid, cname })
                setTimeout(() => { this.setState({ isReady: true }) }, 1000)

            }
        ).catch(ex => { console.log("Outer Promise", ex); alert(ex); this.setState({ isReady: true }) })

    }

    enableNewsLetter(flag) {
        this.setState({ showNewsletter: flag })
    }

    mapTrendingList(tList, sliceValue) {

        let tempList = []

        for (var i = 0; i < tList.length / sliceValue; i++) {
            tempList.push(tList.slice(i * sliceValue, i * sliceValue + sliceValue));
        }
        this.setState({ trending: tempList, isReady: true, })
    }

    render() {
        console.log("History", this.state.history)
        // console.log(this.state.trending.length + " ++++++++++++++++++")
        const Width = Dimensions.get('window').width;
        const Height = Dimensions.get('window').height;
        if (!this.state.isReady) {
            return (
                <View style={styles.loader}>
                    <Shimmer>
                        <FastImage style={styles.logoImageLoader} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
                    </Shimmer>
                </View>
            )

        }
        return (
            <SafeAreaView style={[styles.parentContainer]}>
                <Header navigation={this.props.navigation} centerText="Welcome" homepage={true} person={this.props.route.params.userName} rightIcon="search" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={innerStyles.scrollContainer}
                >
                    <View style={styles.subParentContainer}>
                        <FlatList
                            keyExtractor={(item) => item.category_id}
                            data={this.state.categoryList}
                            horizontal={true}
                            extraData={this.selectedCategory}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <HeaderHorizontalListItem cid={this.state.selectedCategory} index={index} item={item} onCategorySelect={this.onCategorySelect} />

                            )}

                        />
                        <FlatList
                            keyExtractor={(item) => item.background.image}
                            data={this.state.collections}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <MainPageCollection
                                    imageUrl={item.background.image} text={item.text}
                                />
                            )}
                        />

                        <View style={innerStyles.headerView}>
                            <Text style={[styles.buttonText, innerStyles.halfFlex, innerStyles.textAlignLeft]}>New Arrivals</Text>
                            <TouchableOpacity style={[innerStyles.halfFlex, innerStyles.textAlignRight]}>
                                <Text style={[innerStyles.showAllText]}>Show All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={innerStyles.gridView}>
                            <View style={innerStyles.gridCell}>
                                <TouchableOpacity activeOpacity={0.9} style={innerStyles.newArrivalGridTouch}>
                                    <FastImage
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={{ uri: this.state.newArrivals[0].image }}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[0].product}</Text>
                                    <Text style={[innerStyles.showAllText, innerStyles.brandText]}>{this.state.newArrivals[0].brand}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[0].price}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.9} style={innerStyles.newArrivalGridTouch}>
                                    <FastImage
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={{ uri: this.state.newArrivals[1].image }}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[1].product}</Text>
                                    <Text style={[innerStyles.showAllText, innerStyles.brandText]}>{this.state.newArrivals[1].brand}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[1].price}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={innerStyles.gridCell}>
                                <TouchableOpacity activeOpacity={0.9} style={innerStyles.newArrivalGridTouch}>
                                    <FastImage
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={{ uri: this.state.newArrivals[2].image }}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[2].product}</Text>
                                    <Text style={[innerStyles.showAllText, innerStyles.brandText]}>{this.state.newArrivals[2].brand}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[2].price}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.9} style={innerStyles.newArrivalGridTouch}>
                                    <FastImage
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={{ uri: this.state.newArrivals[3].image }}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[3].product}</Text>
                                    <Text style={[innerStyles.showAllText, innerStyles.brandText]}>{this.state.newArrivals[3].brand}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[3].price}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        {/*FIXME: trending header*/}
                        <View style={innerStyles.headerView}>
                            <Text style={[styles.buttonText, innerStyles.halfFlex, innerStyles.textAlignLeft]}>What’s trending</Text>
                            <TouchableOpacity style={[innerStyles.halfFlex, innerStyles.textAlignRight]}>
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
                                    <MainPageTrendingListItem listItem={item} />
                                )
                            }
                            }
                        />

                        {/* history header*/}
                        <View style={innerStyles.headerView}>
                            <Text style={[styles.buttonText, innerStyles.halfFlex, innerStyles.textAlignLeft]}>History</Text>
                            <TouchableOpacity style={[innerStyles.halfFlex, innerStyles.textAlignRight]}>
                                <Text style={[innerStyles.showAllText]}>Show All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            keyExtractor={(item) => item.pid[0]}
                            data={this.state.history}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => ( //FIXME: Items not returning
                                (!item.brand ? 
                                    <MainPageHistoryListItem
                                    imageUrl={item.mainImage}
                                    name={item.productName}
                                    type={this.state.defaults.brand}
                                    price={Number(item.price).toFixed(2)}
                                /> : 

                                <MainPageHistoryListItem
                                imageUrl={item.mainImage}
                                name={item.productName}
                                type={item.brand}
                                price={Number(item.price).toFixed(2)}
                            />)
                            )}
                        />
                        {this.state.showNewsletter == true ?
                            <View style={innerStyles.newsLetterMainView}>
                                <View style={innerStyles.newsLetterInnerView}>
                                    <Text style={[styles.buttonText, innerStyles.newsLetterText]}>Newsletter</Text>
                                    <TouchableOpacity onPress={() => { this.enableNewsLetter(false) }}>
                                        <FastImage
                                            style={innerStyles.newsLetterCloseButtonImage}
                                            resizeMode='contain'

                                            source={require('../static/icon_close.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.inputView, { paddingHorizontal: 10 }]}>
                                    <TextInput style={[styles.input, innerStyles.whiteBackgroundTextInput]} placeholder="Email" />
                                </View>
                                <View style={[styles.buttonContainer, innerStyles.subscribeButtonView]}>
                                    <TouchableOpacity activeOpacity={0.5} style={[innerStyles.buttonSubmit]}>
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                innerStyles.subscribeButtonText
                                            ]}>
                                            Subscribe
                                    </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={innerStyles.centeredView}>
                                    <Text style={innerStyles.lightText}>
                                        By clicking on Subscribe button you agree to accept Privacy Policy
                                </Text>
                                </View>
                            </View> :
                            <View></View>
                        }
                    </View>

                </ScrollView>
                <Footer selected="Home" navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}


const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: "#fff",
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 60
    },
    borderRadiusSix: {
        borderRadius: 6
    },
    halfFlex: {
        flex: 0.5
    },
    textAlignLeft: {
        textAlign: 'left'
    },
    textAlignRight: {
        textAlign: 'right'
    },
    collectionImages: {
        width: Width * 0.85,
        height: Height * 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        marginHorizontal: 10,
        borderRadius: 6
    },
    semiBoldText: {
        width: '60%',
        height: '50%',
        fontFamily: "Montserrat-Bold",
        fontSize: 36,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 44,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
    },
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
    brandText: {
        fontSize: 14,
        lineHeight: 18,
        textAlign: "left",
        marginTop: 5
    },
    innerTrendingView: {
        width: '70%',
        height: '80%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginStart: 10
    },
    newsLetterMainView: {
        width: '100%',
        height: Height * 0.4,
        backgroundColor: '#f6f6f6',
        marginVertical: 15
    },
    newsLetterInnerView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    newsLetterCloseButtonImage: {
        flex: 0.5,
        width: 17,
        height: 17,
        alignContent: 'flex-end',
        marginEnd: 10
    },
    whiteBackgroundTextInput: {
        backgroundColor: '#ffffff'
    },
    subscribeButtonView: {
        paddingHorizontal: 10,
        width: '100%',
        alignItems: 'center'
    },
    subscribeButtonText: {
        color: '#ffffff',
        fontSize: 20
    },
    newsLetterText: {
        flex: 0.5,
        textAlign: 'left',
        marginStart: 10,
        marginVertical: 10
    },
    centeredView: {
        width: '100%',
        alignItems: 'center'
    },
    innerInnerTrendingView: {
        height: '100%',
        flexDirection: 'column',
        marginStart: 10,
        justifyContent: 'center'
    },
    trendingViewPriceView: {
        width: '30%',
        height: '50%',
        borderRadius: 6,
        backgroundColor: "#9775fa",
        alignItems: 'center',
        justifyContent: 'center'
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
        height: Height * 0.4,
        flexDirection: 'row',
        // backgroundColor: '#324385',
        paddingHorizontal: 10,
        justifyContent: 'space-around'
    },
    gridImage: {
        width: Width * 0.427,
        height: Height * 0.28,
        borderRadius: 6,
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
    // trendingImage: {
    //     borderRadius: 6,
    //     width: '25%',
    //     height: '64.7&',
    // },
    historyTouchable: {
        flexDirection: 'column',
        paddingHorizontal: 10,
        marginBottom: 50
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
        fontFamily: "Avenir-Book",
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 1,
        color: '#8d8d8e',
        textAlign: 'center',
        margin: 30
    },
    trendingView: {
        width: Width * 0.88,
        height: Height * 0.1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginEnd: 15,
        alignItems: 'center',
    },
    trendingImage: {
        width: '25%',
        height: '100%',
        borderRadius: 6,
    },
    trendingPriceText: {
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
    }
})

export default MainPage;