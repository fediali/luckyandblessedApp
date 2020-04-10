import React, { useState, PureComponent } from 'react';
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
    
    setupState(){
        if(this.props.colorPickerList == null){
            this.state = {
                isChange: false,
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
        }else{
            this.state = {
                isChange: false,
                colorList: this.props.colorPickerList
            }
        }
        console.log("Called");

    }
    


    onColorSelect = (item) => {
        this.setState({ 
            isChange: !this.state.isChange
        })
        console.log(this.state.isChange);
        this.state.colorList[item.id].isCheck = !this.state.colorList[item.id].isCheck
        this.props.callbackFunction(this.state.colorList)
    }
    

    render() {
        //TODO: this I want to call only once, but it is getting called on every click
        return (
            <View style={{ paddingBottom: 10}}>
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={this.state.colorList}
                    numColumns={5}
                    columnWrapperStyle={innerStyles.multiRowStyling}
                    extraData={this.state.isChange}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={()=> this.onColorSelect(item)}
                        >
                            <View style={[innerStyles.colorView, { backgroundColor: item.color }]}>
                                {item.isCheck ?
                                    <Image
                                        style={{
                                            width: '31%',
                                            height: '31%',
                                        }}
                                        resizeMode="contain" source={require("../static/icon_select.png")}

                                    /> : <View></View>
                                }
                            </View>
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
        marginHorizontal:Width*0.014,

    },
    multiRowStyling: {
        marginTop: 15,
    }
})

export default ColorPicker;