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


class CategoriesProductListSingleItem extends PureComponent {
    render() {

        let Width = Dimensions.get("window").width
        let Height = Dimensions.get("window").height
        return (
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate("ProductPage")}}>
                <Image source={this.props.imageUrl} style={{alignSelf:"center", height: Height * 0.5, width: Width*0.88,borderRadius:6 }} />
                {/* orignal width is 0.12 currently 0.30 due to long height image, height is 0.26 currently 0.20 */}
                <View style={{paddingVertical:9,paddingHorizontal:20,flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={{fontFamily:"Montserrat-Medium",fontSize:16,lineHeight:20,color:"#2d2d2f", maxWidth: Width*0.65}}>{this.props.name1}</Text>
                    <Text style={{fontSize:16,lineHeight:20,fontFamily:"Montserrat-Medium",color:"#2d2d2f"}}>{this.props.price1}</Text>
                </View>
                <View style={{paddingHorizontal:20,flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={{fontFamily:"Avenir-Book",fontSize:14,lineHeight:18,color:"#2967ff", maxWidth: Width*0.65}}>{this.props.name2}</Text>
                    <Text style={{fontFamily:"Avenir-Book",fontSize:14,lineHeight:18,color:"#8d8d8e"}}>{this.props.price2}</Text>
                </View>       
            </TouchableOpacity>
        )
    }
}

export default CategoriesProductListSingleItem;