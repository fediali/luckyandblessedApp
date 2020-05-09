import React, { useState, PureComponent, Component } from 'react';
import {
    FlatList,
    StyleSheet,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    Text
} from 'react-native'


class SizePicker extends PureComponent {

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
                isChange: false,
                sizeList: [
                    { id: 0, size: '5', isCheck: false },
                    { id: 1, size: '5.5', isCheck: false },
                    { id: 2, size: '6', isCheck: false },
                    { id: 3, size: '6.5', isCheck: false },
                    { id: 4, size: '7', isCheck: false },
                    { id: 5, size: '7.5', isCheck: false },
                    { id: 6, size: '8', isCheck: false },
                    { id: 7, size: '8.5', isCheck: false },
                    { id: 8, size: '9', isCheck: false },
                    { id: 9, size: '9.5', isCheck: false },
                    { id: 10, size: '10', isCheck: false },
                    { id: 11, size: '10.5', isCheck: false },
                    { id: 12, size: '11', isCheck: false },
                ]
            }
        } else {
            this.state = {
                isChange: false,
                sizeList: this.props.sizePickerList
            }
        }
        // console.log("Called");

    }



    onSizeSelect = (item) => {

        let arr = [...this.state.sizeList]
        arr = arr.map((val) => {
            if (val.id == item.id) {
                return { "size": val.size, "id": val.id, "isCheck": !val.isCheck }
            }
            else {
                return { "size": val.size, "id": val.id, "isCheck": val.isCheck }
            }

        })
        this.setState({
            sizeList: arr,
        })
    }

    renderItemSize = (item) => {
        return (
            <TouchableOpacity
                activeOpacity={0.99}
                key={item.id.toString()}

                onPressIn={() => this.onSizeSelect(item)}
            >
                <SizePickerItem item={item} />
            </TouchableOpacity>
        )
    }
    render() {
        //TODO: this I want to call only once, but it is getting called on every click
        return (
            <View style={innerStyles.mainView}>
                {this.state.sizeList.map(this.renderItemSize)}

            </View>
        )
    }
}

class SizePickerItem extends Component {
    shouldComponentUpdate(nextProps, nextState) {

        if (nextProps.item.isCheck != this.props.item.isCheck)
            return true;
        return false
    }
    render() {
        console.log(this.props.item)
        return (
            this.props.item.isCheck ?
                <View style={[innerStyles.colorView, innerStyles.backgroundColorCheck]}>
                    <View style={innerStyles.textView}>
                        <Text style={innerStyles.text1}>{this.props.item.size}</Text>
                    </View>
                </View>
                :
                <View style={[innerStyles.colorView, innerStyles.backgroundColorUnheck]}>
                    <View style={innerStyles.textView}>
                        <Text style={innerStyles.text2}>{this.props.item.size}</Text>
                    </View>
                </View>


        )
    }
}
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
    mainView: {
        paddingVertical: 10,
        flexDirection: "row",
        flexWrap: "wrap",
    },
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
    backgroundColorCheck: { backgroundColor: "#3c3c3e" },
    textView: { alignItems: "center", justifyContent: "center" },
    text1: { fontSize: 16, fontFamily: "Montserrat-SemiBold", color: "#fff" },
    text2: { fontSize: 16, fontFamily: "Montserrat", color: "#000" },
    backgroundColorUnheck: { backgroundColor: "#f6f6f6" },

})

export default SizePicker;