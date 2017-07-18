import React, { Component } from "react";

import Home from "../components/home/";
// import Step0 from "../components/signup/step-0";
import Step0 from '../components/signup/step-0';

import HomeDrawerRouter from "./HomeDrawerRouter";
import { StackNavigator } from "react-navigation";
import { Header, Left, Button, Icon, Body, Title, Right } from "native-base";

HomeDrawerRouter.navigationOptions = ({ navigation }) => ({
  header: null
});

export default (StackNav = StackNavigator({
  Home: { screen: Home },
  Step0: { screen: Step0 }
}));