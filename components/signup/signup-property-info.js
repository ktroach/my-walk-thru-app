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

export class SignUpPropertyInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            tenantId: '',
            validated: false,
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

        if(change && change !== ''){
            this.setState({validated:true});
        }
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

            let street1 = formData.PropertyLocationSection.street1;
            let street2 = formData.PropertyLocationSection.street2;
            let city = formData.PropertyLocationSection.city;
            let stateName = formData.PropertyLocationSection.stateActionCell;
            let zip = formData.PropertyLocationSection.zip;
            let geocode = formData.PropertyLocationSection.geocode;            

            let propertyType = formData.PropertyTypeSection.propertyTypeActionCell;

            let bedrooms = formData.BedsBathsSection.bedroomsActionCell;
            let bathrooms = formData.BedsBathsSection.bathroomsActionCell;

            let dining = formData.RoomsSection.diningSwitchCell;
            let laundry = formData.RoomsSection.laundrySwitchCell;
            let family = formData.RoomsSection.familySwitchCell;
            let game = formData.RoomsSection.gameSwitchCell;

            let centralAir = formData.HeatingCoolingSection.centralAirSwitchCell;
            let centralHeat = formData.HeatingCoolingSection.centralHeatSwitchCell;
            let forced = formData.HeatingCoolingSection.forcedSwitchCell;
            let windowUnit = formData.HeatingCoolingSection.windowUnitwitchCell;

            let stories = formData.StoriesSection.storiesActionCell;

            let parking = formData.ParkingSection.parkingActionCell;

            var data = JSON.stringify({
                "propertyType": fullName,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "street1": street1,
                "street2": street2, 
                "city": city,
                "stateName": stateName,
                "zip": zip,
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
                ref={'PropertyLocationSection'}
                title={'LOCATION / ADDRESS'}
                helpText={'Where is this property located?'}
            >
                <TextInputCell
                    ref="street1"
                    inputProps={{ placeholder: 'Street 1' }}
                    autoCapitalize="words"
                /> 

                <TextInputCell
                    ref="street2"
                    inputProps={{ placeholder: 'Street 2 (optional)' }}
                    autoCapitalize="words"
                />      

                <TextInputCell
                    ref="city"
                    inputProps={{ placeholder: 'City' }}
                    autoCapitalize="words"
                />                      

                <ActionSheetCell
                    ref={'stateName'}
                    title={'State Name'}
                    options={ [ " ", 
                    "AK - Alaska", 
                    "AL - Alabama", 
                    "AR - Arkansas", 
                    "AS - American Samoa", 
                    "AZ - Arizona", 
                    "CA - California", 
                    "CO - Colorado", 
                    "CT - Connecticut", 
                    "DC - District of Columbia", 
                    "DE - Delaware", 
                    "FL - Florida", 
                    "GA - Georgia", 
                    "GU - Guam", 
                    "HI - Hawaii", 
                    "IA - Iowa", 
                    "ID - Idaho", 
                    "IL - Illinois", 
                    "IN - Indiana", 
                    "KS - Kansas", 
                    "KY - Kentucky", 
                    "LA - Louisiana", 
                    "MA - Massachusetts", 
                    "MD - Maryland", 
                    "ME - Maine", 
                    "MI - Michigan", 
                    "MN - Minnesota", 
                    "MO - Missouri", 
                    "MS - Mississippi", 
                    "MT - Montana", 
                    "NC - North Carolina", 
                    "ND - North Dakota", 
                    "NE - Nebraska", 
                    "NH - New Hampshire", 
                    "NJ - New Jersey", 
                    "NM - New Mexico", 
                    "NV - Nevada", 
                    "NY - New York", 
                    "OH - Ohio", 
                    "OK - Oklahoma", 
                    "OR - Oregon", 
                    "PA - Pennsylvania", 
                    "PR - Puerto Rico", 
                    "RI - Rhode Island", 
                    "SC - South Carolina", 
                    "SD - South Dakota", 
                    "TN - Tennessee", 
                    "TX - Texas", 
                    "UT - Utah", 
                    "VA - Virginia", 
                    "VI - Virgin Islands", 
                    "VT - Vermont", 
                    "WA - Washington", 
                    "WI - Wisconsin", 
                    "WV - West Virginia", 
                    "WY - Wyoming"]}
                    selectedValueIndex={0}
                />     

                <TextInputCell
                    ref="zip"
                    inputProps={{ placeholder: 'Zip Code' }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType='phone-pad'
                />          

                <TextInputCell
                    ref="geocode"
                    inputProps={{ placeholder: 'Longitude/Latitude (optional)' }}
                />                                         

            </Section>  

            <Section
                ref={'PropertyTypeSection'}
                title={'PROPERTY TYPE'}
                helpText={'Select the type of Property you are leasing.'}
            >
                <ActionSheetCell
                    ref={'propertyTypeActionCell'}
                    title={'Property Type'}
                    options={[' ', 'Single Family', 'Condo/Townhome', 'Apartment', 'Mobile Home', 'Farm/Ranch', 'Multi Family', 'Other']}
                    selectedValueIndex={0}
                />
            </Section> 

            <Section
                ref={'BedsBathsSection'}
                title={'BEDROOMS / BATHROOMS'}
                helpText={'Select how many bedrooms and bathrooms are on the property'}
            >
                <ActionSheetCell
                    ref={'bedroomsActionCell'}
                    title={'Bedrooms'}
                    options={[' ', '1', '2', '3', '4', '5+', 'Studio']}
                    selectedValueIndex={0}
                />

                <ActionSheetCell
                    ref={'bathroomsActionCell'}
                    title={'Bathrooms'}
                    options={[' ', '1', '2', '3', '4', '5+']}
                    selectedValueIndex={0}
                /> 

            </Section> 

            <Section
                ref={'RoomsSection'}
                title={'ROOMS'}
                helpText={'Switch on/off rooms that are on the property'}
            >
                <SwitchCell
                    ref={'diningSwitchCell'}
                    switchTintColor={'blue'}
                    title={'Dining'}
                    titleColor={'black'}
                />

                <SwitchCell
                    ref={'laundrySwitchCell'}
                    switchTintColor={'blue'}
                    title={'Laundry'}
                    titleColor={'black'}
                />     

                <SwitchCell
                    ref={'familySwitchCell'}
                    switchTintColor={'blue'}
                    title={'Family'}
                    titleColor={'black'}
                />   

                <SwitchCell
                    ref={'gameSwitchCell'}
                    switchTintColor={'blue'}
                    title={'Game Room'}
                    titleColor={'black'}
                />                   

            </Section> 

            <Section
                ref={'HeatingCoolingSection'}
                title={'HEATING / COOLING'}
                helpText={'Switch on/off heating and cooling system types on the property'}
            >

                <SwitchCell
                    ref={'centralAirSwitchCell'}
                    switchTintColor={'blue'}
                    title={'Central Air'}
                    titleColor={'black'}
                />  

                <SwitchCell
                    ref={'centralHeatSwitchCell'}
                    switchTintColor={'blue'}
                    title={'Central Heat'}
                    titleColor={'black'}
                />     

                <SwitchCell
                    ref={'windowUnitwitchCell'}
                    switchTintColor={'blue'}
                    title={'Window Unit'}
                    titleColor={'black'}
                />                                  

            </Section> 

            <Section
                ref={'StoriesSection'}
                title={'STORIES'}
                helpText={'Select how many stories there are.'}
            >
                <ActionSheetCell
                    ref={'storiesActionCell'}
                    title={'Stories'}
                    options={[' ', 'Single Story', 'Multiple Stories']}
                    selectedValueIndex={0}
                />

            </Section>  

            <Section
                ref={'ParkingSection'}
                title={'PARKING'}
                helpText={'Select what type of parking is provided'}
            >
                <ActionSheetCell
                    ref={'storiesActionCell'}
                    title={'Stories'}
                    options={[' ', '1+ Car Garage', '3+ Car Garage', 'Carport']}
                    selectedValueIndex={0}
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

export default connect(null, bindActions)(SignUpPropertyInfo);