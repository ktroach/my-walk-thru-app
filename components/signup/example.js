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

export class Example extends Component {
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

  onValidationError(ref, message) {
    console.log(ref, message);
  }

  handleChange(ref, change) {
    console.log(ref, change);
  }

  handlePress(ref) {
    if (ref === 'LogData') {
      console.log(this.form.getData());
    } else if (ref === 'LogValidationErrors') {
      console.log(this.form.getValidationErrors());
    }
  }

  render() {
    const forwardIcon = <Icon name={'ios-arrow-forward'} color={'gray'} size={20} />;
    const alertIcon = <Icon name={'ios-alert'} color={'gray'} size={20} />;
    return (
      <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
        <Form
          ref={(ref) => { this.form = ref; }}
          onPress={this.handlePress.bind(this)}
          onChange={this.handleChange.bind(this)}
        >
          <Section
            ref={'firstSection'}
            title={'FIRST SECTION'}
          >
            <ButtonCell
              ref={'ButtonCell'}
              title={'ButtonCell'}
              textAlign={'center'}
              titleColor={'red'}
            />
            <PushButtonCell
              ref={'PushButtonCell'}
              rightIcon={forwardIcon}
              icon={alertIcon}
              title={'PushButtonCell'}
            />
            <SwitchCell
              ref={'SwitchCell'}
              switchTintColor={'blue'}
              title={'SwitchCell'}
              titleColor={'black'}
              icon={alertIcon}
            />
          </Section>
          <Section
            ref={'secondSection'}
            title={'SECOND SECTION'}
            helpText={'The helpText prop allows you to place text at the section bottom.'}
          >
            <ActionSheetCell
              ref={'ActionSheetCell'}
              title={'ActionSheetCell'}
              options={['Option 1', 'Option 2', 'Option 3']}
              icon={alertIcon}
              selectedValueIndex={0}
            />
            <TextInputCell
              ref="SingleLineTextInput"
              validator={createValidator(emailValidator, { errorMessage: 'Invalid Email' })}
              inputProps={{ placeholder: 'Single line TextInputCell' }}
            />
            <TextInputCell
              ref={'MultiLineTextInput'}
              inputProps={{ multiline: true, color: 'green' }}
              cellHeight={100}
              value={'Multiline TextInputCell with specified value and color.'}
            />
            <DatePickerCell
              ref={'DatePickerCell'}
              title={'DatePickerCell'}
              datePickerProps={{ mode: 'datetime' }}
              value={new Date('7/1/16')}
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
            ref={'customSection'}
            title={'CUSTOM COMPONENTS'}
          >
            <CustomInput title={'CustomInput'} ref={'CustomInput'} />
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

export default connect(null, bindActions)(Example);