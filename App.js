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
import TrackOrders from "./components/TrackOrders"
import SearchResults from "./components/SearchResults"
import ProductPage from "./components/ProductPage"
import MainPage from "./components/MainPage"

import Filter from "./components/Filter"
class App extends Component {
  render() {
    const Stack = createStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            // ...TransitionPresets.SlideFromRightIOS
          }}
        >
          {/* <Stack.Screen name="TaxID" component={TaxID} /> */}
          {/* <Stack.Screen name="MainPage" component={MainPage} /> */}
          {/* <Stack.Screen name="Categories" component={Categories} /> */}
          {/* <Stack.Screen name="CategoriesProduct" component={CategoriesProduct} /> */}
          {/* <Stack.Screen name="Filter" component={Filter} /> */}
          <Stack.Screen name="Payment" component={Payment} />

          <Stack.Screen name="WalkThrough" component={WalkThrough} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="MainPage" component={MainPage} />
          <Stack.Screen name="CompanyProfile" component={CompanyProfile} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="ProductPage" component={ProductPage} />
          <Stack.Screen name="Delivery" component={Delivery} />
          <Stack.Screen name="ShoppingCart" component={ShoppingCart} />
          <Stack.Screen name="TrackOrders" component={TrackOrders} />
          <Stack.Screen name="CategoriesProduct" component={CategoriesProduct} />
          {/* <Stack.Screen name="Payment" component={Payment} /> */}
          <Stack.Screen name="Categories" component={Categories} />
          <Stack.Screen name="TaxID" component={TaxID} />
          <Stack.Screen name="ConfirmationSuccess" component={ConfirmationSuccess} />
          <Stack.Screen name="SearchResults" component={SearchResults} />
          {/* <Stack.Screen name="ProductPage" component={ProductPage} /> */}

          {/* <Stack.Screen name="Filter" component={Filter} />
          <Stack.Screen name="ColorPicker" component={ColorPicker} /> */}

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
