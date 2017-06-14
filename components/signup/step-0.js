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

import moment from 'moment';
import tz from 'moment-timezone';

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
           tenantId: '',
           loggedin: '', 
           userId: ''
      };
   }

   componentWillMount() {

        // this.fetchBuildNumber();

        // if (this.haveTheySignedUp()) {
        //     console.log('user signed up');
       
            // if (this.userLoggedIn()) {
            //     console.log('user logged in'); 

            //     // this.replaceRoute('home');
            // } else {
            //     console.log('user is not logged in');
            // }

        // } else {
        //     console.log('user not Signed Up'); 
        // } 
   }

   fetchBuildNumber(){
        console.log('>>> ENTERED: fetchBuildNumber');
        let query = 'https://mywalkthruapi.herokuapp.com/api/v1/Builds';
        console.log('query: ', query);
        fetch(query).then((response) => response.json()).then((responseData) => {
            let build = responseData[0];
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

//    getStorageItems(){
//        this.getUserId()();
//    }

    getTenantId() {
        try {
            AsyncStorage
                .getItem("tenantId")
                .then((tenantId) => {
                    this.setState({tenantId: tenantId});
                    this.getUserId();
                })
                .done();
        } catch (err) {
            console.log('Failed to get tenantId: ' + err);
        }
    }

    getUserId() {
        try {
            AsyncStorage
                .getItem("userId")
                .then((userId) => {
                    this.setState({userId: userId});
                    // this.getSignUpDate();
                    if (userId && userId.length>0) {
                        this.replaceRoute('home');
                    }
                })
                .done();
        } catch (err) {
            console.log('Failed to get userId: ' + err);
        }
    }

    getSignUpDate() {
        try {
            AsyncStorage
                .getItem("signUpDate")
                .then((signUpDate) => {
                    if (signUpDate && signUpDate.length>0){
                        let sud = signUpDate.toString();
                        if (sud) this.setState({signUpDate: sud});
                    }
                    // this.setState({signUpDate: signUpDate});
                    // return sud;
                })
                .done();
        } catch (err) {
            console.log('Failed to get userId: ' + err);
        }
    }        

    userLoggedIn() {
        try {
            AsyncStorage.getItem("loggedin")
                .then((loggedin) =>
                {
                    this.setState({loggedin: loggedin});
                    // if (loggedin === '1') return true;
                    this.replaceRoute('home');
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

        // this.getUserId();

        // console.log('>>haveTheySignedUp>>this.state.tenantId:',this.state.tenantId);
        // console.log('>>haveTheySignedUp>>this.state.userId:',this.state.userId);
        // console.log('>>haveTheySignedUp>>this.state.signUpDate:',this.state.signUpDate);

        // if (this.state.tenantId && this.state.userId && this.state.signUpDate){
        //     console.log('>> haveTheySignedUp >> ', this.state.userId,' signed up on: ', this.state.signUpDate);



        //     this.replaceRoute('home');
        // } else {
        //     console.log('>> haveTheySignedUp >> no user info found in storage >> user must login using pin');
        // }

        // try {
        //     AsyncStorage.getItem("signUpDate")
        //     .then((signUpDate) =>
        //         {
        //             // if they dont have a signUpDate yet, then 
        //             // we need to handle that appropriately...
        //             if (!signUpDate){
        //                 console.log('not signed up on this device');
        //             } else {
        //                 let sud = signUpDate.toString();
        //                 if (sud) this.setState({signUpDate: sud});
        //                 // this.replaceRoute('home');
        //             }
        //         }
        //     )
        //     .done();
        // } catch(err){}
    }

    render(){
      if (this.state.loaded){
          // been verified? if theres a signUpDate then we know they have been verified.  
          // theyre already logged-in to the app and get the welcome message ..
          // if the signUpDate is saved in storage on the device render the welcome message 
         if (this.state.signUpDate && this.state.signUpDate.length>0) {
            return (
               this.renderVerification()
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
             <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
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
                // console.log('dismissing keyboard');
                Keyboard.dismiss();                
                this.assertVerificationCode(verificationCode);
            }
        }
        try {
            this.setState({verificationCode: verificationCode});
        } catch(error) {
            console.log(error);
        }
        
    }
                               
    verifyUser() {
        let verificationCode = this.state.verificationCode;
        if (!verificationCode){
            alert('Verification Code invalid');
            return;
        } 
        this.assertVerificationCode(verificationCode);
    }              

    assertVerificationCode(verificationCode) {
        let q = {"where": {"and": [{"pincode": verificationCode},{"active":{ "eq": "true"}}]}};
        let url = 'https://mywalkthruapi.herokuapp.com/api/v1/Tenants?filter=' + JSON.stringify(q);
        fetch(url).then((response) => response.json()).then((responseData) => {
            // console.log('responseData:', responseData);
            let result = responseData[0];
            if (result && result.id) {
                // console.log('result.id:', result.id);
                // alert(result.id);
                this.setState({verified: true});
                // leave code active until final approval 
                // this.deactivateCode(result.id);
                if (result.fullname) {
                    AsyncStorage.setItem("tenantId", result.id)
                        .then( () => {
                            // try to parse the first name  
                            let s = result.fullname;
                            if (s && s.length > 0) {
                                s = s.trim();
                                let n = s.lastIndexOf(' '); 
                                if (n){
                                    let firstName = s.substring(0, n); 
                                    let greeting = '';  
                                    let timeOfDay = '';  
                                    let date = new Date();
                                    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                                    const currentTime = moment().tz(timezone).format();
                                    let hours = new Date(currentTime).getHours();
                                    if (hours >= 12) {
                                        timeOfDay = 'Good Afternoon';
                                    } else {
                                        timeOfDay = 'Good Morning';
                                    }
                                    if (firstName && firstName.length>0){
                                        greeting = timeOfDay + ', ' + firstName + '!';
                                    } else {
                                        greeting = timeOfDay + ', ' + s + '!';
                                    }
                                    // alert(greeting);                                    
                                }
                            }

                            console.log('>>assertVerificationCode>>resultuserId:',result.userId);

                            if (result.userId && result.userId.length>0){
                                AsyncStorage.setItem("loggedin", "1")
                                    .then( () => {
                                        console.log('Added storage item: loggedin');
                                        AsyncStorage.setItem("signUpDate", result.created)
                                        .then( () =>
                                            {
                                                console.log('Added storage item: signUpDate');
                                                if (result.leaseBegins || result.leaseBegin) {
                                                    let lb = '';
                                                    if (result.leaseBegins) lb = result.leaseBegins;
                                                    if (result.leaseBegin) lb = result.leaseBegin;
                                                    AsyncStorage.setItem("leaseBeginDate", lb)
                                                        .then( () => {
                                                            console.log('Adding storage item: leaseBegin');
                                                            AsyncStorage.setItem("userId", result.userId)
                                                                .then( () => {
                                                                    console.log('Adding storage item: userId');
                                                                    this.replaceRoute('home');
                                                                }
                                                            ).done();                                                    
                                                        }
                                                        ).done();
                                                }

                                            }
                                        )
                                        .done( );                                   
                                    }
                                ).done(); 
                            } else {
                                AsyncStorage.setItem("loggedin", "0")
                                    .then( () => {
                                        console.log('user does not exist, user is not logged in');
                                        this.replaceRoute('signup-instructions');
                                    }
                                ).done(); 
                            }
                        }
                    ).done();
                } else {
                    alert('Verification Failed: Please request a new Invite Code.');
                }
            } else {
                alert('Invite Code has expired. Please request a new Invite Code.');
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
            <Container theme={theme} style={{backgroundColor: '#fff'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header  style={{backgroundColor: '#2B59AC'}}>
                        <Title>
                            SIGN IN 
                        </Title>
                    </Header>
                    <Content padder style={{backgroundColor: 'transparent'}} >
                       <View style={welcomeStyle.welcomeContainer}>

                        <View style={{paddingBottom: 10, marginTop: 10}}>
                          <Text style={{color:'#C31826', fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>
                            WELCOME TO MYWALKTHRU
                          </Text>
                        </View> 

                        <View>
                           <Image
                            source={require('../../assets/images/mwtlogo.png')}
                            style={{width:175,height:200, marginTop: 20}}
                           />
                        </View>
                        <View>
                            <Text style={{marginTop: 20, color: 'rgb(68,68,68)', textAlign: 'center', fontWeight: 'bold', fontSize: 20, paddingBottom: 10}}>
                                Enter your Invite Code 
                            </Text>                                                 
                        </View>
                        
                        <View style={{paddingTop: 20}}>
                            {this._renderButton()}
                        </View>

                        <View style={{paddingTop: 20}}>
                            <TextInput
                                style={{borderWidth: 2,
                                        borderColor: 'rgb(68,68,68)', 
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

                    {/*<View style={{alignSelf: 'center'}}>
                        <Text style={{color: '#333', textAlign: 'left', fontSize: 10, paddingBottom: 10, marginLeft: 10}}>
                             MyWalkThru.com © 2017, Build: Z281X3HX5ZM, Version: 1.8.2
                        </Text>                          
                    </View>*/}

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

                    {/*<View style={{alignSelf: 'center'}}>
                        <Text style={{color: '#333', textAlign: 'left', fontSize: 10, paddingBottom: 10, marginLeft: 10}}>
                             MyWalkThru.com © 2017, Build: {this.state.build.buildNumber}, Version: {this.state.build.version}
                        </Text>                          
                    </View>*/}

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
                    backgroundColor: '#2B59AC',
                    borderRadius:90,
                    width: 300,
                    height:44}}
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
                      backgroundColor: '#2B59AC',
                      borderRadius:90,
                      width: 300,
                      height:44}}
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
