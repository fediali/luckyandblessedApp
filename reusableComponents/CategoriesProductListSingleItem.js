import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements'
import FastImage from 'react-native-fast-image'


class CategoriesProductListSingleItem extends PureComponent {

    navigateToProductPage=()=>{
        this.props.navigation.push("ProductPage", { pid: [this.props.pid], cname:[this.props.cname] }) 
    }
    
    render() {
        // console.log("nnnn",this.props)
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={this.navigateToProductPage}>
                <View style={styles.imageView}>
                    <FastImage source={this.props.imageUrl} style={styles.image} resizeMode="contain" />
                </View>
                {/* orignal width is 0.12 currently 0.30 due to long height image, height is 0.26 currently 0.20 */}
                <View style={styles.textContainer}>
                    <Text style={[styles.mainText, styles.limitWidth]}>{this.props.name1}</Text>
                    <Text style={styles.mainText}>{this.props.price1}</Text>
                </View>
                <View style={styles.textContainer2}>
                    <Text style={[styles.subText, styles.colorBlue]}>{this.props.name2}</Text>
                    <Text style={[styles.subText, styles.colourGrey]}>{this.props.price2}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

let Width = Dimensions.get("window").width
let Height = Dimensions.get("window").height
const styles = StyleSheet.create({
    imageView: { borderRadius: 6, backgroundColor: "#f6f6f6", width: Width * 0.88, alignSelf: "center" },
    image: { alignSelf: "center", height: Height * 0.5, width: Width * 0.88 },
    textContainer: { paddingVertical: 9, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" },
    textContainer2: { paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" },
    mainText: { fontFamily: "Montserrat-Medium", fontSize: 16, lineHeight: 20, color: "#2d2d2f", },
    limitWidth: { maxWidth: Width * 0.65 },
    subText: { fontFamily: "Avenir-Book", fontSize: 14, lineHeight: 18, },
    colourGrey: { color: "#8d8d8e" },
    colorBlue: { color: "#2967ff", maxWidth: Width * 0.65 }




})

export default CategoriesProductListSingleItem;