'use strict';

import type {Action} from './types';

export const ADD_TODO = "ADD_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";

let nextTodoId = 0;
export function addTodo(text):Action {
 	return {
    	type: ADD_TODO,
      id: nextTodoId++,
      text
  	}
}

export function toggleTodo(id):Action {
 	return {
    	type: TOGGLE_TODO,
      id
  	}
}
