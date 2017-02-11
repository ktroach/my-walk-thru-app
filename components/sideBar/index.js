'use strict';

import React, { Component } from 'react';

import {
   AsyncStorage,
   Image,
   ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';

import { closeDrawer } from '../../actions/drawer';
import { replaceOrPushRoute } from '../../actions/route';

import {Container, Text, Icon, List, ListItem, Content, Thumbnail, Badge, View } from 'native-base';

import styles from './style';

class SideBar extends Component {
   state = {
     username: '',
     loaded: false
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
      try {
         AsyncStorage.getItem("username")
         .then( (username) =>
               {
                  this.setState({loaded: true});
                  return this.setState({username:username})
               }
         )
         .done();
      } catch(err){}
   }

    render(){
      if (this.state.loaded){
         if (this.state.username && this.state.username.length>0) {
            return (
               this.renderSignedUp()
            );
         } else {
            return (
               this.renderNotSignedUp()
            );
         }
      } else {
         return (
            this.renderLoadingView()
         );
      }
    }

    renderLoadingView() {
      return (
         <Content style={styles.sidebar} >
             <Image source={require('../../assets/images/slide_properties.jpg')} style={styles.container} >
                 <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, {height: 80}]}
                    size="large"
                />
             </Image>
         </Content>
      );
    }

    // they are signed up to use the app so display the good stuff
    renderSignedUp(){
        return (
            <Content style={styles.sidebar} >
               <Image source={require('../../assets/images/slide_properties.jpg')} style={{resizeMode: 'cover', opacity: 0.8}}>
                   <Thumbnail size={500} style={{resizeMode: 'contain', marginTop: 7}} source={require('../../assets/images/logo.png')} />

                   <List style={{paddingTop: 50}}>
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
             <Image source={require('../../assets/images/slide_properties.jpg')} style={{resizeMode: 'cover', opacity: 0.8}}>
                  <Thumbnail size={500} style={{resizeMode: 'contain', marginTop: 7}} source={require('../../assets/images/logo.png')} />

                  <List style={{paddingTop: 50}}>
                         <ListItem button onPress={() => this.navigateTo('signup-step0')} iconLeft style={styles.links} >
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
