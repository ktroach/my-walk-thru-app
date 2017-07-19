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

export class SignUpPropertyManagerInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            tenantId: '',
            validated: false,
            phoneFormatted: '',
            loaded: false,
            companyTypeSelected: false,
            blarg: 'blargh!'
        }
    } 

    componentDidMount() {
        this.getTenantId();
        this.setState({loaded: true});
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
                this.setState({tenantId: tenantId});
              }
        )
        .done();
     } catch(err){
         console.log('Failed to get tenantId: ' + err);

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

        if(ref && ref !== '' && ref === 'pmTypeActionCell'){
            if(change && change === 'Company'){
                this.setState({companyTypeSelected: true});
            }            
        }           

        if(change && change !== ''){
            this.setState({validated:true});
        }
    }

    formatPhone(value) {
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
            let companyName = '';

            let pmType = formData.PMTypeSection.pmTypeActionCell;
            let pmName = formData.PMNameSection.propertyManagerName;

            if (formData && 
                formData.CompanyNameSection && 
                formData.CompanyNameSection.companyName) {
                companyName = formData.CompanyNameSection.companyName;
            }
            
            let primaryEmail = formData.EmailSection.primaryEmail;
            let phoneNumber = formData.PhoneSection.phoneNumber;

            var data = JSON.stringify({
                "pmType": pmType,
                "pmName": pmName,
                "pmCompanyName": companyName,
                "pmPhoneNumber": phoneNumber,
                "pmEmail": primaryEmail,
                "active": "true",
                "modified": now
            });

            this.saveFormData(tenantId, data, 'signupTermsConditions');
        }
    }

    validateFormData(formData){
        console.log('>>ENTERED validateFormData');
        console.log('>>> formData: ', formData);

        if (!formData.PMNameSection) {
            alert('Property Manager Full Name is required');
            return false;
        }          

        if (!formData.PMNameSection.propertyManagerName) {
            alert('Property Manager Full Name is required');
            return false;
        }     

        if (!formData.EmailSection) {
            alert('Property Manager Email is required');
            return false;
        }             

        if (!formData.EmailSection.primaryEmail) {
            alert('Property Manager Email is required');
            return false;
        }   

        if (!formData.PhoneSection) {
            alert('Property Manager Phone Number is required');
            return false;
        }             

        if (!formData.PhoneSection.phoneNumber) {
            alert('Property Manager Phone Number is required');
            return false;
        }            

        return true;      
    }    

    saveFormData(id, data, route) {
        console.log('>>ENTERED: saveFormData');
        
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
        console.log('>>> saveFormData responseData: ', responseData);
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
                >VERIFY YOUR PROPERTY MANAGER INFO</Text>
            </View>);
        }
    }

    render() {
        const title = 'Property Manager Info';
        const forwardIcon = <Icon name={'ios-arrow-forward'} color={'gray'} size={20} />;
        const alertIcon = <Icon name={'ios-alert'} color={'red'} size={20} />;

        const blarg = this.state.blarg;
        const pmTypeIndex = 2;
        
        
        return (
            <Container  style={{backgroundColor: '#fff'}} >
               
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
                ref={'PMTypeSection'}
                title={'PROPERTY MANAGER TYPE'}
                helpText={'Select your Property Manager Type.'}
            >
                <ActionSheetCell
                    ref={'pmTypeActionCell'}
                    title={'Select Property Manager Type'}
                    options={[' ',' Individual', 'Company', 'Other']}
                    selectedValueIndex={pmTypeIndex}
                />
            </Section>

            <Section
                ref={'CompanyNameSection'}
                title={'PROPERTY COMPANY NAME'}
                helpText={'Enter your Property Manager`s Company Name'}
            >
                <TextInputCell
                    ref="companyName"
                    value={blarg} 
                    inputProps={{ placeholder: 'Company Name' }}
                    autoCapitalize="words"
                />   
            </Section> 

            <Section
                ref={'PMNameSection'}
                title={'PROPERTY MANAGER NAME'}
                helpText={'Enter your Property Manager`s Full Name'}
            >
                <TextInputCell
                    ref="propertyManagerName"
                    inputProps={{ placeholder: 'Full Name' }}
                    autoCapitalize="words"
                />   
            </Section>             

            <Section
                ref={'EmailSection'}
                title={'EMAIL ADDRESS'}
                helpText={'Enter your Property Manager`s email address.'}
            >
                <TextInputCell
                    ref="primaryEmail"
                    validator={createValidator(emailValidator, { errorMessage: 'Invalid Email' })}
                    inputProps={{ 
                        placeholder: 'Email', 
                        keyboardType: 'email-address',
                        autoCapitalize: "none",
                        returnKeyType: 'done' 
                    }}
                />   
            </Section>   

            <Section
                ref={'PhoneSection'}
                title={'Phone Number'}
                helpText={'Enter your Property Manager`s phone number.  DO NOT USE PARENTHESIS, DASHES, or DOTS'}
            >
                <TextInputCell
                    ref="phoneNumber"
                    inputProps={{ 
                        placeholder: '0000000000',
                        autoCapitalize: "none",
                        autoCorrect: false,
                        keyboardType: 'phone-pad'
                    }}
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

export default connect(null, bindActions)(SignUpPropertyManagerInfo);