'use strict';

import type { Action } from '../actions/types';
import { ADD_TODO, TOGGLE_TODO} from '../actions/sub';

export type State = {
    text: string,
    completed: boolean
}

const initialState = {
    text: '',
    completed: false
};

export default function (state:State = initialState, action:Action): State {
    if (action.type === ADD_TODO) {
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    }

    if (action.type === TOGGLE_TODO) {

      // alert('TOGGLE_TODO');

      // alert('state.id:'+state.id);
      // alert('action.id:'+action.id);

      if (state.id !== action.id) {
        return state
      }

      return {
        ...state,
        completed: !state.completed
      }
    }

    return state;
}
