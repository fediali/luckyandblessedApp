import React, {PureComponent} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import {round} from 'react-native-reanimated';

class ProfileText extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  editButtonPressed(){
    this.setState({isEdit: true})
  }

  checkButtonPressed(){
    this.setState({isEdit: false})
    var key = this.props.stateKey; //fullName
    this.props.customSetState({[key]:this.state[key]})  //fullName: "Updated Text"
  }

  customSetState(stateVal){
    // console.log("I am called",stateVal)
    this.props.customSetState(stateVal)
}

  textChanged(text){
    var key = this.props.stateKey;
    this.setState({[key]: text})
  }

  render() {
    let Height = Dimensions.get('window').height;
    let Width = Dimensions.get('window').width;
    return (
      <View>
        {/*If contains right arrow then it shouldn't be editable
        but it should either be navigated or accordian*/}
        {this.props.containIcon ? (
          <TouchableOpacity style={styles.userDetails} onPress={()=>{
            if(this.props.keyText=="TAX ID"){
              this.props.navigation.navigate("TaxID")
            }
            else if(this.props.keyText=="Referral Link"){
              this.props.navigation.navigate("TaxID")
            }
            else if(this.props.keyText=="My orders"){
              this.props.navigation.navigate("TrackOrders")
            }

            else if(this.props.keyText=="Payment"){
              this.props.navigation.navigate("Payment")
            }
          }}>
            <View style={{paddingVertical: 19}}>
              <Text style={styles.keyText}>{this.props.keyText}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{paddingVertical: 18}}>
                <Text style={[styles.valueText] }>
                  {this.props.valueText}
                </Text>
              </View>
              <View
                style={{
                  marginVertical: 18,
                  marginRight: 6,
                  marginLeft: 19.5,
                }}>
                <Icon size={20} name="right" type="antdesign" />
              </View>
            </View>
          </TouchableOpacity>
        ) : ( 
          <View style={styles.userDetails}>
            {!this.state.isEdit ? (
              <View style={{paddingTop: 4}}>
                <Text style={styles.keyText}>{this.props.keyText}</Text>
                <Text
                  style={[styles.valueText, {marginTop: 4, width: Width * 0.76}]}
                  numberOfLines={1}>
                  {this.props.valueText}
                </Text>
              </View>
            ) : (
              <View style={{paddingTop: 4}}>
                <TextInput
                  name = {this.props.keyText}
                  style={[styles.valueText, {width: Width * 0.76, borderRadius: 6}]}
                  multiline={true}
                  numberOfLines={4}
                  defaultValue={this.props.valueText}
                  onChangeText={text => this.textChanged(text)}
                />
              </View>
            )}

            <View style={{flexDirection: 'row'}}>
              <View style={{paddingVertical: 18}}></View>
              {!this.state.isEdit ? (
              <TouchableOpacity
                 onPress={() => { this.editButtonPressed() }}
                  style={{
                  paddingVertical: 18,
                  paddingEnd: 6,
                  paddingStart: 20,
                }}>
                <Icon size={20} name="edit" type="feather" />
              </TouchableOpacity>
              ) : (
                <TouchableOpacity
                 onPress={() => { this.checkButtonPressed() }}
                style={{
                  paddingVertical: 18,
                  paddingEnd: 6,
                  paddingStart: 20,
                }}>
                <Icon size={20} name="checksquare" type="antdesign" />
              </TouchableOpacity>
              )
              }
            </View>
          </View>
        )}
      </View>
    );
  }
}

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
});

export default ProfileText;
