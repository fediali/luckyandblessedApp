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
rightIcon: "search" provide icon name ,supported icon names info,search,share,edit


*/
class Header extends PureComponent {
    render() {
        return (
            <View style={{ height: 50, flexDirection: "row", alignItems: "center" }}>

                <View style={{ flex: 1, justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 10, alignItems: "center" }}>

                    <View>
                        <Icon
                        size={30}
                        name='arrow-left'
                        type='feather'
                    />
                        {/* <Image 
                    source={require("../static/Arrow.png")}
                    />  */}

                    </View>
                    <View>
                        <Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 18, lineHeight: 22 }}>{this.props.centerText}</Text>
                    </View>
                    <View>
                        <Icon
                        size={30}
                        name='md-information-circle-outline'
                        type='ionicon'
                        color='#000'
                    />
                        {/* <Image 
                    source={require("../static/info.png")}
                    />  */}
                    </View>


                </View>

            </View>
        )
    }
}

export default Header;