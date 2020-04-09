import React, { Component } from 'react'
import { Text, View, FlatList, Image, StyleSheet } from 'react-native'
import Header from '../reusableComponents/Header';
import Footer from '../reusableComponents/Footer';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class SearchResults extends Component {
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Header centerText="Search" rightIcon="filter"/>
                <Footer />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
      },
})
