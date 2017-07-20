import React, { Component } from "react";

import Home from "../components/home/";
import Step0 from '../components/signup/step-0';
import Report from '../components/report/';
import Submittal from '../components/submittal/';
import TopCategories from '../components/categories/top';
import SubCategories from '../components/categories/details';
import CommentsAndPhotos from '../components/categories/commentsAndPhotos';
import SignUpUserInfo from '../components/signup/signup-user-info';
import SignUpPropertyInfo from '../components/signup/signup-property-info';
// import SignUpPropertyLocation from '../components/signup/signup-property-location';
import SignUpLeaseInfo from '../components/signup/signup-lease-info';
import SignUpPropertyManagerInfo from '../components/signup/signup-property-manager-info';
import SignUpTermsConditions from '../components/signup/signup-terms-conditions';
import SignUpPropertyPhotos from '../components/signup/signup-property-photos';
import SignUpComplete from '../components/signup/signup-complete';
import SignUpInstructions from '../components/signup/signup-instructions';
import SignUpResetDemo from '../components/signup/signup-reset-demo';
import Compose from "../components/compose/";

import HomeDrawerRouter from "./HomeDrawerRouter";
import { StackNavigator } from "react-navigation";
import { Header, Left, Button, Icon, Body, Title, Right } from "native-base";

HomeDrawerRouter.navigationOptions = ({ navigation }) => ({
  header: null
});

export default (StackNav = StackNavigator(
    {
      Home: { screen: Home },
      step0: { screen: Step0 },
      report: { screen: Report },
      submittal: { screen: Submittal },
      categories: { screen: TopCategories },
      subcategories: { screen: SubCategories },
      commentsAndPhotos: { screen: CommentsAndPhotos },

      signupUserInfo: { screen: SignUpUserInfo },
      signupPropertyInfo: { screen: SignUpPropertyInfo },

      // signupPropertyLocation: { screen: SignUpPropertyLocation },

      signupLeaseInfo: { screen: SignUpLeaseInfo },
      signupPropertyManagerInfo: { screen: SignUpPropertyManagerInfo },
      signupTermsConditions: { screen: SignUpTermsConditions },

      signupPropertyPhotos: { screen: SignUpPropertyPhotos },
      signupComplete: { screen: SignUpComplete },
      signupInstructions: { screen: SignUpInstructions },

      signupResetDemo: { screen: SignUpResetDemo },

      sendMessageToPM: { screen: Compose }

  },
	{
		initialRouteName: "step0",
		headerMode: "none",
	}

));