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

// import Confetti from 'react-native-confetti';

export class SignUpUserInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            tenantId: '',
            validated: false,
            phoneFormatted: '',
            loaded: false,
            tenant: {}
        }
    } 

    componentWillMount(){
        this.getTenantId();
    }

    componentDidMount() {
        // this.getTenantId();
        // this.setState({loaded: true});

        // if(this._confettiView) {
        //     this._confettiView.startConfetti();
        // }        
    }

    componentWillUnmount() {
        // if (this._confettiView)
        // {
        //     this._confettiView.stopConfetti();
        // }
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
     let fn = '>>> getTenantId ';
     console.log(fn, '>>> ENTERED');
     try {
        AsyncStorage.getItem("tenantId")
        .then( (tenantId) =>
              {
                if (tenantId){
                    // this.setState({tenantId: tenantId});
                    this.fetchTenant(tenantId, function(err, res){
                        if (!err){
                            console.log(fn, '>> TENANT FOUND');
                            // this.setState({loaded: true});
                            // console.log('>>>> this.state.tenant:', this.state.tenant);
                        }
                    });
                }
              }
        )
        .done();
     } catch(err){
         console.log(fn, '>>> Failed to get tenantId: ' + err);
     }       
   }   

    fetchTenant(id, cb){
        let fn = '>>> fetchTenant ';
        console.log(fn, '>>> ENTERED');
        let url = 'https://mywalkthruapi.herokuapp.com/api/v1/Tenants/' + id;
        fetch(url).then((response) => response.json()).then((tenant) => {
            console.log(fn, '>>> tenant: ', tenant);
            let validated = (tenant&&tenant.id);
            this.setState({tenant: tenant, tenantId: id, validated: validated});
            cb(null, tenant);
        }).catch((error) => {
            console.error(error);
            cb(error, null);
        }).done();      
    }      

    onValidationError(ref, message) {
        console.log(ref, message);
    }

    handleChange(ref, change) {
        console.log('>>> handleChange: ', ref, change);

        if(ref && ref !== '' && ref === 'phoneNumber'){
            if(change && change.length>0){
                this.formatPhone(change);
            }            
        }

        if(ref && ref !== '' && ref === 'phoneNumber'){
            if(change && change.length === 10){
                Keyboard.dismiss();
            }            
        }     

        // if(ref && ref !== '' && ref === 'primaryEmail'){
        //     if(change && change.length>8){
        //         this.validateEmail(change);
        //     }            
        // }

        // if(ref && ref !== '' && ref === 'primaryEmail'){
        //     if(change && change.length === 255){
        //         Keyboard.dismiss();
        //     }            
        // }           

        if(change && change !== ''){
            this.setState({validated:true});
        }
    }

    validateEmail(value){
        console.log('>> ENTERED: validateEmail');
        if (!value || value.length===0) return false;
        let v1 = value.indexOf("@");
        let v2 = value.lastIndexOf(".");        
        if (v1 < 1 || ( v2 - v1 < 2 )) {
            return false;
        }
        return true;
    }

    formatPhone(value) {
        // console.log('>> ENTERED: formatPhone');
        // if(!value) return;
        // let phoneFormatted = value;
        // if(!this.state.loaded) return;
        // let formData = this.form.getData();

        // // console.log('>>> this.form: ', this.form);

        // if (!formData) {
        //     return;
        // }         
        // if (!formData.PhoneSection) {
        //     return;
        // }             
        // if (!formData.PhoneSection.phoneNumber) {
        //     return;
        // }    
        // let phone = formData.PhoneSection.phoneNumber;
        // let phoneTest = new RegExp(/^((\+1)|1)? ?\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})( ?(ext\.? ?|x)(\d*))?$/);
        // phone = phone.trim();
        // var results = phoneTest.exec(phone);
        // // console.log(results);
        // if (results !== null && results.length > 8) {
        //     phoneFormatted = "(" + results[3] + ") " + results[4] + "-" + results[5] + (typeof results[8] !== "undefined" ? " x" + results[8] : "");
        // }

        // console.log('phoneFormatted: ', phoneFormatted);

        // this.setState({phoneFormatted: phoneFormatted});

        // console.log('>>> this.refs: ', this.refs);

        // formData.PhoneSection.phoneNumber.setValue(phone);
    }    

    handlePress(ref) {
        if (ref === 'LogData') {
        console.log(this.form.getData());
        } else if (ref === 'LogValidationErrors') {
        console.log(this.form.getValidationErrors());
        }
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
            let fullName = formData.FullNameSection.fullName;
            let primaryEmail = formData.EmailSection.primaryEmail;
            let phoneNumber = formData.PhoneSection.phoneNumber;

            // let gender = formData.GenderSection.genderActionCell;
            // let birthday = formData.BirthdaySection.birthdayDatePicker;

            // and do address 

            var data = JSON.stringify({
                "fullname": fullName,
                "phoneNumber": phoneNumber,
                "email": primaryEmail,
                // "gender": gender,
                // "birthday": birthday, 
                "active": "true",
                "modified": now
            });

            this.saveFormData(tenantId, data, 'signupPropertyInfo');
        }
    }

    validateFormData(formData){
        console.log('>>ENTERED validateFormData');
        console.log('>>> formData: ', formData);

        if (!formData.FullNameSection) {
            alert('Your Full Name is required');
            return false;
        }          

        if (!formData.FullNameSection.fullName) {
            alert('Your Full Name is required');
            return false;
        }     

        if (!formData.EmailSection) {
            alert('Your Email is required');
            return false;
        }             

        if (!formData.EmailSection.primaryEmail) {
            alert('Your Email is required');
            return false;
        }   

        if (!this.validateEmail(formData.EmailSection.primaryEmail)) {
            alert('Valid Email is required');
            return false;
        }

        if (!formData.PhoneSection) {
            alert('Your Phone Number is required');
            return false;
        }             

        if (!formData.PhoneSection.phoneNumber) {
            alert('Your Phone Number is required');
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
        let result = responseData;
        if (result && result.id) {
            console.log('result.id:', result.id);
            if (route) {
                this.replaceRoute(route);
            }            
        }
      }).catch((error) => {
         console.error(error);
      }).done();
    }    

    renderNextButton() {
        if (this.state.validated){
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
            <View>
                <Text
                style={{alignSelf: 'center',marginTop: 30}}                
                >VERIFY YOUR PROFILE INFO</Text>
            </View>);
        }
    }

    render() {
        const title = 'Your Profile';
        const forwardIcon = <Icon name={'ios-arrow-forward'} color={'gray'} size={20} />;
        const alertIcon = <Icon name={'ios-alert'} color={'red'} size={20} />;   

        const fullname = this.state.tenant.fullname;  
        const email = this.state.tenant.email;  
        const phoneNumber = this.state.tenant.phoneNumber;  

        if (this.state.tenant && this.state.tenant.email){
            
            return (

                <Container  style={{backgroundColor: '#2B59AC'}} >
                
                    <Header  style={{backgroundColor: '#2B59AC'}}>
                        <Button transparent onPress={() => this.replaceRoute('signupInstructions')}>
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
                            ref={'FullNameSection'}
                            title={'FULL NAME'}
                            helpText={'Enter your Full Legal Name'}
                        >
                            <TextInputCell
                                ref="fullName"
                                inputProps={{ placeholder: 'Your Full Name' }}
                                autoCapitalize="words"
                                value={fullname} 
                            />   
                        </Section> 

                        <Section
                            ref={'EmailSection'}
                            title={'EMAIL ADDRESS'}
                            helpText={'Enter your primary email address'}
                        >
                            <TextInputCell
                                ref="primaryEmail"
                                value={email}
                                inputProps={{ 
                                    placeholder: 'Your Primary Email', 
                                    keyboardType: 'email-address',
                                    autoCapitalize: "none",
                                    returnKeyType: 'done' 
                                }}
                            />   
                        </Section>   

                        <Section
                            ref={'PhoneSection'}
                            title={'Phone Number'}
                            helpText={'Enter your primary phone number (5555555555)'}
                        >
                            <TextInputCell
                                ref="phoneNumber"
                                value={phoneNumber}
                                inputProps={{ 
                                    placeholder: '0000000000',
                                    autoCapitalize: "none",
                                    autoCorrect: false,
                                    keyboardType: 'phone-pad'
                                }}
                            />   
                        </Section>               

                        {/*<Section
                            ref={'GenderSection'}
                            title={'GENDER'}
                            helpText={'Select your gender.'}
                        >
                            <ActionSheetCell
                                ref={'genderActionCell'}
                                title={'Your Gender'}
                                options={[' ',' Male', 'Female', 'Other']}
                                selectedValueIndex={0}
                            />
                        </Section>

                        <Section
                            ref={'BirthdaySection'}
                            title={'BIRTHDAY'}
                            helpText={'Select your birthday (optional)'}
                        >
                            <DatePickerCell
                            ref={'birthdayDatePicker'}
                            title={'Your Birthday'}
                            datePickerProps={{ mode: 'date' }}
                            value={new Date('1/1/1970')}
                            getDateString={(date) => {
                                const options = {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                timeZone: 'UTC',
                                timeZoneName: 'short',
                                };
                                return date.toLocaleDateString('en-US', options);
                            }}
                            />
                        </Section>*/}

                    </Form>
                    </View>
                </Container>
        );

    } else {
        return(  
            <View>
                <Text>Loading your profile...</Text>
            </View>
        );
    }    
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

export default connect(null, bindActions)(SignUpUserInfo);