import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    InteractionManager,
    ActivityIndicator
} from "react-native"
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import { ScrollView } from 'react-native-gesture-handler';
import CategoriesListItem from "../reusableComponents/CategoriesListItem"
import { Icon } from 'react-native-elements'
import CategoriesProductListSingleItem from "../reusableComponents/CategoriesProductListSingleItem"
import CategoriesProductListDoubleItem from "../reusableComponents/CategoriesProductListDoubleItem"
import Shimmer from 'react-native-shimmer';

const baseUrl = "http://dev.landbw.co/";

//TODO: Add product length
class CategoriesProduct extends Component {

    constructor(props) {
        super(props)
        this.state = {
            iteratedPage: 1,
            cid: this.props.route.params.cid,
            cname: this.props.route.params.cname,
            selected: 0, //Here 0,1,2,3 corresponds to NewArrivals,LookBook,Kids,Sale
            // data: [{ imageUrl: { key: "1", uri: "http://dev.landbw.co/images/detailed/39/26.jpg" }, price1: "$80.00", name1: "Track Jacket Eggplant" }, { key: "2", imageUrl: { uri: "http://dev.landbw.co/images/detailed/39/27.jpg" }, price1: "$108.50", name1: "Athletics Pack W.N.D." }, { imageUrl: { key: "2", uri: "http://dev.landbw.co/images/detailed/39/26.jpg" }, price1: "$81.00", name1: "Track Jacket" }],
            products: [],
            singleItem: true,
            isReady: false,
            totalProducts: 0
        }
    }

    loadData = (cid) => {
        var promises = []
        // promises.push(GetData(baseUrl + 'api/mobile'))
        promises.push(GetData(baseUrl + `api/products?cid=${cid}&page=` + this.state.iteratedPage))
        Promise.all(promises).then((promiseResponses) => {
            Promise.all(promiseResponses.map(res => res.json())).then((responses) => {

                //Adding "All" to categories response
                console.log("*****************************\n")
                console.log(responses[0].params.total_items)

                // console.log(responses[0].products)
                async function parseProducts() {
                    const tempProducts = []
                    for (let i=0;i< responses[0].products.length; i++) {
                        if (responses[0].products[i].main_pair == null) continue;
                        console.log(responses[0].products[i].main_pair.detailed.image_path)

                        await tempProducts.push({
                            product: responses[0].products[i].product,
                            product_id: responses[0].products[i].product_id,
                            price: responses[0].products[i].price,
                            base_price: responses[0].products[i].base_price,
                            imageUrl: responses[0].products[i].main_pair.detailed.image_path,
                            totalProducts: responses[0].params.total_items ////FIXME: Add product length
                        })

                    }
                    
                    return tempProducts
                }
                parseProducts().then((prod) => {
                    this.setState({
                        isReady: true,
                        products: [...this.state.products, ...prod],
                        totalProducts: prod.totalProducts
                    })
                })

            }).catch(ex => { console.log("Exception: Inner Promise", ex) })
        }).catch(ex => { console.log("Exception: Outer Promise", ex) })
    }

    handleLoadMore = () => {
        this.setState({
            iteratedPage: this.state.iteratedPage + 1,
        })
        this.loadData(this.state.cid);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            console.log(this.state.cid)
            this.loadData(this.state.cid)
        })
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

    /*
        product,
        product_id,
        price,
        base_price,
        products.main_pair.detailed.image_path
    */
    render() {
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        console.log(this.state.products[0])
        const textItems = ["New Arrivals", "Lookbook", "Kids", "Sale"]
        // if (!this.state.isReady) {
        //     return (
        //         <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
        //             <Shimmer>
        //                 <Image style={{ height: 200, width: 200 }} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
        //             </Shimmer>
        //         </View>
        //     )

        // }
        return (
            <SafeAreaView style={{
                flex: 1, backgroundColor: "#fff",
            }}>
                <Header navigation={this.props.navigation} rightIcon="search" />
                {!this.state.isReady ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator size="large" /></View> :

                    <View style={styles.mainContainer}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 30, lineHeight: 36, fontFamily: "Montserrat-Bold", color: "#2d2d2f" }}>{this.state.cname}</Text>
                            <Text style={{ fontSize: 14, lineHeight: 18, color: "#8d8d8e", fontFamily: "Avenir-Book" }}>{this.state.totalProducts} products</Text>
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
                                data={this.state.products}
                                contentContainerStyle={styles.container}
                                keyExtractor={(item, index) => item.product_id}
                                renderItem={({ item }) => (
                                    <CategoriesProductListSingleItem key={item.product_id} pid={item.product_id} navigation={this.props.navigation}
                                        imageUrl={{uri: item.imageUrl}} name1={item.product} price1={item.price} name2={item.product} price2={item.base_price} />
                                )}
                                ItemSeparatorComponent={this.renderSeparator}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={5}


                            /> :
                            /*
                            product,
            product_id,
            price,
            base_price,
            products.main_pair.detailed.image_path
                            */
                            // Double Item row FlatList
                            <FlatList
                                key={(this.state.singleItem ? 'h' : 'v')}
                                data={this.state.products}
                                contentContainerStyle={styles.container}
                                numColumns={2}
                                keyExtractor={(item, index) => item.product_id}
                                renderItem={({ item }) => (
                                    <CategoriesProductListDoubleItem key={item.product_id} pid={item.product_id} navigation={this.props.navigation}
                                        imageUrl={{uri: item.imageUrl}} name1={item.product} price1={item.price} name2={item.product} price2={item.base_price} />
                                )}
                                ItemSeparatorComponent={this.renderSeparator}
                                columnWrapperStyle={styles.multiRowStyling}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={5}

                            />

                        }

                    </View>
                }
                <Footer navigation={this.props.navigation} />
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