'use strict';

import React, { Component } from 'react';
import { AsyncStorage, Image, View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input, Textarea } from 'native-base';

import moment from 'moment';

import theme from '../../themes/form-theme';
import styles from './styles';

import { SegmentedControls } from 'react-native-radio-buttons'

import Config from '../../config'

class Step6 extends Component {
   constructor(props) {
      super(props);
      this.state = {
           email: '',
           username: '',
           street1: '',
           street2: '',
           city: '',
           stateabbr: '',
           zip: '',
           pm_companyname: '',
           pm_contactname: '',
           pm_email: '',
           pm_phone: '',
           tenant_phone: '',
           preferred_contact: '',
           sms_alerts: '',
           selectedOption: 0,
           termsAcceptedOn: '',
           userCreatedSuccess: false,
      };
   }

   mapStorageToState(cb) {
      console.log(">>> ENTERED: step-6 mapStorageToState");
      AsyncStorage.getItem("email")
      .then( (email) =>
            {
              this.setState({email:email})
              return AsyncStorage.getItem("username")
            }
      )
      .then( (username) =>
          {
              this.setState({username: username})
              return AsyncStorage.getItem("street1")
          }
      )
      .then( (street1) =>
          {
              this.setState({street1:street1})
              return AsyncStorage.getItem("street2")
          }
      )
      .then( (street2) =>
          {
             this.setState({street2:street2})
             return AsyncStorage.getItem("city")
          }
      )
      .then( (city) =>
            {
              this.setState({city:city})
              return AsyncStorage.getItem("stateabbr")
            }
      )
      .then( (stateabbr) =>
            {
              this.setState({stateabbr:stateabbr})
              return AsyncStorage.getItem("zip")
            }
      )
      .then( (zip) =>
            {
              this.setState({zip:zip})
              return AsyncStorage.getItem("pm_companyname")
            }
      )
      .then( (pm_companyname) =>
            {
              this.setState({pm_companyname:pm_companyname})
              return AsyncStorage.getItem("pm_contactname")
            }
      )
      .then( (pm_contactname) =>
            {
              this.setState({pm_contactname:pm_contactname})
              return AsyncStorage.getItem("tenant_phone")
            }
      )
      .then( (tenant_phone) =>
            {
              this.setState({tenant_phone:tenant_phone})
              return AsyncStorage.getItem("preferred_contact")
            }
      )
      .then( (preferred_contact) =>
            {
              this.setState({preferred_contact:preferred_contact})
              return AsyncStorage.getItem("sms_alerts")
            }
      )
      .then( (sms_alerts) =>
          {
               this.setState({sms_alerts:sms_alerts})
               console.log(">>> FINISHED: step-6 mapStorageToState");
               this.onCreateUser();this.onCreateUser();
               return cb(null, 'done');
          }
      )
      .done(

      );

      // console.log("AsyncStorage.getItem done");
      //
      // return cb(null, 'done');
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

     getOptions() {
       var options = [
        "I Accept",
        "I Decline"
       ];
       return options;
    }

     setSelectedOption(selectedOption){
        if (selectedOption === 'I Decline'){
           alert('Sorry, you will need to Accept the Terms to proceed to start your Walk Thru');
        } else {
           alert('Great, thank you for Accepting the Terms.  Click the Next button to proceed to start your Walk Thru');
        }
         this.setState({
            selectedOption
         });
     }

     getCurrentDateTime(){
      return moment().format('MMM DD YYYY h:mm:ss a');
     }

     renderOption(option, selected, onSelect, index){
      const style = selected ? { fontWeight: 'bold'} : {};

      return (
         <TouchableWithoutFeedback onPress={onSelect} key={index}>
           <Text style={style}>{option}</Text>
         </TouchableWithoutFeedback>
      );
     }

     renderContainer(optionNodes){
      return <View>{optionNodes}</View>;
     }

   //   postUser(){
        // create on api user
        // store the userid in device storage!
        // send the user a welcome email
        // copy the sub category models and patch the user id
        // change the queries to filter by that userid
   //   }

     onCreateUser() {
       console.log('>>> ENTERED : onCreateUser...');

       if (!this.state.email || this.state.email === '') {
          alert('Email address is required');
          return;
       }

       if (!this.state.username || this.state.username === 0) {
          alert('username is required');
          return;
       }

       var now = new Date();
       var url = Config.USERS_API + '/';

       var data = JSON.stringify({
         "username": this.state.username,
         "usertype": "Tenant",
         "email": this.state.email,
         "password": "p@ss1word",
         "status": "active",
         "created": now,
         "street1": this.state.street1,
         "street2": this.state.street2,
         "city": this.state.city,
         "stateabbr": this.state.stateabbr,
         "zip": this.state.zip,
         "pm_companyname": this.state.pm_companyname,
         "pm_contactname": this.state.pm_contactname,
         "pm_email": this.state.pm_email,
         "pm_phone": this.state.pm_phone,
         "tenant_phone": this.state.tenant_phone,
         "preferred_contact": this.state.preferred_contact,
         "sms_alerts": this.state.sms_alerts,
         "termsAcceptedOn": this.state.termsAcceptedOn
       });

       console.log('data: ', data);


         //  // API Call
         //  fetch(url, {
         //      method: 'post',
         //      headers: {
         //        "Content-type": "application/json; charset=UTF-8"
         //      },
         //     body: data
         // }).then((response) => response.json()).then((responseData) => {
         //  console.log('USER CREATED: ', responseData);
         //  this.replaceRoute('home', {email: this.state.email, username: this.state.username});
         // }).done();

         console.log('<<< Finished onCreateUser');

         this.replaceRoute('home', {email: this.state.email, username: this.state.username});
     }

     createUserAccount(){
        console.log('<<< ENTERED createUserAccount');

         var termsAcceptedOn = "";
         let termsAccepted = this.state.selectedOption === "I Accept" ? true : false;

         termsAcceptedOn = moment().format();

         alert('Thank you for accepting the Terms.  Enjoy the App.  ' + termsAcceptedOn);

         this.setState({"termsAcceptedOn": termsAcceptedOn});

         // AsyncStorage.setItem("termsAccepted", this.state.selectedOption );
         // AsyncStorage.setItem("termsAcceptedOn", termsAcceptedOn);

         AsyncStorage.setItem("termsAccepted", this.state.selectedOption)
         .then( () =>
             {
                 return AsyncStorage.setItem("termsAcceptedOn", termsAcceptedOn)
             }
         )
         .done( );

         this.mapStorageToState(function(err, res){
            if (err){
               console.log(err);
            } else {
               console.log(res);
            }
         });

         // if (this.mapStorageToState()) {
         //    this.onCreateUser();
         //
         //    // this.replaceRoute('home', {email: this.state.email, username: this.state.username});
         // }

         // this.replaceRoute('home', {email: this.state.email, username: this.state.username});

         console.log('<<< FINISHED createUserAccount');
     }

     maybeProceed() {
        if (this.state.selectedOption === 'I Accept'){
           this.createUserAccount();
        } else {
           alert('Sorry, you will need to Accept the Terms to proceed to the App');
        }
     }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('signup-step5')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Last Step: Accept the Terms of Use (required)</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                        <Card transparent foregroundColor="#000">
                            <CardItem header>
                                <Text>Terms of Use</Text>
                            </CardItem>
                            <CardItem>
                                 <Textarea disabled placeholder="Use Agreement" style={{color: '#333', height: 500, overflow: 'scroll'}} value='OnSight PROS My Walk Thru is a service provided to landlords, property managers, and insurance companies and the reports reflect the condition of the property on the date of the Report. These reports are provided by trained individuals. This report is not to be mistaken with the report one will receive by a licensed inspector in a particular state.  OnSight PROS My Walk Thru is is not responsible for personal data usage.
                                 Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the http://www.onsightpros.com/ website (the "Service") operated by My Walk Thru ("us", "we", or "our").

Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.

By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service. This Terms of Service was created with (TermsFeed).

Accounts

When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.

You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.

You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.

Links To Other Web Sites

Our Service may contain links to third-party web sites or services that are not owned or controlled by My Walk Thru.

My Walk Thru has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that My Walk Thru shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.

We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.

Termination

We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.

We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.

All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.

Governing Law

These Terms shall be governed and construed in accordance with the laws of Texas, United States, without regard to its conflict of law provisions.

Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.

Changes

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.

Contact Us

If you have any questions about these Terms, please contact us.'>
                                 </Textarea>
                            </CardItem>
                            <CardItem>
                               <SegmentedControls
                                tint={'#007AFF'}
                                selectedTint= {'#ffffff'}
                                backTint= {'#ffffff'}
                                options={ this.getOptions() }
                                allowFontScaling={ true }
                                onSelection={ this.setSelectedOption.bind(this) }
                                selectedOption={ this.state.selectedOption }
                                optionStyles={{fontFamily: 'AvenirNext-Medium'}}
                                optionContainerStyle={{flex: 1}}
                              />
                           </CardItem>
                        </Card>
                    </Content>

                    <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}} onPress={() => this.maybeProceed()}>
                        Next
                    </Button>
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

export default connect(null, bindActions)(Step6);
