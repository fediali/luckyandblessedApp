/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Text, Alert, ActivityIndicator } from 'react-native';
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
import LookbookRenderer from "./components/LookbookRenderer"
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
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import GetData from './reusableComponents/API/GetData';
import Toast from 'react-native-simple-toast';

const STORAGE_FCM_TOKEN = Globals.STORAGE_FCM_TOKEN;

class App extends Component {


  componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners(); //add this line

  }
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }


  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();

    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem(STORAGE_FCM_TOKEN);
    await subscribeToTopic()
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem(STORAGE_FCM_TOKEN, fcmToken);
      }
    }
  }

  async subscribeToTopic () {
    firebase.messaging()
  .subscribeToTopic('weather')
  .then(() => console.log('Subscribed to topic!'));
  }

  async createNotificationListeners() {

    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log("Foreground", notification)
      const { title, body } = notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;

      console.log("PPPP", title, body)

      // this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;

      // const { title, body } = notificationOpen.notification;
      // console.log("zzPPPP",title,body)

      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    // this.messageListener = firebase.messaging().onMessage(async (message) => {
    //   //process data message
    //   Alert.alert('A new FCM message arrived!', JSON.stringify(message));

    //   console.log(JSON.stringify(message));
    // });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      username: "",
      loading: true
    }

    try {
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
            isAuthenticated: false,
            username: ""
          })
        }
      });
    } catch (exp) {
      this.setState({
        loading: false,
        isAuthenticated: false,
        username: ""
      })
    }
  }

  setAuthenticated = (username) => {
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
          isAuthenticated: false,
          username: ""
        })
      }
    });
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
                  <Stack.Screen name="TaxID" component={TaxID} />
                </>

                :
                <>
                  {/* <Stack.Screen name="Delivery" component={Delivery} /> */}
                  {/* <Stack.Screen name="Payment" component={Payment} /> */}

                  <Stack.Screen name="MainPage" component={MainPage} />
                  <Stack.Screen name="CompanyProfile" component={CompanyProfile} />
                  <Stack.Screen name="UserProfile" component={UserProfile} />
                  <Stack.Screen name="ProductPage" component={ProductPage} />
                  <Stack.Screen name="Delivery" component={Delivery} />
                  <Stack.Screen name="ShoppingCart" component={ShoppingCart} />
                  <Stack.Screen name="TrackOrders" component={TrackOrders} />
                  <Stack.Screen name="CategoriesProduct" component={CategoriesProduct} />
                  <Stack.Screen name="LookbookRenderer" component={LookbookRenderer} />
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

