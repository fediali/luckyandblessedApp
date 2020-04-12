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
} from 'react-native'

import styles from './Styles/Style'
import SafeAreaView from 'react-native-safe-area-context'
import Header from '../reusableComponents/Header'
import Footer from '../reusableComponents/Footer'

import { _categoryList, _collections, _newArrivals, _trending, _history } from '../data/MainPageData'

class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showNewsletter: true,
            selectedCategory: 0,
            categoryList: _categoryList,
            collections: _collections,
            newArrivals: _newArrivals,
            trending: _trending,
            history: _history
        }
    }

    onCategorySelect = (index) => {
        this.setState({ selectedCategory: index })
    }


    render() {
        const Width = Dimensions.get('window').width;
        const Height = Dimensions.get('window').height;

        return (
            <View style={[styles.parentContainer]}>
                <Header />
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
                            keyExtractor={(item) => item.id.toString()}
                            data={this.state.categoryList}
                            horizontal={true}
                            extraData={this.selectedCategory}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <View style={{ height: '2.8%', marginVertical: 10 }}>
                                    {this.state.selectedCategory == index ?
                                        < TouchableOpacity onPress={() => { this.onCategorySelect(index) }}>
                                            <Text style={[styles.buttonText, { marginHorizontal: 10, color: "#2967ff" }]}>{item.name}</Text>
                                        </TouchableOpacity>
                                        :
                                        < TouchableOpacity onPress={() => { this.onCategorySelect(index) }}>
                                            <Text style={[styles.buttonText, { marginHorizontal: 10 }]}>{item.name}</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            )}

                        />
                        <FlatList
                            keyExtractor={(item) => item.id.toString()}
                            data={this.state.collections}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={{ borderRadius: 6 }}>
                                    <ImageBackground
                                        style={innerStyles.collectionImages}
                                        source={item.imageUrl}
                                        resizeMode='stretch'
                                    >
                                        <Text style={innerStyles.semiBoldText}>{item.name}</Text>
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
                                <View style={styles.buttonContainer, { paddingHorizontal: 10, width: '100%', alignItems: 'center' }}>
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
                <Footer />
            </View>
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