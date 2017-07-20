import React, { Component } from 'react';

import Expo, {
  Asset,
  Components,
} from 'expo';

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
  Image
} from 'react-native';

import {
  FontAwesome,
} from '@expo/vector-icons';

import MainStackRouter from "./routes/MainStackRouter";

import cacheAssetsAsync from './utilities/cacheAssetsAsync';

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

  componentWillMount() {
    this._cacheResourcesAsync();
  }  

  async _cacheResourcesAsync() {
    const images = [
      require('./assets/images/3d-house-1.png'),
      require('./assets/images/logo.png'),
      require('./assets/images/mwtlogo.png'),
      require('./assets/images/login2.jpg'),
      require('./assets/images/glow2.png'),
    ];

    for (let image of images) {
      await Asset.fromModule(image).downloadAsync();
    }

    this.setState({isReady: true});
  }

  render() {
    if (this.state.appIsReady) {
      return(
         <Provider store={this.state.store}>
             <MainStackRouter store={this.state.store}  />
         </Provider>
      );
    } else {
      return (
        <Components.AppLoading />
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
