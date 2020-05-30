import React, { useState, PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text
} from 'react-native'
import Accordion from 'react-native-collapsible/Accordion';
import { Icon } from 'react-native-elements'
import ModalDropdown from 'react-native-modal-dropdown';
import ColorPicker from "../reusableComponents/ColorPicker"
import SizePicker from "../reusableComponents/SizePicker"
import MultiSlider from '@ptomasroos/react-native-multi-slider';

class AccordianReusable extends PureComponent {


    parentCallBackColor(colorListData) {
        this.customSetState({ colorList: colorListData })
    }

    //This function Receives the state from size component when item is changed 
    parentCallBackSize(sizeListData){
        this.customSetState({ sizeList: sizeListData })

    }
    customSetState(stateVal){
        this.props.customSetState(stateVal)
    }
    
    _renderHeader = section => {
        let colors = []

        if (section.title == "Color") {
            for (let i = 0; i < section.content.length; i++) {
                colors.push(
                    <View key={i} style={{ width: 20, height: 20, backgroundColor: section.content[i], borderRadius: 10, marginRight: 5 }}></View>
                )
            }
        }

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
        this.customSetState({ activeSections });
    };
    render() {
        return (

            <Accordion
                style={{ marginBottom: 0, paddingBottom: 0 }}
                underlayColor="#fff"
                sections={this.props.state.sections}
                activeSections={this.props.state.activeSections}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                onChange={this._updateSections}
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