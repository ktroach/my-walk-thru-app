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
            formData:{}
        }
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

    handleFormChange(formData){
        /*
        formData will contain all the values of the form,
        in this example.

        formData = {
        first_name:"",
        last_name:"",
        gender: '',
        birthday: Date,
        has_accepted_conditions: bool
        }
        */

        this.setState({formData:formData})
        this.props.onFormChange && this.props.onFormChange(formData);
    }    

    handleFormFocus(e, component){
        console.log(e, component);
    }

    openTermsAndConditionsURL(){
        Linking.openURL('http://www.mywalkthru.com/');
    }

    resetForm(){
        this.refs.registrationForm.refs.full_name.setValue("");
        this.refs.registrationForm.refs.email.setValue("");
    }

    render(){
        const title = 'Sign Up';
        return (
            <Container  style={{backgroundColor: '#fff'}} >
                <Header>
                    <Title style={{fontSize: 20}}>{title}</Title>
                </Header>
                <ScrollView keyboardShouldPersistTaps='always' style={{ height:200}}>
                    <Form
                        ref='registrationForm'
                        onFocus={this.handleFormFocus.bind(this)}
                        onChange={this.handleFormChange.bind(this)}
                        label="Personal Information">
                        <Separator />
                        <InputField
                            iconLeft={
                                <WrappedIcon style={{marginLeft:10, alignSelf:'center', color:'#333'}} name='ios-person' size={30} />
                            }
                            ref='full_name' 
                            value=''
                            placeholder='Full Name'
                        />
                        <InputField
                            iconLeft={
                                <WrappedIcon style={{marginLeft:10, alignSelf:'center', color:'#333'}} name='ios-mail' size={30} />
                            }                
                            ref='email'
                            value=''
                            keyboardType='email-address'
                            placeholder='Your Email'
                        />
                        <Separator />
                        <PickerField ref='gender'
                            label='Gender'
                            value='female'
                            options={{
                                "": '',
                                male: 'Male',
                                female: 'Female'
                            }}
                        />

                        <DatePickerField 
                            ref='birthday'
                            mode='date' 
                            minimumDate={new Date('1/1/1900')}
                            maximumDate={new Date('1/1/2099')}
                            iconRight={[<Icon style={{alignSelf:'center', marginLeft:10}} name='ios-arrow-forward' size={30} />,
                                        <Icon style={{alignSelf:'center', marginLeft:10}} name='ios-arrow-down' size={30} />
                                        ]}
                            placeholder='Birthday'
                        />

                    </Form>

                    <Button rounded block
                        style={{alignSelf: 'center',
                            marginTop: 40,
                            backgroundColor: '#ad241f',
                            borderRadius:90,
                            width: 300,
                            height:65}}
                            onPress={() => {
                                this.replaceRoute('signup-user-info');
                            }}
                        >
                        <Text style={{color:'#fff', fontWeight: 'bold'}}>NEXT</Text>
                    </Button>            

                    <Text style={{marginTop: 20}}>Debug Saved: {JSON.stringify(this.state.formData)}</Text>

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