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
    Dimensions,
    Alert
} from "react-native"
import {
    SafeAreaView
} from 'react-native-safe-area-context'

import itemList from '../data/ShoppingCartData';


import Swipeout from 'react-native-swipeout';
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import ColorPicker from '../reusableComponents/ColorPicker'
import styles from './Styles/Style'

YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // Useless Warning(according to github/SOF)
])


class FlatListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeRowKey: null
        };
    }
    render() {
        const swipeSettings = {
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.item.itemNum });
            },
            right: [
                {
                    autoClose: true,
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;
                        Alert.alert(
                            'Alert',
                            'Are you sure you want to delete ?',
                            [
                                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                {
                                    text: 'Yes', onPress: () => {
                                        itemList.splice(this.props.index, 1);
                                        //Refresh FlatList ! 
                                        this.props.parentFlatList.refreshFlatList(deletingRow);
                                    }
                                },
                            ],
                            { cancelable: true }
                        );
                    },
                    text: 'Delete', type: 'delete',
                }
            ],
            rowId: this.props.index,
            sectionId: 1
        };
        return (
            <Swipeout {...swipeSettings}>
                <View style={[innerStyles.itemView,{backgroundColor: '#ffffff'}]}>
                    <View style={{ flexDirection: 'column', padding: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={[innerStyles.itemImage]}
                                resizeMode='contain' source={require("../static/item_cart1.png")}
                            />
                            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
                                <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
                                    <Text style={[innerStyles.itemNameText, { textAlign: 'left', flex: 2 }]}>{this.props.item.name}</Text>
                                    <Text style={[innerStyles.itemNameText, { textAlign: 'right', flex: 1 }]}>${this.props.item.price}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
                                    <Text style={[innerStyles.itemUnitPriceText, { textAlign: 'left', flex: 2 }]}>Unit price</Text>
                                    <Text style={[innerStyles.lightText, { textAlign: 'right', flex: 1 }]}>${this.props.item.unitPrice}</Text>
                                </View>
                                <Text style={innerStyles.lightText}>SIZE: {this.props.item.sizes}</Text>
                                <Text style={innerStyles.lightText}>Color: {this.props.item.selectedColor}</Text>
                                <Text style={innerStyles.lightText}>Quantity: {this.props.item.quantity}</Text>
                            </View>
                        </View>

                        <View style={[innerStyles.horizontalView]}>
                            <TouchableOpacity style={[innerStyles.bottomSelectors, { flex: 0.5 }]}>
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={[innerStyles.numText]}>{this.props.item.unknownNum}</Text>

                                    <Image
                                        style={{
                                            height: 10,
                                            width: 10,
                                            paddingRight:50
                                        }} resizeMode='contain' source={require("../static/arrow_down.png")}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[innerStyles.bottomSelectors, { flex: 0.5, marginStart: 40 }]}>
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ width: 25, height: 25, marginStart: 15, borderRadius: 25, backgroundColor: this.props.item.hexColor,alignSelf:"center" }} />
                                    <Image
                                        style={{
                                            height: 10,
                                            width: 10,
                                            paddingRight:50
                                        }} resizeMode='contain' source={require("../static/arrow_down.png")}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={[styles.line, { marginTop: 10 }]} />
                </View>
            </Swipeout>

        );
    }
}

class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deletedRowKey: null,
            itemList: itemList
        }
    }
    refreshFlatList = (deletedKey) => {
        this.setState((prevState) => {
            return {
                deletedRowKey: deletedKey
            };
        });
    }

    render() {

        const Width = Dimensions.get('window').width;
        const Height = Dimensions.get('window').height;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header  />
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
                            renderItem={({ item, index }) => {
                                return (
                                    <FlatListItem item={item} index={index} parentFlatList={this}>

                                    </FlatListItem>
                                )
                            }}

                        />

                        <View style={innerStyles.promoView}>
                            <View style={styles.inputView}>
                                <TextInput style={[styles.input]} placeholder="Gift Or Promo code" />
                                <TouchableOpacity style={[innerStyles.giftButton]}>
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            {
                                                color: '#ffffff',
                                                fontSize: 18,
                                                lineHeight: 22,
                                            },
                                        ]}>
                                        Add
                                        </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.line, { marginTop: 20 }]} />
                        <Text style={innerStyles.checkoutInfoText}>After this screen you will get another screen before you place your order</Text>



                        <View style={innerStyles.showOrderView}>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                                <Text style={[styles.buttonText, { fontSize: 18, lineHeight: 30 }]}>Order amount: </Text>
                                <Text style={[styles.buttonText, { flex: 1, fontSize: 18, lineHeight: 30, textAlign: 'right' }]}>$103.88</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                                <Text style={[innerStyles.lightText, { lineHeight: 30 }]}>Gift card / Promo applied:</Text>
                                <Text style={[innerStyles.lightText, { flex: 1, lineHeight: 30, textAlign: 'right' }]}>-$55.02</Text>
                            </View>
                        </View>
                        <View style={styles.buttonContainer, {
                            paddingHorizontal: 30, width: '100%',
                            backgroundColor: '#f6f6f6',
                            paddingBottom: 20
                        }}>
                            <TouchableOpacity style={[innerStyles.buttonPaymentMethod]}>
                                <Text
                                    style={[
                                        styles.buttonText,
                                        {
                                            color: '#ffffff',
                                            fontSize: 18,
                                            lineHeight: 22
                                        },
                                    ]}>
                                    Checkout
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Footer />
            </SafeAreaView>
        )
    }
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
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
        width: Width * 0.2,
        height: Height * 0.15,
        alignSelf:"center",
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
    },
    promoView: {
        height: Height * 0.073,
        width: Width,
        backgroundColor: "#ffffff",
        shadowColor: "#e6e6e7",
        shadowOffset: {
            width: 0,
            height: -1
        },
        shadowRadius: 0,
        shadowOpacity: 1,
        marginVertical: 5
    },
    giftButton: {
        height: Height * 0.073,
        width: Width * 0.267,
        borderRadius: 6,
        backgroundColor: "#ffa601",
        marginStart: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkoutInfoText: {
        fontFamily: "Avenir",
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        textAlign: "center",
        color: "#8d8d8e",
        padding: 30
    },
    showOrderView: {
        paddingTop: 15,
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        backgroundColor: '#f6f6f6'
    },
    buttonPaymentMethod: {
        width: '100%',
        backgroundColor: '#2967ff',
        borderRadius: 6,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 15,
    },
})
export default ShoppingCart;