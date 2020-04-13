import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList } from "react-native"
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import { ScrollView } from 'react-native-gesture-handler';
import CategoriesListItem from "../reusableComponents/CategoriesListItem"
class Categories extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: 0, //Here 0,1,2,3 corresponds to NewArrivals,LookBook,Kids,Sale
            data: [{ imageUrl: { key: "1", uri: "http://dev.landbw.co/images/detailed/39/26.jpg" }, quantity: "5,287 items", name: "Jeans" }, { key: "2", imageUrl: { uri: "http://dev.landbw.co/images/detailed/39/27.jpg" }, quantity: "2,509 items", name: "Top" }, { key: "3", imageUrl: { uri: "http://dev.landbw.co/images/detailed/39/28_jp1x-s7.jpg" }, quantity: "1,335 items", name: "Dresses" }, { key: "3", imageUrl: { uri: "http://dev.landbw.co/images/detailed/39/default_851g-6z.jpg" }, quantity: "932 items", name: "Pants" }]
        }
    }

    getData(url, stateKey, responseDataPath) {
        let h = new Headers();
        h.append(
          'Authorization',
          'Basic: emF5YW50aGFyYW5pQGdtYWlsLmNvbTo3bjE3N0JFRTc5OXYyazRIeThkNVdKNDBIOXoxdzBvMw==',
        );
        h.append('Accept', 'application/json');
    
        let req = new Request(url, {
          headers: h,
          method: 'GET',
        });
    
        fetch(req)
          .then((response) => response.json())
          .then((data) => {
              var resPath = responseDataPath
            // console.log(data)
            // console.log(data.categories)
            this.setState({
                [stateKey]: data[responseDataPath],
              loaded: true,
            });
          })
          .catch(this.badStuff);
      }
    
      badStuff = (err) => {
          console.log("Error")
          console.log(err.message)

        this.setState({loaded: true, data: null, error: err.message});
      };
      
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
                <Header  navigation={this.props.navigation} centerText="Women" rightIcon="search" />
                <View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
                        {textItems.map((item, key) => (
                            <TouchableOpacity style={{ paddingVertical: 7 }} key={key} onPress={() => { this.changeTextColor(key) }}>
                                {this.state.selected == key ?
                                    <Text style={[styles.text, { color: "#2967ff" }]}>
                                        {item}
                                    </Text> :
                                    <Text style={[styles.text, { color: "#2d2d2f" }]}>
                                        {item}
                                    </Text>
                                }
                            </TouchableOpacity>
                        ))}
                    </View>
                    <FlatList
                        style={{ paddingTop: 10, marginBottom: 150 }}
                        data={this.state.data}
                        keyExtractor={(item, index) => item.name}
                        renderItem={({ item }) => (
                            <CategoriesListItem key={item.name}
                                imageUrl={item.imageUrl} quantity={item.quantity} name={item.name} />
                        )}
                        ItemSeparatorComponent={this.renderSeparator}

                    />

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

    }
})

export default Categories