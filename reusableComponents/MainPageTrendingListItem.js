import React, { PureComponent } from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    View
} from 'react-native'
import {Image as FastImage} from 'react-native';
const TRENDING_NAME = "Trending"

export default class MainPageTrendingListItem extends PureComponent {

    navigateToProductPage=(product_id)=>()=>{
        console.log("MainPage",product_id);
        this.props.navigation.push("ProductPage", { pid: product_id, cname:[TRENDING_NAME] }) 
    }

    render() {
    
        return (
            <View style={innerStyles.mainItemView}>

                {this.props.listItem.map((val,num) => (
                    <TouchableOpacity key={num.toString()} activeOpacity={0.9} style={innerStyles.trendingView}
                        onPress={this.navigateToProductPage(val.product_id)}
                    >
                        <View style={innerStyles.innerTrendingView}>
                            <FastImage
                                style={innerStyles.trendingImage}
                                source={{ uri: val.main_pair.detailed.image_path }}
                                // resizeMode='contain'
                            />
                            <View style={innerStyles.innerInnerTrendingView}>
                                <Text style={innerStyles.gridItemNameAndPriceText}>{val.product}</Text>
                                <Text style={[innerStyles.showAllText, innerStyles.brandText]}>L&B</Text>
                            </View>
                        </View>
                        <View style={innerStyles.trendingViewPriceView}>
                            <Text style={innerStyles.trendingPriceText}>${parseFloat(val.price).toFixed(2)}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }
}

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const innerStyles = StyleSheet.create({
    mainItemView: {
        alignItems: 'center',
    },
    trendingView: {
        width: Width * 0.88,
        height: Height * 0.10,
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginEnd: 15,
        alignItems: 'center',
    },
    trendingImage: {
        width: '25%',
        height: '100%',
        borderRadius: 6,
    },
    trendingPriceText: {
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff",
    },
    innerInnerTrendingView: {
        height: '100%',
        flexDirection: 'column',
        marginStart: 10,
        justifyContent: 'center'
    },
    trendingViewPriceView: {
        width: '30%',
        height: '50%',
        borderRadius: 6,
        backgroundColor: "#9775fa",
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerTrendingView: {
        width: '70%',
        height: '80%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginStart: 10
    },
    gridItemNameAndPriceText: {
        fontFamily: "Montserrat-Medium",
        fontSize: 16,
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: "left",
        color: '#2d2d2f',
        width: Width * 0.427
    },
    showAllText: {
        fontFamily: "Avenir-Book",
        fontSize: 18,
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 0,
        textAlign: "right",
        color: '#2967ff'
    },
    brandText: {
        fontSize: 14,
        lineHeight: 18,
        textAlign: "left",
        marginTop: 5
    },
})


