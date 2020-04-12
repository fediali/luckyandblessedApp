import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList } from "react-native"
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import { ScrollView } from 'react-native-gesture-handler';
import CategoriesListItem from "../reusableComponents/CategoriesListItem"
import { Icon } from 'react-native-elements'
import CategoriesProductListSingleItem from "../reusableComponents/CategoriesProductListSingleItem"
import CategoriesProductListDoubleItem from "../reusableComponents/CategoriesProductListDoubleItem"

class CategoriesProduct extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: 0, //Here 0,1,2,3 corresponds to NewArrivals,LookBook,Kids,Sale
            data: [{ imageUrl: { key: "1", uri: "http://dev.landbw.co/images/detailed/39/26.jpg" }, price1: "$80.00", name1: "Track Jacket Eggplant" }, { key: "2", imageUrl: { uri: "http://dev.landbw.co/images/detailed/39/27.jpg" }, price1: "$108.50", name1: "Athletics Pack W.N.D." }, { imageUrl: { key: "2", uri: "http://dev.landbw.co/images/detailed/39/26.jpg" }, price1: "$81.00", name1: "Track Jacket" }],
            singleItem: true
        }
    }
    changeTextColor(item) {
        this.setState({ selected: item })
    }
    renderSeparator = (item) => {
        return (
            <View
                style={{
                    paddingBottom: 15
                }}
            />
        );
    };
    render() {
        const textItems = ["New Arrivals", "Lookbook", "Kids", "Sale"]
        return (
            <SafeAreaView style={{
                flex: 1, backgroundColor: "#fff",
            }}>
                <Header  navigation={this.props.navigation} rightIcon="search" />
                <View style={styles.mainContainer}>
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 30, lineHeight: 36, fontFamily: "Montserrat-Bold", color: "#2d2d2f" }}>Jeans</Text>
                        <Text style={{ fontSize: 14, lineHeight: 18, color: "#8d8d8e", fontFamily: "Avenir-Book" }}>2,825 products</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 5 }}>
                        <Image style={{ width: 23, height: 23 }} source={require('../static/listIcon.png')}></Image>

                        <Text style={{ paddingLeft: 13, fontSize: 16, lineHeight: 20, color: "#2d2d2f", fontFamily: "Montserrat-Medium" }}>Clothing</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => { this.setState({ singleItem: false }) }}>
                                {this.state.singleItem ?
                                    <Icon
                                        size={25}
                                        name='grid'
                                        type='feather'
                                        color="#2d2d2f"

                                    /> :
                                    <Icon
                                        size={25}
                                        name='grid'
                                        type='feather'
                                        color="#2967ff"
                                    />
                                }

                            </TouchableOpacity>
                            <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => { this.setState({ singleItem: true }) }}>
                                {this.state.singleItem ?

                                    <Icon
                                        style={{ alignSelf: "flex-end" }}
                                        size={25}
                                        name='square'
                                        type='feather'
                                        color="#2967ff"

                                    /> :
                                    <Icon
                                        style={{ alignSelf: "flex-end" }}
                                        size={25}
                                        name='square'
                                        type='feather'
                                        color="#2d2d2f"

                                    />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={{ paddingLeft: 10 }}>
                                {/* <Icon
                                    size={25}
                                    name='grid'
                                    type='feather'
                                    color="#2d2d2f"

                                /> */}
                                <Image style={{ height: 22, width: 22 }} source={require("../static/Filter.png")} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <CategoriesProductListSingleItem imageUrl={this.state.data[0].imageUrl} name1={this.state.data[0].name1} price1={this.state.data[0].price1} name2={this.state.data[0].name1} price2={this.state.data[0].price1}/> */}

                    {/* Checking whether the Flatlist should render single item row or double item row */}
                    {this.state.singleItem ?
                        // changing Key to rerender the FlatList component as chaning numColumn require rerender
                        // Single Item row FlatList
                        <FlatList
                            key={(this.state.singleItem ? 'h' : 'v')}
                            data={this.state.data}
                            contentContainerStyle={styles.container}
                            keyExtractor={(item, index) => item.name1}
                            renderItem={({ item }) => (
                                <CategoriesProductListSingleItem key={item.name1}
                                    imageUrl={item.imageUrl} name1={item.name1} price1={item.price1} name2={item.name1} price2={item.price1} />
                            )}
                            ItemSeparatorComponent={this.renderSeparator}

                        /> :
                        // Double Item row FlatList
                        <FlatList
                            key={(this.state.singleItem ? 'h' : 'v')}
                            data={this.state.data}
                            contentContainerStyle={styles.container}
                            numColumns={2}
                            keyExtractor={(item, index) => item.name1}
                            renderItem={({ item }) => (
                                <CategoriesProductListDoubleItem key={item.name1}
                                    imageUrl={item.imageUrl} name1={item.name1} price1={item.price1} name2={item.name1} price2={item.price1} />
                            )}
                            ItemSeparatorComponent={this.renderSeparator}
                            columnWrapperStyle={styles.multiRowStyling}


                        />

                    }

                </View>

                <Footer  navigation={this.props.navigation}/>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 18,
        lineHeight: 22
    },
    mainContainer: {
        flex: 1,
        // backgroundColor: "#000",
        paddingBottom: 50,

    },
    subContainer: {
        flex: 1,
        alignItems: "center"
    },
    multiRowStyling: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 20
    }

})

export default CategoriesProduct