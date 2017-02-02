'use strict';

import React, { Component } from 'react';

import {
   AsyncStorage,
   Image
} from 'react-native';

import { connect } from 'react-redux';

import { closeDrawer } from '../../actions/drawer';
import { replaceOrPushRoute } from '../../actions/route';

import { Text, Icon, List, ListItem, Content, Thumbnail, Badge, View } from 'native-base';

import styles from './style';

class SideBar extends Component {
   state = {
     username: '',
   }

    navigateTo(route) {
        this.props.closeDrawer();
        this.props.replaceOrPushRoute(route);
    }

    componentDidMount(){
      this.haveTheySignedUp();
    }

    // if we have the username stored on the device then yes they signed up before
    haveTheySignedUp () {
      AsyncStorage.getItem("username")
      .then( (username) =>
            {
              return this.setState({username:username})
            }
      )
      .done();
   }

    render(){
      if (this.state.username && this.state.username.length>0) {
         return (
            this.renderSignedUp()
         );
      } else {
         return (
            this.renderNotSignedUp()
         );
      }
    }

    // they are signed up to use the app so display the good stuff
    renderSignedUp(){
        return (
            <Content style={styles.sidebar} >
               <Image source={require('../../assets/images/slide_properties.jpg')}>
                   <Thumbnail size={500} style={{marginLeft: 17, marginTop: 27, marginBottom: 15, resizeMode: 'contain'}} circular source={require('../../assets/images/mwtlogo.png')} />
                   <List>
                        <ListItem button onPress={() => this.navigateTo('home')} iconLeft style={styles.links} >
                          <Icon style={styles.sidebarIcon} name='ios-home' />
                          <Text style={styles.text}>Home</Text>
                        </ListItem>
                       <ListItem button onPress={() => this.navigateTo('categories')} iconLeft style={styles.links} >
                         <Icon style={styles.sidebarIcon} name='ios-camera' />
                         <Text style={styles.text}>My Walk Thru</Text>
                       </ListItem>
                   </List>
               </Image>
            </Content>
        );
    }

    // they need to sign up first so dont display the good stuff . tough luck sukers
    renderNotSignedUp(){
        return (
            <Content style={styles.sidebar} >
               <Image source={require('../../assets/images/slide_properties.jpg')}>
                   <Thumbnail size={500} style={{marginLeft: 17, marginTop: 27, marginBottom: 15, resizeMode: 'contain'}} circular source={require('../../assets/images/mwtlogo.png')} />
                   <List>
                         <ListItem button onPress={() => this.navigateTo('signup-step6')} iconLeft style={styles.links} >
                             <Icon style={styles.sidebarIcon} name='ios-person' />
                             <Text style={styles.text}>Sign Up</Text>
                         </ListItem>
                   </List>
               </Image>
            </Content>
        );
    }

}

function bindAction(dispatch) {
    return {
        closeDrawer: ()=>dispatch(closeDrawer()),
        replaceOrPushRoute:(route)=>dispatch(replaceOrPushRoute(route))
    }
}

export default connect(null, bindAction)(SideBar);
