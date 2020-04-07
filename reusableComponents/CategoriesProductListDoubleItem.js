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


class CategoriesProductListDoubleItem extends PureComponent {
    render() {

        let Width = Dimensions.get("window").width
        let Height = Dimensions.get("window").height
        return (
            <View style={{ maxWidth: Width / 2}}>
                <Image source={this.props.imageUrl} style={{ height: Height * 0.3, width: Width * 0.43,justifyContent:"center",borderRadius:6}} />
                {/* orignal width is 0.12 currently 0.30 due to long height image, height is 0.26 currently 0.20 */}
                <Text style={{ maxWidth:Width * 0.43,fontFamily: "Montserrat-Medium", fontSize: 16, lineHeight: 20, color: "#2d2d2f"}}>{this.props.name1}</Text>
                <Text style={{ marginTop:7,fontFamily: "Avenir-Book", fontSize: 14, lineHeight: 18, color: "#2967ff", maxWidth:Width * 0.5}}>{this.props.name2}</Text>
                <Text style={{ fontSize: 16, lineHeight: 20, fontFamily: "Montserrat-Medium", color: "#2d2d2f" }}>{this.props.price1}</Text>
            </View>
        )
    }
}

export default CategoriesProductListDoubleItem;