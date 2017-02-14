'use strict';

import React, { Component } from 'react';
import { AsyncStorage, Image, View, Linking, MapView } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

import moment from 'moment';
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
           loaded: false
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
      return (
        <ExNavigator
          initialRoute={this.getRoute()}
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

    getRoute() {
      // this.setState({loaded: true});
      return {
        // componentDidMount() {
          // this.setState({loaded: true});
        // },
        getInitialState() {
          return {
            loaded: false,
          }
        },
        handleValueChange(values) {
          console.log('handleValueChange', values)
          // this.setState({ form: values })
        },
        getTitle() {
          return 'TENANT SIGN UP';
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
                                    minimumFractionDigits: 2 });
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
                    message: '{TITLE} can contains only alphanumeric characters'
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
                title='Move-in Date'
                displayValue='moveindate'
                scrollEnabled={false}
                image={require('../../assets/icons/passport.png')}
              >
                <GiftedForm.SeparatorWidget/>
                <GiftedForm.DatePickerIOSWidget
                  name='moveindate'
                  mode='date'
                  getDefaultDate={() => {
                    return new Date();
                  }}
                />
              </GiftedForm.ModalWidget>

              <GiftedForm.SeparatorWidget />

              <GiftedForm.ModalWidget
                title='Annual Income'
                displayValue='tenantIncome'
                scrollEnabled={false}
                image={require('../../assets/icons/book.png')}
              >
                <GiftedForm.SeparatorWidget/>
                <GiftedForm.TextInputWidget
                  name='tenantIncome' // optional
                  keyboardType='numeric'
                  placeholder='$0,000.00'
                  autoCapitalize="none"
                  autoCorrect={false}
                  onTextInputBlur={(currentText) => this.formatUsCurrency(currentText)}
                  clearButtonMode='while-editing'
                />
                <GiftedForm.TextInputWidget
                  name='currentEmployer' // optional
                  title='Employer'
                  autoCorrect={false}
                  placeholder='Current Employer'
                  clearButtonMode='while-editing'
                  image={require('../../assets/icons/contact_card.png')}
                />
                <GiftedForm.SeparatorWidget/>
                <GiftedForm.OptionWidget
                  title='Are you interested in owning a home?'
                />
              </GiftedForm.ModalWidget>


              <GiftedForm.SeparatorWidget />
              <GiftedForm.ModalWidget
                title='Property Address'
                displayValue='propertyAddress'
                scrollEnabled={false}
                image={require('../../assets/icons/contact_card.png')}
              >
                <GiftedForm.SeparatorWidget/>
                <GiftedForm.TextInputWidget
                  name='street1' // optional
                  title='Street1'
                  keyboardType="numbers-and-punctuation"
                  placeholder='Street Address 1'
                  clearButtonMode='while-editing'
                  dataDetectorTypes="address"
                  image={require('../../assets/icons/contact_card.png')}
                />
                <GiftedForm.TextInputWidget
                  name='street2' // optional
                  title='Street2'
                  keyboardType="numbers-and-punctuation"
                  placeholder='Street Address 2'
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
                  image={require('../../assets/icons/contact_card.png')}
                >
                  <GiftedForm.SeparatorWidget />
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
                  onTextInputFocus={(currentText = '') => {
                    if (!currentText) {
                      let propertyLocation = GiftedFormManager.getValue('signupForm', 'propertyLocation');
                      if (propertyLocation) {
                        return propertyLocation;
                      }
                    }
                    return currentText;
                  }}
                />

                <GiftedForm.SeparatorWidget/>
                <GiftedForm.GooglePlacesWidget
                    name='locationSearch' // optional
                    title='Location Search'
                    displayValue='locationSearch'
                    placeholder='Places nearby...'
                    keyboardShouldPersistTaps={true}
                    minLength={2}
                    autoFocus={false}
                    fetchDetails={true}
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                      console.log(data);
                      console.log(details);
                    }}
                    getDefaultValue={() => {
                      return ''; // text input default value
                    }}
                    query={{
                      // available options: https://developers.google.com/places/web-service/autocomplete
                      key: 'AIzaSyCB7oaGvrfE-lN-mS85Re53TDGN_UcNxtE',
                      language: 'en', // language of the results
                      types: '(cities)', // default: 'geocode'
                    }}
                    styles={{
                      description: {
                        fontWeight: 'bold',
                      },
                      predefinedPlacesDescription: {
                        color: '#1faadb',
                      },
                    }}

                   currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                   currentLocationLabel="Current location"
                   nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                   GoogleReverseGeocodingQuery={{
                     // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                   }}
                   GooglePlacesSearchQuery={{
                     // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                     rankby: 'distance',
                     types: 'store',
                   }}

                   filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                >
                    <MapView
                      style={{height: 200, margin: 40}}
                      showsUserLocation={true}
                    />
                </GiftedForm.GooglePlacesWidget>


              </GiftedForm.ModalWidget>

              <GiftedForm.SeparatorWidget />

              <GiftedForm.ModalWidget
                title='Property Manager'
                displayValue='propertyManagerInfo'
                scrollEnabled={false}
                image={require('../../assets/icons/contact_card.png')}
              >
                <GiftedForm.TextInputWidget
                  name='propertyManagementCompany' // mandatory
                  title='Company'
                  image={require('../../assets/icons/contact_card.png')}
                  placeholder='Property Management Company'
                  clearButtonMode='while-editing'
                />
                <GiftedForm.TextInputWidget
                  name='propertyManagerName' // mandatory
                  title='Name'
                  image={require('../../assets/icons/user.png')}
                  placeholder='Property Manager Name'
                  clearButtonMode='while-editing'
                />
                <GiftedForm.TextInputWidget
                  name='propertyManagerEmail' // mandatory
                  title='Email'
                  placeholder='Property Manager Email'
                  keyboardType='email-address'
                  clearButtonMode='while-editing'
                  image={require('../../assets/icons/email.png')}
                />
                <GiftedForm.TextInputWidget
                  name='propertyManagerPhone' // mandatory
                  title='Phone'
                  image={require('../../assets/icons/user.png')}
                  placeholder='Property Manager Phone'
                  clearButtonMode='while-editing'
                />

              </GiftedForm.ModalWidget>


              <GiftedForm.SubmitWidget
                title='Sign up'
                widgetStyles={{
                  submitButton: {
                    backgroundColor: '#ad241f',
                    borderRadius:12,
                  }
                }}
                onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                  if (isValid === true) {
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
                    postSubmit(['An error occurred, please try again']);
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
