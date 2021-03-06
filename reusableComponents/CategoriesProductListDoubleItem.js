import React, { PureComponent } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    View
} from 'react-native';
import FastImage from 'react-native-fast-image'

class CategoriesProductListDoubleItem extends PureComponent {

    navigateToProductPage = () => {
        this.props.navigation.push("ProductPage", { pid: [this.props.pid], cname: [this.props.cname] })
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={0.9} style={styles.button} onPress={this.navigateToProductPage}>
                <FastImage source={(this.props.imageUrl!="")?this.props.imageUrl:require("../static/imagenotfound.png")} style={styles.image} />
                {/* orignal width is 0.12 currently 0.30 due to long height image, height is 0.26 currently 0.20 */}
                <Text style={styles.mainText}>{this.props.name1}</Text>

                <View style={{ flexDirection: "row" }}>
                    {this.props.list_price ? <Text style={styles.strikedMainText}>${this.props.list_price}</Text> : null}
                    <Text style={styles.mainText}>{this.props.price1}</Text>

                </View>
            </TouchableOpacity>
        )
    }
}
let Width = Dimensions.get("window").width
let Height = Dimensions.get("window").height
const styles = StyleSheet.create({
    button: { maxWidth: Width / 2 },
    image: { height: Height * 0.3, width: Width * 0.43, justifyContent: "center", borderRadius: 6 },
    mainText: { marginTop: 9, maxWidth: Width * 0.43, fontFamily: "Montserrat-Medium", fontSize: 14, lineHeight: 20, color: "#2d2d2f" },
    subText: { marginTop: 7, fontFamily: "Avenir-Book", fontSize: 14, lineHeight: 18, color: "#1bbfc7", maxWidth: Width * 0.43 },
    subText2: { fontSize: 14, lineHeight: 20, fontFamily: "Montserrat-Medium", color: "#2d2d2f" },
    strikedMainText: { marginTop: 9, fontFamily: "Montserrat-Medium", fontSize: 14, lineHeight: 20, color: "red", paddingHorizontal: 4, textDecorationLine: 'line-through' },


})
export default CategoriesProductListDoubleItem;