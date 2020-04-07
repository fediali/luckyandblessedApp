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
    

    render() {
        return (
            <View style={{
                backgroundColor:"#fff",
                position: "absolute",
                bottom: 0,
                height: 50,
                width: "100%",
                paddingBottom: 10
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
                    <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => { this.setState({ selected: "Shop" }) }}>
                        {this.state.selected == "Shop" ?
                            <Image style={{width:30,height:30}} source={require('../static/cartSelected.png')}></Image>
                            :
                            <Image style={{width:30,height:30}} source={require('../static/cart.png')}></Image>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => { this.setState({ selected: "Van" }) }}>
                        {this.state.selected == "Van" ?
                            <Icon
                                size={35}
                                name='truck'
                                type='material-community' //TODO: Find the truck icon
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