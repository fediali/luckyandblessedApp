import React, { useState, PureComponent, Component } from 'react';
import {
    FlatList,
    StyleSheet,
    View,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native'


class ColorPicker extends PureComponent {

    //TODO: Find a better workaround to update this.state.isChange
    constructor(props) {
        super(props)
        this.setupState();
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }
    method() {
        alert('do stuff')
    }
    setupState() {
        if (this.props.colorPickerList == null) {
            this.state = {
                colorList: [
                    { id: 0, color: '#000000', isCheck: false },
                    { id: 1, color: '#85836a', isCheck: false },
                    { id: 2, color: '#b251ff', isCheck: false },
                    { id: 3, color: '#99836a', isCheck: false },
                    { id: 4, color: '#48322f', isCheck: false },
                    { id: 5, color: '#edaf23', isCheck: false },
                    { id: 6, color: '#896745', isCheck: false },
                    { id: 7, color: '#000000', isCheck: false },
                    { id: 8, color: '#64af12', isCheck: false },
                    { id: 9, color: '#346723', isCheck: false },
                    { id: 10, color: '#2323dd', isCheck: false },
                    { id: 11, color: '#85836a', isCheck: false },
                    { id: 12, color: '#b251ff', isCheck: false },
                    { id: 13, color: '#99836a', isCheck: false },
                ]
            }
        } else {
            this.state = {
                colorList: this.props.colorPickerList
            }
        }

    }



    onColorSelect = (item) => () => {

        let arr = [...this.state.colorList]
        arr = arr.map((val) => {
            if (val.id == item.id) {
                return { "color": val.color, "id": val.id, "isCheck": !val.isCheck }
            }
            else {
                return { "color": val.color, "id": val.id, "isCheck": val.isCheck }
            }

        })
        this.setState({
            colorList: arr,
        })
    }

    renderItemColour = (item) => {
        return (
            <TouchableOpacity
                activeOpacity={0.99}
                key={item.id.toString()}
                onPressIn={this.onColorSelect(item)}
            >
                <ColorPickerItem item={item} />
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={innerStyles.mainView}>
                {this.state.colorList.map(this.renderItemColour)}
            </View>
        )
    }
}

class ColorPickerItem extends Component {
    shouldComponentUpdate(nextProps, nextState) {

        if (nextProps.item.isCheck != this.props.item.isCheck)
            return true;
        return false
    }
    render() {
        return (

            <View style={[innerStyles.colorView, { backgroundColor: this.props.item.color }]}>
                {this.props.item.isCheck ?
                    <Image
                        style={innerStyles.image}
                        resizeMode="contain" source={require("../static/icon_select.png")}

                    /> : <View></View>
                }
            </View>
        )
    }
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
    colorView: {
        alignSelf: 'stretch',
        alignContent: 'flex-start',
        width: Width * 0.15,
        height: Height * 0.065,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 7,
        marginHorizontal: 5
    },
    multiRowStyling: {
        marginTop: 15,
    },
    mainView: {
        paddingVertical: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        // justifyContent:"space-around"
    },
    image: {
        width: '31%',
        height: '31%',
    }
})

export default ColorPicker;