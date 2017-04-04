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
    Image,
} from 'react-native';

import { Button } from 'native-base';

import Swiper from 'react-native-swiper';

import Expo, {
   Components,
   Permissions,
   Location,
   Constants,
   ImagePicker,
} from 'expo';

import { RNS3 } from 'react-native-aws3';

import moment from 'moment';
import shortid from 'shortid';

var styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  slide4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },  
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  }
});

export class SignUpComplete extends Component {

    constructor(props){
        super(props);
        this.state = {
            formData:{},
            leaseBeginMessage: '',
            leaseBeginDate: '',
            tenantId: ''
        }
    } 

    componentWillMount(){
        
    }

    componentDidMount() {
        // this.getTenantId();
    }

   getTenantId() {
     try {
        AsyncStorage.getItem("tenantId")
        .then( (tenantId) =>
              {
                // this.setState({tenantId: tenantId});
                return tenantId;
              }
        )
        .done();
     } catch(err){
         console.log('Failed to get tenantId: ' + err);

         //REMOVE!!!
         let tenantId = '58decc07583ad3e4bab8b0ce';
         console.log('REMOVE!!! USING TEST TENANTID...')
        //  this.setState({tenantId: tenantId});

         return tenantId;

     }     
   
   }      
  
    componentWillUnmount() {
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

    openTermsAndConditionsURL(){
        Linking.openURL('http://www.mywalkthru.com/');
    }

    proceedToWalkthru(){
        this.replaceRoute('signup-property-photos');
    }

    proceedToHome(){
        this.replaceRoute('home');
    }    

    takePhoto(){
         ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4,3]
          }).then(function(pickerResult) {
              console.log('pickerResult:', pickerResult);
              let uploadResponse, uploadResult;
              try {
                if (!pickerResult.cancelled) {
                  let userId = 'unknown';
                  let fileName = shortid.generate();
                  let fileType = 'jpg';

                  const file = {
                    uri: pickerResult.uri,
                    name: `${fileName}.${fileType}`,
                    type: `image/${fileType}`
                  };

                  const options = {
                    keyPrefix: 'photos/',
                    bucket: 'mywalkthru-pm-files',
                    region: 'us-west-2',
                    accessKey: 'AKIAIRVLMXELYRQ5GYFA',
                    secretKey: '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',
                    successActionStatus: 201
                  };

                  console.log('UPLOADING PROPERTY (FRONT) PHOTO TO S3...');

                  RNS3.put(file, options).then(response => {
                    // let res = JSON.stringify(response);

                    console.log('>>>>>>>> response:', response);

                    if (response.status !== 201) {
                      throw new Error('Failed to upload image to S3', response);
                    }

                    if (!response.body){
                      throw new Error('Failed to upload image to S3', response);
                    }

                    let photoUrl = response.body.postResponse.location;

                    console.log('Property photoUrl:', photoUrl);

                    // this.savedPropertyPhotoUrl = photoUrl;

                    let tenantId = '58decc07583ad3e4bab8b0ce';

                    console.log('>>>>>> tenantId:', tenantId);

                    if (!tenantId) {
                        throw new Error('No TenantId found!');
                    }

                    let now = new Date();

                    let newimages = [];

                    newimages.push(
                    {
                        image: photoUrl,
                        caption: 'Front of Property',
                        timestamp: now
                    });                    

                    let data =
                    {
                        images: newimages,
                        modified: now
                    };                    

                    this.persistData(tenantId, data, null);


                  });
                }
              } catch(error) {
                console.log({uploadResponse});
                console.log({uploadResult});
                console.log('error:', error);
                let errorMessage = 'Failed to upload image' + error.message;
                alert(errorMessage);
              } finally {
                console.log('finally');
              }


          }, function() {
              console.log('Photo Cancelled');
          });        
        // this.replaceRoute('signup-property-photos');
    }    

    persistData(id, data, route) {
      if (!data) {
        alert('Invalid parameter: data');
        return;
      }
      if (!id) {
        alert('Invalid parameter: id');
        return;
      }         
    //   let url = '';
      let now = new Date();

      //PATCH data
      let url = 'https://mywalkthruapi.herokuapp.com/api/v1/Tenants/' + id;
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then((response) => response.json()).then((responseData) => {
         console.log('responseData: ', responseData);

         // change navigation route post save
         if (route) {
           this.replaceRoute(route);
         }
         //this.setState({comments: JSON.stringify(responseData)});
      }).catch((error) => {
         console.error(error);
      }).done();
    }    

    render(){
        return (
            <View>
                 
            
                <Swiper style={styles.wrapper} showsButtons={true} loop={false}>

                    <View style={styles.slide1}>

                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={{width: 200, height: 200}}
                        />
                                            
                        <Text style={styles.text}>Let's take some photos of the Property...</Text>
                    </View>
                 

                    <View style={styles.slide3}>
                        
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={{width: 200, height: 200}}
                        />

                        <Text style={styles.text}>Take a Photo of the Front</Text>
                        <Text style={styles.text}>of the Property</Text>
                        <Text style={styles.text}>from the Street</Text>

                            <Button rounded block
                                style={{alignSelf: 'center',
                                    marginTop: 40,
                                    backgroundColor: '#ad241f',
                                    borderRadius:90,
                                    width: 200,
                                    height:40}}
                                    onPress={() => {
                                        this.takePhoto();
                                    }}
                                >
                                <Text style={{color:'#fff', fontWeight: 'bold'}}>Take Photo</Text>
                            </Button>     

                            <Button rounded block
                                style={{alignSelf: 'center',
                                    marginTop: 40,
                                    backgroundColor: '#ad241f',
                                    borderRadius:90,
                                    width: 200,
                                    height:40}}
                                    onPress={() => {
                                        this.proceedToHome();
                                    }}
                                >
                                <Text style={{color:'#fff', fontWeight: 'bold'}}>Skip, for now...</Text>
                            </Button>                                              
                    </View>

                </Swiper> 

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

export default connect(null, bindActions)(SignUpComplete);