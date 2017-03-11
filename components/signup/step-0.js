'use strict';

import React, { Component } from 'react';

import {
  AsyncStorage,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input } from 'native-base';

import welcomeStyle from '../../themes/welcome';
import theme from '../../themes/form-theme';
import styles from './styles';

class Step0 extends Component {

   constructor(props) {
      super(props);
      this.state = {
           email: '',
           fullName: '',
           scroll: false,
           signUpDate: ''
      };
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
                 return this.setState({signUpDate: signUpDate})
              }
        )
        .done();
     } catch(err){}
  }

   replaceRoute(route) {
      this.props.replaceRoute(route);
   }

   pushNewRoute(route) {
        this.props.pushNewRoute(route);
   }

    popRoute() {
        this.props.popRoute();
    }

    _renderWelcomeText() {
        return (
          <Text style={welcomeStyle.welcomeText}>
          
            Thank you for using the best app on the market for recouping your Security Deposit.  My Walkthru will help you document your findings through the apps easy-to-use camera and comments tool.
            Your Walkthru documentation about the property will help you prove pre-existing damage and repair needs before your Lease begins.  At the end of your Walkthru, the app will produce a comprehensive report of all
            of your observations and send it to you and your property manager. Your property manager has made good documentation about the condition of your home and it is important for you to do the same.
          </Text>
        );
    }

    _handleGetStartedPressed() {
       Linking.openURL('http://www.onsightpros.com/');
    }

    // {/*
    // <Button rounded block
    //   style={{marginBottom: 20, backgroundColor: '#ad241f'}}
    //   onPress={() => this.replaceRoute('home')}>
    //     <Text>CONTINUE</Text>
    // // </Button>
    // {/*
    // <Button rounded block
    //   style={{marginBottom: 20, backgroundColor: '#ad241f'}}
    //   onPress={() => this.replaceRoute('signup-step1')}>
    //     <Text>GET STARTED!</Text>
    // </Button>
    //   */}
    // */}


    _renderButton(){
      if (this.state.signUpDate && this.state.signUpDate.length>0) {
        return (
          <Button rounded block
            style={{alignSelf: 'center',
                    marginTop: 40,
                    backgroundColor: '#ad241f',
                    borderRadius:90,
                    width: 300,
                    height:65}}
              onPress={() => this.replaceRoute('home')}>
              <Text>CONTINUE</Text>
          </Button>
        );
      } else {
        return (
            <Button rounded block
              style={{alignSelf: 'center',
                      marginTop: 40,
                      backgroundColor: '#ad241f',
                      borderRadius:90,
                      width: 300,
                      height:65}}
                onPress={() => this.replaceRoute('signup-step1')}>
                <Text>GET STARTED</Text>
            </Button>
        );
      }
    }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('signup-step0')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30}} />
                        </Button>

                        <Title>WELCOME TO YOUR NEW HOME!</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >

                      {/*
                        <Text style={welcomeStyle.appTitleText}>
                           WELCOME TO
                        </Text>
                        */}


                       <View style={welcomeStyle.welcomeContainer}>
                         <Image
                          source={require('../../assets/images/logo.png')}
                          style={welcomeStyle.welcomeImage}
                         />
                         {this._renderWelcomeText()}
                         {this._renderButton()}
                       </View>




                    </Content>



                </Image>
            </Container>
        )
    }
}

function bindActions(dispatch){
    return {
        replaceRoute:(route)=>dispatch(replaceRoute(route)),
        pushNewRoute:(route)=>dispatch(pushNewRoute(route)),
        openDrawer: ()=>dispatch(openDrawer()),
        popRoute: () => dispatch(popRoute())
    }
}

export default connect(null, bindActions)(Step0);
