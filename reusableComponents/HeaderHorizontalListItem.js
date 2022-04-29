import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements'


class HeaderHorizontalListItem extends Component {
    state = {
        cid: -1
    }
    onCategorySelect = () => {
        this.props.onCategorySelect(this.props.item.category_id, this.props.item.category); 
    }
    render() {
        const { item,cid,index } = this.props;
        return (
            <View style={styles.TopLevelView}>
                {cid == item.category_id || cid==index-1?
                    < TouchableOpacity onPress={
                        this.onCategorySelect
                    }>
                        <Text style={[styles.buttonText,styles.selected ]}>{item.category}</Text>
                    </TouchableOpacity>
                    :
                    < TouchableOpacity onPress={this.onCategorySelect}>
                        <Text style={[styles.buttonText]}>{item.category}</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}
styles = StyleSheet.create(
    {
        buttonText: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 18,
            fontStyle: 'normal',
            lineHeight: 22,
            letterSpacing: 0,
            textAlign: 'center',
            marginHorizontal: 10,
        },
        selected:{
            color: "#1bbfc7"
        },
        TopLevelView: { marginVertical: 10, color: "#000" }
    }
)
export default HeaderHorizontalListItem;