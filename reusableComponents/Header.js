import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements'


/* How to use Custom Header

Props:
centerText: "provide the text to show in center"
rightIcon: "search" provide icon name ,supported icon names { info,search,share,edit } and "clear" Clear all text


*/
class Header extends PureComponent {

    getRightIcon() {
        if (this.props.rightIcon == "info") {
            return < Icon
                size={30}
                name='md-information-circle-outline'
                type='ionicon'
                color='#000'
            />
        }
        else if (this.props.rightIcon == "search") {
            return < Icon
                size={30}
                name='ios-search'
                type='ionicon'
                color='#000'
            />
        }
        else if (this.props.rightIcon == "share") {
            return < Icon
                size={26}
                name='upload'
                type='feather'
                color='#000'
            />
        }
        else if (this.props.rightIcon == "edit") {
            return < Icon
                size={26}
                name='edit'
                type='feather'
                color='#000'
            />
        }
        else if (this.props.rightIcon == "filter") {
            return (
                <Image style={{height: 22, width: 20}} 
                source={require("../static/Filter.png")}>

                </Image>
            )
        }
        else if (this.props.rightIcon == "clear") {
            return (
                <TouchableOpacity onPress={()=>{this.props.rightIconClickHandler()}}>
                    <Text style={{ fontSize: 18, lineHeight: 24, color: "#2d2d2f", fontFamily: "Avenir-Medium" }}>
                        Clear All
                    </Text>
                </TouchableOpacity>
            )
        }
    }
    render() {
        return (
            <View style={{ height: 50, flexDirection: "row", alignItems: "center",backgroundColor:"#fff" }}>

                <View style={{ flex: 1, justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 12, alignItems: "center" }}>

                    <View>
                        <Icon
                            size={30}
                            name='arrow-left'
                            type='feather'
                        />
                    </View>
                    <View>
                        <Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 18, lineHeight: 22 }}>{this.props.centerText}</Text>
                    </View>
                    <View>
                        {this.getRightIcon()}

                    </View>


                </View>

            </View>
        )
    }
}

export default Header;