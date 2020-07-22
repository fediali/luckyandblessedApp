import React, { PureComponent } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image'

class CategoriesProductListDoubleItem extends PureComponent {

    navigateToProductPage=()=>{
        this.props.navigation.push("ProductPage", { pid: [this.props.pid], cname: [this.props.cname] }) 
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={0.9} style={styles.button} onPress={this.navigateToProductPage}>
                <FastImage source={this.props.imageUrl} style={styles.image} />
                {/* orignal width is 0.12 currently 0.30 due to long height image, height is 0.26 currently 0.20 */}
                <Text style={styles.mainText}>{this.props.name1}</Text>
                <Text style={styles.subText2}>{this.props.price1}</Text>
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
    subText: { marginTop: 7, fontFamily: "Avenir-Book", fontSize: 14, lineHeight: 18, color: "#2967ff", maxWidth: Width * 0.43 },
    subText2: { fontSize: 16, lineHeight: 20, fontFamily: "Montserrat-Medium", color: "#2d2d2f" }



})
export default CategoriesProductListDoubleItem;