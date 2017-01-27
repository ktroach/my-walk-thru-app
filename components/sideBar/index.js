'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { closeDrawer } from '../../actions/drawer';
import { replaceOrPushRoute } from '../../actions/route';

import { Text, Icon, List, ListItem, Content, Thumbnail, Badge } from 'native-base';

import styles from './style';

class SideBar extends Component {

    navigateTo(route) {
        this.props.closeDrawer();
        this.props.replaceOrPushRoute(route);
    }

    render(){
        return (
            <Content style={{backgroundColor: '#252A30'}} >
                <Thumbnail size={200} style={{alignSelf: 'center', marginTop: 20, marginBottom: 15, resizeMode: 'contain'}} circular source={require('../../assets/images/mwtlogo.png')} />
                <List  foregroundColor={'white'} >
                    <ListItem button onPress={() => this.navigateTo('signUp')} iconLeft style={styles.links} >
                        <Icon name='ios-paper-outline' />
                        <Text>Sign Up</Text>
                    </ListItem>
                    <ListItem button onPress={() => this.navigateTo('compose')} iconLeft style={styles.links} >
                      <Icon name='ios-paper-plane' />
                      <Text>Compose</Text>
                    </ListItem>
                    <ListItem button onPress={() => this.navigateTo('categories')} iconLeft style={styles.links} >
                      <Icon name='ios-eye' />
                      <Text>Categories</Text>
                    </ListItem>
                </List>
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
