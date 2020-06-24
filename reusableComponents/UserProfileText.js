import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import PutData from '../reusableComponents/API/PutData';
import Toast from 'react-native-simple-toast';
import Globals from '../Globals';
import RetrieveDataAsync from '../reusableComponents/AsyncStorage/RetrieveDataAsync'
import StoreDataAsync from "../reusableComponents/AsyncStorage/StoreDataAsync"
const baseUrl = Globals.baseUrl;
const STORAGE_USER = Globals.STORAGE_USER

class ProfileText extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  editButtonPressed = () => {
    var key = this.props.stateKey; //fullName
    this.setState({ isEdit: true, [key]: this.props.valueText })
  }

  checkButtonPressed = () => {  
    this.setState({ isEdit: false })
    var key = this.props.stateKey; //fullName
    let data;
    //no need for email
    RetrieveDataAsync(STORAGE_USER).then(user => {
    if (key == "fullName") {
      StoreDataAsync(STORAGE_USER,{...JSON.parse(user),name:this.state[key]})
      if (this.state[key].split(' ').length > 1) {
        let fname = this.state[key].split(' ').slice(0, -1).join(' '); // returns "Paul Steve"
        let lname = this.state[key].split(' ').slice(-1).join(' ');
        data = {
          firstname: fname,
          lastname: lname
        }
      } else {
        data = {
          firstname: this.state[key],
          lastname: ""
        }
      }
    }else if (key == "email"){
      data={
        email:this.state[key]
      }
    }
    this.props.customSetState({ [key]: this.state[key] })  //fullName: "Updated Text"

    
      PutData(
        baseUrl + `api/usersnew/${JSON.parse(user).user_id}`,
        data,
      ).then((res) => res.json()).then((result) => {
        if (result.message=="User updated successfully") {
        }
        else {
          Toast.show('Failed to update');
        }
      }).catch((ex) => {
        console.log('Inner Promise', ex);
        Toast.show(ex.toString())
      });
    })
  }

  navigateScreen = () => {
    if (this.props.keyText == "TAX ID") {
      this.props.navigation.navigate("TaxID")
    }
    else if (this.props.keyText == "Address") {
      this.props.navigation.navigate("Delivery", {fromUserProfile: true})
    }
    else if (this.props.keyText == "My orders") {
      this.props.navigation.navigate("TrackOrders")
    }

    else if (this.props.keyText == "Payment") {
      this.props.navigation.navigate("Payment")
    }
  }

  customSetState(stateVal) {
    this.props.customSetState(stateVal)
  }

  textChanged(text) {
    var key = this.props.stateKey;
    this.setState({ [key]: text })
  }

  render() {

    return (
      <View>
        {/*If contains right arrow then it shouldn't be editable
        but it should either be navigated or accordian*/}
        {this.props.containIcon ? (
          <TouchableOpacity style={styles.userDetails} onPress={this.navigateScreen}>
            <View style={styles.pad19}>
              <Text style={styles.keyText}>{this.props.keyText}</Text>
            </View>
            <View style={styles.flexRow}>
              <View style={styles.pad18}>
                <Text style={[styles.valueText]}>
                  {this.props.valueText}
                </Text>
              </View>
              <View
                style={styles.iconView}>
                <Icon size={20} name="right" type="antdesign" />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
            <View style={styles.userDetails}>
              {!this.state.isEdit ? (
                <View style={styles.pad4}>
                  <Text style={styles.keyText}>{this.props.keyText}</Text>
                  <Text
                    style={[styles.valueText, styles.textView]}
                    numberOfLines={1}>
                    {this.props.valueText}
                  </Text>
                </View>
              ) : (
                  <View style={styles.pad4}>
                    <TextInput
                      style={[styles.valueText, styles.textInput]}
                      multiline={true}
                      numberOfLines={4}
                      returnKeyType="done" //FIXME: Check why done is not apperating on keyboard
                      defaultValue={this.props.valueText}
                      onChangeText={text => this.textChanged(text)}
                      onEndEditing={this.checkButtonPressed}
                    />
                  </View>
                )}

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.pad18}></View>
                {!this.state.isEdit ? (
                  <TouchableOpacity
                    onPress={this.editButtonPressed}
                    style={styles.iconView}>
                    <Icon size={20} name="edit" type="feather" />
                  </TouchableOpacity>
                ) : (
                    <View style={styles.iconView}></View>
                  )
                }
              </View>
            </View>
          )}
      </View>
    );
  }
}

let Height = Dimensions.get('window').height;
let Width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  keyText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    lineHeight: 22,
    color: '#2d2d2f',
  },
  valueText: {
    fontFamily: 'Avenir-Book',
    fontSize: 18,
    lineHeight: 24,
    color: '#2d2d2f',
  },
  pad19: { paddingVertical: 19 },
  pad18: { paddingVertical: 18 },
  flexRow: { flexDirection: 'row' },
  iconView: {
    marginVertical: 18,
    marginRight: 6,
    marginLeft: 19.5,
  },
  pad4: { paddingTop: 4 },
  textView: { marginTop: 4, width: Width * 0.76 },
  textInput: { width: Width * 0.76, borderRadius: 6 },
});

export default ProfileText;
