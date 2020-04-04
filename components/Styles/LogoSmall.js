import React,  {PureComponent}from 'react'; 
import {
    View, 
    Image, 
}from 'react-native'; 

class LogoSmall extends PureComponent {
    render() {
        return ( < View >  < Image style =  { {
            width:'20%', 
            height:'15%', 
                        }}resizeMode = "contain"source =  {require("../../static/logo-signIn.png")}/>  </View > 
        )
    }
}

export default LogoSmall; 