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
     loaded: false,
     signUpDate: ''
   }

    navigateTo(route) {
        this.props.closeDrawer();
        this.props.replaceOrPushRoute(route);
    }

    componentDidMount(){
      this.haveTheySignedUp();
    }

    // if we have the signUpDate stored on the device then yes they signed up before
    haveTheySignedUp () {
      try {
         AsyncStorage.getItem("signUpDate")
         .then( (signUpDate) =>
               {
                  this.setState({loaded: true});
                  return this.setState({signUpDate: signUpDate})
               }
         )
         .done();
      } catch(err){}
   }

    render(){
      if (this.state.loaded){
         if (this.state.signUpDate && this.state.signUpDate.length>0) {
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
               <Image source={require('../../assets/images/slide_properties.jpg')} style={{resizeMode: 'cover', opacity: 1.0}}>

                   <Thumbnail size={620} style={{resizeMode: 'contain', marginTop: 10, opacity: 1.0}} source={require('../../assets/images/logo.png')} />

                   <List style={{paddingTop: 20}}>
                        <ListItem button onPress={() => this.navigateTo('home')} iconLeft style={styles.links} >
                          <Icon style={styles.sidebarIcon} name='ios-home' />
                          <Text style={styles.text}>Home</Text>
                        </ListItem>
                       <ListItem button onPress={() => this.navigateTo('categories')} iconLeft style={styles.links} >
                         <Icon style={styles.sidebarIcon} name='ios-camera' />
                         <Text style={styles.text}>Walk Thru</Text>
                       </ListItem>
                       <ListItem button onPress={() => this.navigateTo('signup-step1')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-person' />
                           <Text style={styles.text}>Sign Up (Test)</Text>
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
