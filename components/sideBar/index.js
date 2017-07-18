'use strict';

import React, { Component } from 'react';

import {
   AsyncStorage,
   Image,
   ActivityIndicator,
} from 'react-native';

// import { connect } from 'react-redux';

import { closeDrawer } from '../../actions/drawer';
import { replaceOrPushRoute } from '../../actions/route';

import {Container, Text, Icon, List, ListItem, Content, Thumbnail, Badge, View } from 'native-base';

import styles from './style';

class SideBar extends Component {

   state = {
     username: '',
     loaded: false,
     signUpDate: '',
     userId: ''
   }

    navigateTo(route) {
        // this.props.closeDrawer();
        // this.props.replaceOrPushRoute(route);
    }

    componentDidMount(){
      this.haveTheySignedUp();
    }

    // if we have the signUpDate stored on the device then yes they signed up before
    haveTheySignedUp () {
      try {
         AsyncStorage.getItem("userId")
         .then( (userId) =>
               {
                  this.setState({loaded: true});
                  return this.setState({userId: userId})
               }
         )
         .done();
      } catch(err){}
   }

    render(){
      if (this.state.loaded){
         if (this.state.userId && this.state.userId.length>0) {
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
             <Image source={require('../../assets/images/house02.jpg')} style={styles.container} >
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

             {/*<Image source={require('../../assets/images/3d-house-1.png')} style={{resizeMode: 'cover', opacity: 1.8}}>*/}

                  <Thumbnail size={100} style={{resizeMode: 'contain', marginTop: 7}} source={require('../../assets/images/logo.png')} />
                
                  <List style={{paddingTop: 1, height: 1000}}>
                         {/*<ListItem button onPress={() => this.navigateTo('signup-step0')} iconLeft style={styles.links} >
                             <Icon style={styles.sidebarIcon} name='ios-happy-outline' />
                             <Text style={styles.text}>Welcome</Text>
                         </ListItem>      */}

                       <ListItem button onPress={() => this.navigateTo('home')} iconLeft style={styles.links} >
                          <Icon style={styles.sidebarIcon} name='ios-home-outline' />
                          <Text style={styles.text}>Home</Text>
                        </ListItem>
                       <ListItem button onPress={() => this.navigateTo('categories')} iconLeft style={styles.links} >
                         <Icon style={styles.sidebarIcon} name='ios-list-box-outline' />
                         <Text style={styles.text}>Continue WalkThru</Text>
                       </ListItem>
                       {/*<ListItem button onPress={() => this.navigateTo('signup-lease-info')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-folder-outline' />
                           <Text style={styles.text}>Lease Info</Text>
                       </ListItem>                       
                       <ListItem button onPress={() => this.navigateTo('signup-property-manager-info')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-folder-outline' />
                           <Text style={styles.text}>Property Manager</Text>
                       </ListItem>                       
                       <ListItem button onPress={() => this.navigateTo('signup-property-info')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-folder-outline' />
                           <Text style={styles.text}>Property Info</Text>
                       </ListItem>*/}
                       <ListItem button onPress={() => this.navigateTo('signup-property-photos')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-photos-outline' />
                           <Text style={styles.text}>Snap Photos</Text>
                       </ListItem> 

                       <ListItem button onPress={() => this.navigateTo('report')} iconLeft style={styles.links} >
                         <Icon style={styles.sidebarIcon} name='ios-list-box-outline' />
                         <Text style={styles.text}>View Report</Text>
                       </ListItem>
                       
                       {/*<ListItem button onPress={() => this.navigateTo('submittal')} iconLeft style={styles.links} >
                         <Icon style={styles.sidebarIcon} name='ios-list-box-outline' />
                         <Text style={styles.text}>Submit WalkThru</Text>
                       </ListItem>                                              */}


                       {/*<ListItem button onPress={() => this.navigateTo('signup-reset-demo')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-git-compare' />
                           <Text style={styles.text}>Logout</Text>
                       </ListItem>                                                             */}
                   </List>
                 

               {/*</Image>*/}
            </Content>
        );
    }

    // they need to sign up first so dont display the good stuff 
    renderNotSignedUp(){
        return (
           <Content style={styles.sidebar} >

             {/*<Image source={require('../../assets/images/3d-house-1.png')} style={{resizeMode: 'cover', opacity: 1.8}}>*/}

                  <Thumbnail size={100} style={{resizeMode: 'contain', marginTop: 7}} source={require('../../assets/images/logo.png')} />
                
                  <List style={{paddingTop: 1, height: 1000}}>
                         <ListItem button onPress={() => this.navigateTo('signup-step0')} iconLeft style={styles.links} >
                             <Icon style={styles.sidebarIcon} name='ios-happy-outline' />
                             <Text style={styles.text}>Welcome</Text>
                         </ListItem>      
                       {/*<ListItem button onPress={() => this.navigateTo('signup-reset-demo')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-git-compare' />
                           <Text style={styles.text}>Logout</Text>
                       </ListItem>                              */}

                       {/*<ListItem button onPress={() => this.navigateTo('home')} iconLeft style={styles.links} >
                          <Icon style={styles.sidebarIcon} name='ios-home-outline' />
                          <Text style={styles.text}>Home</Text>
                        </ListItem>*/}
                       {/*<ListItem button onPress={() => this.navigateTo('categories')} iconLeft style={styles.links} >
                         <Icon style={styles.sidebarIcon} name='ios-list-box-outline' />
                         <Text style={styles.text}>Continue WalkThru</Text>
                       </ListItem>
                       <ListItem button onPress={() => this.navigateTo('signup-lease-info')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-folder-outline' />
                           <Text style={styles.text}>Lease Info</Text>
                       </ListItem>                       
                       <ListItem button onPress={() => this.navigateTo('signup-property-manager-info')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-folder-outline' />
                           <Text style={styles.text}>Property Manager</Text>
                       </ListItem>                       
                       <ListItem button onPress={() => this.navigateTo('signup-property-info')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-folder-outline' />
                           <Text style={styles.text}>Property Info</Text>
                       </ListItem>
                       <ListItem button onPress={() => this.navigateTo('signup-property-photos')} iconLeft style={styles.links} >
                           <Icon style={styles.sidebarIcon} name='ios-photos-outline' />
                           <Text style={styles.text}>Property Photos</Text>
                       </ListItem>                                    */}
                   </List>
                 

               {/*</Image>*/}
            </Content>
        );
    }

}

export default SideBar;

// function bindAction(dispatch) {
//     return {
//         closeDrawer: ()=>dispatch(closeDrawer()),
//         replaceOrPushRoute:(route)=>dispatch(replaceOrPushRoute(route))
//     }
// }

// export default connect(null, bindAction)(SideBar);
