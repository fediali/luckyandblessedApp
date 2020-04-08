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
import Categories from "./components/Categories"
import UserProfile from "./components/UserProfile"
import Payment from "./components/Payment"
import Delivery from "./components/Delivery"
import CompanyProfile from "./components/CompanyProfile"
import CategoriesProduct from "./components/CategoriesProduct"
import ShoppingCart from "./components/ShoppingCart"
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
          {/* <Stack.Screen name="CategoriesProduct" component={CategoriesProduct} /> */}
          <Stack.Screen name="Payment" component={Payment} />
          {/* <Stack.Screen name="Categories" component={Categories} /> */}
          {/* <Stack.Screen name="SignIn" component={SignIn} /> */}
          {/* <Stack.Screen name="SignUp" component={SignUp} /> */}
          {/* <Stack.Screen name="TaxID" component={TaxID} /> */}
          {/* <Stack.Screen name="WalkThrough" component={WalkThrough} /> */}
          {/* <Stack.Screen name="Delivery" component={Delivery} /> */}
          <Stack.Screen name="ShoppingCart" component={ShoppingCart} />
          {/* <Stack.Screen name="ColorPicker" component={ColorPicker} /> */}
          {/* <Stack.Screen name="ConformationSuccess" component={ConfirmationSuccess} /> */}
          {/* <Stack.Screen name="UserProfile" component={UserProfile} /> */}
          {/* <Stack.Screen name="CompanyProfile" component={CompanyProfile} /> */}

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
