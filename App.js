/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import SignIn from "./components/SignIn"
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
          <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


export default App;
