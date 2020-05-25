import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    SafeAreaView,
    YellowBox,

} from 'react-native';
import { Icon } from 'react-native-elements'
import Header from "../reusableComponents/Header"
import Footer from "../reusableComponents/Footer"
import Accordion from 'react-native-collapsible/Accordion';
import ColorPicker from "../reusableComponents/ColorPicker"
import SizePicker from "../reusableComponents/SizePicker"
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import ModalDropdown from 'react-native-modal-dropdown';
import GetData from '../reusableComponents/API/GetData';
import Globals from "../Globals"
YellowBox.ignoreWarnings([
    'ReactNativeFiberHostComponent', // Useless Warning
    'Failed prop type', // Useless Warning
    'componentWillReceiveProps'
])


//TODO: ClearAll
class Filter extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: 1,//0,1,2,3 corresponds to Most Popular, New Items, Price H-L , Price L-H
            multislideVal: [0, 1000],
            sections: [
                {
                    id: 0,
                    title: 'Gender',
                    content: 'ALL',
                },
                {
                    id: 1,
                    title: 'Category',
                    content: 'Jackets',
                },
                {
                    id: 2,
                    title: 'Brand',
                    content: 'Addidas,Puma,Reebok',
                },
                {
                    id: 3,
                    title: 'Size',
                    content: 'M,L',
                },
                {
                    id: 4,
                    title: 'Color',
                    content: ["#0f0", "#0ff"],
                },
                {
                    id: 5,
                    title: 'Price',
                    content: '$0 - $999',
                },

            ],
            activeSections: [],
        }
    }

    callFilterAPI=()=>{
        let url = '';
        if(this.state.selected==2){
            url+="&sort_by=price&sort_order=desc"
        }
        else if(this.state.selected==3){
            url+="&sort_by=price&sort_order=asc"
        }
        if(this.state.multislideVal[0]!=0 || this.state.multislideVal[1]!=1000){
            url+=`&price_from=${this.state.multislideVal[0]}&price_to=${this.state.multislideVal[1]}`
        }
        this.props.navigation.navigate('CategoriesProduct', {url});
        
    }

    //This function Receives the state from colour component when item is changed 
    parentCallBackColor=(colorListData)=> {
        this.setState({ colorList: colorListData })
    }

    //This function Receives the state from size component when item is changed 
    parentCallBackSize=(sizeListData)=> {
        this.setState({ sizeList: sizeListData })

    }
    //clear All click Handler
    rightIconClickHandler=()=> {
        alert("test")
    }

    onItemClick=(key)=>()=>{
        this.setState({ selected: key })
    }

    multiSliderValueHandler=(values)=>{
        this.setState({ multislideVal: values })
    }

    handleViewAll=()=>{
          // To retrive value of colour and size not implement yet
        //   this.child.method()
       
        this.callFilterAPI()
     
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
                    !this.state.activeSections.includes(section.id) ?//Checking whether open or collapsed and showing right view based on that
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
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon
                                size={22}
                                name='ios-arrow-down'
                                type='ionicon'
                            />
                        </View>//Empty view just for the sake of else condition
                }

            </View>
        );
    };

    _renderContent = section => {
        let Width = Dimensions.get("window").width
        if (section.title == "Gender" || section.title == "Category") {
            return (
                <View style={{ marginVertical: 15 }}>
                    <ModalDropdown options={section.title=="Gender"?["Male", 'Female', "All"]:["Sneakers", 'Jacket', "All"]}
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
                <ColorPicker  onRef={ref => (this.child = ref)} callbackFunction={this.parentCallBackColor} />
            )
        }
        else if (section.title == "Price") {
            return (
                <View style={{ alignItems: "center", marginTop: 10 }}>

                    <MultiSlider
                        values={[this.state.multislideVal[0], this.state.multislideVal[1]]}
                        onValuesChangeFinish={this.multiSliderValueHandler}
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
                <SizePicker  onRef={ref => (this.child = ref)}  callbackFunction={this.parentCallBackSize}  />
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
        this.setState({ activeSections });
    };
    render() {
        let filterListItemsText = ["Most popular", "New items", "Price: High - Low", "Price: Low - High"]
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Header navigation={this.props.navigation} centerText="Filter" rightIcon="clear" rightIconClickHandler={this.rightIconClickHandler} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grownFlex}>
                    <View style={styles.twentyPad}>
                        {filterListItemsText.map((item, key) => (
                            this.state.selected == key ?
                                <TouchableOpacity key={key.toString()}
                                    style={[styles.listItem, styles.spaceBetweenContent]}>
                                    <Text style={[styles.listItemText, styles.msbText]}>{item}</Text>
                                    < Icon
                                        size={23}
                                        name='check'
                                        type='feather'
                                        color='#2967ff'
                                    />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity key={key.toString()} style={styles.listItem} onPressIn={this.onItemClick(key) }>
                                    <Text style={[styles.listItemText, styles.abText]}>{item}</Text>
                                </TouchableOpacity>

                        ))}
                    </View>
                    <View style={styles.divider}></View>
                    <View style={styles.verticalAndHorizontalPad}>
                        <Accordion
                            style={{ marginBottom: 0, paddingBottom: 0 }}
                            underlayColor="#fff"
                            sections={this.state.sections}
                            activeSections={this.state.activeSections}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                            onChange={this._updateSections}
                            expandMultiple={true}

                        />
                    </View>
                    <View style={styles.allItemsView}>
                        <TouchableOpacity style={styles.allItemsTouch} onPress={this.handleViewAll}>
                            <Text style={styles.allItemsText}>
                                View All Items
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>

                <Footer navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}
let Width = Dimensions.get('window').width;
let Height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    subContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },
    listItemText: {
        fontSize: 18,
        lineHeight: 24,
        color: "#2d2d2f",
    },
    divider: {
        height: 10,
        width: Width,
        backgroundColor: '#f6f6f6',
    },
    text: {
        alignSelf: 'center',
        paddingVertical: 20,
    },
    twentyPad: {padding: 20},
    grownFlex: {flexGrow: 1},
    verticalAndHorizontalPad:{ paddingHorizontal: 20, paddingVertical: 10 },
    spaceBetweenContent: {justifyContent: 'space-between'},
    msbText:{ fontFamily: "Montserrat-SemiBold" },
    abText: { fontFamily: "Avenir-Book" },
    allItemsView: { backgroundColor: "#f6f6f6", marginBottom: 50, paddingTop: 20, alignItems: "center", paddingBottom: 20 },
    allItemsTouch: { backgroundColor: "#2967ff", alignItems: "center", width: "90%", borderRadius: 6 },
    allItemsText: { color: "#fff", paddingVertical: 11, fontSize: 18, lineHeight: 22, fontFamily: "Montserrat-SemiBold" }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});


export default Filter;