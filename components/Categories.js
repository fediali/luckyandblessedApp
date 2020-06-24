import React, { Component } from 'react';
import { View, StyleSheet, InteractionManager, SafeAreaView, FlatList, ActivityIndicator } from "react-native"
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import CategoriesListItem from "../reusableComponents/CategoriesListItem"
import HeaderHorizontalListItem from "../reusableComponents/HeaderHorizontalListItem"
import Globals from "../Globals"
import Toast from 'react-native-simple-toast';

const baseUrl = Globals.baseUrl;

class Categories extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: 0, //Here 0,1,2,3 corresponds to NewArrivals,LookBook,Kids,Sale
            data: this.props.route.params.subCats,
            cid: this.props.route.params.cid,
            cname: this.props.route.params.cname,
            categoryList: this.props.route.params.categoryList,
            isReady: false,
            nextScreen: false
        }

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

            this.setState({ isReady: true })
        })
    }

    onCategorySelect = (cid, cname) => {
        this.setState({ cid, cname })
        if (cid == -1) {
            this.props.navigation.goBack()
        }
        else {
            this.setState({ isReady: false })
            GetData(baseUrl + `api/categories?visible=1&category_id=${cid}&get_images=true&status=A`).then(res => res.json()).then(
                (responses) => {
                    if (responses.categories.length > 0) {
                        var subCat = responses.categories;
                        this.setState({ cid, cname, data: subCat, isReady: true }); //SubCat of the selected category and categoryList is main categories
                    }
                    else {

                        this.props.navigation.navigate("CategoriesProduct", { cid, cname })
                        setTimeout(() => { this.setState({ isReady: true }) }, 1000)

                    }

                }
            ).catch(err => {console.log(err); Toast.show(err.toString())})

        }
    }
    renderSeparator = (item) => {
        return (
            <View
                style={styles.renderSeparatorStyle}
            />
        );
    };
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Header navigation={this.props.navigation} centerText={this.state.cname} rightIcon="search" />
                <View>
                    <View style={styles.subContainer}>
                        <FlatList
                            keyExtractor={(item) => item.category_id}
                            data={this.state.categoryList}
                            horizontal={true}
                            extraData={this.selectedCategory}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <HeaderHorizontalListItem cid={this.state.cid} item={item} onCategorySelect={this.onCategorySelect} />

                            )}

                        />
                    </View>
                    {(!this.state.isReady && !this.state.nextScreen) ? <View><ActivityIndicator size="large" /></View> :


                        <FlatList
                            style={styles.flatListCategories}
                            data={this.state.data}
                            keyExtractor={(item, index) => item.category_id}
                            renderItem={({ item }) => (

                                (item.main_pair) ?
                                    <CategoriesListItem key={item.category} navigation={this.props.navigation}
                                        imageUrl={{ uri: item.main_pair.detailed.image_path }} quantity={item.product_count + " items"} cid={item.category_id} name={item.category} />
                                    :
                                    <CategoriesListItem key={item.category} navigation={this.props.navigation}
                                        imageUrl={{ uri: 'http://dev.landbw.co/images/detailed/39/26_8sq6-me.jpg' }} quantity={item.product_count + " items"} cid={item.category_id} name={item.category} />

                            )}
                            ItemSeparatorComponent={this.renderSeparator}

                        />
                    }
                </View>
                <Footer Key={Math.random()} navigation={this.props.navigation} />
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: "#fff",
    },
    subContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10
    },
    text: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 18,
        lineHeight: 22

    },
    buttonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        fontStyle: 'normal',
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: 'center',
    },
    loader: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loaderImage: {
        height: 200,
        width: 200
    },
    renderSeparatorStyle: {
        paddingBottom: 15
    },
    flatListCategories: {
        paddingTop: 10,
        marginBottom: 150
    }
})

export default Categories