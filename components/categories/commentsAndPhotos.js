'use strict';

import React, { Component } from 'react';
import { AsyncStorage, Image, View, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native';
import Exponent, {
  Constants,
  ImagePicker,
  registerRootComponent,
} from 'exponent';

import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input, Textarea } from 'native-base';

import moment from 'moment';
import shortid from 'shortid';
//let id = shortid.generate();

import theme from '../../themes/form-theme';
import styles from './styles';

import { SegmentedControls } from 'react-native-radio-buttons'

import Config from '../../config'

import PhotoBrowser from 'react-native-photo-browser';

import { RNS3 } from 'react-native-aws3';

class CommentsAndPhotos extends Component {
   constructor(props) {
      super(props);
      this.state = {
         subItemId: '',
         item: {},
         comments: '',
         commentsCreatedOn: '',
         media: [],
         image: null,
         uploading: false,
         images: [],
         thumbnails: []
      };
   }

   componentDidMount() {
      var subItemId = '';
      AsyncStorage.getItem("subItemId").then((subItemId) => {
          this.setState({"subItemId": subItemId});
         if (subItemId) {
           this.fetchWalkthroughItem(subItemId);
         }
      }).then(res => {});
   }

   fetchWalkthroughItem(itemId){

     console.log('>>> ENTERED commentsAndPhotos::fetchWalkthroughItem')

     if (!itemId) {
        console.log('Invalid itemId');
        return;
     }

     let query = Config.PRICING_ITEMS_API + '?filter={"where": {"id": "' + itemId + '"}}';

     fetch(query).then((response) => response.json()).then((responseData) => {
        let item = responseData[0];

        this.setState({
           comments: item.comments
        });

        let thumbnails = [];
        let media = [];
        if (item.images) {
           let images = item.images;
           images.forEach(function(imageItem){
              if (imageItem.image) {
                 thumbnails.push(imageItem.image);

                 // moment().format('MMMM Do YYYY, h:mm:ss a');
                 let createdOn = item.created;
                 if (!createdOn) createdOn = new Date().now;
                 let formattedDate = moment(createdOn).format('YYYYMMDD h:mm:ss a');

                 let photo = {
                   thumb: '', // thumbnail version of the photo to be displayed in grid view. actual photo is used if thumb is not provided
                   photo: imageItem.image, // a remote photo or local media url
                   caption: 'Taken: ' + formattedDate, // photo caption to be displayed
                   selected: false, // set the photo selected initially(default is false)
                 };

                 media.push(photo);

              }
           })
        }

        this.setState({
           media: media
        });

        this.setState({
          item: item,
          loaded: true,
          images: item.images,
          thumbnails: thumbnails
        });
     }).done();
   }

    mapStorageToState(cb) {
      console.log(">>> ENTERED: commentsAndPhotos mapStorageToState");
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

    handleError(error){
       console.error('error: ', error);
    }

    getCurrentDateTime(){
      return moment().format('MMM DD YYYY h:mm:ss a');
    }

    onSaveCommentsAndPhotos() {
       console.log('>>> ENTERED : onSaveCommentsAndPhotos...');

       if (!this.state.comments || this.state.comments === '') {
          alert('Please enter your comments for this area');
          return;
       }

       var now = new Date();
       var url = Config.USERS_API + '/';

       // your going to POST a new item to the SUB API endpoint
       // you need to copy the data from the current selected Sub
       // append the user id and comments to the copied sub json
       // then POST that json to the SUBs



      //  var data = JSON.stringify({
      //    "username": this.state.username,
      //    "usertype": "Tenant",
      //    "email": this.state.email,
      //    "password": "p@ss1word",
      //    "status": "active",
      //    "created": now,
      //    "street1": this.state.street1,
      //    "street2": this.state.street2,
      //    "city": this.state.city,
      //    "stateabbr": this.state.stateabbr,
      //    "zip": this.state.zip,
      //    "pm_companyname": this.state.pm_companyname,
      //    "pm_contactname": this.state.pm_contactname,
      //    "pm_email": this.state.pm_email,
      //    "pm_phone": this.state.pm_phone,
      //    "tenant_phone": this.state.tenant_phone,
      //    "preferred_contact": this.state.preferred_contact,
      //    "sms_alerts": this.state.sms_alerts,
      //    "commentsCreatedOn": this.state.commentsCreatedOn
      //  });

      // console.log('data: ', data);

      //  if (!this.state.updating) {
      //     //  POST (Create) a new record containing the sub data, the userid, and the comments, and photos[]
      //     fetch(url, {
      //          method: 'post',
      //          headers: {
      //            "Content-type": "application/json; charset=UTF-8"
      //          },
      //        body: data
      //     }).then((response) => response.json()).then((responseData) => {
      //        this.setState({"updating": true});
      //        console.log('RESPONSEDATA: ', responseData);
      //        alert('Comments Saved')
      //        //this.replaceRoute('home', {email: this.state.email, username: this.state.username});
      //     }).done();
      //  }
       console.log('<<< Finished onSaveCommentsAndPhotos');
     }

     saveCommentsAndPhotos(){
        console.log('<<< ENTERED saveCommentsAndPhotos');

        let commentsCreatedOn = "";
        commentsCreatedOn = moment().format();
        this.setState({"commentsCreatedOn": commentsCreatedOn});

        // this.replaceRoute('home', {email: this.state.email, username: this.state.username});

        console.log('<<< FINISHED saveCommentsAndPhotos');
     }

    maybeProceed() {
        this.saveCommentsAndPhotos();
    }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button onPress={() => this.replaceRoute('subcategories')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>{this.state.item.name}</Title>

                        <Button transparent onPress={this._takePhoto}>
                            <Icon name='ios-camera' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                        <Card transparent foregroundColor="#000">
                            <CardItem header>
                                <Text>Comments</Text>
                            </CardItem>
                            <CardItem>
                                 <Textarea placeholder="Enter your comments" style={{color: '#333', height: 200, overflow: 'scroll'}} value={this.state.comments}>
                                 </Textarea>
                            </CardItem>

                            <CardItem>
                                 <Button rounded block style={{backgroundColor: '#ad241f'}} onPress={() => this._takePhoto()}>
                                     <Text>Take Pictures</Text>
                                 </Button>
                            </CardItem>

                            <CardItem>
                              {this._maybeRenderImage()}
                            </CardItem>

                            <CardItem>
                              {this._maybeRenderPhotos()}
                           </CardItem>
                        </Card>
                    </Content>
                </Image>
            </Container>
        )
    }

    _takePhoto = async () => {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4,3]
      });

      console.log('pickerResult:', pickerResult);

      this._handleImagePicked(pickerResult);
    }

    _getUserId = async () => {
      AsyncStorage.getItem("userId")
      .then( (userId) =>
        {
          return userId
        }
      ).done( );
    }

    _handleImagePicked = async (pickerResult) => {
      let uploadResponse, uploadResult;

      try {
        this.setState({uploading: true});

        if (!pickerResult.cancelled) {

          let fileName = shortid.generate();
          let fileType = 'jpg';

          //  let userId = await this._getUserId();

          // if (userId) {
          //   // we should always have the userId available
          //   fileName = userId + '-' + shortid.generate();
          // } else {
          //   // in the unlikely event that the userId is not avaiable, we can proceed with uploading the
          //   // image with a unique filename
          //   fileName = shortid.generate();
          // }

          // name: fileName,
          // type: 'image/jpeg'

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

          RNS3.put(file, options).then(response => {
            // let res = JSON.stringify(response);
            if (response.status !== 201) {
              // this.setState({comments: res});
              // return;
              throw new Error('Failed to upload image to S3', response);
            }

            if (!response.body){
              throw new Error('Failed to upload image to S3', response);
            }

            // let body = JSON.stringify(response.body);
            // this.setState({comments: body});

            let location = response.body.postResponse.location;

            // alert(location);

            this.setState({image: location});

            let newimages = [];
            let item = this.state.item;
            let images = item.images;
            if (images) newimages = images;
            newimages.push({image: location});

            let data = {comments: this.state.comments, images: newimages};

            // this.setState({comments: JSON.stringify(data)});

            // alert('item.id: '+item.id);

            this.patchItem(item.id, data, false);
          });
        }
      } catch(e) {
        console.log({uploadResponse});
        console.log({uploadResult});
        console.log({e});
        let errorMessage = JSON.stringify(e) + ' : ' + e.message;
        this.setState({comments: errorMessage});
        alert('Failed to upload image');
      } finally {
        this.setState({uploading: false});
      }
    }

    patchItem(id, data, doCheck) {
       if (!id) {
          alert('Invalid parameter: id');
          return;
       }
       if (!data) {
          alert('Invalid parameter: data');
          return;
       }
       let url = Config.PRICING_ITEMS_API + '/' + id;
       fetch(url, {
         method: 'PATCH',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data)
       }).then((response) => response.json()).then((responseData) => {
          console.log('responseData: ', responseData);
          // alert(responseData);
          // if (doCheck) this.checkAction(responseData);
          //COMMENT!
          this.setState({comments: JSON.stringify(responseData)});
       }).catch((error) => {
          console.error(error);
       }).done();
    }

    // <PhotoBrowser
    //   mediaList={this.state.media}
    //   useCircleProgress={true}
    //   initialIndex={0}
    //   displayNavArrows={true}
    //   displaySelectionButtons={false}
    //   displayActionButton={false}
    //   startOnGrid={true}
    //   enableGrid={true}
    //   onSelectionChanged={this._onPhotoSelectionChanged}
    //   onActionButton={this._onPhotoActionButton}
    // />

    _maybeRenderPhotos() {
       return(
          <PhotoBrowser
            mediaList={this.state.media}
            useCircleProgress={true}
            enableGrid={true}
          />
       );
    }

    _onPhotoSelectionChanged(){
       console.log('>>> ENTERED _onPhotoSelectionChanged...');
    }

    _onPhotoActionButton(){
       console.log('>>> ENTERED _onPhotoActionButton...');
    }

    _maybeRenderImage = () => {
      let { image } = this.state;
      if (!image) {
        return;
      }

      return (
        <View style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
          shadowColor: 'rgba(0,0,0,1)',
          shadowOpacity: 0.2,
          shadowOffset: {width: 4, height: 4},
          shadowRadius: 5,
        }}>
          <View style={{borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden'}}>
            <Image
              source={{uri: image}}
              style={{width: 250, height: 250}}
            />
          </View>

          <Text
            style={{paddingVertical: 10, paddingHorizontal: 10}}>
            {image}
          </Text>
        </View>
      );
    }

}

async function uploadImageAsync(uri) {

  let apiUrl = 'https://pros-s3-image-uploader.herokuapp.com/api/CloudStoreImages/images/upload';

  let uriParts = uri.split('.');
  let fileType = uri[uri.length - 1];

  let formData = new FormData();
  formData.append('fileUpload=', uri);

  // formData.append('photo', {
  //   uri,
  //   name: `photo.${fileType}`,
  //   type: `image/${fileType}`,
  // });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  return fetch(apiUrl, options);
}


function bindActions(dispatch){
    return {
        replaceRoute:(route)=>dispatch(replaceRoute(route)),
        pushNewRoute:(route)=>dispatch(pushNewRoute(route)),
        openDrawer: ()=>dispatch(openDrawer()),
        popRoute: () => dispatch(popRoute())
    }
}

export default connect(null, bindActions)(CommentsAndPhotos);
