import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView,
    YellowBox,
    Dimensions
} from "react-native"
import {
    SafeAreaView
} from 'react-native-safe-area-context'

import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import ColorPicker from '../reusableComponents/ColorPicker'
import styles from './Styles/Style'

//TODO: To implement cart list
YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // Useless Warning(according to github/SOF)
])
class ShoppingCart extends Component {
    constructor() {
        super();
        this.state = {
            itemList: [
                {
                    itemNum: 0,
                    name: '3-Stripes Shirt',
                    price: 48.99,
                    unitPrice: 19.40,
                    sizes: '2(S), 2(M), 2(L)',
                    color: ['Turquoise'],
                    quantity: 14,
                    unknownNum: 6,
                    hexColor: '#05c2bd'
                }, {
                    itemNum: 1,
                    name: 'Tuxedo Blouse',
                    price: 34.90,
                    unitPrice: 50.00,
                    sizes: '2(S), 2(M), 2(L)',
                    color: ['Turquoise'],
                    quantity: 14,
                    unknownNum: 12,
                    hexColor: '#3c3c3e'
                }, {
                    itemNum: 2,
                    name: 'Linear Near Tee',
                    price: 19.99,
                    unitPrice: 29.50,
                    sizes: '2(S), 2(M), 2(L)',
                    color: ['Turquoise'],
                    quantity: 14,
                    unknownNum: 12,
                    hexColor: '#ff671c'
                }
            ]
        }
    }
    render() {

        const Width = Dimensions.get('window').width;
        const Height = Dimensions.get('window').height;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        backgroundColor: "#fff",
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        paddingBottom: 60
                    }}>
                    <View style={styles.parentContainer}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <Text style={innerStyles.mainTextBold}>Your bag</Text>
                            <Text style={innerStyles.lightText}>You have 3 items in your bag</Text>
                        </View>
                        <View style={[styles.line, { marginTop: 10 }]} />
                        <FlatList
                            keyExtractor={(item) => item.itemNum.toString()}
                            data={this.state.itemList}
                            numColumns={1}
                            renderItem={({ item }) => (
                                <View style={[innerStyles.itemView]}>
                                    <View style={{ flexDirection: 'column', padding: 15 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image style={[innerStyles.itemImage]}
                                                resizeMode='contain' source={require("../static/item_cart1.png")}
                                            />
                                            <View style={{ flex: 1, flexDirection: 'column', marginLeft:10 }}>
                                                <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
                                                    <Text style={[innerStyles.itemNameText, { textAlign: 'left', flex: 2 }]}>{item.name}</Text>
                                                    <Text style={[innerStyles.itemNameText, { textAlign: 'right', flex: 1 }]}>${item.price}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
                                                    <Text style={[innerStyles.itemUnitPriceText, { textAlign: 'left', flex: 2 }]}>Unit price</Text>
                                                    <Text style={[innerStyles.lightText, { textAlign: 'right', flex: 1 }]}>${item.unitPrice}</Text>
                                                </View>
                                                <Text style={innerStyles.lightText}>SIZE: {item.sizes}</Text>
                                                <Text style={innerStyles.lightText}>Color: {item.color}</Text>
                                                <Text style={innerStyles.lightText}>Quantity: {item.quantity}</Text>
                                            </View>
                                        </View>

                                        <View style={[innerStyles.horizontalView]}>
                                            <TouchableOpacity style={[innerStyles.bottomSelectors, { flex: 0.5 }]}>
                                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={[innerStyles.numText]}>{item.unknownNum}</Text>

                                                    <Image
                                                        style={{
                                                            height: '33.3%',
                                                            width: '58.3%',
                                                        }} resizeMode='contain' source={require("../static/arrow_down.png")}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[innerStyles.bottomSelectors, { flex: 0.5, marginStart: 40 }]}>
                                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <View style={{ width: 25, height: 25,marginStart: 15, borderRadius: 25, backgroundColor: item.hexColor }} />
                                                    <Image
                                                        style={{
                                                            height: '33.3%',
                                                            width: '58.3%',
                                                        }} resizeMode='contain' source={require("../static/arrow_down.png")}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                </View>
                            )}

                        />


                    </View>
                </ScrollView>
                <Footer />
            </SafeAreaView>
        )
    }
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

innerStyles = StyleSheet.create({
    mainTextBold: {
        fontFamily: "Montserrat-Bold",
        fontSize: 30,
        fontStyle: "normal",
        lineHeight: 45,
        letterSpacing: 0,
        textAlign: "left",
        color: '#2d2d2f',
        marginTop: 10
    },
    lightText: {
        fontFamily: "Avenir-Book",
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 1,
        color: '#8d8d8e',
    },
    itemView: {
        // flex:1
    },
    itemImage: {
        width: Width*0.2,
        height: Height*0.15,
    },
    rowStyling: {
        backgroundColor: "#ffffff",
        shadowColor: "#e6e6e7",
        shadowOffset: {
            width: 0,
            height: -1
        },
        shadowRadius: 0,
        shadowOpacity: 1
    },
    itemNameText: {
        fontFamily: "Montserrat-Medium",
        fontSize: 16,
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: "#2d2d2f"
    },
    itemUnitPriceText: {
        fontFamily: "Avenir-Book",
        fontSize: 14,
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        color: "#2967ff"
    },
    horizontalView: {
        flexDirection: 'row',
        marginTop: 20,
        paddingHorizontal: 10
    },
    bottomSelectors: {
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: '#f6f6f6',
        alignItems: 'center',
    },
    numText: {
        fontFamily: "Avenir-Book",
        fontSize: 18,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 0,
        color: "#2d2d2f",
        textAlign: 'left',
        marginStart: 15
    }
})
export default ShoppingCart;