/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SignIn from "./components/SignIn"
import WalkThrough from "./components/WalkThrough"
import ConfirmationSuccess from "./components/ConfirmationSuccess"
import SignUp from "./components/SignUp"
import TaxID from "./components/TaxID"
import TaxIDCont from "./components/TaxIDCont"
import Categories from "./components/Categories"
import UserProfile from "./components/UserProfile"

class App extends Component {
  render() {
    const Stack = createStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS
          }}
        >
          <Stack.Screen name="Categories" component={Categories} />
          {/* <Stack.Screen name="SignIn" component={SignIn} /> */}
          {/* <Stack.Screen name="SignUp" component={SignUp} /> */}
          {/* <Stack.Screen name="TaxID" component={TaxID} /> */}
          {/* <Stack.Screen name="TaxIDCont" component={TaxIDCont} /> */}
          {/* <Stack.Screen name="WalkThrough" component={WalkThrough} /> */}
          {/* <Stack.Screen name="ConformationSuccess" component={ConfirmationSuccess} /> */}
          {/* <Stack.Screen name="UserProfile" component={UserProfile} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
