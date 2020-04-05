import React, {
    Component
} from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    View,
    Text,
    Image
} from 'react-native';

import styles from './Styles/Style'
import Header from "./Header"
import {
    SafeAreaView
} from 'react-native-safe-area-context'

import Logosmall from './Styles/LogoSmall'
import LogoSmall from './Styles/LogoSmall';

class TaxID extends Component {
    render() {
        return (
            <ScrollView
                contentContainerStyle={{
                    backgroundColor: "#fff",
                    flexGrow: 1,
                    justifyContent: 'space-between',
                }}>
                <SafeAreaView style={styles.parentContainer}>
                <Header centerText={""} rightIcon= "info"/>
                    <View style={styles.subParentContainer}>
                        <LogoSmall/>
                        <Text style={[styles.customTextBold, { marginTop: 20 }]}>Use & Sale Tax Form</Text>
                        <View style={styles.inputView}>
                            <TextInput style={styles.input} placeholder="Name of purchaser, firm or agence" />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput style={styles.input} placeholder="Phone" />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput style={styles.input} placeholder="Address, City, State, ZIP code" />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput style={styles.input} placeholder="Texas sales & Use Tax Permit Num" />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput style={styles.input} placeholder="Out-of-state or Fedral Taxpay Num" />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput style={styles.input} placeholder="Mexico registration form" />
                        </View>

                        <Text style={[innerStyles.customText1]}>
                            I, the purchaser named above, claim the right to make a non-taxable purchase (for resale of the taxable items described below or on the attached order or invoice) from:
                        </Text>
                        <Text style={[innerStyles.customText1, {marginTop: 15}]}><Text style={[styles.customTextBold, { fontSize: 20 }]}>L&B</Text> - 12801 N STEMMONS FWY STE 710
FARMERS BRANCH, TX 75234</Text>

                    </View>
                </SafeAreaView>
            </ScrollView>
        )
    }
}

innerStyles = StyleSheet.create({
    customText1: {
        fontFamily: "Avenir",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: "#2d2d2f",
        paddingHorizontal: 30
    }
})

export default TaxID;