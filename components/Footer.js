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

    // TODO: Change Icons Correspondingly
    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.subContainer}>

                    <TouchableOpacity style={styles.iconButton} onPress={() => { this.setState({ selected: "Home" }) }}>
                        {this.state.selected == "Home" ? 
                        <Icon
                            size={35}
                            name='arrow-left'
                            type='feather'
                            color="#2967ff"
                        />
                        :
                        <Icon
                            size={35}
                            name='arrow-left'
                            type='feather'
                        />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => { this.setState({ selected: "Shop" }) }}>
                    {this.state.selected == "Shop" ? 
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
                        />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} onPress={() => { this.setState({ selected: "Van" }) }}>
                    {this.state.selected == "Van" ? 
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
                        />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => { this.setState({ selected: "Person" }) }}>
                    {this.state.selected == "Person" ? 
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
                        />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => { this.setState({ selected: "Info" }) }}>
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
                        />}
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}
styles = StyleSheet.create({
    mainContainer: {
        position: "absolute",
        bottom: 0,
        height: 50,
        width: "100%",
        marginBottom: 10
    },
    subContainer: {
        flex: 1,
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center"
    },
    iconButton: {
        paddingHorizontal: 8
    }


})

export default Footer;