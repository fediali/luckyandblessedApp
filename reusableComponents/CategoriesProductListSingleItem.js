import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image'


class CategoriesProductListSingleItem extends PureComponent {

    navigateToProductPage = () => {
        this.props.navigation.push("ProductPage", { pid: [this.props.pid], cname: [this.props.cname] })
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={this.navigateToProductPage}>
                <View style={styles.imageView}>
                    <FastImage source={(this.props.imageUrl!="")?this.props.imageUrl:require("../static/imagenotfound.png")} style={styles.image} resizeMode="contain" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.mainText, styles.limitWidth]}>{this.props.name1}</Text>
                    <View style={{ flexDirection: "row" }}>
                        {this.props.list_price ? <Text style={styles.strikedMainText}>${this.props.list_price}</Text> : null}
                        <Text style={styles.mainText}>{this.props.price1}</Text>

                    </View>
                </View>
                {/* <View style={styles.textContainer2}>
                    <Text style={[styles.subText, styles.colourGrey]}>{this.props.price2}</Text>
                </View> */}
            </TouchableOpacity>
        )
    }
}

let Width = Dimensions.get("window").width
let Height = Dimensions.get("window").height
const styles = StyleSheet.create({
    imageView: { borderRadius: 6, backgroundColor: "#f6f6f6", width: Width * 0.88, alignSelf: "center" },
    image: { alignSelf: "center", height: Height * 0.5, width: Width * 0.88, borderRadius: 6 },
    textContainer: { paddingVertical: 9, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" },
    textContainer2: { paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" },
    mainText: { fontFamily: "Montserrat-Medium", fontSize: 14, lineHeight: 20, color: "#2d2d2f", },
    strikedMainText: { fontFamily: "Montserrat-Medium", fontSize: 14, lineHeight: 20, color: "red", paddingHorizontal: 4, textDecorationLine: 'line-through' },

    limitWidth: { maxWidth: Width * 0.65 },
    subText: { fontFamily: "Avenir-Book", fontSize: 14, lineHeight: 18, },
    colourGrey: { color: "#8d8d8e" },
    colorBlue: { color: "#2967ff", maxWidth: Width * 0.65 }




})

export default CategoriesProductListSingleItem;