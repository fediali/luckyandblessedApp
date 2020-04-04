import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Header } from 'react-native-elements';

class CustomHeader extends Component {
    render() {
        return (
            <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
            />
        )
    }
}

export default CustomHeader;