// import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { addNavigationHelpers, StackNavigator } from 'react-navigation';

// import Home from './components/home/';
// import Report from './components/report/';
// import Step0 from './components/signup/step-0';

// export const AppNavigator = StackNavigator({
//   Home: { screen: Home },
//   Step0: { screen: Step0 },
//   Report: { screen: Report },
// });

// const AppWithNavigationState = ({ dispatch, nav }) => (
//   <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
// );

// AppWithNavigationState.propTypes = {
//   dispatch: PropTypes.func.isRequired,
//   nav: PropTypes.object.isRequired,
// };

// const mapStateToProps = state => ({
//   nav: state.nav,
// });

// export default connect(mapStateToProps)(AppWithNavigationState);

import React from "react";

import { Platform } from "react-native";
import { Root } from "native-base";
import { StackNavigator } from "react-navigation";

// import Drawer from "./Drawer";
import Home from "./components/home/";
import Step0 from "./components/signup/step-0";

const AppNavigator = StackNavigator(
	{
		// Drawer: { screen: Drawer },
		Home: { screen: Home },
		Step0: { screen: Step0 },
	},
	{
		initialRouteName: "Home",
		headerMode: "none",
	}
);

export default () =>
	<Root>
		<AppNavigator />
	</Root>;