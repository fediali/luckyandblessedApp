import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
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

// import Ripple from 'react-native-material-ripple';


YellowBox.ignoreWarnings([
    'ReactNativeFiberHostComponent', // Useless Warning
    'Failed prop type'
])
class Filter extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: 1,
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
                    content: ["#0f0","#0ff"],
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
    //clear All click Handler
    rightIconClickHandler() {
        alert("hellow")
    }


    _renderSectionTitle = section => {
        return (
            <View style={styles.content}>
                <Text>{section.content}</Text>
            </View>
        );
    };


    _renderHeader = section => {
        console.log(section)
        let colors=[]

        if(section.title=="Color"){
            // console.log(section.content)
            for(let i=0;i<section.content.length;i++){
                console.log(section.content[i])
                colors.push(
                    <View key={i} style={{width:20,height:20,backgroundColor:section.content[i],borderRadius:10,marginRight:5}}></View>
                )
            }
        }
        console.log("<<",colors)
        
        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13 }}>
                <Text style={{ fontSize: 18, fontFamily: "Montserrat-SemiBold", lineHeight: 22,color:"#2d2d2f" }}>{section.title}</Text>
                {
                    !this.state.activeSections.includes(section.id) ?//Checking whether open or collapsed and showing right view based on that
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {
                                section.title != "Color" ?//Color has different View than others
                                    <Text style={{ paddingRight: 12,fontSize:18,fontFamily:"Avenir-Book",lineHeight:24,color:"#2d2d2f" }}>{section.content}</Text> :
                                    <View style={{marginRight: 12,flexDirection:"row" }}>
                                        {/* Circles of hex colour */}
                                        {colors}
                                    </View>
                            }
                            <Icon
                                size={22}
                                name='ios-arrow-forward'
                                type='ionicon'
                            />
                        </View>:
                        <View></View>//Empty view just for the sake of else condition
                }

            </View>
        );
    };

    _renderContent = section => {
        return (
            <View style={{ backgroundColor: "#fff", height: 50 }}>
                <Text>{section.content}</Text>
            </View>
        );
    };

    _updateSections = activeSections => {
        console.log(activeSections)
        this.setState({ activeSections });
    };
    render() {
        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height;
        let filterListItemsText = ["Most popular", "New items", "Price: High - Low", "Price: Low - High"]
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Header centerText="Filter" rightIcon="clear" rightIconClickHandler={this.rightIconClickHandler} />
                {/*add justifyContent: 'space-between' */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ padding: 20 }}>
                        {filterListItemsText.map((item, key) => (
                            this.state.selected == key ?
                                <TouchableOpacity key={key.toString()}
                                    style={[styles.listItem, { justifyContent: "space-between" }]}>
                                    <Text style={[styles.listItemText, { fontFamily: "Montserrat-SemiBold" }]}>{item}</Text>
                                    < Icon
                                        size={23}
                                        name='check'
                                        type='feather'
                                        color='#2967ff'
                                    />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity key={key.toString()} style={styles.listItem} onPressIn={() => { this.setState({ selected: key }) }}>
                                    <Text style={[styles.listItemText, { fontFamily: "Avenir-Book" }]}>{item}</Text>
                                </TouchableOpacity>

                        ))}
                    </View>
                    <View style={styles.divider}></View>
                    <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                        <Accordion
                            style={{ marginBottom: 0, paddingBottom: 0 }}
                            underlayColor="#fff"
                            sections={this.state.sections}
                            activeSections={this.state.activeSections}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                            onChange={this._updateSections}
                            // touchableComponent={(props) => <TouchableOpacity {...props} />}
                            expandMultiple={true}

                        />
                    </View>
                    <View style={{backgroundColor:"#f6f6f6",marginBottom:50,paddingTop:20,alignItems:"center",paddingBottom:20}}>
                        <TouchableOpacity style={{backgroundColor:"#2967ff",alignItems:"center",width:"90%",borderRadius:6}}>
                            <Text style={{color:"#fff",paddingVertical:11}}>
                                View All Items
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>

                <Footer />
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
})

export default Filter;