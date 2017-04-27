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
            tenantId: '',
            userId: '',
            userModelId: ''
        }
    } 

    componentWillMount(){
        
    }

    componentDidMount() {
      AsyncStorage.getItem("userId")
      .then( (userId) =>
            {
                this.setState({userId: userId});
                // alert(userId);
                this.fetchUser(userId, function(err, res){
                    if (err){
                        console.log(err);
                    } else {
                        console.log('snap');
                        // if(res && res[0]){
                        //     let userModelId = res[0].id;
                        //     if(userModelId){
                        //         this.setState({userModelId: userModelId});
                        //     }    
                        // }
                    }

                });
            }
      )
      .done();
    }

    fetchUser(userId, cb){
        if(!userId)return;
        var query = 'https://mywalkthruapi.herokuapp.com/api/v1/users?filter={"where": {"userId": "' + userId + '"}}';
        
        console.log('query:', query);

        fetch(query).then((response) => response.json()).then((res) => {
            console.log('fetchUser => responseData', res);

            if(res && res[0]){
                let userModelId = res[0].id;
                if(userModelId){
                    this.setState({userModelId: userModelId});
                }    
            }


            cb(null, res);
        }).catch((error) => {
            console.error(error);
            cb(error, null);
        }).done();      
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

    proceedToAreas(){
        this.replaceRoute('categories');
    }    

    takePhoto(userId){
         ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4,3]
          }).then(function(pickerResult) {
              console.log('pickerResult:', pickerResult);
              let uploadResponse, uploadResult;
              try {
                if (!pickerResult.cancelled) {

                    // let userId = this.state.userModelId;

                    

                    if (!userId) {
                        throw new Error('No userId found!');
                    }

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

                    // alert(photoUrl);


                    let now = new Date();

                    // let newimages = [];

                    // newimages.push(
                    // {
                    //     image: photoUrl,
                    //     caption: 'Front of Property',
                    //     timestamp: now
                    // });                    

                    let data =
                    {
                        photoUrl: photoUrl,
                        modified: now
                    };                    

                    // this.persistData(userId, data, 'categories');
                    
                    //PATCH data
                    let url = 'https://mywalkthruapi.herokuapp.com/api/v1/users/' + userId;

                    // alert(url);

                    fetch(url, {
                        method: 'PATCH',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    }).then((response) => response.json()).then((responseData) => {
                        console.log('responseData: ', responseData);


                        AsyncStorage.setItem("snappedFront", url)
                        .then( () => 
                            {
                                alert('Thank you for snapping a pic of your home');
                                // this.replaceRoute('categories');    
                            }
                        )
                        .done(); 

                        //  this.replaceRoute('categories');

                        //this.setState({comments: JSON.stringify(responseData)});
                    }).catch((error) => {
                        console.error(error);
                    }).done();

                  });
                }
              } catch(error) {
                // console.log({uploadResponse});
                // console.log({uploadResult});
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

    //   alert('persistData userId:'+userId);

      let now = new Date();

      //PATCH data
      let url = 'https://mywalkthruapi.herokuapp.com/api/v1/users/' + id;

      alert(url);

      fetch(url, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then((response) => response.json()).then((responseData) => {
         console.log('responseData: ', responseData);


        AsyncStorage.setItem("snappedFront", true)
        .then( () => 
            {
                alert('Thank you for snapping a pic of your home');
                this.replaceRoute('categories');    
            }
        )
        .done(); 

        //  this.replaceRoute('categories');

         //this.setState({comments: JSON.stringify(responseData)});
      }).catch((error) => {
         console.error(error);
      }).done();

    }    

    render(){
        return (
            <View>
                 
                <Swiper style={styles.wrapper} showsButtons={false} loop={false}>

                    {/*<View style={styles.slide1}>

                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={{width: 200, height: 200}}
                        />
                                            
                        <Text style={styles.text}>Let's take some photos of the Property...</Text>
                    </View>*/}
                 

                    <View style={styles.slide1}>
                        
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={{width: 200, height: 200}}
                        />

                        <Text style={styles.text}>Snap a Photo of the Front</Text>
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
                                        this.takePhoto(this.state.userModelId);
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
                                        this.proceedToAreas();
                                    }}
                                >
                                <Text style={{color:'#fff', fontWeight: 'bold'}}>Next</Text>
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
                                <Text style={{color:'#fff', fontWeight: 'bold'}}>Cancel</Text>
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