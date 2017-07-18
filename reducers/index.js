import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import drawer from "./drawer";
import user from "./user";
import list from "./list";

export default combineReducers({
  form: formReducer,
  drawer,
  user,
  list
});

// 'use strict';

// import { combineReducers } from 'redux';

// import drawer from './drawer';
// import route from './route';
// import subs from './subs';

// export default combineReducers({
//  	drawer,
//   	route,
//    subs
// })


// import { combineReducers } from 'redux';
// import { NavigationActions } from 'react-navigation';
// import { AppNavigator } from '../AppNavigator';

// // Start with two routes: The Main screen, with the Login screen on top.
// const firstAction = AppNavigator.router.getActionForPathAndParams('Home');
// const tempNavState = AppNavigator.router.getStateForAction(firstAction);
// const secondAction = AppNavigator.router.getActionForPathAndParams('Step0');
// const initialNavState = AppNavigator.router.getStateForAction(
//   secondAction,
//   tempNavState
// );

// function nav(state = initialNavState, action) {
//   let nextState;
//   switch (action.type) {
//     case 'Login':
//       nextState = AppNavigator.router.getStateForAction(
//         NavigationActions.back(),
//         state
//       );
//       break;
//     case 'Logout':
//       nextState = AppNavigator.router.getStateForAction(
//         NavigationActions.navigate({ routeName: 'Login' }),
//         state
//       );
//       break;
//     default:
//       nextState = AppNavigator.router.getStateForAction(action, state);
//       break;
//   }

//   // Simply return the original `state` if `nextState` is null or undefined.
//   return nextState || state;
// }

// const initialAuthState = { isLoggedIn: false };

// function auth(state = initialAuthState, action) {
//   switch (action.type) {
//     case 'Login':
//       return { ...state, isLoggedIn: true };
//     case 'Logout':
//       return { ...state, isLoggedIn: false };
//     default:
//       return state;
//   }
// }

// const AppReducer = combineReducers({
//   nav,
//   auth,
// });

// export default AppReducer;
