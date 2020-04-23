import React, { PureComponent } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native';
import { Icon } from 'react-native-elements'

class Footer extends PureComponent {
    /* How to use Custom footer
    
    Name of options corresponding to Icons:
    Home, Shop, Van, Person, Info

    Just Include Footer No Props Needed
    
    */
    constructor(props) {
        super(props)
        if (this.props.selected != null) {
            this.state={
                selected: this.props.selected
            }
        } else {
            this.state = {
                selected: "Home"
            }
        }
    }

    navigateToScreen=(screenName)=>{
        this.props.navigation.navigate(screenName)
    }
    

    render() {
        return (
            <View style={innerStyles.mainViewStyle}>
                <View style={innerStyles.subViewStyle}>

                    <TouchableOpacity style={innerStyles.touchPad} onPress={() => {this.navigateToScreen("MainPage")}}>
                        {this.state.selected == "Home" ?
                            <Icon
                                size={32}
                                name='home'
                                type='entypo'
                                color="#2967ff"
                            />
                            :
                            <Icon
                                size={32}
                                name='home'
                                type='entypo'
                                color="#d0d0d0"
                            />}
                    </TouchableOpacity>
                    <TouchableOpacity style={innerStyles.touchPad} onPress={() => {this.navigateToScreen("ShoppingCart") }}>
                        {this.state.selected == "Shop" ?
                            <Image style={innerStyles.imageStyle} source={require('../static/cartSelected.png')}></Image>
                            :
                            <Image style={innerStyles.imageStyle} source={require('../static/cart.png')}></Image>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity style={innerStyles.touchPad} onPress={() => {this.navigateToScreen("TrackOrders")}}>
                        {this.state.selected == "Van" ?
                            <Icon
                                size={35}
                                name='truck'
                                type='material-community' 
                                color="#2967ff"
                            />
                            :
                            <Icon
                                size={35}
                                name='truck'
                                type='material-community'
                                color="#d0d0d0"
                            />}
                    </TouchableOpacity>
                    <TouchableOpacity style={innerStyles.touchPad} onPress={() => {this.navigateToScreen("UserProfile") }}>
                        {this.state.selected == "Person" ?
                            <Icon
                                size={35}
                                name='ios-person'
                                type='ionicon'
                                color="#2967ff"
                            />
                            :
                            <Icon
                                size={35}
                                name='ios-person'
                                type='ionicon'
                                color="#d0d0d0"
                            />}
                    </TouchableOpacity>
                    <TouchableOpacity style={innerStyles.touchPad} onPress={() => {this.navigateToScreen("CompanyProfile") }}>
                        {this.state.selected == "Info" ?
                            <Icon
                                size={35}
                                name='md-information-circle-outline'
                                type='ionicon'
                                color="#2967ff"
                            />
                            :
                            <Icon
                                size={35}
                                name='md-information-circle-outline'
                                type='ionicon'
                                color="#d0d0d0"
                            />}
                    </TouchableOpacity>
                </View>

            </View >
        )
    }
}

const innerStyles = StyleSheet.create({
    mainViewStyle:{
        backgroundColor:"#fff",
        position: "absolute",
        bottom: 0,
        height: 50,
        width: "100%",
        marginBottom: (Platform.OS === 'ios') ? 25:0 
    },
    subViewStyle:{
        flex: 1,
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center"
    },
    touchPad:{
        paddingHorizontal: 8 
    },
    imageStyle:{
        width:30,height:30
    }

})

export default Footer;