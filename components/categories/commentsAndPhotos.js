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
         media: [],
         image: null,
         uploading: false,
         images: [],
         thumbnails: [],
         photoUri: '',
         templateId: '',
         userId:'',
         templateItem: {}
      };
   }

   componentDidMount() {
      var subItemId = '';
      AsyncStorage.getItem("subItemId").then((subItemId) => {
          this.setState({"subItemId": subItemId});
          if (subItemId) {
            this.fetchTemplateItem(subItemId);
          }
      }).then(res => {});
   }

   fetchTemplateItem(itemId){
     console.log('>>> ENTERED commentsAndPhotos::fetchTemplateItem');

     if (!itemId) {
        console.log('Invalid itemId');
        return;
     }

     let query = Config.PRICING_ITEMS_API + '?filter={"where": {"id": "' + itemId + '"}}';
     fetch(query).then((response) => response.json()).then((responseData) => {
        let templateItem = responseData[0];
        console.log('>>> templateItem:', templateItem);
        this.setState({
          templateItem: templateItem
        });
        this.fetchWalkthroughItem(templateItem.id);
     }).done();
   }

   fetchWalkthroughItem(templateItemId){
     console.log('>>> ENTERED commentsAndPhotos::fetchWalkthroughItem');
     console.log('>>> templateItemId:', templateItemId);
     AsyncStorage.getItem("userId")
     .then( (userId) =>
           {
              let query = Config.PROPERTY_ITEMS_API + '?filter={"where": {"and": [{"userId": "' + userId + '"}, {"PropertyItemId": "' + templateItemId + '"}]}}';
              // console.log('query: ', query);

              fetch(query).then((response) => response.json()).then((responseData) => {
                  // console.log('>>> responseData:', responseData);
                 let item = responseData[0];
                //  console.log('>>> item:', item);
                 if (item) {
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

                           let photoUrl = '';
                           // if(photoUrl.indexOf('mywalkthru')){
                           //   photoUrl = imageItem.image;
                           // } else {
                           //   photoUrl = 'https://s3-us-west-2.amazonaws.com/mywalkthru-pm-files/photos/photo.jpg';
                           // }

                           photoUrl = imageItem.image;

                           //  let photoUrl = imageItem.image;
                           // let photoUrl = 'https://s3-us-west-2.amazonaws.com/mywalkthru-pm-files/photos/SyV-uCOKe.jpg';

                           let photo = {
                            thumb: '', // thumbnail version of the photo to be displayed in grid view. actual photo is used if thumb is not provided
                            photo: photoUrl, // a remote photo or local media url
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
                     comments: item.comments,
                     thumbnails: thumbnails
                   });

                 } else {
                   // item does not exist
                   this.setState({
                     loaded: true
                   });

                 }
              }).done();

           this.setState({"userId": userId})
           return AsyncStorage.getItem("photoUri")
         }
     )
     .then( (photoUri) =>
         {
           this.setState({"photoUri": photoUri});
           if (photoUri && photoUri.length > 0){
             AsyncStorage.setItem("photoUri", "")
             .then( () =>
                 {
                     //alert('Describe what you just took a photo of in the Comments');
                 }
             )
             .done( );
           }
         }
     )
     .done( );
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

     updateComments(value){
       this.setState({comments: value});
     }

     saveCommentsAndPhotos(route){
        console.log('<<< ENTERED saveCommentsAndPhotos');
        let item = this.state.item;
        let modified = new Date();
        if (item){
          let data = {comments: this.state.comments, modified: modified};
          this.persistData(item.id, data, route);
        } else {
          let data = {comments: this.state.comments, images: this.state.images, modified: modified};
          this.persistData('', data, route);
        }
        console.log('<<< FINISHED saveCommentsAndPhotos');
     }

    maybeProceed(route) {
        this.saveCommentsAndPhotos(route);
    }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button onPress={() => this.maybeProceed('subcategories')}>
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
                                 <Textarea
                                    placeholder="Enter your comments"
                                    style={{color: '#333', height: 200, overflow: 'scroll'}}
                                    onChangeText={this.updateComments.bind(this)}
                                    value={this.state.comments}>
                                 </Textarea>
                            </CardItem>

                            <CardItem>
                                 <Button rounded block style={{backgroundColor: '#ad241f'}} onPress={() => this._takePhoto()}>
                                     <Text>TAKE CLOSE UP PHOTO</Text>
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
    //  alert('Use the Zoom gesture on your camera to take a close up picture.  Pinch gesture to Zoom in closer.');
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4,3]
      });
      console.log('pickerResult:', pickerResult);
      this._handleImagePicked(pickerResult);
    }

    _handleImagePicked = async (pickerResult) => {
      let uploadResponse, uploadResult;
      try {
        this.setState({uploading: true});
        if (!pickerResult.cancelled) {
          let userId = 'unknown';
          if (this.state.userId) userId = this.state.userId;
          let fileName = shortid.generate();
          let fileType = 'jpg';

          const file = {
            uri: pickerResult.uri,
            name: `${userId}___${fileName}.${fileType}`,
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

            if (item){
              this.persistData(item.id, data, null);
            } else {
              this.persistData('', data, null);
            }

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

    persistData(id, data, route) {
        if (!data) {
          alert('Invalid parameter: data');
          return;
        }
        let url = '';
        let now = new Date();
        if (!id) {
          // POST data
          url = Config.PROPERTY_ITEMS_API + '/';
          let template = this.state.templateItem;
          if (template){
            let postData = {
              "name": template.name,
              "userId": this.state.userId,
              "rank": template.rank,
              "active": template.active,
              "deleted": template.deleted,
              "PropertyItemId": template.id,
              "PropertyCategoryId": template.divisionid,
              "cost": template.cost,
              "selectedOption": template.selectedOption,
              "allObservedSwitchIsOn": template.allObservedSwitchIsOn,
              "images": data.images,
              "comments": data.comments,
              "created": now
            };
            // POST
            fetch(url, {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(postData)
            }).then((response) => response.json()).then((responseData) => {
               console.log('responseData: ', responseData);
               if (route) {
                 this.replaceRoute(route);
               }
               //this.setState({comments: JSON.stringify(responseData)});
            }).catch((error) => {
               console.error(error);
            }).done();
          } else {
            console.warn('templateItem not found');
            alert('templateItem not found');
            return;
          }
        } else {
          //PATCH data
          url = Config.PROPERTY_ITEMS_API + '/' + id;
          fetch(url, {
            method: 'PATCH',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          }).then((response) => response.json()).then((responseData) => {
             console.log('responseData: ', responseData);
             if (route) {
               this.replaceRoute(route);
             }
             //this.setState({comments: JSON.stringify(responseData)});
          }).catch((error) => {
             console.error(error);
          }).done();
        }
    }

    _maybeRenderPhotos() {
       return(
         <PhotoBrowser
           onBack={this._onBack}
           mediaList={this.state.media}
           alwaysShowControls={true}
           displayNavArrows={true}
           displaySelectionButtons={false}
           displayActionButton={true}
           startOnGrid={false}
           enableGrid={false}
           onSelectionChanged={this._onPhotoSelectionChanged}
           onActionButton={this._onPhotoActionButton}
         />
       );
    }

    _onBack(){
       console.log('>>> ENTERED _onBack...');
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
