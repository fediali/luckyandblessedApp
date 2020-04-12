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
import Accordion from 'react-native-collapsible/Accordion';
import { Icon } from 'react-native-elements'
import ModalDropdown from 'react-native-modal-dropdown';
import ColorPicker from "../reusableComponents/ColorPicker"
import SizePicker from "../reusableComponents/SizePicker"
import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import console = require('console');

class AccordianReusable extends PureComponent {


    parentCallBackColor(colorListData) {
        // console.log(colorListData)
        // console.log(this.state)
        this.customSetState({ colorList: colorListData })
    }

    //This function Receives the state from size component when item is changed 
    parentCallBackSize(sizeListData){
        this.customSetState({ sizeList: sizeListData })

    }
    customSetState(stateVal){
        // console.log("I am called",stateVal)
        this.props.customSetState(stateVal)
    }
    
    _renderHeader = section => {
        // console.log(section)
        let colors = []

        if (section.title == "Color") {
            // console.log(section.content)
            for (let i = 0; i < section.content.length; i++) {
                // console.log(section.content[i])
                colors.push(
                    <View key={i} style={{ width: 20, height: 20, backgroundColor: section.content[i], borderRadius: 10, marginRight: 5 }}></View>
                )
            }
        }
        // console.log("<<", colors)

        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13 }}>
                <Text style={{ fontSize: 18, fontFamily: "Montserrat-SemiBold", lineHeight: 22, color: "#2d2d2f" }}>{section.title}</Text>
                {
                    !this.props.state.activeSections.includes(section.id) ?//Checking whether open or collapsed and showing right view based on that
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {
                                section.title != "Color" ?//Color has different View than others
                                    <Text style={{ paddingRight: 12, fontSize: 18, fontFamily: "Avenir-Book", lineHeight: 24, color: "#2d2d2f" }}>{section.content}</Text> :
                                    <View style={{ marginRight: 12, flexDirection: "row" }}>
                                        {/* Circles of hex colour */}
                                        {colors}
                                    </View>
                            }
                            <Icon
                                size={22}
                                name='ios-arrow-forward'
                                type='ionicon'
                            />
                        </View> :
                        <View></View>//Empty view just for the sake of else condition
                }

            </View>
        );
    };

    _renderContent = section => {
        let Width = Dimensions.get("window").width
        if (section.title == "Gender") {
            return (
                <View style={{ marginVertical: 15 }}>
                    <ModalDropdown options={["Male", 'Female', "All"]}
                        style={{ padding: 10, backgroundColor: "#f6f6f6", borderRadius: 6 }}
                        dropdownStyle={{ width: "80%", height: 134 }}
                        textStyle={{ fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f" }}
                        renderRow={(option, index, isSelected) => {
                            return (
                                <Text style={{ fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f", paddingHorizontal: 20, paddingVertical: 10 }}>{option}</Text>
                            )
                        }}
                    />

                    {/* <RNPickerSelect
                        useNativeAndroidPickerStyle={false}

                        placeholder={{
                            label: 'Select Gender',
                            value: 'Both',
                            color: "#C7C7CD"

                        }}
                        Icon={() => {
                            return < Icon
                                size={20}
                                name='ios-arrow-down'
                                type='ionicon'
                                color='#2d2d2f'
                            />;
                        }}
                        style={{
                            headlessAndroidPicker: {},
                            inputAndroid: { borderRadius: 10, alignItems: "center", fontSize: 18, fontFamily: "Avenir-Book", paddingLeft: 15, color: "#2d2d2f", lineHeight: 24 },
                            iconContainer: {
                                top: 9,
                                right: 15,
                            },
                            inputIOS: {
                                backgroundColor: "#f6f6f6", borderRadius: 10, alignItems: "center", fontSize: 18, fontFamily: "Avenir-Book", paddingLeft: 15, color: "#2d2d2f", lineHeight: 24,
                            }
                        }}
                        onValueChange={(value) => console.log(value)}
                        items={[
                            { label: 'Women', value: 'Women' },
                            { label: 'Men', value: 'Men' },
                        ]}
                    /> */}
                </View>
            )
        }
        else if (section.title == "Category") {
            return (
                <View style={{ marginVertical: 15 }}>
                    <ModalDropdown options={["Sneakers", 'Jacket', "All"]}
                        style={{ padding: 10, backgroundColor: "#f6f6f6", borderRadius: 6 }}
                        dropdownStyle={{ width: "80%", height: 134 }}
                        textStyle={{ fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f" }}
                        renderRow={(option, index, isSelected) => {
                            return (
                                <Text style={{ fontFamily: "Avenir-Book", fontSize: 18, lineHeight: 24, color: "#2d2d2f", paddingHorizontal: 20, paddingVertical: 10 }}>{option}</Text>
                            )
                        }}
                    />
                    {/* <RNPickerSelect
                        placeholder={{
                        }}
                        Icon={() => {
                            return < Icon
                                size={26}
                                name='ios-arrow-down'
                                type='ionicon'
                                color='#2d2d2f'
                            />;
                        }}
                        useNativeAndroidPickerStyle={false}
                        style={{
                            inputAndroid: { backgroundColor: "#f6f6f6", borderRadius: 10, alignItems: "center", fontSize: 18, fontFamily: "Avenir-Book", paddingLeft: 15, color: "#2d2d2f", lineHeight: 24 },
                            iconContainer: {
                                top: 9,
                                right: 15,
                            },
                            inputIOS: {
                                inputAndroid: { backgroundColor: "#f6f6f6", borderRadius: 10, alignItems: "center", fontSize: 18, fontFamily: "Avenir-Book", paddingLeft: 15, color: "#2d2d2f", lineHeight: 24 },
                            }
                        }}
                        onValueChange={(value) => console.log(value)}
                        items={[
                            { label: 'Sneaker', value: 'Sneaker' },
                            { label: 'Jackets', value: 'Jackets' },
                        ]}
                    /> */}

                </View>

            )
        }
        else if (section.title == "Color") {
            return (
                <ColorPicker callbackFunction={(colorListData) => { this.parentCallBackColor(colorListData) }} />
            )
        }
        else if (section.title == "Price") {
            return (
                <View style={{ alignItems: "center", marginTop: 10 }}>

                    <MultiSlider
                        values={[this.props.state.multislideVal[0], this.props.state.multislideVal[1]]}
                        onValuesChange={(values => { this.customSetState({ multislideVal: values }) })}
                        min={0}
                        max={999}
                        step={10}
                        allowOverlap={false}
                        snapped
                        sliderLength={Width * 0.75}
                    />
                </View>
            )
        }
        else if (section.title == "Size") {
            return (
                <SizePicker callbackFunction={(sizeListData) => { this.parentCallBackSize(sizeListData) }}  />
            )
        }

        else {
            return (
                <View style={{ backgroundColor: "#fff", height: 50 }}>
                    <Text>{section.content}</Text>
                </View>
            )
        }
    };

    _updateSections = activeSections => {
        // console.log(activeSections)
        this.customSetState({ activeSections });
    };
    render() {
        console.log("ZZZZZZZZ",this.props.state)
        return (

            <Accordion
                style={{ marginBottom: 0, paddingBottom: 0 }}
                underlayColor="#fff"
                sections={this.props.state.sections}
                activeSections={this.props.state.activeSections}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                onChange={this._updateSections}
                // touchableComponent={(props) => <TouchableOpacity {...props} />}
                expandMultiple={true}

            />
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
    }
})

export default AccordianReusable;