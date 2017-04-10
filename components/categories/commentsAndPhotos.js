'use strict';

import React, { Component } from 'react';

import { AsyncStorage, Image, View, TouchableWithoutFeedback, ScrollView, TouchableOpacity, Modal } from 'react-native';

import Expo, {
  Constants,
  ImagePicker,
  registerRootComponent,
} from 'expo';

import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, DeckSwiper, Card, CardItem, Left, Body, Thumbnail, InputGroup, Input, Textarea } from 'native-base';

import moment from 'moment';
import shortid from 'shortid';

import theme from '../../themes/form-theme';
import styles from './styles';

import { SegmentedControls } from 'react-native-radio-buttons'

import Config from '../../config'

import PhotoBrowser from 'react-native-photo-browser';

import { RNS3 } from 'react-native-aws3';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class CommentsAndPhotos extends Component {
   constructor(props) {
      super(props);
      this.state = {
         modalVisible: false,
         subItemId: '',
         item: {},
         comments: '',
         media: [],
         image: null,
         uploading: false,
         images: [],
         thumbnails: [],
         photoUri: '',
         userId:'',
         templateItem: {},
         closeUpComments: '',
         categoryName: '',
         key: ''
      };
   }

   setModalVisible(visible) {
     this.setState({modalVisible: visible});
   }

   componentDidMount() {
      var subItemId = '';
      AsyncStorage.getItem("categoryName").then((categoryName) => {
         this.setState({"categoryName": categoryName});
         AsyncStorage.getItem("subItemId").then((subItemId) => {
             this.setState({"subItemId": subItemId});
             if (subItemId) {
               this.fetchWalkthruItem(subItemId);
             }
         }).then(res => {});
      }).then(res => {
      });
      // AsyncStorage.getItem("subItemId").then((subItemId) => {
      //     this.setState({"subItemId": subItemId});
      //     if (subItemId) {
      //       this.fetchWalkthruItem(subItemId);
      //     }
      // }).then(res => {});
   }

  //  fetchWalkthruItem(itemId){
  //    console.log('>>> ENTERED commentsAndPhotos::fetchWalkthruItem');
   //
  //    if (!itemId) {
  //       console.log('Invalid itemId');
  //       return;
  //    }
   //
  //    let query = Config.PROPERTY_ITEMS_API + '?filter={"where": {"and": [{"id": "' + itemId + '"}]}}';
  //    fetch(query).then((response) => response.json()).then((responseData) => {
  //       let walkthruItem = responseData[0];
  //       console.log('>>> walkthruItem:', walkthruItem);
  //       this.setState({
  //         item: walkthruItem
  //       });
  //       this.fetchWalkthroughItem(templateItem.id);
  //    }).done();
  //  }

   fetchWalkthruItem(itemId){
     console.log('>>> ENTERED commentsAndPhotos::fetchWalkthroughItem');
     console.log('>>> itemId:', itemId);
     AsyncStorage.getItem("userId")
     .then( (userId) =>
           {
              let query = Config.PROPERTY_ITEMS_API + '?filter={"where": {"and": [{"id": "' + itemId + '"}]}}';
              // let query = Config.PROPERTY_ITEMS_API + '?filter={"where": {"and": [{"userId": "' + userId + '"}, {"PropertyItemId": "' + templateItemId + '"}]}}';
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

                          //  let photo = {
                          //   thumb: '', // thumbnail version of the photo to be displayed in grid view. actual photo is used if thumb is not provided
                          //   photo: photoUrl, // a remote photo or local media url
                          //   caption: 'Taken: ' + formattedDate, // photo caption to be displayed
                          //   selected: false, // set the photo selected initially(default is false)
                          //  };

                          let caption = imageItem.timestamp;

                          // if (imageItem.caption) caption = caption + imageItem.caption;
                          // if (imageItem.timestamp) caption = caption + imageItem.timestamp;

                          let photo = {
                           thumb: '', // thumbnail version of the photo to be displayed in grid view. actual photo is used if thumb is not provided
                           photo: photoUrl, // a remote photo or local media url
                           caption: caption, // photo caption to be displayed
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

     updateCloseUpComments(value){
       this.setState({closeUpComments: value});
     }

     saveCommentsAndPhotos(route){
        console.log('<<< ENTERED saveCommentsAndPhotos');
        let item = this.state.item;
        let modified = new Date();
        if (item){
          let data = {comments: this.state.comments, modified: modified, dateObserved: modified};
          this.persistData(item.id, data, route);
        } else {
          let data = {comments: this.state.comments, images: this.state.images, modified: modified, dateObserved: modified};
          this.persistData('', data, route);
        }
        console.log('<<< FINISHED saveCommentsAndPhotos');
     }

    maybeProceed(route) {
        this.saveCommentsAndPhotos(route);
    }

    render() {

        const title = this.state.categoryName + ' - ' + this.state.item.name;

        return (
            <Container theme={theme} style={{backgroundColor: '#fafbfc'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >

                    <Header>
                        <Button onPress={() => this.maybeProceed('subcategories')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title style={{fontSize: 20}}>{title}</Title>

                        <Button transparent onPress={this._takePhoto}>
                            <Icon name='ios-camera' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                    {/* Modal View triggered */}
                    {/* Start ScrollView */}
                    <View style={{marginTop: 15}}>
                    {/* Start Modal */}
                      <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >

                       <KeyboardAwareScrollView style={{marginTop: 15}}>



                        <View style={{marginTop: 15}}>

                          <View style={{borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden'}}>
                              <Image
                                source={{uri: this.state.image}}
                                style={{width: 250, height: 250}}
                              />
                          </View>                          

                         <View style={{backgroundColor: '#333', marginTop: 15}}>

                            <Text
                              style={{paddingVertical: 10, paddingHorizontal: 10, color: '#fff', fontSize: 14, fontWeight: '500'}}>
                              Briefly describe your Close Up shot of this Area (required)
                            </Text>

                          </View>

                          <View style={{marginTop: 15}}>

                            <Textarea
                                autoFocus = {true}
                                placeholder=''
                                keyboardType='default'
                                autoCapitalize='sentences'                             
                                style={{height: 100, backgroundColor: '#fff', color: '#333', borderWidth: 1,  borderColor: '#333'}}
                                onChangeText={this.updateCloseUpComments.bind(this)}
                                value={this.state.closeUpComments}>
                            </Textarea>

                          </View>                          

                        </View>

                         <Button rounded block style={{backgroundColor: '#ad241f'}}
                             onPress={() => this.saveCloseUp()}>
                             <Text style={{color:'#fff', fontWeight: 'bold'}}>Save Close Up</Text>
                         </Button>

                       </KeyboardAwareScrollView>

                       <View style={{marginTop: 10}}>



                       </View>

                      </Modal>
                      {/*End Modal*/}

                    </View>
                    {/* End ScrollView*/}

                        <Card transparent foregroundColor="#000">
                            <CardItem header>
                                <Text>Close Up Photos/Comments</Text>
                            </CardItem>

                            <CardItem>
                                 <Button rounded block style={{backgroundColor: '#ad241f'}}
                                     onPress={() => this._takePhoto()}>
                                     <Text style={{color:'#fff', fontWeight: 'bold'}}>TAKE CLOSE UP PHOTO</Text>
                                 </Button>
                            </CardItem>

                            <CardItem>
                              {this._maybeRenderComments()}
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

    _maybeRenderComments() {
      let comments = '';
      if(!this.state.images){
        return(
          <View>
            <Text style={{color:'#333', fontSize: 14, fontWeight: 'bold'}}>Take close up photos to add some comments...</Text>
          </View>
        );
      } else {
        let imgs = this.state.images;
        if(imgs.length > 0){
          for(let i=0;i<imgs.length;i++){
            let ts = '';
            let tsf = '';
            if (imgs[i].timestamp){
              ts = imgs[i].timestamp;
              let d = new Date(ts);
              if(d){
                // tsf = d.toDateString() + ' ' + d.toTimeString();
                tsf= moment(d.toISOString()).format('MM/DD/YYYY h:mm a');
              }
            }
            if(tsf){
              comments = comments + tsf + ' : ' + imgs[i].caption + '\r\n';
            } else {
              comments = comments + imgs[i].caption + '\r\n';
            }
          }
        }

        if(comments && comments.length>0){
          return(
               <View>  
                  <View>
                    <Text style={{color:'#333', fontSize: 14, fontWeight: 'bold'}}>Take close up photos to add more comments...</Text>
                  </View>     
                  <View>         
                  <Textarea 
                      disabled 
                      editable={false} 
                      placeholder=''                            
                      style={{
                        height: 100, 
                        backgroundColor: '#fff', 
                        color: '#333', 
                        borderWidth: 1,  
                        borderColor: '#333',
                        fontSize: 14
                      }}
                      value={comments}>
                  </Textarea>
                  </View>  
              </View>  
          );
        }


      }

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

          let key = shortid.generate();
          this.setState({key: key});

          let fileName = key;
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

            this.setModalVisible(true);

            // var now = new Date();
            //
            // let newimages = [];
            // let item = this.state.item;
            // let images = item.images;
            // if (images) newimages = images;
            //
            // let ordinal = newimages.length+1;
            //
            // newimages.push({key: key, ordinal: ordinal, image: location,
            //   caption: this.state.closeUpComments, timestamp: now});
            //
            // let data = {comments: this.state.comments, images: newimages, dateObserved: now};
            //
            // // this.setState({comments: JSON.stringify(data)});
            // // alert('item.id: '+item.id);
            //
            // if (item){
            //   this.persistData(item.id, data, null);
            // } else {
            //   this.persistData('', data, null);
            // }

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

    saveCloseUp() {
      let timestamp = new Date();
      let newimages = [];
      let item = this.state.item;
      let images = item.images;

      if (!item) {
        console.log('Failed to Save Close Up: [this.state.item] is undefined.');
        alert('Failed to Save Close Up!');
        return;
      }

      if (!this.state.closeUpComments) {
        console.log('Close Up Comments are Required');
        alert('Close Up Comments are Required');
        return;
      }

      // images can be null/undefined, its ok.
      if (images) {
        newimages = images
      };

      let ordinal = newimages.length+1;

      newimages.push(
      {
          key: this.state.key,
          ordinal: ordinal,
          image: this.state.image,
          caption: this.state.closeUpComments,
          timestamp: timestamp
      });

      let data =
      {
        comments: this.state.comments,
        images: newimages,
        dateObserved: timestamp
      };



      this.persistData(item.id, data, null);

      this.setModalVisible(!this.state.modalVisible);
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
      let url = '';
      let now = new Date();

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

         // change navigation route post save
         if (route) {
           this.replaceRoute(route);
         }
         //this.setState({comments: JSON.stringify(responseData)});
      }).catch((error) => {
         console.error(error);
      }).done();
    }


        _maybeRenderPhotos() {
           return(
             <PhotoBrowser
               onBack={this._onBack}
               mediaList={this.state.media}
               alwaysShowControls={true}
               displayNavArrows={true}
               displaySelectionButtons={false}
               displayActionButton={false}
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
          <Text>{new Date().toISOString()}</Text>
          <View style={{borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden'}}>
              <Image
                source={{uri: image}}
                style={{width: 250, height: 250}}
              />
          </View>
          <View style={{backgroundColor: '#333'}}>
            <Text
              style={{paddingVertical: 10, paddingHorizontal: 10, color: '#fff', fontSize: 14, fontWeight: '500'}}>
              Close Up Comments (required)
            </Text>
            <Textarea
               disabled
               autoFocus = {false}
               style={{backgroundColor: '#fff', color: '#333', height: 200, overflow: 'scroll', borderWidth: 1,  borderColor: '#333'}}
               onChangeText={this.updateCloseUpComments.bind(this)}
               value={this.state.closeUpComments}>
            </Textarea>

          </View>

        </View>
      );
    }

    saveCloseUpComments() {
      let now = new Date();
      let item = this.state.item;
      let key = this.state.key;
      let imageToUpdate = {};
      let newimages = [];

      // let closeUpImages = this.state.images;
      // if (closeUpImages) {
      //   closeUpImages.forEach(function(closeUpImage){
      //     console.log(closeUpImage);
      //     if (closeUpImage.key){
      //       if (closeUpImage.key === key) {
      //         console.log('FOUND closeUpImage (KEY):', key);
      //         imageToUpdate = closeUpImage;
      //         imageToUpdate.caption = this.state.closeUpComments;
      //         newimages.push(imageToUpdate);
      //       } else {
      //         otherImage = closeUpImage;
      //         newimages.push(otherImage);
      //       }
      //     }
      //   });
      //   if (imageToUpdate && newimages) {
      //     // imageToUpdate.caption = this.state.closeUpComments;
      //     let data = {images: newimages};
      //     this.persistData(item.id, data, null);
      //   }

      // }


      //newimages.push({key: key, ordinal: ordinal, image: location, caption: this.state.closeUpComments, timestamp: now});


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

export default connect(null, bindActions)(CommentsAndPhotos);
