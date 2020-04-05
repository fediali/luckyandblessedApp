import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from "react-native"
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import { ScrollView } from 'react-native-gesture-handler';

class Categories extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: 0 //Here 0,1,2,3 corresponds to NewArrivals,LookBook,Kids,Sale
        }
    }
    changeTextColor(item){
        this.setState({selected:item})
    }
    render() {
        console.log(this.state.selected)
        const textItems = ["New Arrivals", "Lookbook", "Kids", "Sale"]
        // const textComponents = []
        // for (var i = 0; i < 4; i++) {
        //     textComponents.push(
        //         <TouchableOpacity key={i} onPress={(x) => { console.log(x.key) }}>
        //             {this.state.selected == i ?
        //                 <Text style={[styles.text, { color: "#00f" }]}>
        //                     {textItems[i]}
        //                 </Text> :
        //                 <Text style={[styles.text, { color: "#2d2d2f" }]}>
        //                     {textItems[i]}
        //                 </Text>
        //             }
        //         </TouchableOpacity>
        //     )
        // }
        return (
            <View style={{ flex: 1 }}>
                <Header centerText="Women" rightIcon="search" />
                <ScrollView>

                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>

                        {textItems.map((item, key) => (
                            <TouchableOpacity style={{paddingVertical:7}} key={key} onPress={() => { this.changeTextColor(key) }}>
                                {this.state.selected == key ?
                                    <Text style={[styles.text, { color: "#2967ff" }]}>
                                        {item}
                                    </Text> :
                                    <Text style={[styles.text, { color: "#2d2d2f" }]}>
                                        { item }
                                    </Text>
                                }
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                <Footer />
            </View >
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