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
    // Text,
    View,
    ScrollView,
    Linking,
    TouchableHighlight, 
    Modal,
    Image,
} from 'react-native';

// import { Button } from 'native-base';


import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input } from 'native-base';


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

import theme from '../../themes/form-theme';

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
    color: '#333',
    fontSize: 16,
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
            userModelId: '',
            photoUrl: '',
            titleText: ''
        }
    } 

    _funcYou = function(userId) {
        // console.log('FUNC YOU ', userId);
        return Promise.resolve(userId);
    }

    componentDidMount() {
        let photoUrl = '';
        AsyncStorage.getItem("userId")
            .then(this._funcYou)
            .then(userId => {
                // console.log('FUNC YOU 2 ', userId);
                this.setState({userId: userId});
                return Promise.resolve(userId);
            })
            .then((userId) => {
                console.log('GO FETCH YOURSELF THEN ', userId);
                    // this.setState({userId: userId});
                    // alert(userId);
                    this.fetchUser(userId, function(err, res){
                        if (err){
                            console.log(err);
                            // return err;
                        } else {
                            console.log('sure, why not');
                        }
                    });
                }
                // classic example of the difference of using callbacks versus promises right here:
                // this would work as expected had the function returned a promise
                // instead of a callback.  that is why res is null when the next 
                // then function is executed.  to fix that fetchUser() would need 
                // to return a new Promise.
            ).then((res) => {
                // res will always be null inside of this function (see above)
                console.log('FETCHED ', res);
            }
        ).done(() => {
            console.log('done');
            }
        );
    }

    fetchUser(userId, cb){
        if(!userId)return;
        var query = 'https://mywalkthruapi.herokuapp.com/api/v1/users?filter={"where": {"userId": "' + userId + '"}}';
        
        console.log('query:', query);

        fetch(query).then((response) => response.json()).then((res) => {
            console.log('fetchUser => responseData', res[0].userId);

            let user = {};

            if (Array.isArray(res)){
                user = res[0];
            } else {
                user = res;
            }      

            // console.log('user:', user);
            
            let photoUrl = '';
            let userModelId = '';

            if (user){

                userModelId = user.id;

                console.log('userModelId:', userModelId);
                
                if (user.property && user.property.length>0){
                    if (user.property.photoUrl && user.property.photoUrl.length>0){
                        console.log('found property photo: ', user.property.photoUrl);
                        photoUrl = user.property.photoUrl;
                    }                            
                } else {
                    if (user.photoUrl && user.photoUrl.length>0){
                        console.log('found property photo: ', user.photoUrl);
                        photoUrl = user.photoUrl;
                    }                                   
                }

                console.log('photoUrl:', photoUrl);

                if (userModelId) {
                    if (photoUrl){
                        console.log('1:');
                        this.setState({userModelId: userModelId, photoUrl: photoUrl, titleText: 'Photo of the Property'});
                    } else {
                        console.log('2:');
                        this.setState({userModelId: userModelId, titleText: 'Snap a photo of the front of the property from the street'});
                    }
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

    openTermsAndConditionsURL(){
        Linking.openURL('http://www.mywalkthru.com/');
    }

    proceedToWalkthru(){
        this.replaceRoute('signupPropertyPhotos');
    }

    proceedToHome(){
        this.replaceRoute('Home');
    }    

    proceedToAreas(){
        this.replaceRoute('categories');
    }    

    takePhotoProxy(userId){
        this.takePhoto(userId, function(err,res){
            if (err) return;
            if (res){
                this.setState({photoUrl: res});
            }
        });
    }

    takePhoto(userId, cb){
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
                        alert('userId not found!');
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

                    // this.setState({photoUrl: photoUrl});
                    // alert(photoUrl);      

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

                        cb(null, photoUrl);

                        // AsyncStorage.setItem("snappedFront", url)
                        // .then( () => 
                        //     {
                        //         alert('Thank you for snapping a pic of your home');
                        //         // this.replaceRoute('categories');    
                        //     }
                        // )
                        // .done(); 

                        //  this.replaceRoute('categories');

                        //this.setState({comments: JSON.stringify(responseData)});
                    }).catch((error) => {
                        console.error(error);
                        cb(error, null);
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
        // this.replaceRoute('signupPropertyPhotos');
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

    //   alert(url);

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
                // alert('Thank you for snapping a photo of your home');
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

    maybeRenderPropertyPhoto(){
        if (this.state.photoUrl){
            return(
            <View style={{alignSelf: 'center', borderTopRightRadius: 5, borderTopLeftRadius: 5, overflow: 'hidden'}}>
                <Image
                    source={{uri: this.state.photoUrl}}
                    style={{width: 300, height: 200}}
                />
            </View>            
            );
        } else {
            return(
            <View style={{alignSelf: 'center', borderTopRightRadius: 5, borderTopLeftRadius: 5, overflow: 'hidden'}}>
                <Image
                        source={require('../../assets/images/property-placeholder.jpg')}
                        style={{width: 300, height: 200}}
                    />                
            </View>            
            );
        }
    }

    maybeSuggestTakingPhoto(){
        if (!this.state.photoUrl){
            return(
                <CardItem>
                    <Text style={{
                                    alignSelf: 'center',
                                    color: '#333',
                                    fontSize: 16, 
                                    fontWeight: 'bold'
                        }}>
                        Based on your current location, it appears you are near the property address.  Do you want to 
                        go ahead and take a photo of the front of the property? We display this on the MyWalkThru 
                        Report. 
                    </Text>
                </CardItem>           
            );
        }    
    }

    render(){
        return (

            <Container theme={theme} style={{backgroundColor: '#fff'}}>
               <Image source={require('../../assets/images/login2.jpg')} style={{        
                        flex: 1,
                        width: null,
                        height: null}} >          
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('Home')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Property Photo</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                        <View style={{
                              		backgroundColor: '#fff',  		
  		                            borderRadius: 5
                        }}>
                            <Card foregroundColor='#000'>

                                <CardItem>
                                    <Text style={{
                                                    alignSelf: 'center',
                                                    color: '#333',
                                                    fontSize: 16, 
                                                    fontWeight: 'bold'
                                        }}>
                                        {this.state.titleText}
                                    </Text>
                                </CardItem>

                                {this.maybeSuggestTakingPhoto}

                                <CardItem>
                                    {this.maybeRenderPropertyPhoto()}
                                </CardItem>

                                <CardItem>
                                <View style={{marginTop: 10}}>
                                <Button rounded block
                                        style={{alignSelf: 'center',
                                                marginTop: 1,
                                                backgroundColor:'#2B59AC',
                                                borderRadius:45,
                                                width: 300,
                                                height:40}}
                                        onPress={() => {
                                            this.takePhotoProxy(this.state.userModelId);
                                        }}
                                    >
                                    <Text style={{color:'#fff', fontWeight: 'bold'}}>TAKE PHOTO</Text>
                                </Button>  
                                </View>   

                                <View style={{marginTop: 10}}>        
                                <Button rounded block
                                        style={{alignSelf: 'center',
                                                marginTop: 1,
                                                backgroundColor:'#2B59AC',
                                                borderRadius:45,
                                                width: 300,
                                                height:40}}
                                        onPress={() => {
                                            this.proceedToAreas();
                                        }}
                                    >
                                    <Text style={{color:'#fff', fontWeight: 'bold'}}>NEXT</Text>
                                </Button>  
                                </View>                            

                                {/* <View style={{marginTop: 10}}>        
                                <Button rounded block
                                        style={{alignSelf: 'center',
                                                marginTop: 1,
                                                backgroundColor:'#2B59AC',
                                                borderRadius:45,
                                                width: 300,
                                                height:40}}
                                        onPress={() => {
                                            this.proceedToHome();
                                        }}
                                    >
                                    <Text style={{color:'#fff', fontWeight: 'bold'}}>CANCEL</Text>
                                </Button>  
                                </View>     */}

                                </CardItem>                        

                            </Card>
                        </View>
                    </Content>

                </Image>

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

export default connect(null, bindActions)(SignUpComplete);