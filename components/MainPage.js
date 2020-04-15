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
    SafeAreaView
} from 'react-native'

import styles from './Styles/Style'
import Header from '../reusableComponents/Header'
import Footer from '../reusableComponents/Footer'

import { _categoryList, _collections, _newArrivals, _trending, _history } from '../data/MainPageData'
import GetData from "../reusableComponents/API/GetData"
import ShimmerLogo from "../reusableComponents/ShimmerLogo"
import Shimmer from 'react-native-shimmer';

YellowBox.ignoreWarnings([
    'Require cycle:'
])

const baseUrl = "http://dev.landbw.co/";

//FIXME: Headers selection too slow
class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showNewsletter: true,
            selectedCategory: 0,
            categoryList: null,
            collections: null,
            newArrivals: _newArrivals,
            trending: _trending,
            history: _history,
            isReady: false
        }


    }


    componentDidMount() {

        InteractionManager.runAfterInteractions(() => {
            var promises = []
            promises.push(GetData(baseUrl + 'api/mobile'))
            promises.push(GetData(baseUrl + 'api/categories?visible=1&category_id=33'))
            Promise.all(promises).then((promiseResponses) => {
                Promise.all(promiseResponses.map(res => res.json())).then((responses) => {
                    
                    //Adding "All" to categories response
                    responses[1].categories.unshift({category_id: "-1", category: "All"})
                    // console.log(responses[1])
                    this.setState({
                        isReady: true,
                        collections: responses[0].home.logged.sliders,
                        categoryList: responses[1].categories
                    })
                }).catch(ex => { console.log("Inner Promise", ex) })
            }).catch(ex => { console.log("Outer Promise", ex) })

        })
    }
    onCategorySelect = (c_id, c_name) => {
        // this.setState({ selectedCategory: index })
        console.log(c_id)
        this.setState({ isReady: false })
        var res = GetData(baseUrl + `api/categories?visible=1&category_id=${c_id}`)
        console.log(res)
        console.log(baseUrl + `api/categories?visible=1&category_id=${c_id}`)
        if (res.categories.length > 0)
            this.props.navigation.navigate("Categories", {c_id, c_name})
        else 
            this.props.navigation.navigate("CategoriesProduct", {c_id, c_name})
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
                <Header navigation={this.props.navigation} centerText="Welcome" rightIcon="search" />
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
                                <View style={{ height: '2.8%', marginVertical: 10 }}>
                                    {this.state.selectedCategory == index ?
                                        < TouchableOpacity onPress={() => {                             
                                            this.onCategorySelect(item.category_id, item.category) }}>
                                            <Text style={[styles.buttonText, { marginHorizontal: 10, color: "#2967ff" }]}>{item.category}</Text>
                                        </TouchableOpacity>
                                        :
                                        < TouchableOpacity onPress={() => { this.onCategorySelect(item.category_id, item.category)  }}>
                                            <Text style={[styles.buttonText, { marginHorizontal: 10 }]}>{item.category}</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
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

                        {/* new arrival header*/}
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
                                        source={this.state.newArrivals[0].imageUrl}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[0].name}</Text>
                                    <Text style={[innerStyles.showAllText, { fontSize: 14, lineHeight: 18, textAlign: "left", marginTop: 5 }]}>{this.state.newArrivals[0].type}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[0].price}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: 'column', marginStart: 5 }}>
                                    <Image
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={this.state.newArrivals[1].imageUrl}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[1].name}</Text>
                                    <Text style={[innerStyles.showAllText, { fontSize: 14, lineHeight: 18, textAlign: "left", marginTop: 5 }]}>{this.state.newArrivals[1].type}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[1].price}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={innerStyles.gridCell}>
                                <TouchableOpacity style={{ flexDirection: 'column', marginEnd: 5 }}>
                                    <Image
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={this.state.newArrivals[2].imageUrl}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[2].name}</Text>
                                    <Text style={[innerStyles.showAllText, { fontSize: 14, lineHeight: 18, textAlign: "left", marginTop: 5 }]}>{this.state.newArrivals[2].type}</Text>
                                    <Text style={innerStyles.gridItemNameAndPriceText}>${this.state.newArrivals[2].price}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: 'column', marginStart: 5 }}>
                                    <Image
                                        style={innerStyles.gridImage}
                                        resizeMode='contain'
                                        source={this.state.newArrivals[3].imageUrl}
                                    />
                                    <Text style={innerStyles.gridItemNameAndPriceText}>{this.state.newArrivals[3].name}</Text>
                                    <Text style={[innerStyles.showAllText, { fontSize: 14, lineHeight: 18, textAlign: "left", marginTop: 5 }]}>{this.state.newArrivals[3].type}</Text>
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
                            keyExtractor={(item) => item.id.toString()}
                            data={this.state.trending}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                    <TouchableOpacity style={innerStyles.trendingView}>
                                        <View style={{ width: '70%', height: '80%', flexDirection: 'row', alignItems: 'flex-start', marginStart: 10 }}>
                                            <Image
                                                style={innerStyles.trendingImage}
                                                source={item.imageUrl}
                                                resizeMode='contain'
                                            />
                                            <View style={{ height: '100%', flexDirection: 'column', marginStart: 10, justifyContent: 'center' }}>
                                                <Text style={innerStyles.gridItemNameAndPriceText}>{item.name}</Text>
                                                <Text style={[innerStyles.showAllText, { fontSize: 14, textAlign: 'left', lineHeight: 18, marginTop: 5 }]}>{item.type}</Text>
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
                                                source={item.imageUrl}
                                                resizeMode='contain'
                                            />
                                            <View style={{ height: '100%', flexDirection: 'column', marginStart: 10, justifyContent: 'center' }}>
                                                <Text style={innerStyles.gridItemNameAndPriceText}>{item.name}</Text>
                                                <Text style={[innerStyles.showAllText, { fontSize: 14, textAlign: 'left', lineHeight: 18, marginTop: 5 }]}>{item.type}</Text>
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
                                                source={item.imageUrl}
                                                resizeMode='contain'
                                            />
                                            <View style={{ height: '100%', flexDirection: 'column', marginStart: 10, justifyContent: 'center' }}>
                                                <Text style={innerStyles.gridItemNameAndPriceText}>{item.name}</Text>
                                                <Text style={[innerStyles.showAllText, { fontSize: 14, textAlign: 'left', lineHeight: 18, marginTop: 5 }]}>{item.type}</Text>
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