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
import codePush from "react-native-code-push"
import Filter from "./components/Filter"
import ThemeContext from "./reusableComponents/ThemeContext"
import RetrieveDataAsync from './reusableComponents/AsyncStorage/RetrieveDataAsync'
import BarCodeScanner from './components/BarCodeScanner'
import Globals from "./Globals"
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      username: "",
      loading: true
    }


    RetrieveDataAsync(Globals.STORAGE_USER).then((value) => {
      if (value != null) {

        this.setState({
          isAuthenticated: true,
          username: JSON.parse(value).name,
          loading: false

        })

      }
      else {
        this.setState({
          loading: false,
          isAuthenticated:false,
          username:""
        })
      }
    });

  }

  setAuthenticated = (username) => {
    if (!username) {
      this.setState({ isAuthenticated: false, username: username })
    }
    else {
      this.setState({ isAuthenticated: true, username: username })

    }
  }

  render() {
    const Stack = createStackNavigator();
    const { isAuthenticated, loading } = this.state
    const { username } = this.state
    const { setAuthenticated } = this
    return (

      loading ?
        <>
        </>
        :
        <NavigationContainer>
          <ThemeContext.Provider
            value={{
              isAuthenticated,
              setAuthenticated,
              username,
            }}
          >
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                ...TransitionPresets.DefaultTransition
              }}
            >
              {!this.state.isAuthenticated ?
                <>

                  <Stack.Screen name="WalkThrough" component={WalkThrough} />
                  <Stack.Screen name="SignIn" component={SignIn} />
                  <Stack.Screen name="SignUp" component={SignUp} />
                  <Stack.Screen name="CompanyProfile" component={CompanyProfile} />
                  <Stack.Screen name="TaxID" component={TaxID} />
                </>

                :
                <>
                  <Stack.Screen name="Delivery" component={Delivery} />

                  <Stack.Screen name="MainPage" component={MainPage} />
                  <Stack.Screen name="CompanyProfile" component={CompanyProfile} />
                  <Stack.Screen name="UserProfile" component={UserProfile} />
                  <Stack.Screen name="ProductPage" component={ProductPage} />
                  {/* <Stack.Screen name="Delivery" component={Delivery} /> */}
                  <Stack.Screen name="ShoppingCart" component={ShoppingCart} />
                  <Stack.Screen name="TrackOrders" component={TrackOrders} />
                  <Stack.Screen name="CategoriesProduct" component={CategoriesProduct} />
                  <Stack.Screen name="Payment" component={Payment} />
                  <Stack.Screen name="Categories" component={Categories} />
                  <Stack.Screen name="TaxID" component={TaxID} />
                  <Stack.Screen name="ConfirmationSuccess" component={ConfirmationSuccess} />
                  <Stack.Screen name="SearchResults" component={SearchResults} />
                  <Stack.Screen name="BarCodeScanner" component={BarCodeScanner} />
                  <Stack.Screen name="Filter" component={Filter} />

                </>

              }
              
            </Stack.Navigator>
          </ThemeContext.Provider>
        </NavigationContainer>
    );
  }
}

App = codePush(App);
export default App;

