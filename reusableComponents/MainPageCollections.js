import React, { PureComponent } from 'react'
import { 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    ImageBackground,
    Dimensions
} from 'react-native'
import Globals from '../Globals';

export default class MainPageCollections extends PureComponent {

    navigateToProductPage=()=>{
        console.log("Helllllooooooo", this.props.cid)
        this.props.navigation.push("CategoriesProduct", { cid: this.props.cid, cname:this.props.text }) 
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.9} style={innerStyles.borderRadiusSix} onPress={this.navigateToProductPage}>
                <ImageBackground
                    style={innerStyles.collectionImages}
                    imageStyle={{ borderRadius: 6 }}
                    source={{ uri: (this.props.imageUrl)?this.props.imageUrl:Globals.noImageFoundURL }}
                    resizeMode = "stretch"
                >
                    <Text style={innerStyles.semiBoldText}>{this.props.text}</Text>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
    borderRadiusSix: {
        borderRadius: 6
    },
    collectionImages: {
        width: Width * 0.85,
        height: Height * 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        marginHorizontal: 10,
        borderRadius: 6
    },
    semiBoldText: {
        width: '60%',
        height: '50%',
        fontFamily: "Montserrat-Bold",
        fontSize: 36,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 44,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
    },
})


