'use strict';

import React, { Component } from 'react';
import { AsyncStorage, Image, View } from 'react-native';
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

@withNavigation
class Step1Copy extends Component {

   constructor(props) {
      super(props);
      this.state = {
           email: '',
           username: '',
           validForm: false,
           form: {
             fullName: 'Marco Polo',
             tos: false,
           }
      };
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
          sceneStyle={{ paddingTop: 64 }}
        />
      );
    }

    getRoute() {
      return {
        renderScene(navigator) {
          return (
            <GiftedForm
              formName='signupForm' // GiftedForm instances that use the same name will also share the same states

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
                password: {
                  title: 'Password',
                  validate: [{
                    validator: 'isLength',
                    arguments: [6, 16],
                    message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
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
                bio: {
                  title: 'Biography',
                  validate: [{
                    validator: 'isLength',
                    arguments: [0, 512],
                    message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                  }]
                },
                gender: {
                  title: 'Gender',
                  validate: [{
                    validator: (...args) => {
                      if (args[0] === undefined) {
                        return false;
                      }
                      return true;
                    },
                    message: '{TITLE} is required',
                  }]
                },
              }}
            >

              <GiftedForm.SeparatorWidget />
              <GiftedForm.TextInputWidget
                name='fullName' // mandatory
                title='Full name'

                image={require('../../assets/icons/user.png')}

                placeholder='Marco Polo'
                clearButtonMode='while-editing'
              />


              <GiftedForm.TextInputWidget
                name='username'
                title='Username'
                image={require('../../assets/icons/contact_card.png')}

                placeholder='MarcoPolo'
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
                name='password' // mandatory
                title='Password'

                placeholder='******'


                clearButtonMode='while-editing'
                secureTextEntry={true}
                image={require('../../assets/icons/lock.png')}
              />

              <GiftedForm.TextInputWidget
                name='emailAddress' // mandatory
                title='Email address'
                placeholder='example@nomads.ly'

                keyboardType='email-address'

                clearButtonMode='while-editing'

                image={require('../../assets/icons/email.png')}
              />

              <GiftedForm.SeparatorWidget />

              <GiftedForm.ModalWidget
                title='Gender'
                displayValue='gender'
                image={require('../../assets/icons/gender.png')}
              >
                <GiftedForm.SeparatorWidget />

                <GiftedForm.SelectWidget name='gender' title='Gender' multiple={false}>
                  <GiftedForm.OptionWidget image={require('../../assets/icons/female.png')} title='Female' value='F'/>
                  <GiftedForm.OptionWidget image={require('../../assets/icons/male.png')} title='Male' value='M'/>
                </GiftedForm.SelectWidget>
              </GiftedForm.ModalWidget>

              <GiftedForm.ModalWidget
                title='Birthday'
                displayValue='birthday'
                image={require('../../assets/icons/birthday.png')}

                scrollEnabled={false}
              >
                <GiftedForm.SeparatorWidget/>
                <GiftedForm.DatePickerIOSWidget
                  name='birthday'
                  mode='date'

                  getDefaultDate={() => {
                    return new Date(((new Date()).getFullYear() - 18)+'');
                  }}
                />
              </GiftedForm.ModalWidget>

              <GiftedForm.ModalWidget
                title='Country'
                displayValue='country'
                image={require('../../assets/icons/passport.png')}
                scrollEnabled={false}

              >
                <GiftedForm.SelectCountryWidget
                  code='alpha2'
                  name='country'
                  title='Country'
                  autoFocus={true}
                />
              </GiftedForm.ModalWidget>


              <GiftedForm.ModalWidget
                title='Biography'
                displayValue='bio'

                image={require('../../assets/icons/book.png')}

                scrollEnabled={true} // true by default
              >
                <GiftedForm.SeparatorWidget/>
                <GiftedForm.TextAreaWidget
                  name='bio'

                  autoFocus={true}

                  placeholder='Something interesting about yourself'
                />
              </GiftedForm.ModalWidget>



              <GiftedForm.SubmitWidget
                title='Sign up'
                widgetStyles={{
                  submitButton: {
                    backgroundColor: '#000',
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
              />

              <GiftedForm.HiddenWidget name='tos' value={true} />

            </GiftedForm>
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
