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
  ActivityIndicator,
  TextInput,
  Keyboard,
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
           signUpDate: '',
           authenticated: false,
           verificationCode: '',
           loaded: true
      };
   }

   componentDidMount() {
     if (this.userVerified()) {
        console.log('user authenticated'); 
        if (this.haveTheySignedUp()) {
            console.log('user is signed up');
        } else {
            console.log('user has not signed up yet');
        }
     } else {
         console.log('user not verified: verificationCode not stored'); 
     } 
   }

   userVerified() {
     try {
        AsyncStorage.getItem("verificationCode")
        .then( (verificationCode) =>
              {
                this.setState({verificationCode: verificationCode});
                return true;
              }
        )
        .done();
     } catch(err){
         return false;
     }       
     return false;
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

    render(){
      if (this.state.loaded){
         if (this.state.signUpDate && this.state.signUpDate.length>0) {
            return (
               this.renderWelcome()
            );
         } else {
            return (
               this.verifyUser()
            );
         }
      } else {
         return (
            this.renderLoading()
         );
      }
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

    renderLoading() {
      return (
         <Content style={styles.sidebar}>
             <Image source={require('../../assets/images/house02.jpg')} style={styles.container} >
                 <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[{height: 80}]}
                    size="large"
                />
             </Image>
         </Content>
      );
    }    

    onVerificationCodeChanged(verificationCode) {
        if (verificationCode){
            if (verificationCode.length > 3){
                console.log('dismissing keyboard');
                Keyboard.dismiss();
            }
        }
        this.setState({verificationCode: verificationCode});
    }
                                    
    submitVerification() {
        let verificationCode = this.state.verificationCode;
        if (!verificationCode){
            alert('Verification Failed');
            return;
        } 
        AsyncStorage.setItem("verificationCode", verificationCode)
            .then( () => {
                alert('Verification Complete!');
                this.replaceRoute('signup-step1');
            }
        ).done();
    }

    verifyUser() {
      return (
            <Container theme={theme} style={{backgroundColor: '#fff'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('signup-step0')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30}} />
                        </Button>
                        <Title>VERIFICATION</Title>
                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30}} />
                        </Button>
                    </Header>
                    <Content padder style={{backgroundColor: 'transparent'}} >
                       <View style={welcomeStyle.welcomeContainer}>
                        <View>
                           <Image
                            source={require('../../assets/images/logo.png')}
                            style={welcomeStyle.welcomeImage}
                           />
                        </View>
                        <View>
                            <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20, paddingBottom: 10}}>
                                Enter the 4 digit Invite Code sent to you from your Property Manager
                            </Text>
                        </View>
                        <View style={{paddingTop: 20}}>
                            <TextInput
                                style={{borderWidth: 1,
                                        borderColor: '#D7D7D7', 
                                        textAlign: 'center', 
                                        fontSize: 20, 
                                        height:60, 
                                        width: 300}}
                                placeholder="Enter 4 digit Code" 
                                secureTextEntry={true} 
                                autoCapitalize={'none'}
                                maxLength={4}
                                value={this.state.verificationCode}
                                keyboardType="number-pad" 
                                onChangeText={(verificationCode) => this.onVerificationCodeChanged(verificationCode)}
                            />
                        </View>                        
                        <View style={{paddingTop: 20}}>
                            {this._renderButton()}
                        </View>
                       </View>
                    </Content>
                </Image>
            </Container>
      );
    }     

    renderWelcome() {
        return (
            <Container theme={theme} style={{backgroundColor: '#fff'}} >
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
                       <View style={welcomeStyle.welcomeContainer}>
                        <View>
                           <Image
                            source={require('../../assets/images/logo.png')}
                            style={welcomeStyle.welcomeImage}
                           />
                        </View>
                        <View>
                         {this._renderButton()}
                        </View>
                         <View style={{marginTop: 20}}>
                          {this._renderWelcomeText()}
                         </View>
                       </View>
                    </Content>
                </Image>
            </Container>
        )
    }    

    // Before you move in, your landlord usually gives you a document to record the condition of your apartment. Take it a step further and snap some photos for your own records. Email your landlord any concerns you might have about pre-move-in conditions. This way, you'll have evidence should an issue arise.


    _renderWelcomeText() {
        return (
          <View>
            <Text style={{textAlign: 'center',fontWeight: 'bold',fontSize: 20, paddingBottom: 10}}>The BEST APP for HELPING TENANTS GET their DEPOSITS BACK!</Text>

            <Text style={welcomeStyle.welcomeText}>

              Thank you for using the best app on the market for recouping your Security Deposit.  My Walkthru will help you document your findings through the apps easy-to-use camera and comments tool.
              Your Walkthru documentation about the property will help you prove pre-existing damage and repair needs before your Lease begins.  At the end of your Walkthru, the app will produce a comprehensive report of all
              of your observations and send it to you and your property manager. Your property manager has made good documentation about the condition of your home and it is important for you to do the same.
            </Text>
          </View>
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

      if (!this.state.verificationCode 
            || this.state.verificationCode === '' 
            || this.state.verificationCode.length < 4) {
        return (
            <View></View>
        );
      } 

      if (this.state.signUpDate && this.state.signUpDate.length>0) {
        return (
          <Button rounded block
            style={{alignSelf: 'center',
                    marginTop: 10,
                    backgroundColor: '#ad241f',
                    borderRadius:90,
                    width: 300,
                    height:65}}
              onPress={() => this.replaceRoute('home')}>
              <Text style={{color:'#fff', fontWeight: 'bold'}}>CONTINUE</Text>
          </Button>
        );
      } else {
        return (
            <Button rounded block
              style={{alignSelf: 'center',
                      marginTop: 10,
                      backgroundColor: '#ad241f',
                      borderRadius:90,
                      width: 300,
                      height:65}}
                onPress={() => this.submitVerification()}>
                <Text style={{color:'#fff', fontWeight: 'bold'}}>GET STARTED</Text>
            </Button>
        );
      }
    }

    //this.replaceRoute('signup-step1') 
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
