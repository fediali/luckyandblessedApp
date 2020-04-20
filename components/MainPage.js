import React, { Component } from 'react'
import {
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    FlatList,
    ImageBackground,
    ActivityIndicator,
    InteractionManager,
    YellowBox,
    SafeAreaView,
    
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

import styles from './Styles/Style'
import Header from '../reusableComponents/Header'
import Footer from '../reusableComponents/Footer'

import { _categoryList, _collections, _newArrivals, _trending, _history } from '../data/MainPageData'
import GetData from "../reusableComponents/API/GetData"
import ShimmerLogo from "../reusableComponents/ShimmerLogo"
import Shimmer from 'react-native-shimmer';
import HeaderHorizontalListItem from "../reusableComponents/HeaderHorizontalListItem"

YellowBox.ignoreWarnings([
    'Require cycle:'
])

const baseUrl = "http://dev.landbw.co/";
const SELECTED_CATEGORY_ALL=-1
class MainPage extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            showNewsletter: true,
            selectedCategory: SELECTED_CATEGORY_ALL,
            categoryList: null,
            collections: null,
            newArrivals: null,
            trending: _trending,
            history: _history,
            isReady: false
        }


    }

    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('user_id');

          if (value !== null) {
            return(value)
          }
        } catch (error) {
          console.log(error)
        }
      };
    componentDidMount() {

        InteractionManager.runAfterInteractions(() => {
            var promises = []
            promises.push(GetData(baseUrl + 'api/mobile'))
            promises.push(GetData(baseUrl + 'api/categories?visible=1&category_id=33'))
            // Retriving the user_id
            this._retrieveData().then(value=>{
                console.log("THIS IS VALUE",value)
            });
            Promise.all(promises).then((promiseResponses) => {
                Promise.all(promiseResponses.map(res => res.json())).then((responses) => {

                    //Adding "All" to categories response
                    responses[1].categories.unshift({ category_id: "-1", category: "All" })
                    // console.log(responses[1])
                    this.setState({
                        isReady: true,
                        collections: responses[0].home.logged.sliders,
                        newArrivals: responses[0].home.logged.new_arrivals.products,
                        trending: responses[0].home.logged.trending.products,
                        categoryList: responses[1].categories
                    })
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
                console.log(baseUrl + `api/categories?visible=1&category_id=${cid}`)
                if (responses.categories.length > 0) {
                    var subCat = responses.categories;
                    // console.log(subCat)
                    this.props.navigation.navigate("Categories", { cid: cid, cname: cname, subCats: subCat, categoryList: this.state.categoryList }); //SubCat of the selected category and categoryList is main categories
                }

                else
                    this.props.navigation.navigate("CategoriesProduct", { cid, cname })
                setTimeout(() => { this.setState({ isReady: true }) }, 1000)

            }
        ).catch(ex => { console.log("Outer Promise", ex); alert(ex); this.setState({ isReady: true }) })

    }


    render() {
        const Width = Dimensions.get('window').width;
        const Height = Dimensions.get('window').height;
        if (!this.state.isReady) {
            return (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
                    <Shimmer>
                        <Image style={{ height: 200, width: 200 }} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
                    </Shimmer>
                </View>
            )

        }
        return (
            <SafeAreaView style={[styles.parentContainer]}>
                <Header navigation={this.props.navigation} centerText="Welcome" homepage= {true} person={this.props.route.params.userName} rightIcon="search" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        backgroundColor: "#fff",
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        paddingBottom: 60
                    }}
                >
                    <View style={styles.subParentContainer}>
                        <FlatList
                            keyExtractor={(item) => item.category_id}
                            data={this.state.categoryList}
                            horizontal={true}
                            extraData={this.selectedCategory}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <HeaderHorizontalListItem cid={this.state.selectedCategory} index={index} item={item} onCategorySelect={this.onCategorySelect}/>

                            )}

                        />
                        <FlatList
                            keyExtractor={(item) => item.background.image}
                            data={this.state.collections}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={{ borderRadius: 6 }}>
                                    <ImageBackground
                                        style={innerStyles.collectionImages}
                                        source={{ uri: item.background.image }}
                                        resizeMode='stretch'
                                    >
                                        <Text style={innerStyles.semiBoldText}>{item.text}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            )}
                        />

                        {/*FIXME new arrival header */ }
                        <View style={innerStyles.headerView}>
                            <Text style={[styles.buttonText, { flex: 0.5, textAlign: 'left' }]}>New Arrivals</Text>
                            <TouchableOpacity style={{ flex: 0.5, textAlign: 'right' }}>
                                <Text style={[innerStyles.showAllText]}>Show All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={innerStyles.gridView}>
                            <View style={innerStyles.gridCell}>
                                <TouchableOpacity style={{ flexDirection: 'column', marginEnd: 5 }}>
                                    <Image
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={{uri: this.state.newArrivals[0].image}}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[0].product}</Text>
                                    <Text style={[innerStyles.showAllText, { fontSize: 14, lineHeight: 18, textAlign: "left", marginTop: 5 }]}>{this.state.newArrivals[0].brand}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[0].price}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: 'column', marginStart: 5 }}>
                                    <Image
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={{uri: this.state.newArrivals[1].image}}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[1].product}</Text>
                                    <Text style={[innerStyles.showAllText, { fontSize: 14, lineHeight: 18, textAlign: "left", marginTop: 5 }]}>{this.state.newArrivals[1].brand}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[1].price}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={innerStyles.gridCell}>
                                <TouchableOpacity style={{ flexDirection: 'column', marginEnd: 5 }}>
                                    <Image
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={{uri: this.state.newArrivals[2].image}}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[2].product}</Text>
                                    <Text style={[innerStyles.showAllText, { fontSize: 14, lineHeight: 18, textAlign: "left", marginTop: 5 }]}>{this.state.newArrivals[2].brand}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[2].price}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: 'column', marginStart: 5 }}>
                                    <Image
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={{uri: this.state.newArrivals[3].image}}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[3].product}</Text>
                                    <Text style={[innerStyles.showAllText, { fontSize: 14, lineHeight: 18, textAlign: "left", marginTop: 5 }]}>{this.state.newArrivals[3].brand}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[3].price}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        {/* trending header*/}
                        <View style={innerStyles.headerView}>
                            <Text style={[styles.buttonText, { flex: 0.5, textAlign: 'left' }]}>What’s trending</Text>
                            <TouchableOpacity style={{ flex: 0.5, textAlign: 'right' }}>
                                <Text style={[innerStyles.showAllText]}>Show All</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            keyExtractor={(item) => item.product_id.toString()}
                            data={this.state.trending}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                    <TouchableOpacity style={innerStyles.trendingView}>
                                        <View style={{ width: '70%', height: '80%', flexDirection: 'row', alignItems: 'flex-start', marginStart: 10 }}>
                                            <Image
                                                style={innerStyles.trendingImage}
                                                source={{uri: item.image}}
                                                resizeMode='contain'
                                            />
                                            <View style={{ height: '100%', flexDirection: 'column', marginStart: 10, justifyContent: 'center' }}>
                                                <Text style={innerStyles.gridItemNameAndPriceText}>{item.product}</Text>
                                                <Text style={[innerStyles.showAllText, { fontSize: 14, textAlign: 'left', lineHeight: 18, marginTop: 5 }]}>{item.brand}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: '30%', height: '50%', borderRadius: 6, backgroundColor: "#9775fa", alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={innerStyles.trendingPriceText}>${item.price}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={innerStyles.trendingView}>
                                        <View style={{ width: '70%', height: '80%', flexDirection: 'row', alignItems: 'flex-start', marginStart: 10 }}>
                                            <Image
                                                style={innerStyles.trendingImage}
                                                source={{uri: item.image}}
                                                resizeMode='contain'
                                            />
                                            <View style={{ height: '100%', flexDirection: 'column', marginStart: 10, justifyContent: 'center' }}>
                                                <Text style={innerStyles.gridItemNameAndPriceText}>{item.product}</Text>
                                                <Text style={[innerStyles.showAllText, { fontSize: 14, textAlign: 'left', lineHeight: 18, marginTop: 5 }]}>{item.brand}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: '30%', height: '50%', borderRadius: 6, backgroundColor: "#9775fa", alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={innerStyles.trendingPriceText}>${item.price}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={innerStyles.trendingView}>
                                        <View style={{ width: '70%', height: '80%', flexDirection: 'row', alignItems: 'flex-start', marginStart: 10 }}>
                                            <Image
                                                style={innerStyles.trendingImage}
                                                source={{uri: item.image}}
                                                resizeMode='contain'
                                            />
                                            <View style={{ height: '100%', flexDirection: 'column', marginStart: 10, justifyContent: 'center' }}>
                                                <Text style={innerStyles.gridItemNameAndPriceText}>{item.product}</Text>
                                                <Text style={[innerStyles.showAllText, { fontSize: 14, textAlign: 'left', lineHeight: 18, marginTop: 5 }]}>{item.brand}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: '30%', height: '50%', borderRadius: 6, backgroundColor: "#9775fa", alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={innerStyles.trendingPriceText}>${item.price}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            )}
                        />

                        {/* history header*/}
                        <View style={innerStyles.headerView}>
                            <Text style={[styles.buttonText, { flex: 0.5, textAlign: 'left' }]}>History</Text>
                            <TouchableOpacity style={{ flex: 0.5, textAlign: 'right' }}>
                                <Text style={[innerStyles.showAllText]}>Show All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            keyExtractor={(item) => item.id.toString()}
                            data={this.state.history}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={{ flexDirection: 'column', paddingHorizontal: 10, marginBottom: 50 }}>
                                    <Image
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={item.imageUrl}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{item.name}</Text>
                                    <Text style={[innerStyles.showAllText, { fontSize: 14, lineHeight: 18, textAlign: "left", marginTop: 5 }]}>{item.type}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${item.price}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        {this.state.showNewsletter == true ?
                            <View style={{ width: '100%', height: Height * 0.4, backgroundColor: '#f6f6f6', marginVertical: 15 }}>
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={[styles.buttonText, { flex: 0.5, textAlign: 'left', marginStart: 10, marginVertical: 10 }]}>Newsletter</Text>
                                    <TouchableOpacity onPress={() => { this.setState({ showNewsletter: false }) }}>
                                        <Image
                                            style={{ flex: 0.5, width: 17, height: 17, alignContent: 'flex-end', marginEnd: 10 }}
                                            resizeMode='contain'

                                            source={require('../static/icon_close.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.inputView, { paddingHorizontal: 10 }]}>
                                    <TextInput style={[styles.input, { backgroundColor: '#ffffff' }]} placeholder="Email" />
                                </View>
                                <View style={[styles.buttonContainer, { paddingHorizontal: 10, width: '100%', alignItems: 'center' }]}>
                                    <TouchableOpacity style={[innerStyles.buttonSubmit]}>
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                {
                                                    color: '#ffffff',
                                                    fontSize: 20
                                                },
                                            ]}>
                                            Subscribe
                                    </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '100%', alignItems: 'center' }}>
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
    trendingImage: {
        borderRadius: 6,
        width: '25%',
        height: '64.7&',
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