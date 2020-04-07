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


class CategoriesListItem extends PureComponent {
    render() {

        let Width = Dimensions.get("window").width
        let Height = Dimensions.get("window").height
        return (
            <View style={{ flexDirection: "row", paddingHorizontal: 20,alignItems:"center" }} >
                <Image source={this.props.imageUrl} resizeMode="contain" style={{ height: Height * 0.20, width: Width * 0.24,borderRadius:6 }} />
                {/* orignal width is 0.12 currently 0.30 due to long height image, height is 0.26 currently 0.20 */}
                <View style={{paddingLeft:20}}>
                    <Text style={{fontFamily:"Montserrat-SemiBold",fontSize:24,lineHeight:28}}>{this.props.name}</Text>
                    <Text style={{fontSize:14,lineHeight:18,color:"#2967ff"}}>{this.props.quantity}</Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end"}}>
                <Icon
                    size={30}
                    name='ios-arrow-forward'
                    type='ionicon'
                />
                </View>
                
            </View>
        )
    }
}

export default CategoriesListItem;