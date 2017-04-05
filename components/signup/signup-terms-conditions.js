/* eslint-disable no-console */

'use strict';

import React, { Component } from 'react';

import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Linking,
    TouchableHighlight, 
    Modal,
    Keyboard,
} from 'react-native';

import {
  ActionSheetCell,
  ButtonCell,
  createValidator,
  DatePickerCell,
  emailValidator,
  Form,
  PushButtonCell,
  Section,
  SwitchCell,
  TextInputCell,
} from 'react-native-forms';

import { Container, Header, Title, Content, Button, Image } from 'native-base';

import Icon from 'react-native-vector-icons/Ionicons';

import CustomInput from './CustomInput';

import moment from 'moment';
import shortid from 'shortid';

import Config from '../../config';

export class SignUpTermsConditions extends Component {
    constructor(props){
        super(props);
        this.state = {
            tenantId: '',
            validated:  false,
            responseData: {},
            termscolor: '#333'
        }
    } 

    componentDidMount() {
        this.getTenantId();
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

   getTenantId() {
     try {
        AsyncStorage.getItem("tenantId")
        .then( (tenantId) =>
              {
                this.setState({tenantId: tenantId});
              }
        )
        .done();
     } catch(err){
         console.log('Failed to get tenantId: ' + err);

         //REMOVE!!!
         let tenantId = '58decc07583ad3e4bab8b0ce';
         console.log('REMOVE!!! USING TEST TENANTID...')
         this.setState({tenantId: tenantId});

     }       
   }    

    onValidationError(ref, message) {
        console.log(ref, message);
    }

    handleChange(ref, change) {
        console.log('>>> handleChange: ', ref, change);

        if(change && change !== ''){
            this.setState({validated:true});
            this.setState({termscolor: 'green'});

            if(ref && ref === 'acceptTermsSwitchCell'){
                if (change === true){
                    this.setState({termscolor: 'green'});
                } else {
                    this.setState({termscolor: 'red'});
                }
            }            
        }
    }

    handlePress(ref) {
        if (ref === 'LogData') {
        console.log(this.form.getData());
        } else if (ref === 'LogValidationErrors') {
        console.log(this.form.getValidationErrors());
        }
    }

    patchData(url, data, cb) {
      if (!url) {
        alert('Invalid parameter: url');
        return;
      }            
      if (!data) {
        alert('Invalid parameter: data');
        return;
      }
      let now = new Date();
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then((response) => response.json()).then((responseData) => {
        console.log('responseData: ', responseData);
        let res = responseData;
        cb(null, res);
      }).catch((error) => {
         console.error(error);
         cb(error, null);
      }).done();        
    }

    saveData() {
        console.log('>>ENTERED: saveData');
        let formData = this.form.getData();
        if (this.validateFormData(formData)) {

            let tenantId = this.state.tenantId;
            if (!tenantId) {
                alert('Failed to Save: Invalid tenantId');
                return;
            }

            let now = new Date();
            let termsAccepted = formData.termsSection.acceptTermsSwitchCell;

            var data = JSON.stringify({
                "termsAccepted": termsAccepted,
                "termsAcceptedOn": now,
                "active": "true",
                "modified": now
            });

            this.saveFormData(tenantId, data, '');
        }
    }

    createUserAccount(tenantId, responseData){
        console.log('>>ENTERED: createUserAccount');
        // let responseData = this.state.responseData;
        if (!responseData || responseData.length === 0) {
            alert('Failed to Create User Account: Invalid data');
            return;
        }    

        let values = responseData;

        console.log('>>>>> values: ', values);

        let userId = shortid.generate();
        let signUpDate = moment().format();
        let now = new Date();
        let url = Config.USERS_API + '/';

        let leaseBeginDate = values.leaseBegin;        

        let addressLine = '';

        let values_fullName = '';
        let values_emailAddress = '';
        let values_phoneNumber = '';
        let values_termsAcceptedOn = '';
        let values_propertyType = '';
        let values_leaseBegin = '';
        let values_leaseEnd = '';

        let values_street1 = '';
        let values_street2 = '';
        let values_city = '';
        let values_stateName = '';
        let values_zip = '';

        let values_bedrooms = '';
        let values_bathrooms = '';
        let values_leaseReason = '';

        let values_pmType = '';
        let values_pmCompanyName = '';
        let values_pmName = '';
        let values_pmPhoneNumber = '';
        let values_pmEmail = '';


        if (values && 
            values.street1 && 
            values.city && 
            values.stateName && 
            values.zip
        ) {
            addressLine = values.street1 + " " + values.city + ", " + values.stateName + " " + values.zip;
        }

        if (values && 
            values.fullName 
        ) {
            values_fullName = values.fullName;
        }        
        
        if (values && 
            values.email 
        ) {
            values_emailAddress = values.email;
            if (values_emailAddress === 'Kjjjj'){
                values_emailAddress = 'test@test.it';
            }
        }           

        values_termsAcceptedOn = now;

        // if (values && 
        //     values.email 
        // ) {
        //     values_emailAddress = values.email;
        // }           

        if (values.propertyType) values_propertyType = values.propertyType;
        if (values.leaseBegin) values_leaseBegin = values.leaseBegin;
        if (values.leaseEnd) values_leaseEnd = values.leaseEnd;
        if (values.street1) values_street1 = values.street1;
        if (values.street2) values_street2 = values.street2;
        if (values.city) values_city = values.city;
        if (values.stateName) values_stateName = values.stateName;
        if (values.zip) values_zip = values.zip;
        if (values.phoneNumber) values_phoneNumber = values.phoneNumber;
        if (values.bedrooms) values_bedrooms = values.bedrooms;
        if (values.bathrooms) values_bathrooms = values.bathrooms;
        if (values.leaseReason) values_leaseReason = values.leaseReason;
        if (values.pmType) values_pmType = values.pmType;
        if (values.pmCompanyName) values_pmCompanyName = values.pmCompanyName;
        if (values.pmName) values_pmName = values.pmName;
        if (values.pmPhoneNumber) values_pmPhoneNumber = values.pmPhoneNumber;
        if (values.pmEmail) values_pmEmail = values.pmEmail;

        let userType = 'Tenant';

        var data = JSON.stringify(
        {
            "userId": userId,
            "tenantId": tenantId,
            "fullName": values_fullName,
            "username": userId,
            "phoneNumber": values_phoneNumber,
            "usertype": userType,
            "email": values_emailAddress,
            "password": "p@ss1word",
            "preferred_contact_method": "SMS",
            "allow_sms_alerts": "true",
            "allow_emails": "true",
            "allow_data_usage": "true",
            "status": "active",
            "deleted": "false",
            "notes": "",
            "signatureUrl": "",
            "termsAcceptedOn": values_termsAcceptedOn,
            "created": now,
            "report": {
                "title": "MyWalkThru Report",
                "reportDate": "",
                "reportId": ""
            },
            "property": {
                "propertyType": values_propertyType,
                "leaseBegins": values_leaseBegin,
                "leaseEnds": values_leaseEnd,
                "addressLine": addressLine,
                "address1": values_street1,
                "address2": values_street2,
                "city": values_city,
                "state": values_stateName,
                "zip": values_zip,
                "photoUrl": "",
                "numberOfBedRooms": values_bedrooms,
                "numberOfBathRooms": values_bathrooms,
                "leaseReason": values_leaseReason
            },
            "propertyManager": {
                "landlordType": values_pmType,
                "company": values_pmCompanyName,
                "landLordName": values_pmName,
                "landLordPhone": values_pmPhoneNumber,
                "landLordEmail": values_pmEmail
            },
            "summary": [],
            "details": []
        });

        var patchData = JSON.stringify(
        {
            "fullName": values_fullName,
            "phoneNumber": values_phoneNumber,
            "termsAcceptedOn": values_termsAcceptedOn,
            "modified": now,
            "property": {
                "propertyType": values_propertyType,
                "leaseBegins": values_leaseBegin,
                "leaseEnds": values_leaseEnd,
                "addressLine": addressLine,
                "address1": values_street1,
                "address2": values_street2,
                "city": values_city,
                "state": values_stateName,
                "zip": values_zip,
                "photoUrl": "",
                "numberOfBedRooms": values_bedrooms,
                "numberOfBathRooms": values_bathrooms,
                "leaseReason": values_leaseReason
            },
            "propertyManager": {
                "landlordType": values_pmType,
                "company": values_pmCompanyName,
                "landLordName": values_pmName,
                "landLordPhone": values_pmPhoneNumber,
                "landLordEmail": values_pmEmail
            }
        });        

        console.log('data: ', data);

        fetch(url, {
                method: 'post',
                headers: {
                "Content-type": "application/json; charset=UTF-8"
                },
            body: patchData
        }).then((response) => response.json()).then((responseData) => {

            console.log('createUserAccount--RESPONSEDATA: ', responseData);

            // if (responseData.error && 
            //     responseData.error.message){
            //     console.log('>>> responseData.error.message..',responseData.error.message);
                
            //     if(responseData.error.name==='ValidationError'){
            //         console.log('>>> PATCHING DATA...');
            //         this.patchData(url, patchData, function(err, res){
            //             if (err) {console.log(err);} else {
            //                 console.log('>>> PATCH DATA RESULT: ', res);
            //             }
            //         });
            //     }
            // }

            try {

                if (!responseData) {
                    alert('Sorry, there was a problem Signing Up.');
                    
                } else {

                    if(!AsyncStorage){
                        this.replaceRoute('signup-complete');
                    }

                    AsyncStorage.setItem("signUpDate", now)
                    .then( () =>
                        {
                            AsyncStorage.setItem("userId", userId)
                            .then( () => {

                                AsyncStorage.setItem("leaseBeginDate", leaseBeginDate)
                                .then( () => {

                                    alert('Thank you for Signing Up! ');

                                    this.replaceRoute('signup-complete');

                                }
                                ).done();
                            }
                            ).done();
                        }
                    )
                    .done( );
                }

            } catch(err){
                console.log('>> createUserAccount failed: ', err);

                this.replaceRoute('signup-complete');
            }

        }).done();        


    }

    validateFormData(formData){
        console.log('>>ENTERED validateFormData');
        console.log('>>> formData: ', formData);

        if (!formData.termsSection.acceptTermsSwitchCell) {
            alert('Terms must be accepted to proceed.');
            return false;
        }        

        return true;      
    }    

    saveFormData(id, data, route) {
      if (!data) {
        alert('Invalid parameter: data');
        return;
      }
      if (!id) {
        alert('Invalid parameter: id');
        return;
      }      
      let url = 'https://mywalkthruapi.herokuapp.com/api/v1/Tenants/' + id;
      let now = new Date();
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then((response) => response.json()).then((responseData) => {
        console.log('responseData: ', responseData);
        
        this.setState({responseData: responseData});

        this.createUserAccount(id, responseData);

        // let result = responseData;
        // if (result && result.id) {
        //     console.log('result.id:', result.id);
        //     if (route) {
        //         this.replaceRoute(route);
        //     }            
        // }
      }).catch((error) => {
         console.error(error);
      }).done();
    }    

    renderNextButton() {
        if (this.state.validated){
        return(
            <Button rounded block
                style={{alignSelf: 'center',
                    marginTop: 20,
                    marginBottom: 20,
                    backgroundColor: '#ad241f',
                    borderRadius:90,
                    width: 300,
                    height:65}}
                    onPress={() => {
                        this.saveData();
                    }}
                >
                <Text style={{color:'#fff', fontWeight: 'bold'}}>NEXT</Text>
            </Button> 
        );
        } else {
            return (<View></View>);
        }
    }

    openTermsConditions() {
        Linking.openURL('http://www.mywalkthru.com/');
    }

    render() {
        const title = 'Terms and Conditions';
        const forwardIcon = <Icon name={'ios-arrow-forward'} color={'gray'} size={20} />;
        const alertIcon = <Icon name={'ios-alert'} color={'gray'} size={20} />;
        
        return (
            <Container  style={{backgroundColor: '#fff'}} >
                <Header>
                    <Button transparent onPress={() => this.replaceRoute('signup-property-manager-info')}>
                        <Icon name='ios-arrow-back' style={{fontSize: 30}} />
                    </Button>                      
                    <Title style={{fontSize: 20}}>{title}</Title>
                </Header>            

        <View style={{ flex: 1, backgroundColor: '#9DD6EB' }}>

        {this.renderNextButton()}

        <Form
          ref={(ref) => { this.form = ref; }}
          onPress={this.handlePress.bind(this)}
          onChange={this.handleChange.bind(this)}
        >

          <Section
            ref={'readTermsSection'}
            title={'TERMS and CONDITIONS'}
            helpText={'Read the Terms and Conditions for using the app.'}
          >

            <TextInputCell
              ref={'MultiLineTextInput'}
              inputProps={{ multiline: true, color: this.state.termscolor, editable: false }}
              cellHeight={200}
              value={"Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service. This Terms of Service was created with (TermsFeed).Accounts.When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.Links To Other Web Sites.Our Service may contain links to third-party web sites or services that are not owned or controlled by My Walk Thru.My Walk Thru has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that My Walk Thru shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services. We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.Termination. We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability. We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability. Governing Law. These Terms shall be governed and construed in accordance with the laws of Texas, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service. Changes. We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service. Contact Us. If you have any questions about these Terms, please contact us."}
            />          


          </Section>

          <Section
            ref={'termsSection'}
            title={'TERMS'}
            helpText={'Switch on if you accept the Terms and Conditions'}
          >
                <SwitchCell
                    ref={'acceptTermsSwitchCell'}
                    switchTintColor={'#8EC5AD'}
                    title={'Do you accept the Terms?'}
                    titleColor={'black'}
                />
          </Section>




        </Form>
      </View>
    </Container>
    );
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

export default connect(null, bindActions)(SignUpTermsConditions);