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

export class SignUpLeaseInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            tenantId: '',
            validated:  false
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


        if(change && change !== ''){
            this.setState({validated:true});
        }


        // let vCount = 0;

        // let formData = this.form.getData();

        // if (!formData) {
        //     return;
        // }

        // if (!formData.leaseReasonSection ||
        //     !formData.leaseReasonSection.leaseReasonActionCell) {
        //     return;
        // }        

        // // lease reason picker
        // let reason = formData.leaseReasonSection.leaseReasonActionCell;

        // if (!reason || reason.length===0) {
        //     this.setState({validated:false});
        // } else {
        //     this.setState({validated:true});
        // } 

        // if (ref === 'leaseReasonActionCell') {
        //     if (change && change !== '') {
        //        vCount++; 
        //     }
        // }
        // if (ref === 'leaseBeginDatePicker') {
        //     if (change && change !== '') {
        //        vCount++; 
        //     }
        // }   
        // if (ref === 'leaseEndDatePicker') {
        //     if (change && change !== '') {
        //        vCount++; 
        //     }
        // }    

        // if (vCount > 0) {
        //     this.setState({validated:true});
        // }
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
                alert('Failed to Save: invalid tenantId');
                return;
            }

            let now = new Date();
            let reason = formData.leaseReasonSection.leaseReasonActionCell;
            let begin = formData.leaseBeginSection.leaseBeginDatePicker;
            let end = formData.leaseEndSection.leaseEndDatePicker;

            var data = JSON.stringify({
                "leaseReason": reason,
                "leaseBegin": begin,
                "leaseEnd": end,
                "active": "true",
                "modified": now
            });

            this.saveFormData(tenantId, data, 'signup-property-info');
        }
    }

    validateFormData(formData){
        console.log('>>ENTERED validateFormData');
        console.log('>>> formData: ', formData);

        // lease reason picker
        if (!formData.leaseReasonSection.leaseReasonActionCell) {
            alert('Lease Reason is required');
            return false;
        }        

        // lease begin date
        if (!formData.leaseBeginSection.leaseBeginDatePicker) {
            alert('Lease Begin date is required');
            return false;
        }

        // lease end date
        if (!formData.leaseEndSection.leaseEndDatePicker) {
            alert('Lease End date is required');
            return false;
        }

        // lease end date must be greater than lease begin date 
        let beginValue = formData.leaseBeginSection.leaseBeginDatePicker;
        let endValue = formData.leaseEndSection.leaseEndDatePicker;

        if (!beginValue || !endValue) {
            alert('Lease Dates not selected');
            return false;
        }          

        let begin = new Date(beginValue);
        let end = new Date(endValue);

        if (end < begin) {
            alert('Lease End date must be after Lease Begin date');
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
                    marginTop: 20,
                    marginBottom: 20,
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

    addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }    

    getDefaultBeginDate(){
        let now = new Date();
        return this.addDays(now, 5);
    }

    getDefaultEndDate(){
        let now = new Date();
        return this.addDays(now, 366);
    }

    render() {

        const title = 'Lease Info';
        const forwardIcon = <Icon name={'ios-arrow-forward'} color={'gray'} size={20} />;
        const alertIcon = <Icon name={'ios-alert'} color={'gray'} size={20} />;
        
        return (
            <Container  style={{backgroundColor: '#fff'}} >
                <Header>
                    <Button transparent onPress={() => this.replaceRoute('signup-user-info')}>
                        <Icon name='ios-arrow-back' style={{fontSize: 30}} />
                    </Button>                      
                    <Title style={{fontSize: 20}}>{title}</Title>
                </Header>            

        <View style={{ flex: 1, backgroundColor: '#9DD6EB' }}>

        {this.renderNextButton()}

        <Form
          ref={(ref) => { this.form = ref; }}
          onPress={this.handlePress.bind(this)}
          onChange={this.handleChange.bind(this)}
        >

          <Section
            ref={'leaseReasonSection'}
            title={'LEASE REASON'}
            helpText={'Select the primary reason you are leasing the property.'}
          >
            <ActionSheetCell
              ref={'leaseReasonActionCell'}
              title={'Select the Lease Reason'}
              options={[' ',' First Time Lease', 'Renewing Lease', 'Other']}
              selectedValueIndex={0}
            />
          </Section>

          <Section
            ref={'leaseBeginSection'}
            title={'LEASE BEGIN'}
            helpText={'Select the date when your lease ends according to your lease agreement.'}
          >
            <DatePickerCell
              ref={'leaseBeginDatePicker'}
              title={'Select the Lease Begin Date'}
              datePickerProps={{ mode: 'date' }}
              value={this.getDefaultBeginDate()}
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
            ref={'leaseEndSection'}
            title={'LEASE END'}
            helpText={'Select the date when your lease begins according to your lease agreement.'}
          >
            <DatePickerCell
              ref={'leaseEndDatePicker'}
              title={'Select the Lease End Date'}
              datePickerProps={{ mode: 'date' }}
              value={this.getDefaultEndDate()}
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

export default connect(null, bindActions)(SignUpLeaseInfo);