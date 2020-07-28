import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, InteractionManager, Dimensions } from 'react-native'
import HTML from 'react-native-render-html';
import Header from "../reusableComponents/Header"
import { ScrollView } from 'react-native-gesture-handler';
import Shimmer from 'react-native-shimmer';
import FastImage from 'react-native-fast-image'

export default class LookbookRenderer extends Component {

    state = {
        pageName: this.props.route.params.pageName,
        html: this.props.route.params.html[0],
        isReady: false
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

            this.setState({ isReady: true })
        })
    }
    render() {
        // console.log(this.state.html)
        if (!this.state.isReady) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Shimmer>
                  <FastImage
                    style={{ height: 200, width: 200 }}
                    resizeMode={'contain'}
                    source={require('../static/logo-signIn.png')}
                  />
                </Shimmer>
              </View>
            );
        }
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Header navigation={this.props.navigation} centerText={this.state.pageName} rightIcon="search" />
                <ScrollView style={{flexGrow:1, marginVertical: 20, marginHorizontal: 15}} showsVerticalScrollIndicator={false}>
                    <HTML 
                        html={this.state.html.replace(/<p>/g,"").replace(/<[/]p>/g,"").replace(/>/g,"/>")} 
                        imagesMaxWidth={Dimensions.get('window').width} 
                        tagsStyles= {{ img: { marginVertical: 10} }}
                    />
                </ScrollView>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: "#fff",
    },
    htmlView: {
        borderRadius: 6
    }
})

