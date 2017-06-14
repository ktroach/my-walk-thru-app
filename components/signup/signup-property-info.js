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

export class SignUpPropertyInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            tenantId: '',
            validated: false,
            loaded: false,
            tenant: {},
            propertyAddress: ''
        }
    } 

    componentWillMount(){
        this.getTenantId();
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
            this.setState({tenant: tenant, tenantId: id, validated: validated, propertyAddress: tenant.propertyAddress});
            cb(null, tenant);
        }).catch((error) => {
            console.error(error);
            cb(error, null);
        }).done();      
    }              

    // componentDidMount() {
    //     this.getTenantId();
    //     this.setState({loaded: true});
    // }

    replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    pushNewRoute(route) {
        this.props.pushNewRoute(route);
    }

    popRoute() {
        this.props.popRoute();
    }  

//    getTenantId() {
//      try {
//         AsyncStorage.getItem("tenantId")
//         .then( (tenantId) =>
//               {
//                 this.setState({tenantId: tenantId});
//               }
//         )
//         .done();
//      } catch(err){
//          console.log('Failed to get tenantId: ' + err);

//         //  //REMOVE!!!
//         //  let tenantId = '58decc07583ad3e4bab8b0ce';
//         //  console.log('REMOVE!!! USING TEST TENANTID...')
//         //  this.setState({tenantId: tenantId});

//      }       
//    }    

    onValidationError(ref, message) {
        console.log(ref, message);

    }

    handleChange(ref, change) {
        console.log('>>> handleChange: ', ref, change);

        if(ref && ref !== '' && ref === 'zip'){
            if(change && change.length === 5){
                Keyboard.dismiss();
            }            
        }  

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

        if (!this.form) {
            console.log('form undefined');
            return;
        }        

        let formData = this.form.getData();

        if (!formData) {
            console.log('formData undefined');
            return;
        }

        if (this.validateFormData(formData)) {

            let tenantId = this.state.tenantId;
            if (!tenantId) {
                alert('Failed to Save: Invalid tenantId');
                return;
            }

            let now = new Date();

            // if (!formData){
            //     alert('Failed to Save: Invalid tenantId');
            //     return;                
            // }

            // let street1 = '';
            // let street2 = '';
            // let city  = '';
            // let stateName = '';
            // let zip  = '';
            // let geocode = '';           

            let propertyType = '';

            let bedrooms = '';
            let bathrooms = '';

            let dining = '';
            let laundry = '';
            let family = '';
            let game = '';

            let centralAir = '';
            let centralHeat  = '';
            let forcedAir = '';
            let windowUnit = '';


            let stories = '';

            let parking = '';           

            // if (formData.PropertyLocationSection){
            //     if (formData.PropertyLocationSection.street1) street1 = formData.PropertyLocationSection.street1;
            //     if (formData.PropertyLocationSection.street2) street2 = formData.PropertyLocationSection.street2;
            //     if (formData.PropertyLocationSection.city) city = formData.PropertyLocationSection.city;
            //     if (formData.PropertyLocationSection.stateName) stateName = formData.PropertyLocationSection.stateActionCell;
            //     if (formData.PropertyLocationSection.zip) zip = formData.PropertyLocationSection.zip;
            //     // if (formData.PropertyLocationSection.geocode) geocode = formData.PropertyLocationSection.geocode;
            // }
            
            if (formData.PropertyTypeSection){
                if (formData.PropertyTypeSection.propertyTypeActionCell) propertyType = formData.PropertyTypeSection.propertyTypeActionCell;
                console.log('>> propertyType: ', propertyType);
            }

            if (formData.BedsBathsSection){
                if (formData.BedsBathsSection.bedroomsActionCell) bedrooms = formData.BedsBathsSection.bedroomsActionCell;
                if (formData.BedsBathsSection.bathroomsActionCell) bathrooms = formData.BedsBathsSection.bathroomsActionCell;
            }

            if (formData.RoomsSection){
                if (formData.RoomsSection.diningSwitchCell) dining = formData.RoomsSection.diningSwitchCell;
                if (formData.RoomsSection.laundrySwitchCell) laundry = formData.RoomsSection.laundrySwitchCell;
                if (formData.RoomsSection.familySwitchCell) family = formData.RoomsSection.familySwitchCell;
                if (formData.RoomsSection.gameSwitchCell) game = formData.RoomsSection.gameSwitchCell;
            }

            if (formData.HeatingCoolingSection){
                if (formData.HeatingCoolingSection.centralAirSwitchCell) centralAir = formData.HeatingCoolingSection.centralAirSwitchCell;
                if (formData.HeatingCoolingSection.centralHeatSwitchCell) centralHeat = formData.HeatingCoolingSection.centralHeatSwitchCell;
                if (formData.HeatingCoolingSection.forcedSwitchCell) forcedAir = formData.HeatingCoolingSection.forcedSwitchCell;
                if (formData.HeatingCoolingSection.windowUnitwitchCell) windowUnit = formData.HeatingCoolingSection.windowUnitwitchCell;
            }

            if (formData.StoriesSection){
                if (formData.StoriesSection.storiesActionCell) stories = formData.StoriesSection.storiesActionCell;
            }
            
            // if (formData.ParkingSection){
            //     if (formData.ParkingSection.parkingActionCell) parking = formData.ParkingSection.parkingActionCell;
            // }

            // if (!propertyType || propertyType.length===0){
            //     propertyType = 'Single Family';
            // }            
            
            // if (!bedrooms || bedrooms.length===0){
            //     bedrooms = '3';
            // }

            // if (!bathrooms || bathrooms.length===0){
            //     bathrooms = '2';
            // } 

            if (!stories || stories.length===0){
                stories = 'Single Story';
            }    

            if (!parking || parking.length===0){
                parking = '1+ Car Garage';
            }  

            if (!centralAir || centralAir.length===0){
                centralAir = 'true';
            }           

            if (!centralHeat || centralHeat.length===0){
                centralHeat = 'true';
            }                                                     

            var data = JSON.stringify({
                "propertyType": propertyType,
                // "street1": street1,
                // "street2": street2, 
                // "city": city,
                // "stateName": stateName,
                // "zip": zip,
                // "geocode": geocode,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,  
                "dining": dining,  
                "laundry": laundry,  
                "family": family,  
                "game": game,  
                "centralAir": centralAir,  
                "centralHeat": centralHeat,  
                "forcedAir": forcedAir,  
                "windowUnit": windowUnit,
                "stories": stories,
                "active": "true",
                "modified": now
            });

            console.log('>> property info save data: ', data);

            this.saveFormData(tenantId, data, 'signup-terms-conditions');
        }
    }

    validateFormData(formData){
        console.log('>>ENTERED validateFormData');
        console.log('>>> formData: ', formData);

        if (!formData) {
            alert('Input is required');
            return false;
        }           

        // if (!formData.PropertyLocationSection) {
        //     alert('Address is required');
        //     return false;
        // }          

        // if (!formData.PropertyLocationSection.street1) {
        //     alert('Street1 is required');
        //     return false;
        // }     

        // if (!formData.PropertyLocationSection.city) {
        //     alert('City is required');
        //     return false;
        // }    

        // if (!formData.PropertyLocationSection.stateName) {
        //     alert('State is required');
        //     return false;
        // } 

        // if (!formData.PropertyLocationSection.zip) {
        //     alert('Zip Code is required');
        //     return false;
        // }  

        if (!formData.PropertyTypeSection ||
            !formData.PropertyTypeSection.propertyTypeActionCell) {
            alert('Property Type is required');
            return false;
        }           

        if (!formData.BedsBathsSection ||
            !formData.BedsBathsSection.bedroomsActionCell) {
            alert('Number of Bedrooms is required');
            return false;
        }  

        if (!formData.BedsBathsSection|| 
            !formData.BedsBathsSection.bathroomsActionCell) {
            alert('Number of Bathrooms is required');
            return false;
        }   

        if (!formData.StoriesSection || 
            !formData.StoriesSection.storiesActionCell) {
            alert('Number of Stories is required');
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
                >DESCRIBE THE PROPERTY AS YOU SEE IT</Text>
            </View>);
        }
    }

    render() {
        const title = 'Property Info';
        const forwardIcon = <Icon name={'ios-arrow-forward'} color={'gray'} size={20} />;
        const alertIcon = <Icon name={'ios-alert'} color={'red'} size={20} />;
        
        return (
            <Container  style={{backgroundColor: '#2B59AC'}} >
               
                <Header  style={{backgroundColor: '#2B59AC'}}>
                    <Button transparent onPress={() => this.replaceRoute('signup-user-info')}>
                        <Icon name='ios-arrow-back' style={{fontSize: 30, color: '#fff'}} />
                    </Button>                     
                    <Title style={{fontSize: 20, color: '#fff'}}>{title}</Title>
                </Header>            

        <View style={{  backgroundColor: '#ffffff', height: 64 }}>
            {this.renderNextButton()}
        </View>

        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

        <View style={{  backgroundColor: '#132431', height: 24 }}>
            <Text style={{color:'#fff', fontSize: 16, fontWeight: 'bold', alignSelf: 'center'}}
            >{this.state.propertyAddress}</Text>
        </View>            

        <Form
          ref={(ref) => { this.form = ref; }}
          onPress={this.handlePress.bind(this)}
          onChange={this.handleChange.bind(this)}
        >

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

            {/*<Section
                ref={'PropertyLocationSection'}
                title={'LOCATION / ADDRESS'}
                helpText={'Enter the exact location of the Property.'}
            >
                <TextInputCell
                    ref="street1"
                    inputProps={{ 
                        placeholder: 'Street 1', 
                        autoCapitalize: 'words', 
                        autoCorrect: false, 
                        maxLength: 50,
                        keyboardType: 'default' 
                    }}
                /> 

                <TextInputCell
                    ref="street2"
                    inputProps={{ 
                        placeholder: 'Street 2 (optional)', 
                        autoCapitalize: 'words', 
                        autoCorrect: false, 
                        maxLength: 50,
                        keyboardType: 'default' 
                    }}
                />      

                <TextInputCell
                    ref="city"
                    inputProps={{ 
                        placeholder: 'City', 
                        autoCapitalize: 'words', 
                        autoCorrect: false, 
                        maxLength: 100,
                        keyboardType: 'default' 
                    }}
                />                      

                <ActionSheetCell
                    ref={'stateName'}
                    title={'State Name'}
                    options={ [ " ", 
                    "TX - Texas", 
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
                    inputProps={{ 
                        placeholder: 'Zip Code', 
                        autoCapitalize: "none", 
                        autoCorrect: false, 
                        maxLength: 5,
                        keyboardType: 'number-pad' 
                    }}
                />                                             

            </Section>  */}

            <Section
                ref={'BedsBathsSection'}
                title={'BEDROOMS / BATHROOMS'}
                helpText={'Select how many bedrooms and bathrooms are on the property'}
            >
                <ActionSheetCell
                    ref={'bedroomsActionCell'}
                    title={'Bedrooms'}
                    options={[' ','1','2','3','4','5+']}
                    selectedValueIndex={0}
                />

                <ActionSheetCell
                    ref={'bathroomsActionCell'}
                    title={'Bathrooms'}
                    options={[' ', '1', '1½', '2', '2½', '3', '3½', '4', '4½', '5+']}
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
                    switchTintColor={'#8EC5AD'}
                    title={'Dining'}
                    titleColor={'black'}
                />

                <SwitchCell
                    ref={'laundrySwitchCell'}
                    switchTintColor={'#8EC5AD'}
                    title={'Laundry'}
                    titleColor={'black'}
                />     

                <SwitchCell
                    ref={'familySwitchCell'}
                    switchTintColor={'#8EC5AD'}
                    title={'Family'}
                    titleColor={'black'}
                />   

                <SwitchCell
                    ref={'gameSwitchCell'}
                    switchTintColor={'#8EC5AD'}
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
                    switchTintColor={'#8EC5AD'}
                    title={'Central Air'}
                    titleColor={'black'}
                />  

                <SwitchCell
                    ref={'centralHeatSwitchCell'}
                    switchTintColor={'#8EC5AD'}
                    title={'Central Heat'}
                    titleColor={'black'}
                />     

                <SwitchCell
                    ref={'windowUnitwitchCell'}
                    switchTintColor={'#8EC5AD'}
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
                    title={'Select number of Stories'}
                    options={[' ', 'Single Story', 'Multiple Stories']}
                    selectedValueIndex={0}
                />

            </Section>  

            {/*<Section
                ref={'ParkingSection'}
                title={'PARKING'}
                helpText={'Select what type of parking is provided'}
            >
                <ActionSheetCell
                    ref={'parkingActionCell'}
                    title={'Select Parking option'}
                    options={[' ', '1+ Car Garage', '3+ Car Garage', 'Carport', 'Driveway', 'Circle Driveway', 'Other']}
                    selectedValueIndex={0}
                />
            </Section>              */}


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