/* eslint-disable no-console */

'use strict';

import React, { Component } from 'react';

import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import {
    AsyncStorage,
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
            termscolor: '#333',
            tenantInfo: [],
            termsAccepted: false
        }
    } 

    componentDidMount() {
        this.getTenantId();
    }

    // replaceRoute(route) {
    //     this.props.replaceRoute(route);
    // }

    replaceRoute(route) {
      console.log('>>>>> entered: [replaceRoute]: ', route);
      this.props.navigation.navigate(route);
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
                console.log('>>>>>>> GOT tenantId from AsyncStorage! ', tenantId);
                this.setState({tenantId: tenantId});
              }
        )
        .done();
     } catch(err){

         console.log('>>>>>>> FAILED to GET tenantId from AsyncStorage! : ' + err);

        //  //REMOVE!!!
        //  let tenantId = '58decc07583ad3e4bab8b0ce';
        //  console.log('REMOVE!!! USING TEST TENANTID...')
        //  this.setState({tenantId: tenantId});

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
                    this.setState({termscolor: 'green', termsAccepted: true});
                } else {
                    this.setState({termscolor: 'red', termsAccepted: false});
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

        if (!formData) {
            alert('Invalid formData');
            return;
        }        

        if (this.validateFormData(formData)) {

            let tenantId = this.state.tenantId;

            if (!tenantId) {
                alert('Failed to Save: Invalid tenantId');
                return;
            }

            let now = new Date();
            let termsAccepted = formData.termsSection.acceptTermsSwitchCell;
            let userId = shortid.generate();

            var data = JSON.stringify({
                "userId": userId, 
                "termsAccepted": termsAccepted,
                "termsAcceptedOn": now,
                "active": "true",
                "modified": now
            });

            this.saveFormData(tenantId, userId, data, '');
        }
    }

    buildUserAccountModel(tenantId, userId, cb) {
        let fn = '>>> buildUserAccountModel ';
        let mappedModel = {};
        let values = {};
        
        console.log('[ENTERED]', fn, '>>> tenantId: ', tenantId, '>>> userId: ', userId);

        if (!tenantId){
            alert('Error: Missing tenantId');
            return;
        }  

        if (!userId){
            alert('Error: Missing userId');
            return;
        }                

        let now = moment().format();

        let user = {
            userType: '',
            userId: userId,
            password: shortid.generate(),
            tenantId: tenantId,
            signUpDate: now.toString(),
            termsAccepted: true ,
            termsAcceptedOn: now.toString(),                
            fullName: '' ,
            phoneNumber: '' ,
            email: '' ,
            gender: '' ,
            birthday: '' ,        
            leaseReason: '' ,
            leaseBegin: '' ,
            leaseEnd: '' ,
            propertyType: '' ,
            addressLine: '' ,
            street1: '' ,
            street2: '' ,
            city: '' ,
            stateName: '' ,
            zip: '' ,
            geocode: '' ,
            bedrooms: '' ,
            bathrooms: '' ,
            dining: false ,
            laundry: false ,
            family: false ,
            game: false ,
            centralAir: false ,
            centralHeat: false ,
            forcedAir: false ,
            windowUnit: false ,
            stories: '' ,
            parking: '' ,
            pmType: '' ,
            pmCompanyName: '' ,
            pmName: '' ,
            pmPhoneNumber: '' ,
            pmEmail: ''   
        }      

        console.log(fn, '>>> invoking: fetchTenant');

        this.fetchTenant(tenantId, function(err,res) {
            if (err){
                console.log(fn, '>>> Error: Failed to fetch tenant info: ', err);
                return;
            } else {
                if(res){
                    console.log(fn, '>>> fetched tenant info: ', res);

                    if (!res || res.length===0){
                        alert('Error: No values were provided in onboarding screens');
                        return;
                    }

                    // note: tenant model 
                    values = res;


                    if (values.userType) user.userType = values.userType;


                    if (values.fullName) user.fullName = values.fullName;
                    if (values.fullname) user.fullName = values.fullname;
                    if (values.email) user.email = values.email;
                    if (values.phoneNumber) user.phoneNumber = values.phoneNumber;
                    if (values.gender) user.gender = values.gender;
                    if (values.birthday) user.birthday = values.birthday;



                    if (values.leaseReason) user.leaseReason = values.leaseReason;
                    if (values.leaseBegin) user.leaseBegin = values.leaseBegin;
                    if (values.leaseEnd) user.leaseEnd = values.leaseEnd;                    



                    if (values.propertyType) user.propertyType = values.propertyType;
                    if (values.street1) user.street1 = values.street1;
                    if (values.street2) user.street2 = values.street2;
                    if (values.city) user.city = values.city;
                    if (values.stateName) user.stateName = values.stateName;
                    if (values.zip) user.zip = values.zip;


                    if (user.street1 && user.city && user.state && user.zip){
                        user.addressLine = user.street1 + ' ' + user.street2 + ' ' + user.city + ', ' + user.stateName + ' ' + user.zip;
                    }

                    if (values.geocode) user.geocode = values.geocode;

                    if (values.bedrooms) user.bedrooms = values.bedrooms;
                    if (values.bathrooms) user.bathrooms = values.bathrooms;

                    if (values.dining) user.dining = values.dining;
                    if (values.laundry) user.laundry = values.laundry;
                    if (values.family) user.family = values.family;
                    if (values.game) user.game = values.game;

                    if (values.centralAir) user.centralAir = values.centralAir;
                    if (values.centralHeat) user.centralHeat = values.centralHeat;
                    if (values.forcedAir) user.forcedAir = values.forcedAir;
                    if (values.windowUnit) user.windowUnit = values.windowUnit;

                    if (values.stories) user.stories = values.stories;
                    if (values.parking) user.parking = values.parking;                   

                    if (values.pmType) user.pmType = values.pmType;
                    if (values.pmCompanyName) user.pmCompanyName = values.pmCompanyName;
                    if (values.pmName) user.pmName = values.pmName;
                    if (values.pmPhoneNumber) user.pmPhoneNumber = values.pmPhoneNumber;
                    if (values.pmEmail) user.pmEmail = values.pmEmail;

                    let mappedModel = {
                        "id": shortid.generate(),
                        "tenantId": tenantId,
                        "userId": userId,
                        "email": user.email,
                        "password": shortid.generate(),
                        "username": shortid.generate(),
                        "usertype": user.userType,  
                        "status": "active",
                        "fullName": user.fullName,
                        "phoneNumber": user.phoneNumber,
                        "preferred_contact_method": "SMS",
                        "allow_sms_alerts": "true",
                        "allow_emails": "true",
                        "allow_data_usage": "true",
                        "deleted": "false",
                        "notes": "",
                        "signatureUrl": "",
                        "termsAcceptedOn": user.termsAcceptedOn,
                        "report": {
                            "title": "MyWalkThru Report (Tenant Copy)",
                            "reportDate": "",
                            "reportId": ""
                        },
                        "property": {
                            "propertyType": user.propertyType,
                            "addressLine": user.addressLine,
                            "address1": user.street1,
                            "address2": user.street2,
                            "city": user.city,
                            "stateName": user.stateName,
                            "zip": user.zip,
                            "photoUrl": "",
                            "dateObserved": "",
                            "bedrooms": user.bedrooms,
                            "bathrooms": user.bathrooms,

                            "dining": user.dining,
                            "laundry": user.laundry,
                            "family": user.family,
                            "game": user.game,
                            "centralAir": user.centralAir,
                            "centralHeat": user.centralHeat,
                            "forcedAir": user.forcedAir,
                            "windowUnit": user.windowUnit,
                            "stories": user.stories,
                            "parking": user.parking,

                            "leaseReason": user.leaseReason,
                            "leaseBegins": user.leaseBegin,
                            "leaseEnds": user.leaseEnd                            
                        },
                        "propertyManager": {
                            "landlordType": user.pmType,
                            "company": user.pmCompanyName,
                            "landLordName": user.pmName,
                            "landLordPhone": user.pmPhoneNumber,
                            "landLordEmail": user.pmEmail
                        },
                        "summary": [],
                        "details": []
                    }; 

                    cb(null, mappedModel);

                } else {
                    console.log(fn, '>>> Error: Failed to fetch tenant info: ');
                    return cb('didnt work', null);
                }
            }
        }); 

        return mappedModel;
    }
  

    createTestUser(tenantId, userId, cb){
        let u = {
            "id": shortid.generate(),
            "tenantId": tenantId,
            "userId": userId,
            "email": "james"+shortid.generate()+"@me.com",
            "password": "p@"+shortid.generate(),
            "username": shortid.generate(),
            "usertype": "Tenant",  
            "status": "active",
            "tenantId": "58decc07583ad3e4bab8b0ce",
            "fullName": "James Smith",
            "phoneNumber": "2135648970",
            "preferred_contact_method": "SMS",
            "allow_sms_alerts": "true",
            "allow_emails": "true",
            "allow_data_usage": "true",
            "deleted": "false",
            "notes": "",
            "signatureUrl": "",
            "termsAcceptedOn": "2017-04-03T22:38:29.808Z",
            "report": {
            "title": "MyWalkThru Report (Tenant Copy)",
            "reportDate": "",
            "reportId": ""
            },
            "property": {
            "propertyType": "Single Family",
            "leaseBegins": "2017-04-08T22:26:16.506Z",
            "leaseEnds": "2018-04-04T22:26:16.506Z",
            "addressLine": "123 Me Street, Coopers, TX 99999",
            "address1": "123 Me Street",
            "address2": "",
            "city": "Coopers",
            "state": "TX",
            "zip": "78123",
            "photoUrl": "https://mywalkthru-pm-files.s3.amazonaws.com/photos%2FHyFcYY5nl___ry53ctchl.jpg",
            "dateObserved": "2017-03-30T13:40:03.399Z",
            "bedrooms": "4",
            "bathrooms": "2½",
            "leaseReason": " First Time Lease"
            },
            "propertyManager": {
            "landlordType": "Individual",
            "company": "Real Testing Properties, Inc. ",
            "landLordName": "Slick Williams, III",
            "landLordPhone": "8765432109",
            "landLordEmail": "slickw@test.it"
            },
            "summary": [],
            "details": []
        };  
        cb(null, u);
    }    

    createUserAccount(tenantId, userId, cb) { 
        let fn = '>>> createUserAccount ';

        console.log('[ENTERED]', fn, '>>> tenantId: ', tenantId, '>>> userId: ', userId);

        // this.createTestUser(tenantId, userId, function(err, res){
        //     if (res) data = res;
        // });

        let data = {};

        this.buildUserAccountModel(tenantId, userId, function(err, res){
            if (res) data = res;
            console.log(fn, '>>> data: ', data);

            if (!data || data.length === 0) {
                alert('Failed to create user: invalid data');
                return;
            }    
            
            let url = Config.USERS_API + '/';

            fetch(url, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
            }).then((response) => response.json()).then((user) => {

                console.log(fn, '>>> user: ', user);


                // try {
                    
                    if (user && user.error) {

                        console.log('ooops :(');

                        if (user.error.message){
                            alert('Sorry, there was a problem Signing Up. ' + user.error.message);
                        } else {
                            alert('Sorry, there was a problem Signing Up.');
                        }

                        // Houston, we have a problem. go back to square one
                        // this.replaceRoute('step0');                    

                    } else {

                        let d = new Date();
                        let signUpDate = '';
                        let leaseBeginDate = '';

                        if (user.signUpDate) {
                            signUpDate = user.signUpDate.toString();
                        } else {
                            signUpDate = d.toString();
                        }

                        if (user.leaseBegin) {
                            leaseBeginDate = user.leaseBegin.toString();
                        } else {
                            leaseBeginDate = d.toString();
                        }       

                        if (!AsyncStorage){
                            alert('AsyncStorage not supported on this device type.');
                            return;
                        }             

                        // alert('Thank you for Signing Up!');

                        // this.replaceRoute('signupComplete');


                        // console.log(fn, '>>> signUpDate: ', signUpDate);
                        // console.log(fn, '>>> leaseBeginDate: ', leaseBeginDate);
                        // console.log(fn, '>>> userId, user.userId: ', userId, user.userId);

                        // this.createTestUser(signUpDate, leaseBeginDate, userId, function(cb){

                        //         alert('Thank you for Signing Up! ');
                        //         this.replaceRoute('signupComplete');                                

                        // });

                        AsyncStorage.setItem("signUpDate", signUpDate)
                        .then( () =>
                            {
                                AsyncStorage.setItem("userId", userId)
                                .then( () => {

                                    AsyncStorage.setItem("leaseBeginDate", leaseBeginDate)
                                    .then( () => {



                                    }
                                    ).done();
                                }
                                ).done();
                            }
                        )
                        .done( );
                    }

                // } catch(err){

                //     console.log('>> createUserAccount failed: ', err);

                //     let message = err.message;

                //     if (message){
                //         alert('Sorry, there was a problem Signing Up. ' + message);
                //     }else{
                //         alert('Sorry, there was a problem Signing Up.');
                //     }

                //     // Houston, we have a problem. go back to square one
                //     // this.replaceRoute('step0');
                // }

            }).done();        


        });

        this.replaceRoute('Home'); 

        // alert('Thank you for Signing Up!');

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

    saveFormData(id, userId, data, route) {
        console.log('>>>>> ENTERED: saveFormData...');
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
            console.log('>>>>> saveFormData responseData: ', responseData);

            this.createUserAccount(id, userId, function(err, res){
                if (err){
                    console.log(err);
                } else {
                    console.log(res);
                }
            });

        }).catch((error) => {
            console.error(error);
        }).done();
    }    

    fetchTenant(id, cb){
        console.log('>>>>> ENTERED: fetchTenant...');
        let url = 'https://mywalkthruapi.herokuapp.com/api/v1/Tenants/' + id;
        fetch(url).then((response) => response.json()).then((responseData) => {
            console.log('fetchTenant => responseData', responseData);
            cb(null, responseData);
        }).catch((error) => {
            console.error(error);
            cb(error, null);
        }).done();      
    }      

    renderNextButton() {
        if (this.state.termsAccepted){
            return(
                <Button rounded block
                    style={{alignSelf: 'center',
                            marginTop: 10,
                            backgroundColor: '#2B59AC',
                            borderRadius:90,
                            width: 300,
                            height:44}}
                        onPress={() => {
                            this.saveData();
                        }}
                    >
                    <Text style={{color:'#fff', fontWeight: 'bold'}}>NEXT</Text>
                </Button> 
            );
        } else {
            return (
        <View style={{  backgroundColor: '#132431', height: 24 }}>
            <Text style={{color:'#fff', fontSize: 16, fontWeight: 'bold', alignSelf: 'center'}}
            >Please review the terms</Text>
        </View>                 
        );
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
                <Container  style={{backgroundColor: '#2B59AC'}} >
                
                    <Header  style={{backgroundColor: '#2B59AC'}}>
                        <Button transparent onPress={() => this.replaceRoute('signupPropertyInfo')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, color: '#fff'}} />
                        </Button>                     
                        <Title style={{fontSize: 20, color: '#fff'}}>{title}</Title>
                    </Header>            

                    <View style={{  backgroundColor: '#ffffff', height: 64 }}>
                        {this.renderNextButton()}
                    </View>

                    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

        <Form
          ref={(ref) => { this.form = ref; }}
          onPress={this.handlePress.bind(this)}
          onChange={this.handleChange.bind(this)}
        >

          <Section
            ref={'termsSection'}
            title={'TERMS'}
            helpText={'Switch on if you accept the Terms and Conditions, below:'}
          >
                <SwitchCell
                    ref={'acceptTermsSwitchCell'}
                    switchTintColor={'#8EC5AD'}
                    title={'Do you accept the Terms?'}
                    titleColor={'black'}
                />
          </Section>

          <Section
            ref={'readTermsSection'}
            title={'TERMS and CONDITIONS'}
            helpText={'*** Please Read the Terms and Conditions ***'}
          >

            <TextInputCell
              ref={'MultiLineTextInput'}
              inputProps={{ multiline: true, color: this.state.termscolor, editable: false }}
              cellHeight={500}
              value={"Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service. This Terms of Service was created with (TermsFeed).Accounts.When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.Links To Other Web Sites.Our Service may contain links to third-party web sites or services that are not owned or controlled by My Walk Thru.My Walk Thru has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that My Walk Thru shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services. We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.Termination. We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability. We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability. Governing Law. These Terms shall be governed and construed in accordance with the laws of Texas, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service. Changes. We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service. Contact Us. If you have any questions about these Terms, please contact us."}
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