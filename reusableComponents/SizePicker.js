import React, { useState, PureComponent } from 'react';
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



    onSizeSelect = (item) => { //Inline function here
        this.setState({
            isChange: !this.state.isChange
        })
        // console.log(this.state.isChange);
        this.state.sizeList[item.id].isCheck = !this.state.sizeList[item.id].isCheck
        this.props.callbackFunction(this.state.sizeList)
    }


    render() {
        //TODO: this I want to call only once, but it is getting called on every click
        return (
            <View style={{ paddingBottom: 10 }}>
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={this.state.sizeList}
                    numColumns={5}
                    columnWrapperStyle={innerStyles.multiRowStyling}
                    extraData={this.state.isChange}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => this.onSizeSelect(item)}
                        >
                            {item.isCheck ?
                                <View style={[innerStyles.colorView, styles.backgroundColorCheck]}>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>{item.size}</Text>
                                    </View>
                                </View>
                                :
                                <View style={[innerStyles.colorView, styles.backgroundColorUnheck]}>
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>{item.size}</Text>
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>
                    )}

                />
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
        marginHorizontal: Width * 0.014,

    },
    multiRowStyling: {
        marginTop: 15,
    },
    backgroundColorCheck: { backgroundColor: "#3c3c3e" },
    textView: { alignItems: "center", justifyContent: "center" },
    text: {fontSize:16,fontFamily:"Montserrat-SemiBold",color:"#fff"},
    backgroundColorUnheck: { backgroundColor: "#f6f6f6" },
    
})

export default SizePicker;