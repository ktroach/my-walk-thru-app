import React, { Component } from "react";

import Home from "../components/home/";
// import Step0 from "../components/signup/step-0";

import { DrawerNavigator } from "react-navigation";
import DrawBar from "../components/DrawBar";

export default (DrawNav = DrawerNavigator(
  {
    Home: { screen: Home }
  },
  {
    contentComponent: props => <DrawBar {...props} />
  }
));