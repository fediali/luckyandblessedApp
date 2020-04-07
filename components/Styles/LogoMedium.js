import React, { PureComponent } from 'react';
import {
    View,
    Image,
    Dimensions
} from 'react-native';

class LogoMedium extends PureComponent {
    render() {
        let width=Dimensions.get('window').width;
        let height=Dimensions.get('window').height;
        return (
            <Image style={{
                width: width*0.2,
                height: height*0.15,
            }} resizeMode="contain" source={require("../../static/logo-signIn.png")} />  
        )
    }
}

export default LogoMedium; 