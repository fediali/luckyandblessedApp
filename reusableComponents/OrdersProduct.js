import React, { Component } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'

export default class ordersProduct extends Component {
    render() {
        return (
            <View style={styles.order}>
                <Image source={"http://dev.landbw.co/images/detailed/39/26.jpg"} ></Image>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    order: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
      },
    thumbnailImage: {
        height: 100,
        width: 100,

    }
})
