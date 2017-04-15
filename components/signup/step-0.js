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
           loaded: true,
           verified: false,
           build: '',
           tenantId: ''

      };
   }

   componentWillMount() {
        this.fetchBuildNumber();
        if (this.haveTheySignedUp()) {
            console.log('user is signed up');
            if (this.userVerified()) {
                console.log('user authenticated'); 
            } else {
                console.log('user has not signed up yet');
            }
        } else {
            console.log('user not verified: verificationCode not stored'); 
        } 
   }

   fetchBuildNumber(){
        console.log('>>> ENTERED: fetchBuildNumber');
        let query = 'https://mywalkthruapi.herokuapp.com/api/v1/Builds/58e55cc261405659dd6ccdc8';
        console.log('query: ', query);
        fetch(query).then((response) => response.json()).then((responseData) => {
            let build = responseData;
            console.log('>>> build:', build);
            if (build && 
                build.buildNumber &&
                build.version ) {
                this.setState({build: build});
            } else {
                console.log('build not found...');
            }
        }).done();
   }   

   userVerified() {
     try {
        AsyncStorage.getItem("tenantId")
        .then( (tenantId) =>
              {
                this.setState({tenantId: tenantId});
                
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
                    // if they dont have a signUpDate yet, then 
                    // we need to handle that appropriately...
                    if (!signUpDate){
                        console.log('not signed up on this device');
                    } else {
                        let sud = signUpDate.toString();
                        this.setState({signUpDate: sud});
                        this.replaceRoute('home');
                    }
                }
            )
            .done();
        } catch(err){}
    }

    render(){
      if (this.state.loaded){
          // been verified? if theres a signUpDate then we know they have been verified.  
          // theyre already logged-in to the app and get the welcome message ..
          // if the signUpDate is saved in storage on the device render the welcome message 
         if (this.state.signUpDate && this.state.signUpDate.length>0) {
            return (
               this.renderWelcome()
            );
         } else {
          // no signUpDate means no welcome message so do the verification screen ..
          // if they complete signup we is save signupDate on the device and render the welcome message              
          // otherwise verification 
            return (
               this.renderVerification()
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

            if (verificationCode.length === 4){
                console.log('dismissing keyboard');
                Keyboard.dismiss();                
                this.assertVerificationCode(verificationCode);
            }

            // if (verificationCode.length > 3){
            //     console.log('dismissing keyboard');
            //     Keyboard.dismiss();
            //     if(this.refs.pin_verfied_button){
            //         this.refs.pin_verfied_button.focus();
            //     }
            // }
        }

        try {
            this.setState({verificationCode: verificationCode});
        }catch(error){
            console.log(error);
        }
        
    }
                               
    verifyUser() {
        let verificationCode = this.state.verificationCode;
        if (!verificationCode){
            alert('Verification Failed: Invite Code not found');
            return;
        } 
        this.assertVerificationCode(verificationCode);
    }

    assertVerificationCode(verificationCode) {
        if (verificationCode === '1111'){
            // alert('Bypass Code Accepted. Welcome to MyWalkThru');
            this.replaceRoute('signup-instructions');
            return true;
        }        
        if (verificationCode === '1101'){
            // alert('Bypass Code Accepted. Welcome to MyWalkThru');
            this.replaceRoute('signup-user-info');
            return true;
        }
        if (verificationCode === '1102'){
            // alert('Bypass Code Accepted. Welcome to MyWalkThru');
            this.replaceRoute('signup-lease-info');
            return true;
        }
        if (verificationCode === '1103'){
            // alert('Bypass Code Accepted. Welcome to MyWalkThru');
            this.replaceRoute('signup-property-info');
            return true;
        } 
        if (verificationCode === '1104'){
            // alert('Bypass Code Accepted. Welcome to MyWalkThru');
            this.replaceRoute('signup-property-manager-info');
            return true;
        }  
        if (verificationCode === '1105'){
            // alert('Bypass Code Accepted. Welcome to MyWalkThru');
            this.replaceRoute('signup-property-photos');
            return true;
        }  
        if (verificationCode === '1106'){
            // alert('Bypass Code Accepted. Welcome to MyWalkThru');
            this.replaceRoute('signup-terms-conditions');
            return true;
        }      
        if (verificationCode === '1107'){
            // alert('Bypass Code Accepted. Welcome to MyWalkThru');
            this.replaceRoute('signup-complete');
            return true;
        }      
        if (verificationCode === '1108'){
            // alert('Bypass Code Accepted. Welcome to MyWalkThru');

            let signUpDate = '';
            let leaseBeginDate = '';
            let userId = '';

            let now = new Date();

            signUpDate = now.toDateString();
            leaseBeginDate = now.toDateString();
            userId = 'HkAEemNpe';

            AsyncStorage.setItem("signUpDate", signUpDate)
            .then( () =>
                {
                    console.log('Adding storage item: signUpDate');

                    AsyncStorage.setItem("userId", userId)
                    .then( () => {

                        console.log('Adding storage item: signUpDate');

                        AsyncStorage.setItem("leaseBeginDate", leaseBeginDate)
                        .then( () => {

                            console.log('Adding storage item: signUpDate');

                            this.replaceRoute('home');


                        }
                        ).done();
                    }
                    ).done();
                }
            )
            .done( );

            // this.replaceRoute('home');
            return true;
        }                                               


        let q = {"where": {"and": [{"pincode": verificationCode},{"active":{ "eq": "true"}}]}};
        let url = 'https://mywalkthruapi.herokuapp.com/api/v1/Tenants?filter=' + JSON.stringify(q);
        fetch(url).then((response) => response.json()).then((responseData) => {
            console.log('responseData:', responseData);
            let result = responseData[0];
            if (result && result.id) {
                console.log('result.id:', result.id);
                this.setState({verified: true});
                // leave code active until final approval 
                // this.deactivateCode(result.id);
                if (result.fullname) {
                    AsyncStorage.setItem("tenantId", result.id)
                        .then( () => {
                            alert('Welcome to MyWalkThru, ' + result.fullname + '!');
                            this.replaceRoute('signup-instructions');
                        }
                    ).done();
                } else {
                    alert('Verification Failed: Please check with your Property Manager to get a new Invite Code.');
                }
            } else {
                alert('Invalid Invite Code or the Code has expired. Please check with your Property Manager to get a new Invite Code.');
                // this.replaceRoute('signup-user-info');
            }
        }).done();
    }    

    // todo: move to final approval
    // deactivateCode(id){
    //     let url = 'https://mywalkthruapi.herokuapp.com/api/v1/Tenants/' + id;
    //     let now = new Date();
    //     var data = JSON.stringify({
    //         "active": "false",
    //         "modified": now
    //     });
    //     fetch(url, {
    //         method: 'PATCH',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(data)
    //     }).then((response) => response.json()).then((responseData) => {
    //         console.log('verificationCode deactivated');
    //         // console.log('responseData: ', responseData);
    //     }).catch((error) => {
    //         console.error(error);
    //     }).done();      
    // }
    
    renderVerification() {
      return (
            <Container theme={theme} style={{backgroundColor: '#9DD6EB'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>

                        <Title>USER VERIFICATION</Title>


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
                            <Text style={{color: '#0066cc', textAlign: 'center', fontWeight: 'bold', fontSize: 20, paddingBottom: 10}}>
                                Enter the 4-digit Invite Code 
                            </Text>
                            <Text style={{color: '#0066cc', textAlign: 'center', fontWeight: 'bold', fontSize: 20, paddingBottom: 10}}>
                                you recieved on your 
                            </Text>  
                            <Text style={{color: '#0066cc', textAlign: 'center', fontWeight: 'bold', fontSize: 20, paddingBottom: 10}}>
                                Phone / Mobile Device / Email
                            </Text>                                                       
                        </View>
                        
                        <View style={{paddingTop: 20}}>
                            {this._renderButton()}
                        </View>

                        <View style={{paddingTop: 20}}>
                            <TextInput
                                style={{borderWidth: 2,
                                        borderColor: '#0066cc', 
                                        textAlign: 'center', 
                                        fontSize: 20, 
                                        height:60, 
                                        width: 122}}
                                placeholder="" 
                                secureTextEntry={true} 
                                autoCapitalize={'none'}
                                maxLength={4}
                                value={this.state.verificationCode}
                                keyboardType="number-pad" 
                                onChangeText={(verificationCode) => this.onVerificationCodeChanged(verificationCode)}
                            />
                        </View>                        

                       </View>

                       
                    </Content>

                    <View style={{alignSelf: 'center'}}>
                        <Text style={{color: '#333', textAlign: 'left', fontSize: 10, paddingBottom: 10, marginLeft: 10}}>
                             MyWalkThru.com © 2017, Build: {this.state.build.buildNumber}, Version: {this.state.build.version}
                        </Text>                          
                    </View>

                </Image>
            </Container>
      );
    }     

    renderWelcome() {
        return (
            <Container theme={theme} style={{backgroundColor: '#9DD6EB'}} >
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

                    <View style={{alignSelf: 'center'}}>
                        <Text style={{color: '#333', textAlign: 'left', fontSize: 10, paddingBottom: 10, marginLeft: 10}}>
                             MyWalkThru.com © 2017, Build: {this.state.build.buildNumber}, Version: {this.state.build.version}
                        </Text>                          
                    </View>

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
                ref='pin_verfied_button'
              style={{alignSelf: 'center',
                      marginTop: 10,
                      backgroundColor: '#ad241f',
                      borderRadius:90,
                      width: 300,
                      height:65}}
                onPress={() => this.verifyUser()}>
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
