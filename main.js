import Expo from 'expo';

import React, { Component } from 'react';
import { Provider } from 'react-redux';

// import { createStore } from 'redux';
// import AppReducer from './reducers';

import configureStore from './configureStore';

import {
  AppRegistry,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {
  FontAwesome,
} from '@expo/vector-icons';

import MainStackRouter from "./routes/MainStackRouter";

// import setup from './setup';

// import App from './App';

// import cacheAssetsAsync from './utilities/cacheAssetsAsync';

// import AppWithNavigationState from './AppNavigator';


class AppContainer extends React.Component {

  // store = createStore(AppReducer);

   constructor() {
       super();
       this.state = {
           isLoading: false,
           store: configureStore(()=> this.setState({isLoading: false})),
           appIsReady: true,
           userIsRegistered: false
       };
   }

  render() {
    if (this.state.appIsReady) {
      // return(
      //     <App />
      // );      
      return(
         <Provider store={this.state.store}>
             <MainStackRouter store={this.state.store}  />
         </Provider>
      );
    } else {
      return (
        <Expo.Components.AppLoading />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

Expo.registerRootComponent(AppContainer);
