'use strict';

import React, { Component } from 'react';

import {
  Image
} from 'react-native';

import { connect } from 'react-redux';

import { closeDrawer } from '../../actions/drawer';
import { replaceOrPushRoute } from '../../actions/route';

import { Text, Icon, List, ListItem, Content, Thumbnail, Badge, View } from 'native-base';

// import sidebarTheme from './sidebar-theme';

import styles from './style';

class SideBar extends Component {

    navigateTo(route) {
        this.props.closeDrawer();
        this.props.replaceOrPushRoute(route);
    }

// #faf6ec
// #252A30

// background-color: #133740;
// color: #ecebeb;

    render(){
        return (
            <Content style={styles.sidebar} >
               <Image source={require('../../assets/images/slide_properties.jpg')}>
                   <Thumbnail size={500} style={{alignSelf: 'left', marginTop: 20, marginBottom: 15, resizeMode: 'contain'}} circular source={require('../../assets/images/mwtlogo.png')} />
                   <List>
                        <ListItem button onPress={() => this.navigateTo('home')} iconLeft style={styles.links} >
                          <Icon style={styles.sidebarIcon} name='ios-home' />
                          <Text style={styles.text}>Home</Text>
                        </ListItem>
                       <ListItem button onPress={() => this.navigateTo('signup-step1')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-person' />
                           <Text style={styles.text}>Sign Up</Text>
                       </ListItem>
                       <ListItem button onPress={() => this.navigateTo('categories')} iconLeft style={styles.links} >
                         <Icon style={styles.sidebarIcon} name='ios-list' />
                         <Text style={styles.text}>Walkthru</Text>
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
