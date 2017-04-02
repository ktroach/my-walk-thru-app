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

export class SignUpUserInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            tenantId: '',
            validated: false,
            phoneFormatted: '',
            loaded: false
        }
    } 

    componentDidMount() {
        this.getTenantId();
        this.setState({loaded: true});
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

        if(ref && ref !== '' && ref === 'phoneNumber'){
            if(change && change.length>0){
                this.formatPhone(change);
            }            
        }

        if(change && change !== ''){
            this.setState({validated:true});
        }
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

            let gender = formData.GenderSection.genderActionCell;
            let birthday = formData.BirthdaySection.birthdayDatePicker;

            var data = JSON.stringify({
                "fullname": fullName,
                "phoneNumber": phoneNumber,
                "email": primaryEmail,
                "gender": gender,
                "birthday": birthday, 
                "active": "true",
                "modified": now
            });

            this.saveFormData(tenantId, data, 'signup-lease-info');
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
                    marginTop: 40,
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



    render() {

        const title = 'User Profile';
        const forwardIcon = <Icon name={'ios-arrow-forward'} color={'gray'} size={20} />;
        const alertIcon = <Icon name={'ios-alert'} color={'red'} size={20} />;
        
        return (
            <Container  style={{backgroundColor: '#fff'}} >
               
                <Header>
                    <Button transparent onPress={() => this.replaceRoute('signup-step0')}>
                        <Icon name='ios-arrow-back' style={{fontSize: 30}} />
                    </Button>                     
                    <Title style={{fontSize: 20}}>{title}</Title>
                </Header>            
        <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>

        {this.renderNextButton()}

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
                />   
            </Section> 

            <Section
                ref={'EmailSection'}
                title={'EMAIL ADDRESS'}
                helpText={'Enter the primary email address that you have given your Property Manager.'}
            >
                <TextInputCell
                    ref="primaryEmail"
                    validator={createValidator(emailValidator, { errorMessage: 'Invalid Email' })}
                    inputProps={{ placeholder: 'Your Primary Email' }}
                    keyboardType='email-address'
                    autoCapitalize="none"
                />   
            </Section>   

            <Section
                ref={'PhoneSection'}
                title={'Phone Number'}
                helpText={'Enter the primary phone number that you have given your Property Manager.  You can enter it in this format: 8308321234'}
            >
                <TextInputCell
                    ref="phoneNumber"
                    inputProps={{ placeholder: 'Your Phone Number' }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType='phone-pad'
                />   
            </Section>               

            <Section
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
            </Section>



          <Section
            title={'DATA'}
            ref={'dataSection'}
          >
            <ButtonCell
              ref={'LogData'}
              title={'Log Form Data'}
              textAlign={'center'}
              titleColor={'blue'}
            />
            <ButtonCell
              ref={'LogValidationErrors'}
              title={'Log Validation Errors'}
              textAlign={'center'}
              titleColor={'blue'}
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

export default connect(null, bindActions)(SignUpUserInfo);