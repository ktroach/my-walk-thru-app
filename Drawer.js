/* @flow */

import React from "react";
import { DrawerNavigator } from "react-navigation";

import Home from "./components/home/";
import Step0 from "./components/signup/step-0";
import SideBar from "./components/sideBar";

const DrawerExample = DrawerNavigator(
  {
    Home: { screen: Home },
    Step0: { screen: Step0 },
  },
  {
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

export default DrawerExample;