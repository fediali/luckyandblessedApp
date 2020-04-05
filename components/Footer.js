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

class Footer extends PureComponent {
    /* How to use Custom footer
    
    Name of options corresponding to Icons:
    Home, Shop, Van, Person, Info

    Just Include Footer No Props Needed
    
    */
    constructor(props) {
        super(props)
        this.state = {
            selected: "Home"
        }
    }

    render() {
        return (
            <View style={{
                position: "absolute",
                bottom: 0,
                height: 50,
                width: "100%",
                marginBottom: 10
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: "space-around",
                    flexDirection: "row",
                    alignItems: "center"
                }}>

                    <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => { this.setState({ selected: "Home" }) }}>
                        {this.state.selected == "Home" ?
                            <Icon
                                size={35}
                                name='home'
                                type='entypo'
                                color="#2967ff"
                            />
                            :
                            <Icon
                                size={35}
                                name='home'
                                type='entypo'
                                color="#d0d0d0"
                            />}
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => { this.setState({ selected: "Shop" }) }}>
                        {this.state.selected == "Shop" ?
                            <Icon
                                size={35}
                                name='shoppingcart'
                                type='antdesign'
                                color="#2967ff"
                            />
                            :
                            <Icon
                                size={35}
                                name='shoppingcart'
                                type='antdesign'
                                color="#d0d0d0"
                            />}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => { this.setState({ selected: "Van" }) }}>
                        {this.state.selected == "Van" ?
                            <Icon
                                size={35}
                                name='ios-person'
                                type='ionicon' //TODO: Find the truck icon
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
                    <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => { this.setState({ selected: "Person" }) }}>
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
                    <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => { this.setState({ selected: "Info" }) }}>
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


export default Footer;