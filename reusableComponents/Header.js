import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Share
} from 'react-native';
import { Icon } from 'react-native-elements'

//TODO: Fix the centerText position in case there is no right icon --- Check i have done some tweaks it would be fixed
/* How to use Custom Header

Props:
centerText: "provide the text to show in center"
rightIcon: "search" provide icon name ,supported icon names { info,search,share,edit } and "clear" Clear all text


*/
class Header extends PureComponent {
    lockSubmit = false

    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Check amazing products at LUCKY & BLESSED',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
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
            return (
                <TouchableOpacity onPress={() => { this.props.navigation.navigate("SearchResults") }}>
                    < Icon
                        size={30}
                        name='ios-search'
                        type='ionicon'
                        color='#000'
                    />
                </TouchableOpacity>
            )
        }
        else if (this.props.rightIcon == "share") {
            return (
                <TouchableOpacity onPress={this.onShare}>
                    < Icon
                        size={26}
                        name='upload'
                        type='feather'
                        color='#000'
                    />
                </TouchableOpacity>
            )

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
                <Image style={{ height: 22, width: 20 }}
                    source={require("../static/Filter.png")}>

                </Image>
            )
        }
        else if (this.props.rightIcon == "clear") {
            return (
                <TouchableOpacity onPress={() => { this.props.rightIconClickHandler() }}>
                    <Text style={{ fontSize: 18, lineHeight: 24, color: "#2d2d2f", fontFamily: "Avenir-Medium" }}>
                        Clear All
                    </Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <View></View>
            )
        }
    }
    render() {
        return (
            <View style={{ height: 50, flexDirection: "row", alignItems: "center", backgroundColor: '#ffffff' }}>

                <View style={{ flex: 1, justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 12, alignItems: "center" }}>
                    {this.props.homePage ?
                        <View></View> :
                        <View>
                            <TouchableOpacity onPress={() => {
                                if (this.lockSubmit) return;
                                this.lockSubmit = true
                                this.props.navigation.goBack()
                            }
                            }>
                                <Icon
                                    size={30}
                                    name='arrow-left'
                                    type='feather'
                                />
                            </TouchableOpacity>

                        </View>
                    }

                    {this.props.homePage ?
                        <View >
                            <Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 18, lineHeight: 22 }}>{this.props.centerText}</Text>
                            <Text style={styles.homePersonText}>{this.props.person}</Text>
                        </View>
                        :
                        <View>
                            <Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 18, lineHeight: 22 }}>{this.props.centerText}</Text>
                        </View>}
                    <View>
                        {this.getRightIcon()}

                    </View>


                </View>

            </View>
        )
    }
}
const styles=StyleSheet.create({
    homePersonText:{
        fontSize:14,
        lineHeight:18,
        color:"#8d8d8e",
        fontFamily:"Avenir-Book"
    }
})
export default Header;