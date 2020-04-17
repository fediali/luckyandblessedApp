import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput,InteractionManager, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from "react-native"
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import { ScrollView } from 'react-native-gesture-handler';
import CategoriesListItem from "../reusableComponents/CategoriesListItem"
import Shimmer from 'react-native-shimmer';
const baseUrl = "http://dev.landbw.co/";

class Categories extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: 0, //Here 0,1,2,3 corresponds to NewArrivals,LookBook,Kids,Sale
            // data: [{ imageUrl: { key: "1", uri: "http://dev.landbw.co/images/detailed/39/26.jpg" }, quantity: "5,287 items", name: "Jeans" }, { key: "2", imageUrl: { uri: "http://dev.landbw.co/images/detailed/39/27.jpg" }, quantity: "2,509 items", name: "Top" }, { key: "3", imageUrl: { uri: "http://dev.landbw.co/images/detailed/39/28_jp1x-s7.jpg" }, quantity: "1,335 items", name: "Dresses" }, { key: "3", imageUrl: { uri: "http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg" }, quantity: "932 items", name: "Pants" }],
            data:this.props.route.params.subCats ,
            cid: this.props.route.params.cid,
            cname: this.props.route.params.cname,
            categoryList: this.props.route.params.categoryList,
            isReady: false,
            nextScreen: false
        }
        console.log()

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

            this.setState({isReady: true})
        })
    }
      
    onCategorySelect(cid, cname) {
        console.log(cid)
        if (cid == -1){
            this.props.navigation.goBack()
        }
        else
        {
            this.setState({ isReady: false })
            GetData(baseUrl + `api/categories?visible=1&category_id=${cid}&get_images=true`).then(res => res.json()).then(
                (responses) => {
                    // console.log(responses)
                    console.log(baseUrl + `api/categories?visible=1&category_id=${cid}`)
                    if (responses.categories.length > 0){
                        var subCat = responses.categories;
                        // console.log(subCat)
                        this.setState({ cid, cname, data: subCat, isReady: true}); //SubCat of the selected category and categoryList is main categories
                    }
    
                    else
                    {
                        // this.setState({isReady: true, nextScreen: true}) //FIXME: For shimmer

                        this.props.navigation.navigate("CategoriesProduct", { cid, cname})
                    }
                    // setTimeout(() => { this.setState({ isReady: true }) }, 1000)
    
                }
            )
    
        }
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

        if (this.state.nextScreen && this.state.isReady) {
            return (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
                    <Shimmer>
                        <Image style={{ height: 200, width: 200 }} resizeMode={"contain"} source={require("../static/logo-signIn.png")} />
                    </Shimmer>
                </View>
            )

        }
        return (
            <SafeAreaView style={{
                flex: 1, backgroundColor: "#fff",
            }}>
                <Header  navigation={this.props.navigation} centerText={this.state.cname} rightIcon="search" />
                <View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
                        <FlatList
                            keyExtractor={(item) => item.category_id}
                            data={this.state.categoryList}
                            horizontal={true}
                            extraData={this.selectedCategory}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <View style={{ height: '2.8%', marginVertical: 10 }}>
                                    {this.state.cid == item.category_id ?
                                        < TouchableOpacity onPress={() => {
                                            this.onCategorySelect(item.category_id, item.category)
                                        }}>
                                            <Text style={[styles.buttonText, { marginHorizontal: 10, color: "#2967ff" }]}>{item.category}</Text>
                                        </TouchableOpacity>
                                        :
                                        < TouchableOpacity onPress={() => { this.onCategorySelect(item.category_id, item.category) }}>
                                            <Text style={[styles.buttonText, { marginHorizontal: 10 }]}>{item.category}</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            )}

                        />
                    </View>
                            {  (!this.state.isReady && !this.state.nextScreen) ?<View style={{}}><ActivityIndicator size="large"/></View>:


                    <FlatList
                        style={{ paddingTop: 10, marginBottom: 150 }}
                        data={this.state.data}
                        keyExtractor={(item, index) => item.category_id}
                        renderItem={({ item }) => (
                            // FIXME: item.main_pair.detailed.image_path not working
                            
                            (item.main_pair.detailed.image_path) ? 

                            <CategoriesListItem key={item.category} navigation={this.props.navigation}
                            imageUrl={{uri: item.main_pair.detailed.image_path}} quantity={item.product_count + " items"} cid={item.category_id} name={item.category} />
                            :
                            <CategoriesListItem key={item.category} navigation={this.props.navigation}
                                imageUrl={{uri: 'http://dev.landbw.co/images/detailed/39/26_8sq6-me.jpg'}} quantity={item.product_count + " items"} cid={item.category_id} name={item.category} />
                            
                        )}
                        ItemSeparatorComponent={this.renderSeparator}

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
    buttonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        fontStyle: 'normal',
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: 'center',
      },
})

export default Categories