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
    Alert,
    InteractionManager
} from "react-native"
import {
    SafeAreaView
} from 'react-native-safe-area-context'

import itemList from '../data/ShoppingCartData';
import Shimmer from 'react-native-shimmer';
import ModalDropdown from 'react-native-modal-dropdown';
import Swipeout from 'react-native-swipeout';
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import styles from './Styles/Style'


YellowBox.ignoreWarnings([
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillMount has been renamed',
    'Warning: componentWillReceiveProps is deprecated',
    'Warning: componentWillUpdate is deprecated',
]);

//TODO: Too long file. FlatListItem should be separated
class FlatListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeRowKey: null,
            currentSelectedColor: this.props.item.hexColor,
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
                <View style={[innerStyles.itemView, innerStyles.whiteBackground]}>
                    <View style={innerStyles.listMainView}>
                        <View style={innerStyles.listInnerView}>
                            <Image style={[innerStyles.itemImage]}
                                resizeMode='contain' source={require("../static/item_cart1.png")}
                            />
                            <View style={innerStyles.listTextsContainerView}>
                                <View style={innerStyles.listRowView}>
                                    <Text style={[innerStyles.itemNameText, innerStyles.listRowNameText]}>{this.props.item.name}</Text>
                                    <Text style={[innerStyles.itemNameText, innerStyles.listRowPriceText]}>${this.props.item.price}</Text>
                                </View>
                                <View style={innerStyles.listRowView}>
                                    <Text style={[innerStyles.itemUnitPriceText, innerStyles.listRowNameText]}>Unit price</Text>
                                    <Text style={[innerStyles.lightText, innerStyles.listRowPriceText]}>${this.props.item.unitPrice}</Text>
                                </View>
                                <Text style={innerStyles.lightText}>SIZE: {this.props.item.sizes}</Text>
                                <Text style={innerStyles.lightText}>Color: {this.props.item.selectedColor}</Text>
                                <Text style={innerStyles.lightText}>Quantity: {this.props.item.quantity}</Text>
                            </View>
                        </View>

                        <View style={[innerStyles.horizontalView]}>
                            <TouchableOpacity style={[innerStyles.bottomSelectors, innerStyles.halfFlex]}>
                                <View style={innerStyles.modalView}>

                                    <ModalDropdown
                                        onSelect={(index) => { console.log(index) }}
                                        options={this.props.item.availableSizes}
                                        defaultValue={this.props.item.unknownNum}
                                        style={innerStyles.modalStyle}
                                        dropdownStyle={innerStyles.modalDropdownStyle}
                                        textStyle={innerStyles.modalTextStyle}
                                        renderRow={(option, index, isSelected) => {
                                            return (
                                                <Text style={[innerStyles.numText]}>{option}</Text>
                                            )
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[innerStyles.bottomSelectors, innerStyles.colorModalTouch]}>
                                <View style={innerStyles.modalView}>
                                    {/* <View style={{ width: 25, height: 25, marginStart: 15, borderRadius: 25, backgroundColor: this.props.item.hexColor, alignSelf: "center" }} />
                                    <Image
                                        style={{
                                            height: 10,
                                            width: 10,
                                            paddingRight: 50
                                        }} resizeMode='contain' source={require("../static/arrow_down.png")}
                                    /> */}

                                    <ModalDropdown
                                        hexCode={this.state.currentSelectedColor}
                                        onSelect={(index) => { this.setState({ currentSelectedColor: this.props.item.availableColors[index] }) }}
                                        options={this.props.item.availableColors}
                                        defaultValue={this.props.item.selectedColor}
                                        style={innerStyles.modalStyle}
                                        dropdownStyle={innerStyles.modalDropdownStyle}
                                        textStyle={innerStyles.modalTextStyle}
                                        renderRow={(option, index, isSelected) => {
                                            return (
                                                <View>
                                                    <View style={[innerStyles.modalInnerView, { backgroundColor: option }]} />
                                                </View>
                                            )

                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={[styles.line, innerStyles.viewMargin]} />
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
            itemList: itemList,
            isReady: false
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({ isReady: true })
        })
    };
    refreshFlatList = (deletedKey) => {
        this.setState((prevState) => {
            return {
                deletedRowKey: deletedKey
            };
        });
    }


    renderFlatListHeader = () => {
        var listHeader = (
            <View>
                <View style={innerStyles.listHeaderPad}>
                    <Text style={innerStyles.mainTextBold}>Your bag</Text>
                    <Text style={innerStyles.lightText}>You have 3 items in your bag</Text>
                </View>
                <View style={[styles.line, innerStyles.viewMargin]} />
            </View>
        );
        return listHeader;
    }

    renderFlatListFooter = () => {
        var listFooter = (
            <View style={innerStyles.listFooterPad}>
                <View style={innerStyles.promoView}>
                    <View style={styles.inputView}>
                        <TextInput style={[styles.input]} placeholder="Gift Or Promo code" />
                        <TouchableOpacity activeOpacity={0.5} style={[innerStyles.giftButton]}>
                            <Text
                                style={[
                                    styles.buttonText,
                                    innerStyles.giftButtonText
                                ]}>
                                Add
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.line, { marginTop: 20 }]} />
                <Text style={innerStyles.checkoutInfoText}>After this screen you will get another screen before you place your order</Text>



                <View style={innerStyles.showOrderView}>
                    <View style={innerStyles.orderRowView}>
                        <Text style={[styles.buttonText, innerStyles.orderAmountText]}>Order amount: </Text>
                        <Text style={[styles.buttonText, innerStyles.orderAmountValueText]}>$103.88</Text>
                    </View>
                    <View style={innerStyles.orderRowView}>
                        <Text style={[innerStyles.lightText, innerStyles.orderGiftText]}>Gift card / Promo applied:</Text>
                        <Text style={[innerStyles.lightText, innerStyles.orderAmountValueText]}>-$55.02</Text>
                    </View>
                </View>
                <View style={[styles.buttonContainer, innerStyles.orderButtonView]}>
                    <TouchableOpacity activeOpacity={0.5} style={[innerStyles.buttonPaymentMethod]} onPress={() => { this.props.navigation.navigate("Delivery") }}>
                        <Text
                            style={[
                                styles.buttonText, innerStyles.orderButtonText
                            ]}>
                            Checkout
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )

        return listFooter;
    }

    render() {

        const Width = Dimensions.get('window').width;

        if (!this.state.isReady) {
            return (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
                    <Shimmer>
                        <Image style={{ height: 200, width: 200 }} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
                    </Shimmer>
                </View>
            )

        }
        const Height = Dimensions.get('window').height;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header navigation={this.props.navigation} />
                <View style={styles.parentContainer}>
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
                        ListHeaderComponent={this.renderFlatListHeader}
                        ListFooterComponent={this.renderFlatListFooter}
                    />
                </View>
                <Footer selected="Shop" navigation={this.props.navigation} />
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
        alignSelf: "center",
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
        marginStart: 15,
        marginVertical: 10
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
    whiteBackground: {
        backgroundColor: '#ffffff'
    },
    listMainView: {
        flexDirection: 'column', padding: 15
    },
    listInnerView: {
        flexDirection: 'row'
    },
    listTextsContainerView: {
        flex: 1, flexDirection: 'column', marginLeft: 10
    },
    listRowView: {
        flexDirection: 'row', paddingBottom: 4
    },
    listRowNameText: {
        textAlign: 'left', flex: 2
    },
    listRowPriceText: {
        textAlign: 'right', flex: 1
    },
    halfFlex: {
        flex: 0.5
    },
    modalView: {
        flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center'
    },
    modalStyle: {
        flex: 1, padding: 5, borderRadius: 6
    },
    modalDropdownStyle: {
        width: "30%", height: 110
    },
    modalTextStyle: {
        fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f"
    },
    modalInnerView: {
        width: 25, height: 25, alignSelf: "center", marginVertical: 10, borderRadius: 25, alignSelf: "center"
    },
    viewMargin: {
        marginTop: 15
    },
    colorModalTouch: {
        flex: 0.5, marginStart: 40
    },
    giftButtonText: {
        color: '#ffffff',
        fontSize: 18,
        lineHeight: 22,
    },
    listHeaderPad: {
        paddingHorizontal: 20
    },
    listFooterPad: {
        paddingBottom: 60
    },
    orderRowView: {
        flexDirection: 'row', paddingHorizontal: 20
    },
    orderAmountText: {
        fontSize: 18, lineHeight: 30
    },
    orderAmountValueText: {
        flex: 1, fontSize: 18, lineHeight: 30, textAlign: 'right'
    },
    orderGiftText: {
        lineHeight: 30
    },
    orderButtonView: {
        paddingHorizontal: 30, width: '100%',
        backgroundColor: '#f6f6f6',
        paddingBottom: 20
    },
    orderButtonText: {
        color: '#ffffff',
        fontSize: 18,
        lineHeight: 22
    }

})
export default ShoppingCart;