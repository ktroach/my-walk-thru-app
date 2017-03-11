'use strict';

import React, { Component } from 'react';
import { AsyncStorage, Image, View, Linking, MapView, DatePickerIOS } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

import Config from '../../config';

import moment from 'moment';
import shortid from 'shortid';

import ExNavigator from '@exponent/react-native-navigator';
import { GiftedForm, GiftedFormManager } from 'react-native-gifted-form';
import {withNavigation} from "@exponent/ex-navigation/src/ExNavigationComponents";

// const homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
// const workPlace = {description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

@withNavigation
class Step1Copy extends Component {

   constructor(props) {
      super(props);
      this.state = {
           email: '',
           username: '',
           validForm: false,
           form: {
             tos: false,
           },
           loaded: false,
           leaseBeginDate: new Date(),
      };
   }

   componentDidMount() {
     this.setState({loaded: true});
   }

   handleValueChange(values) {
     console.log('handleValueChange', values)
     this.setState({ form: values })
   }

   onPress() {
     alert('Next Step');
   }

   saveInputs(route) {
      if (this.inputsValidated()) {
         this.setState({validForm: true});
         try {
            AsyncStorage.setItem("username", this.state.username);
            AsyncStorage.setItem("email", this.state.email);

            this.props.replaceRoute(route);
         } catch(err) {
            console.log(err);
         }
      }
   }

   inputsValidated() {
      if (!this.state.username || this.state.username.length===0) return this.invalidInput('Name');
      if (!this.state.email || this.state.email.length===0) return this.invalidInput('Email');
      return true;
   }

   invalidInput(inputName) {
      alert(inputName + ' is required.');
      this.setState({validForm: false});
      return false;
   }

   replaceRoute(route) {
      this.saveInputs(route);
   }

   pushNewRoute(route) {
        this.props.pushNewRoute(route);
   }

    popRoute() {
        this.props.popRoute();
    }

    render() {
      let someState = this.state;
      return (
        <ExNavigator
          initialRoute={this.getRoute(someState, this.props)}
          style={{ flex: 1 }}
          titleStyle={{
            fontSize: 14,
            color: '#fff'
          }}
          sceneStyle={{
            paddingTop: 64,
            overflow: 'visible',
            shadowColor: '#333',
            shadowOpacity: 0.5,
            shadowRadius: 6
          }}
          navigationBarStyle={{ backgroundColor: '#333', height: 64, borderBottomColor: 'transparent' }}
        />
      );
    }

    getRoute(someState, someProps) {
      // this.setState({loaded: true});
      var someState = someState;
      var props = someProps;
      console.log('>>> props:', props);
      return {
        getSomeState(key){
          //return this.someState;
          // alert('someState key: ' + key);
          console.log('>>> entered getSomeState:', key);
          if (key==='leaseBeginDate') return someState.leaseBeginDate;
        },
        setSomeState(key, val){
          if (key==='leaseBeginDate') return someState.setState({"leaseBeginDate": val});
        },
        replaceRoute(route) {
           props.replaceRoute(route);
        },
        onDateChange(date){
          console.log('entered onDateChange:', date);
          console.log('>>> someState: ', someState);
          someState.leaseBeginDate = date;
          console.log('>>> someState: ', someState);
          // return someState.leaseBeginDate;
          // someState.setState({"leaseBeginDate": date});

          //this.setSomeState("leaseBeginDate", date);
          // this.something.date = date;
          //this.setState({date: date});
        },
        // getDefaultProps() {
        //   return {
        //      date: new Date()
        //   }
        // },
        //
        // getInitialState() {
        //   return {
        //     loaded: false,
        //     date: this.props.date,
        //   }
        // },
        // componentDidMount() {
          // this.setState({loaded: true});
        // },
        // getInitialState() {
        //   return {
        //     loaded: false,
        //   }
        // },
        handleValueChange(values) {
          console.log('handleValueChange', values)
          // this.setState({ form: values })
        },
        getTitle() {
          return 'TENANT SIGN UP';
        },
        formatDateField(dateValue){
          return dateValue;
        },
        formatUsPhone(phone) {
            let phoneFormatted = phone;
            if (!phone || phone === 'undefined') return phone;
            var phoneTest = new RegExp(/^((\+1)|1)? ?\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})( ?(ext\.? ?|x)(\d*))?$/);
            phone = phone.trim();
            var results = phoneTest.exec(phone);
            console.log(results);
            if (results !== null && results.length > 8) {
              phoneFormatted = "(" + results[3] + ") " + results[4] + "-" + results[5] + (typeof results[8] !== "undefined" ? " x" + results[8] : "");
            }
            return phoneFormatted;
        },
        formatUsCurrency(amount) {
          if(!amount || amount === 'undefined') return amount;
          try {
             var currencyFormatter = new Intl.NumberFormat('en-US',
                                  { style: 'currency', currency: 'USD',
                                    minimumFractionDigits: 0 });
             var formattedAmount = currencyFormatter.format(amount);
          } catch(ex){
            console.warn(ex);
          }
          if (formattedAmount) return formattedAmount;
          return amount;
        },
        TOSPressed() {
          // if(this.state.loaded){
          //   Linking.openURL('http://www.mywalkthru.com/tos');
          // }
        },

        renderScene(navigator) {
          return (
            <Container theme={theme} style={{backgroundColor: '#333'}} >
            <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
            <Content padder style={{backgroundColor: 'transparent'}} >
            <GiftedForm
              formName='signupForm' // GiftedForm instances that use the same name will also share the same states
              onValueChange={this.handleValueChange.bind(this)}
              openModal={(route) => {
                navigator.push(route); // The ModalWidget will be opened using this method. Tested with ExNavigator
              }}

              clearOnClose={false} // delete the values of the form when unmounted

              defaults={{
                country: 'USA',
              }}

              validators={{
                fullName: {
                  title: 'Full name',
                  validate: [{
                    validator: 'isLength',
                    arguments: [1, 23],
                    message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                  }]
                },
                username: {
                  title: 'Username',
                  validate: [{
                    validator: 'isLength',
                    arguments: [3, 16],
                    message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                  },{
                    validator: 'matches',
                    arguments: /^[a-zA-Z0-9]*$/,
                    message: '{TITLE} can contain only alphanumeric characters'
                  }]
                },
                emailAddress: {
                  title: 'Email address',
                  validate: [{
                    validator: 'isLength',
                    arguments: [6, 255],
                  },{
                    validator: 'isEmail',
                  }]
                },
                tenantPhone: {
                  title: 'Phone',
                  validate: [{
                    validator: 'isLength',
                    arguments: [1, 14],
                    message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                  },{
                    validator: 'matches',
                    arguments: /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
                    message: ' Enter complete {TITLE} number'
                  }]
                },
                leaseBeginDate: {
                  title: 'Lease Start Date',
                  validate: [{
                    validator: 'isLength',
                    arguments: [1, 10],
                    message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                  }]
                },
              }}
            >

              <GiftedForm.SeparatorWidget />
              <GiftedForm.TextInputWidget
                name='fullName' // mandatory
                title='Your Name'
                image={require('../../assets/icons/user.png')}
                placeholder='Full Name'
                clearButtonMode='while-editing'
              />

              <GiftedForm.TextInputWidget
                name='username'
                title='Username'
                autoCapitalize="none"
                autoCorrect={false}
                image={require('../../assets/icons/user.png')}
                placeholder='User Name'
                clearButtonMode='while-editing'
                onTextInputFocus={(currentText = '') => {
                  if (!currentText) {
                    let fullName = GiftedFormManager.getValue('signupForm', 'fullName');
                    if (fullName) {
                      return fullName.replace(/[^a-zA-Z0-9-_]/g, '');
                    }
                  }
                  return currentText;
                }}
              />

              <GiftedForm.TextInputWidget
                name='emailAddress' // mandatory
                title='Your Email'
                autoCapitalize="none"
                autoCorrect={false}
                placeholder='user@domain.com'
                keyboardType='email-address'
                clearButtonMode='while-editing'
                image={require('../../assets/icons/email.png')}
              />

              <GiftedForm.TextInputWidget
                name='tenantPhone' // optional
                title='Your Phone #'
                image={require('../../assets/icons/user.png')}
                placeholder='(555) 555-5555'
                autoCapitalize="none"
                autoCorrect={false}
                onTextInputBlur={(currentText) => this.formatUsPhone(currentText)}
                keyboardType='phone-pad'
                clearButtonMode='while-editing'
                dataDetectorTypes="phoneNumber"
              />

              <GiftedForm.SeparatorWidget />

              <GiftedForm.ModalWidget
                title='Lease Details'
                displayValue='moveindate'
                scrollEnabled={false}
                cancelable={true}
                image={require('../../assets/icons/contact_card.png')}
              >


              <GiftedForm.ModalWidget
                  title='What is the primary reason you are leasing?'
                  displayValue='leaseReason'
                  image={require('../../assets/icons/contact_card.png')}
              >
                  <GiftedForm.SelectWidget name='leaseReason' title='Primary Reason' multiple={false}>
                    <GiftedForm.OptionWidget title='First time Lease' value='First time Lease'/>
                    <GiftedForm.OptionWidget title='Renewing Lease' value='Renewing Lease'/>
                  </GiftedForm.SelectWidget>
              </GiftedForm.ModalWidget>
              <GiftedForm.SeparatorWidget/>

              <GiftedForm.TextInputWidget
                name='leaseBeginDate' // optional
                title='Lease Begins?'
                image={require('../../assets/icons/book.png')}
                placeholder='Lease Begin Date'
                autoCapitalize="none"
                autoCorrect={false}
                onTextInputBlur={(currentText) => this.formatDateField(currentText)}
                keyboardType='default'
                clearButtonMode='while-editing'
              />

              <GiftedForm.ModalWidget
                  title='How long is your lease?'
                  displayValue='leaseDuration'
                  scrollEnabled={false}
                  cancelable={true}
                  image={require('../../assets/icons/contact_card.png')}
              >
                  <GiftedForm.SelectWidget name='leaseDuration' title='Lease Length' multiple={false}>
                    <GiftedForm.OptionWidget title='6 Months' value='6'/>
                    <GiftedForm.OptionWidget title='1 Year' value='12'/>
                    <GiftedForm.OptionWidget title='2 Years' value='24'/>
                  </GiftedForm.SelectWidget>
              </GiftedForm.ModalWidget>
              <GiftedForm.SeparatorWidget/>

                {/*
                  <GiftedForm.SeparatorWidget/>
                  <DatePickerIOS
                    date={this.getSomeState("leaseBeginDate")}
                    mode="date"
                    onDateChange={this.onDateChange}
                  />

                  <GiftedForm.DatePickerIOSWidget
                    name='moveindate'
                    mode='date'
                    getDefaultDate={() => {
                      return new Date();
                    }}
                  />
                  */}

              </GiftedForm.ModalWidget>

              <GiftedForm.SeparatorWidget />
              <GiftedForm.ModalWidget
                title='Property Details'
                displayValue='propertyAddress'
                cancelable={true}
                image={require('../../assets/icons/contact_card.png')}
              >
                <GiftedForm.ModalWidget
                    title='Property Type'
                    displayValue='propertyType'
                    cancelable={true}
                    image={require('../../assets/icons/contact_card.png')}
                >
                    <GiftedForm.SelectWidget name='propertyType' title='Property Type' multiple={false}>
                      <GiftedForm.OptionWidget title='House' value='House'/>
                      <GiftedForm.OptionWidget title='Apartment' value='Apartment'/>
                      <GiftedForm.OptionWidget title='Condo' value='Condo'/>
                      <GiftedForm.OptionWidget title='Duplex' value='Duplex'/>
                      <GiftedForm.OptionWidget title='Townhouse' value='Townhouse'/>
                    </GiftedForm.SelectWidget>
                </GiftedForm.ModalWidget>
                <GiftedForm.SeparatorWidget/>

                <GiftedForm.ModalWidget
                    title='# of Bedrooms'
                    displayValue='numberOfBedRooms'
                    cancelable={true}
                    image={require('../../assets/icons/contact_card.png')}
                >
                    <GiftedForm.SelectWidget name='numberOfBedRooms' title='# of Bedrooms' multiple={false}>
                      <GiftedForm.OptionWidget title='1' value='1'/>
                      <GiftedForm.OptionWidget title='2' value='2'/>
                      <GiftedForm.OptionWidget title='3' value='3'/>
                      <GiftedForm.OptionWidget title='4' value='4'/>
                      <GiftedForm.OptionWidget title='5' value='5'/>
                      <GiftedForm.OptionWidget title='6' value='6'/>
                      <GiftedForm.OptionWidget title='7' value='7'/>
                      <GiftedForm.OptionWidget title='8' value='8'/>
                      <GiftedForm.OptionWidget title='9' value='9'/>
                      <GiftedForm.OptionWidget title='10' value='10'/>
                      <GiftedForm.OptionWidget title='11' value='11'/>
                      <GiftedForm.OptionWidget title='12' value='12'/>
                      <GiftedForm.OptionWidget title='13' value='13'/>
                      <GiftedForm.OptionWidget title='14' value='14'/>
                      <GiftedForm.OptionWidget title='15' value='15'/>
                      <GiftedForm.OptionWidget title='16' value='16'/>
                    </GiftedForm.SelectWidget>
                </GiftedForm.ModalWidget>
                <GiftedForm.SeparatorWidget/>

                <GiftedForm.ModalWidget
                    title='# of Bathrooms'
                    displayValue='numberOfBathRooms'
                    cancelable={true}
                    image={require('../../assets/icons/contact_card.png')}
                >
                    <GiftedForm.SelectWidget name='numberOfBathRooms' title='# of Bathrooms' multiple={false}>
                      <GiftedForm.OptionWidget title='1' value='1'/>
                      <GiftedForm.OptionWidget title='2' value='2'/>
                      <GiftedForm.OptionWidget title='3' value='3'/>
                      <GiftedForm.OptionWidget title='4' value='4'/>
                      <GiftedForm.OptionWidget title='5' value='5'/>
                      <GiftedForm.OptionWidget title='6' value='6'/>
                      <GiftedForm.OptionWidget title='7' value='7'/>
                      <GiftedForm.OptionWidget title='8' value='8'/>
                    </GiftedForm.SelectWidget>
                </GiftedForm.ModalWidget>
                <GiftedForm.SeparatorWidget/>

                <GiftedForm.TextInputWidget
                  name='street1' // optional
                  title='Street1'
                  autoCapitalize="words"
                  kkeyboardType="default"
                  placeholder=''
                  clearButtonMode='while-editing'
                  dataDetectorTypes="address"
                  image={require('../../assets/icons/contact_card.png')}
                />
                <GiftedForm.TextInputWidget
                  name='street2' // optional
                  title='Street2 (optional)'
                  autoCapitalize="words"
                  keyboardType="default"
                  placeholder=''
                  clearButtonMode='while-editing'
                  dataDetectorTypes="address"
                  image={require('../../assets/icons/contact_card.png')}
                />
                <GiftedForm.TextInputWidget
                  name='cityName' // optional
                  title='City'
                  keyboardType="default"
                  placeholder=''
                  clearButtonMode='while-editing'
                  image={require('../../assets/icons/contact_card.png')}
                />

                <GiftedForm.ModalWidget
                  title='State'
                  displayValue='stateName'
                  cancelable={true}
                  image={require('../../assets/icons/contact_card.png')}
                >
                  <GiftedForm.SelectWidget name='stateName' title='State' multiple={false}>
                    <GiftedForm.OptionWidget title='Arizona' value='AZ'/>
                    <GiftedForm.OptionWidget title='District of Columbia' value='DC'/>
                    <GiftedForm.OptionWidget title='Georgia' value='GA'/>
                    <GiftedForm.OptionWidget title='Florida' value='FL'/>
                    <GiftedForm.OptionWidget title='Texas' value='TX'/>
                    <GiftedForm.OptionWidget title='Virginia' value='VA'/>
                  </GiftedForm.SelectWidget>
                </GiftedForm.ModalWidget>

                <GiftedForm.TextInputWidget
                  name='zipCode' // optional
                  title='Zip Code'
                  keyboardType="numeric"
                  placeholder=''
                  clearButtonMode='while-editing'
                  image={require('../../assets/icons/contact_card.png')}
                />

              <GiftedForm.SeparatorWidget/>
                <MapView
                  style={{height: 300, margin: 10}}
                  showsUserLocation={true}
                  followUserLocation={true}
                />
              </GiftedForm.ModalWidget>
              <GiftedForm.SeparatorWidget />

              <GiftedForm.ModalWidget
                  title='Add Photo of Property'
                  displayValue='propertyPhoto'
                  scrollEnabled={false}
                  cancelable={true}
                  image={require('../../assets/icons/contact_card.png')}
              >
                  <GiftedForm.SelectWidget name='propertyPhoto' title='Add Photo of Property' multiple={false}>
                    <GiftedForm.OptionWidget title='Take Photo' value='takephoto'/>
                    <GiftedForm.OptionWidget title='Camera Roll' value='cameraroll'/>
                  </GiftedForm.SelectWidget>
              </GiftedForm.ModalWidget>
              <GiftedForm.SeparatorWidget/>

              <GiftedForm.ModalWidget
                title='Property Manager'
                displayValue='propertyManagerInfo'
                scrollEnabled={false}
                cancelable={true}
                image={require('../../assets/icons/contact_card.png')}
              >
                <GiftedForm.ModalWidget
                    title='Landlord Type'
                    displayValue='landlordType'
                    image={require('../../assets/icons/contact_card.png')}
                >
                    <GiftedForm.SelectWidget name='landlordType' title='Landlord Type' multiple={false}>
                      <GiftedForm.OptionWidget title='Individual' value='Individual'/>
                      <GiftedForm.OptionWidget title='Corporation/Organization' value='CorpOrg'/>
                    </GiftedForm.SelectWidget>
                </GiftedForm.ModalWidget>

                <GiftedForm.SeparatorWidget/>

                <GiftedForm.TextInputWidget
                  name='propertyManagementCompany' // mandatory
                  title='Company'
                  autoCapitalize="words"
                  image={require('../../assets/icons/contact_card.png')}
                  placeholder="Landlord's Company Name"
                  clearButtonMode='while-editing'
                />
                <GiftedForm.TextInputWidget
                  name='propertyManagerName' // mandatory
                  title='Name'
                  autoCapitalize="words"
                  image={require('../../assets/icons/user.png')}
                  placeholder="Landlord's Name"
                  clearButtonMode='while-editing'
                />
                <GiftedForm.TextInputWidget
                  name='propertyManagerEmail' // mandatory
                  title='Email'
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Landlord's Email"
                  keyboardType='email-address'
                  clearButtonMode='while-editing'
                  image={require('../../assets/icons/email.png')}
                />
                <GiftedForm.TextInputWidget
                  name='propertyManagerPhone' // mandatory
                  title='Phone'
                  image={require('../../assets/icons/user.png')}
                  placeholder="Landlord's Phone"
                  clearButtonMode='while-editing'
                />
              </GiftedForm.ModalWidget>




              <GiftedForm.SubmitWidget
                title='Sign up'
                widgetStyles={{
                  submitButton: {
                    alignSelf: 'center',
                    backgroundColor: '#ad241f',
                    height:65,
                    marginTop: 40,
                    backgroundColor: '#ad241f',
                    borderRadius:90,
                    width: 300,
                  }
                }}
                onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                  if (isValid === true) {

                    console.log('values:',values);
                    if(!values.fullName) {
                      alert('Full Name is required');
                      postSubmit(['An error occurred, please try again']);
                      return;
                    }
                    if(!values.username) {
                      alert('username is required');
                      postSubmit(['An error occurred, please try again']);
                      return;
                    }
                    if(!values.emailAddress) {
                      alert('emailAddress is required');
                      postSubmit(['An error occurred, please try again']);
                      return;
                    }
                    if(!values.leaseBeginDate) {
                      alert('leaseBeginDate is required');
                      postSubmit(['An error occurred, please try again']);
                      return;
                    }
                    if(!values.street1) {
                      alert('street1 is required');
                      postSubmit(['An error occurred, please try again']);
                      return;
                    }
                    if(!values.cityName) {
                      alert('cityName is required');
                      postSubmit(['An error occurred, please try again']);
                      return;
                    }
                    if(!values.stateName) {
                      alert('stateName is required');
                      postSubmit(['An error occurred, please try again']);
                      return;
                    }
                    if(!values.zipCode) {
                      alert('zipCode is required');
                      postSubmit(['An error occurred, please try again']);
                      return;
                    }
                    if(!values.propertyManagerName) {
                      alert('propertyManagerName is required');
                      postSubmit(['An error occurred, please try again']);
                      return;
                    }
                    if(!values.propertyManagerEmail) {
                      alert('propertyManagerEmail is required');
                      postSubmit(['An error occurred, please try again']);
                      return;
                    }

                    let userId = shortid.generate();
                    let signUpDate = moment().format();
                    var now = new Date();
                    var url = Config.USERS_API + '/';

                    var data = JSON.stringify({
                      "userId": userId,
                      "fullName": values.fullName,
                      "username": values.username,
                      "usertype": "Tenant",
                      "email": values.emailAddress,
                      "password": "p@ss1word",
                      "tenant_phone": values.tenantPhone,
                      "preferred_contact": "sms",
                      "sms_alerts": "true",
                      "status": "active",
                      "propertyType": values.propertyType,
                      "numberOfBedRooms": values.numberOfBedRooms,
                      "numberOfBathRooms": values.numberOfBathRooms,
                      "leaseReason": values.leaseReason,
                      "leaseBeginDate": values.leaseBeginDate,
                      "leaseDuration": values.leaseDuration,
                      "street1": values.street1,
                      "street2": values.street2,
                      "cityName": values.cityName,
                      "stateName": values.stateName,
                      "zip": values.zipCode,
                      "landlordType": values.landlordType,
                      "propertyManagementCompany": values.propertyManagementCompany,
                      "propertyManagerName": values.propertyManagerName,
                      "propertyManagerEmail": values.propertyManagerEmail,
                      "propertyManagerPhone": values.propertyManagerPhone,
                      "termsAcceptedOn": signUpDate,
                      "created": now
                    });

                    console.log('data: ', data);

                    fetch(url, {
                         method: 'post',
                         headers: {
                           "Content-type": "application/json; charset=UTF-8"
                         },
                       body: data
                    }).then((response) => response.json()).then((responseData) => {
                       console.log('RESPONSEDATA: ', responseData);

                        if (!responseData) {
                           alert('Sorry, there was a problem signing up.');
                        } else {
                          AsyncStorage.setItem("signUpDate", signUpDate)
                          .then( () =>
                              {
                                  AsyncStorage.setItem("userId", userId);
                                  alert('Thank you for Signing Up ('+signUpDate+')');
                                  this.replaceRoute('home');
                              }
                          )
                          .done( );
                        }

                    }).done();

                    // was uncommented before adding the POST save stuff
                    // AsyncStorage.setItem("signUpDate", signUpDate)
                    // .then( () =>
                    //     {
                    //         AsyncStorage.setItem("userId", userId);
                    //         alert('Thank you for Signing Up ('+signUpDate+')');
                    //         this.replaceRoute('home');
                    //     }
                    // )
                    // .done( );


                    // prepare object
                    // values.gender = values.gender[0];
                    // values.birthday = moment(values.birthday).format('YYYY-MM-DD');

                    /* Implement the request to your server using values variable
                    ** then you can do:
                    ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
                    ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
                    ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
                    */

                    // postSubmit();
                    // postSubmit(['An error occurred, please try again']);
                  }
                }}

              />

              <GiftedForm.NoticeWidget
                title='By signing up, you agree to the Terms of Service and Privacy Policy.'
                onPress={this.TOSPressed()}
              />

              <GiftedForm.HiddenWidget name='tos' value={true} />

            </GiftedForm>
            </Content>
            </Image>
            </Container>
          );
        }
      }
    }



    // render() {
    //   const { fullName, tos, gender } = this.state.form
    //   console.log('render', this.state.form)
    //     return (
    //         <Container theme={theme} style={{backgroundColor: '#333'}} >
    //             <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
    //                 <Header>
    //                     <Button transparent onPress={() => this.replaceRoute('signup-step0')}>
    //                         <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
    //                     </Button>
    //
    //                     <Title>WELCOME TO YOUR NEW HOME!</Title>
    //
    //                     <Button transparent onPress={this.props.openDrawer}>
    //                         <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
    //                     </Button>
    //                 </Header>
    //
    //                 <Content padder style={{backgroundColor: 'transparent'}} >
    //                   <GiftedForm
    //                     formName='signupForm'
    //                     openModal={(route) => { this.props.navigator.push(route) }}
    //                     onValueChange={this.handleValueChange.bind(this)}
    //                   >
    //                     <GiftedForm.TextInputWidget
    //                       name='fullName'
    //                       title='Full name'
    //                       placeholder='Marco Polo'
    //                       clearButtonMode='while-editing'
    //                       value={fullName}
    //                     />
    //
    //                     <GiftedForm.SeparatorWidget />
    //                     <GiftedForm.TextInputWidget
    //                       name='fullName' // mandatory
    //                       title='Full name'
    //                       placeholder='Marco Polo'
    //                       clearButtonMode='while-editing'
    //                     />
    //
    //
    //
    //
    //
    //
    //                     <GiftedForm.HiddenWidget name='tos' value={tos} />
    //
    //
    //
    //
    //                   </GiftedForm>
    //                 </Content>
    //
    //                 <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}}
    //                 onPress={this.onPress} >
    //                     Next
    //                 </Button>
    //             </Image>
    //         </Container>
    //     )
    // }
}

function bindActions(dispatch){
    return {
        replaceRoute:(route)=>dispatch(replaceRoute(route)),
        pushNewRoute:(route)=>dispatch(pushNewRoute(route)),
        openDrawer: ()=>dispatch(openDrawer()),
        popRoute: () => dispatch(popRoute())
    }
}

export default connect(null, bindActions)(Step1Copy);
