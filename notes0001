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

import Icon from 'react-native-vector-icons/Ionicons';

import { 
    Form,
    Separator,
    InputField, 
    LinkField,
    SwitchField, 
    PickerField,
    DatePickerField,
    TimePickerField
} from 'react-native-form-generator';

import { Container, Header, Title, Content, Button, Image } from 'native-base';

import theme from '../../themes/form-theme';

class CustomModal extends React.Component{

  handleClose(){
    this.props.onHidePicker && this.props.onHidePicker();
  }

  render(){
    return <Modal transparent={true}>
    <View style={{padding:20, flex:1, justifyContent:'center', backgroundColor:'rgba(43, 48, 62, 0.57)'}}>
    <View
      style={{
        backgroundColor:'white',
        borderRadius: 8,
        flexDirection:'column',

    }}
      >
      <Text style={{
        textAlign: 'center',
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        fontSize:18
      }}>A Custom Wrapper for your picker</Text>
      {this.props.children}

    <TouchableHighlight
        onPress={this.handleClose.bind(this)}
        underlayColor='#78ac05'>
        <View style={{
            flex:1, alignItems:'center'
        }}>
            <Text style={{fontSize:19,padding:15,}}>Close</Text>
        </View>
    </TouchableHighlight>
    </View>
    </View>
    </Modal>
  }
}

class WrappedIcon extends React.Component {
  render() {
    return (
      <Icon {...this.props} />
    );
  }
}

export class SignUpUserInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            tenantId: '',
            validated:  false,
            formData:{}
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
     }       
   }    

    handleFormChange(formData){

        if (formData.tenant_full_name && formData.tenant_email && formData.tenant_phone_number){
            this.setState({validated:true});
        }

        this.setState({formData:formData})
        this.props.onFormChange && this.props.onFormChange(formData);
    }    

    // focusNextField = (nextField) => {
    //     this.refs[nextField].focus();
    // };    

    handleFormFocus(e, component){
        console.log(e, component);
    }

    // openTermsAndConditionsURL(){
    //     console.log('>>ENTERED: saveData');
    //     Linking.openURL('http://www.mywalkthru.com/');
    // }

    saveData() {
        console.log('>>ENTERED: saveData');
        if (this.validateFormData()) {
            let tenantId = this.state.tenantId;
            if (!tenantId) {
                alert('Failed to Save: invalid tenantId');
                return;
            }
            var data = JSON.stringify({
                "active": "true",
                "modified": now
            });
            this.saveFormData(tenantId, data, 'signup-lease-info');
        }
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
        let result = responseData[0];
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

    validateFormData(){
        console.log('>>ENTERED validateFormData');
        // tenant_full_name
        if (!this.state.formData.tenant_full_name) {
            alert('Full Name is required');
            return false;
        }
        if (this.state.formData.tenant_full_name.length < 7) {
            alert('Invalid Full Name');
            return false;
        }  

        // tenant_email
        if (!this.state.formData.tenant_email) {
            alert('Email Addressis required');
            return false;
        }
        if (this.state.formData.tenant_email.length < 8) {
            alert('Invalid Email Address');
            return false;
        }       

        // tenant_phone_number
        if (!this.state.formData.tenant_phone_number) {
            alert('Phone Number is required');
            return false;
        }
        if (this.state.formData.tenant_phone_number.length < 10) {
            alert('Invalid Phone Number');
            return false;
        }     

        // tenant_gender
        if (!this.state.formData.tenant_gender) {
            alert('Gender is required');
            return false;
        }

        // tenant_birthday
        if (!this.state.formData.tenant_birthday) {
            alert('Birthday is required');
            return false;
        }              

        return true;      
    }

    // resetForm(){
    //     this.refs.registrationForm.refs.tenant_full_name.setValue("");
    //     this.refs.registrationForm.refs.tenant_email.setValue("");
    //     this.refs.registrationForm.refs.tenant_phone_number.setValue("");
    // }

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

    // onEmailValueChange() {
    //     this.refs.registrationForm.refs.tenant_email.setValue("");
    // }

    handlePhoneNumberChange(){
        console.log('>> ENTERED: handlePhoneNumberChange');

        let value = this.state.formData.tenant_phone_number;

        console.log('>> handlePhoneNumberChange: value', value);

        if (!value || value.length<10) {
            return;
        }

        let phoneFormatted = this.formatPhoneNumber(value);
        console.log('phoneFormatted: ', phoneFormatted);
        console.log('phoneFormatted.length: ', phoneFormatted.length);

        if (phoneFormatted.length === 14){
            this.refs.registrationForm.refs.tenant_phone_number.setValue(phoneFormatted);
            console.log('dismissing keyboard');
            Keyboard.dismiss();
        }
    }    

    formatPhoneNumber(phone) {
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
    }    

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(email)) return true;
        return false;
    }    

    render(){
        const title = 'Sign Up - Tenant Info';
        return (
            <Container  style={{backgroundColor: '#fff'}} >
                <Header>
                    <Title style={{fontSize: 20}}>{title}</Title>
                </Header>

                <ScrollView keyboardShouldPersistTaps='always' style={{ height:200}}>

                    {this.renderNextButton()}

                    <Form 
                        ref='registrationForm'
                        onFocus={this.handleFormFocus.bind(this)}
                        onChange={this.handleFormChange.bind(this)}
                        label="Tenant Signup">

                        <Separator />

                        <InputField
                            iconLeft={
                                <WrappedIcon style={{marginLeft:10, alignSelf:'center', color:'#333'}} 
                                    name='ios-person' 
                                    size={30} />
                            }
                            ref='tenant_full_name' 
                            value=''
                            placeholder='Full Name'
                            autoCapitalize='words'
                            keyboardType='default'
                            returnKeyType="next" 
                            
                        />

                        <InputField
                            iconLeft={
                                <WrappedIcon style={{marginLeft:10, alignSelf:'center', color:'#333'}} 
                                    name='ios-mail' 
                                    size={30} />
                            }              
                            ref='tenant_email'
                            autoCapitalize='none'
                            value=''
                            placeholder='Your Email'
                            keyboardType='email-address'
                            returnKeyType="next"
                            
                      />

                        <InputField
                            iconLeft={
                                <WrappedIcon style={{marginLeft:10, alignSelf:'center', color:'#333'}} 
                                    name='ios-phone-portrait' 
                                    size={30} />
                            }                                       
                            ref='tenant_phone_number'
                            autoCapitalize='none'
                            value=''
                            placeholder='Your Phone Number'
                            keyboardType='phone-pad'
                            returnKeyType="next"
                            onBlur={this.handlePhoneNumberChange()}
                        />                        

                        <Separator />

                        <PickerField ref='tenant_gender'
                            label='Gender'
                            value=''
                            options={{
                                "": '',
                                male: 'Male',
                                female: 'Female'
                            }}
                            iconRight={
                                [
                                    <Icon key='ir1' style={{marginTop: 7, position:'absolute', right: 10}} name='ios-arrow-forward' size={30} />
                                ]}                         

                        />

                        <Separator />

                        <DatePickerField 
                            ref='tenant_birthday'
                            mode='date' 
                            minimumDate={new Date('1/1/1900')}
                            maximumDate={new Date('1/1/2099')}
                            iconRight={[<Icon style={{alignSelf:'center', marginLeft:10}} name='ios-arrow-forward' size={30} />,
                                        <Icon style={{alignSelf:'center', marginLeft:10}} name='ios-arrow-down' size={30} />
                            ]}
                            placeholder='Birthday'
                        />

                       

                    </Form>

        

                </ScrollView>
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