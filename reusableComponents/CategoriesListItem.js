import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements'

import FastImage from 'react-native-fast-image'

class CategoriesListItem extends PureComponent {

    navigateToProductPage = () => {
        this.props.navigation.navigate("CategoriesProduct", { cid: [this.props.cid], cname: [this.props.name] })
    }
    
    render() {
        return (
            <TouchableOpacity activeOpacity={0.9} style={styles.button} onPress={this.navigateToProductPage}>
                <FastImage source={this.props.imageUrl} resizeMode="contain" style={styles.image} />
                {/* orignal width is 0.12 currently 0.30 due to long height image, height is 0.26 currently 0.20 */}
                <View style={styles.paddingLeft}>
                    <Text style={styles.mainText}>{this.props.name}</Text>
                    <Text style={styles.subText}>{this.props.quantity}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Icon
                        size={30}
                        name='ios-arrow-forward'
                        type='ionicon'
                    />
                </View>

            </TouchableOpacity>
        )
    }
}
let Width = Dimensions.get("window").width
let Height = Dimensions.get("window").height
const styles = StyleSheet.create({
    button: { flexDirection: "row", paddingHorizontal: 20, alignItems: "center" },
    image: { height: Height * 0.20, width: Width * 0.24, borderRadius: 6 },
    mainText: { fontFamily: "Montserrat-SemiBold", fontSize: 24, lineHeight: 28 },
    subText: { fontSize: 14, lineHeight: 18, color: "#2967ff" },
    paddingLeft: { paddingLeft: 20 }

})

export default CategoriesListItem;