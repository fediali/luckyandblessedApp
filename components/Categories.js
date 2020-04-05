import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from "react-native"
import Header from "./Header"
import Footer from "./Footer"

class Categories extends Component {

    render(){

        return(
            <View style={{flex:1}}>
                <Header/>
                <Footer/>
            </View>
        )
    }
}

export default Categories