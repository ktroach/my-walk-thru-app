import React from 'react';
import {
  StyleSheet,
  View,
  Navigator
} from 'react-native';
import {
  Notifications,
} from 'expo';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@expo/ex-navigation';
import {
  FontAwesome,
} from '@expo/vector-icons';

import Alerts from '../constants/Alerts';
import Colors from '../constants/Colors';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

// import Signup from '../components/signup';

export default class RootNavigation extends React.Component {
   state = {
      location: null,
      signedup: false,
   };

  componentDidMount() {
     this._notificationSubscription = this._registerForPushNotifications();

   //   this.setState({signedup: true});
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  onSignUpComplete() {

  }

  renderSignUp() {
     return (
      <TabNavigation
        tabBarHeight={56}
        initialTab="signup">

        <TabNavigationItem
          id="signup"
          renderIcon={isSelected => this._renderIcon('user', isSelected)}>
          <StackNavigation initialRoute="signup" />
        </TabNavigationItem>

      </TabNavigation>
    );
  }

  render() {
     if (this.state.signedup) {
        return this.renderTabNavigation();
     } else {
        return this.renderSignUp();
     }
  }

  renderTabNavigation() {
    return (
      <TabNavigation
        tabBarHeight={56}
        initialTab="home">
        <TabNavigationItem
          id="home"
          renderIcon={isSelected => this._renderIcon('home', isSelected)}>
          <StackNavigation initialRoute="home" />
        </TabNavigationItem>

        <TabNavigationItem
          id="links"
          renderIcon={isSelected => this._renderIcon('book', isSelected)}>
          <StackNavigation initialRoute="links" />
        </TabNavigationItem>

        <TabNavigationItem
          id="settings"
          renderIcon={isSelected => this._renderIcon('cog', isSelected)}>
          <StackNavigation initialRoute="settings" />
        </TabNavigationItem>
      </TabNavigation>
    );
  }

  _renderIcon(name, isSelected) {
    return (
      <FontAwesome
        name={name}
        size={32}
        color={isSelected ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({origin, data}) => {
    this.props.navigator.showLocalAlert(
      `Thank you for using the OnSight PROS My Walk Thru`,
      Alerts.notice
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  selectedTab: {
    color: Colors.tabIconSelected,
  },
  contentContainer: {
    paddingTop: 80,
  },
  titleText: {
    fontSize: 24,
    color: Colors.tabIconSelected,
    lineHeight: 23,
    marginTop: 4,
    paddingBottom: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
});
