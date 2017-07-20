import React, { Component } from "react";

import Home from "../components/home/";
import Step0 from '../components/signup/step-0';
import TopCategories from '../components/categories/top';
import SignUpPropertyInfo from '../components/signup/signup-property-info';

import { DrawerNavigator } from "react-navigation";
import DrawBar from "../components/DrawBar";

export default (DrawNav = DrawerNavigator(
  {
      Home: { screen: Home },
      step0: { screen: Step0 },
      categories: { screen: TopCategories },
      signupPropertyInfo: { screen: SignUpPropertyInfo }
  },
  {
    contentComponent: props => <DrawBar {...props} />
  }
));