'use strict';

import React, { Component } from 'react';
import { AsyncStorage, Image, View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input, Textarea } from 'native-base';

import moment from 'moment';

import theme from '../../themes/form-theme';
import styles from './styles';

import { SegmentedControls } from 'react-native-radio-buttons'

import Config from '../../config'

import PhotoBrowser from 'react-native-photo-browser';

class CommentsAndPhotos extends Component {
   constructor(props) {
      super(props);
      this.state = {
         subItemId: '',
         item: {},
         comments: '',
         commentsCreatedOn: '',
         photolist: [],
         image: null,
         uploading: false,
         images: [],
         thumbnails: [],
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

        let thumbnails = [];
        let photolist = [];
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
                   caption: formattedDate, // photo caption to be displayed
                   selected: false, // set the photo selected initially(default is false)
                 };

                 photolist.push(photo);

              }
           })
        }

        this.setState({
           photolist: photolist
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

                        <Title>Comments And Photos</Title>

                        <Button transparent onPress={this.props.openDrawer}>
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
                              {this._maybeRenderPhotos()}
                           </CardItem>
                        </Card>
                    </Content>

                    <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}} onPress={() => this.maybeProceed()}>
                        Next
                    </Button>
                </Image>
            </Container>
        )
    }

    _maybeRenderPhotos() {
       return(
          <PhotoBrowser
            mediaList={this.state.photolist}
            initialIndex={0}
            displayNavArrows={false}
            displaySelectionButtons={false}
            displayActionButton={true}
            startOnGrid={true}
            enableGrid={true}
            onSelectionChanged={this._onPhotoSelectionChanged}
            onActionButton={this._onPhotoActionButton}
          />
       );
    }

    _onPhotoSelectionChanged(){
       console.log('>>> ENTERED _onPhotoSelectionChanged...');
    }

    _onPhotoActionButton(){
       console.log('>>> ENTERED _onPhotoActionButton...');
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
