import {
  createRouter,
} from '@expo/ex-navigation';

import RootNavigation from './RootNavigation';

export default createRouter(() => ({
  rootNavigation: () => RootNavigation,
}));
