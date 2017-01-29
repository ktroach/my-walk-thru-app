'use strict';

import { combineReducers } from 'redux';

import drawer from './drawer';
import route from './route';
import subs from './subs';

export default combineReducers({
 	drawer,
  	route,
   subs
})
