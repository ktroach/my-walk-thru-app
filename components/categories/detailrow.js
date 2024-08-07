import React, {
  PropTypes
} from 'react';
import {
   AsyncStorage,
   StyleSheet,
   TextInput,
   View,
   TouchableHighlight,
   Alert,
   Clipboard,
   Image,
   Share,
   TouchableOpacity,
   ActivityIndicator,
   RefreshControl,
   RecyclerViewBackedScrollView,
   StatusBar,
   Switch,
   ScrollView,
   KeyboardAvoidingView,
   Dimensions,
   Modal
} from 'react-native';
import Expo, {
   Components,
   Permissions,
   Location,
   Constants,
   ImagePicker,
} from 'expo';
import Config from '../../config'
import styles from './styles/details';
import rowStyles from './styles/row';
import Toolbar from '../toolbar'
import shortid from 'shortid';
import { SegmentedControls } from 'react-native-radio-buttons';
import {
  FontAwesome,
} from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const Icon = Ionicons;
import moment from 'moment';
// import Lightbox from 'react-native-lightbox';
// import RNAssetThumbnail from  'react-native-asset-thumbnail';
// import PhotoBrowser from 'react-native-photo-browser';

import { Container, Header, Title, Content, Text, Button, List, ListItem, Card, CardItem, Textarea } from 'native-base';

import { RNS3 } from 'react-native-aws3';

import { connect } from 'react-redux'
import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { replaceOrPushRoute } from '../../actions/route';
import { pushNewRoute, replaceRoute } from '../../actions/route';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class DetailRow extends React.Component {
   constructor(props, context) {
      super(props, context);
      this.state = {
          modalVisible: false,        
           isRefreshing: false,
           isLoaded: false,
           item: {},
           image: null,
           uploading: false,
           selectedOption: {},
           images: [],
           thumbnails: [],
           comments: '',
           photolist: [],
           userId: '', // 2017.06.14: kroach: NO! 'rJirzIMsx' what the hell is this?
           summaryComments: '',
           summaryPhoto: '',
           dateObserved: '',
           behavior: 'padding'
      };
   }

   setModalVisible(visible) {
     this.setState({modalVisible: visible});
   }   

   componentDidMount() {
     AsyncStorage.getItem("userId")
     .then( (userId) =>
           {
              return this.setState({userId: userId})
           }
     )
     .done();
     AsyncStorage.setItem("photoUri", "")
     .then( () =>
         {
         }
     )
     .done( );
      this.fetchWalkthroughItem(this.props.itemId);
      // this.fetchTemplateItem(this.props.itemId);
   }

  //  replaceRoute(route) {
  //      this.props.replaceRoute(route);
  //  }

    replaceRoute(route) {
      console.log('>>>>> entered: [replaceRoute]: ', route);
      this.props.navigation.navigate(route);
    }  

   popRoute() {
       this.props.popRoute();
   }


   renderWalkthroughItem() {
     return (
      <View style={rowStyles.container}>
         <View style={{
             flex: 1,
             flexDirection: 'column',
             justifyContent: 'center',
             borderWidth: 4,
             borderColor: '#C8C7CC',
             borderRadius: 3,
             elevation: 2,
             shadowColor: 'rgba(0,0,0,1)',
             shadowOpacity: 0.2,
             shadowOffset: {width: 4, height: 4},
             shadowRadius: 5,
            }}>

            <Header style={{backgroundColor: '#9DD6EB'}}>
                <Title style={{fontSize: 22, color: '#333', marginTop: -10}}>{this.state.item.name}</Title>
            </Header>

            {/* Modal View triggered */}
            {/* Start ScrollView */}
            <View style={{marginTop: 1}}>
            {/* Start Modal */}
              <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}
                >
                  <KeyboardAwareScrollView style={{marginTop: 15}}>
                    <View style={{marginTop: 15}}>                        
                      <View style={{backgroundColor: '#333', marginTop: 15}}>
                        <Text
                          style={{paddingVertical: 10, paddingHorizontal: 10, color: '#fff', fontSize: 14, fontWeight: 'bold'}}>
                          Enter a Summary Comment (Required)
                        </Text>
                      </View>
                      <View style={{marginTop: 15}}>
                        <Textarea 
                            autoFocus = {true} 
                            placeholder='Type your Comments...'
                            keyboardType='default'
                            autoCapitalize='sentences' 
                            autoCorrect={false}
                            maxLength={1000}
                            clearButtonMode='while-editing'
                            returnKeyType='done'
                            style={{
                              fontSize: 14, 
                              backgroundColor: '#fff', 
                              color: '#333', 
                              height: 200, 
                              overflow: 'scroll'
                            }}
                            onChangeText={this.updateSummaryComments.bind(this)}
                            value={this.state.summaryComments}>
                        </Textarea>
                      </View>                          
                    </View>
                    <Button rounded block style={{alignSelf: 'center',
                        marginTop: 5,
                        backgroundColor: 'rgba(0, 122, 255, 1)',
                        borderRadius:45,
                        width: 300,
                        height:45}}
                        onPress={() => this.saveSummaryComments()}>
                        <Text style={{color:'#fff', fontWeight: 'bold'}}>Save Comments</Text>
                    </Button>
                  </KeyboardAwareScrollView>
              </Modal>
              {/*End Modal*/}

            </View>
            {/* End ScrollView*/}
            

            <View padder style={{backgroundColor: '#fafbfc'}} >
                <Card transparent foregroundColor="#333">
                    {/*<CardItem header>
                       <Text style={{
                              paddingVertical: 5, 
                              paddingHorizontal: 5, 
                              color: '#333', 
                              fontSize: 18, 
                              fontWeight: 'bold'
                          }}>Condition</Text>
                    </CardItem>*/}
                    <CardItem>
                       {this.renderSegmentControl(this.state.item)}
                    </CardItem>
                    {/*<CardItem header>
                       <Text style={{
                              paddingVertical: 5, 
                              paddingHorizontal: 5, 
                              color: '#333', 
                              fontSize: 18, 
                              fontWeight: 'bold'
                          }}>Summary of Attention Needed</Text>
                    </CardItem>*/}
                    <CardItem>
                      {this.maybeRenderSummaryPhotosComments()}
                    </CardItem>
                    {/*<CardItem>
                    <Button rounded block
                       style={{alignSelf: 'center',
                            marginTop: 5,
                            backgroundColor: 'rgba(0, 122, 255, 1)',
                            borderRadius:45,
                            width: 300,
                            height:45}} onPress={() => this.navigateTo('commentsAndPhotos')}>
                          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>Close Up Photos/Comments</Text>
                      </Button>
                    </CardItem>*/}
                </Card>
            </View>

         </View>
      </View>
     );
   }

   maybeRenderSummaryPhotosComments = () => {

     let { summaryPhoto } = this.state;
     
     if (!summaryPhoto) {
       return;
     }

     let screenWidth = Dimensions.get('window').width;
     let screenHeight = Dimensions.get('window').height;

    //  let now = new Date();
    //  let dateObserved = moment(now).format("MM-DD-YYYY h:mm:ss a");

     return (

       /*<View style={{
         marginTop: 10,
         width: 500,
         borderRadius: 3,
         elevation: 2,
         shadowColor: 'rgba(0,0,0,1)',
         shadowOpacity: 0.2,
         shadowOffset: {width: 4, height: 4},
         shadowRadius: 5,
         alignSelf: 'center'
       }}>*/

      <ScrollView behavior={this.state.behavior} style={{backgroundColor: '#fafbfc'}}>
           
        <Card transparent foregroundColor="#333">
            <CardItem header>
                <Text style={{
                      color: '#333', 
                      fontSize: 18, 
                      fontWeight: 'bold'
                  }}>Summary</Text>
            </CardItem>

            {/*<CardItem>*/}
              {/*<Text
                style={{ 
                    color: '#333', 
                    fontSize: 16, 
                    fontWeight: 'bold',
                    paddingVertical: 10,
                    backgroundColor: '#eff0f1'
                }}>
                Comments 
              </Text>*/}

              {/*<Textarea
                  placeholder='Type your comments...'
                  keyboardType='default'
                  autoCapitalize='sentences' 
                  autoCorrect={false}
                  maxLength={1000}
                  clearButtonMode='while-editing'
                  returnKeyType='done'
                  style={{
                    fontSize: 14, 
                    backgroundColor: '#fff', 
                    color: '#333', 
                    height: 50, 
                    overflow: 'scroll'
                  }}
                  onChangeText={this.updateSummaryComments.bind(this)}
                  onBlur={this.saveSummaryComments()}
                  value={this.state.summaryComments}>
              </Textarea>*/}
            {/*</CardItem>*/}

            {/*<CardItem>
                <Text 
                  placeholder=''
                  style={{
                    fontSize: 14, 
                    backgroundColor: '#fff', 
                    color: '#333', 
                    height: 50, 
                    overflow: 'scroll'
                  }} 
                  multiline = {true}
                  editable={false}
                  value={this.state.summaryComments}
                  ></Text>              
            </CardItem>*/}


            <CardItem>
              {/*<Text
                style={{
                  color: '#333', 
                  fontSize: 16, 
                  fontWeight: 'bold',
                  paddingVertical: 10,
                  backgroundColor: '#eff0f1'                  
                }}>
                Photo
              </Text>*/}
              <View style={{ flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#fafbfc',}}>

                <Image
                  source={{uri: summaryPhoto}}
                  style={{width: screenWidth *.8, height: 200}}
                >
                </Image> 
                  <Text style={{fontSize: 8, color: '#333'}}>
                  {
                    this.state.dateObserved
                  }
                  </Text>
              </View>     
                   <Textarea 
                      editable={false}
                      placeholder='Type your comments...'
                      keyboardType='default'
                      autoCapitalize='sentences' 
                      autoCorrect={false}
                      ellipsizeMode={'tail'}
                      maxLength={20}
                      clearButtonMode='while-editing'
                      returnKeyType='done'
                      style={{
                        fontSize: 14, 
                        backgroundColor: '#fff', 
                        color: '#333', 
                        height: 50, 
                        overflow: 'scroll'
                      }}
                      onChangeText={this.updateSummaryComments.bind(this)}
                      value={this.state.summaryComments}>
                  </Textarea>
              </CardItem>

              {this.maybeRenderEditComments()}

            <CardItem>
                <Text
                  style={{
                    color: '#333', 
                    fontSize: 16, 
                    fontWeight: 'bold',
                    paddingVertical: 10,
                    backgroundColor: '#eff0f1'                    
                  }}>
                  Close Ups
                </Text>
                <Button rounded block
                  style={{alignSelf: 'center',
                        marginTop: 5,
                        backgroundColor: 'rgba(0, 122, 255, 1)',
                        borderRadius:45,
                        width: 300,
                        height:45}} onPress={() => this.navigateTo('commentsAndPhotos')}>
                      <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>Close Up Photos/Comments</Text>
                  </Button>              
              </CardItem>

          </Card>

      </ScrollView>

 



      //  </View>
     );
   }

   maybeRenderEditComments(){
     if (this.state.summaryComments&&this.state.summaryComments.length>0){
      return(
        <CardItem>
            <Button rounded block
              style={{alignSelf: 'center',
                    marginTop: 5,
                    backgroundColor: 'rgba(0, 122, 255, 1)',
                    borderRadius:45,
                    width: 300,
                    height:45}} 
                    onPress={() => this.setModalVisible(!this.state.modalVisible)}
                    >
                  <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>Edit Summary Comments</Text>
              </Button>              
          </CardItem>
      );
     } else {
       return(<View></View>);
     }
   }

   updateSummaryComments(value){
     this.setState({summaryComments: value});
   }

   saveSummaryComments() {
      console.log('>>>>>>>>>>> saveSummaryComments triggered >>>>>>>>>>>>>');
      let summaryComments = this.state.summaryComments;
      if (!summaryComments || summaryComments.length===0){
        alert('Please enter a Comment.  Summary Comment is Required');
        return;
      }
      let now = Date.now();
      let t = moment.tz(now, "America/Chicago");
      let dateObserved = t.format("MM-DD-YYYY h:mm:ss a");
      console.log('>>>>>> dateObserved: ', dateObserved);
      let data = {summaryComments: summaryComments, dateObserved: dateObserved};
      let item = this.state.item;
      this.persistData(item.id, data, null);
      this.setModalVisible(!this.state.modalVisible);
   }

   navigateTo(route) {
     console.log('>>> detailRow.js >> subItemId:', this.props.itemId);
     AsyncStorage.setItem("subItemId", this.props.itemId)
     .then( () =>
         {
            //  this.props.replaceOrPushRoute(route);
            this.replaceRoute(route);
         }
     )
     .done( );
   }

    replaceRoute(route) {
      console.log('>>>>> entered: [replaceRoute]: ', route);
      this.props.navigation.navigate(route);
    }     

   _takePhoto = async () => {
     let pickerResult = await ImagePicker.launchCameraAsync({
       allowsEditing: true,
       aspect: [4,3]
     });

     console.log('pickerResult:', pickerResult);

     this._handleImagePicked(pickerResult);


    //  AsyncStorage.setItem("photoUri", pickerResult.uri)
    //  .then( () =>
    //      {
    //         //  this.navigateTo('commentsAndPhotos');
    //      }
    //  )
    //  .done( );
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

         console.log('UPLOADING SUMMARY PHOTO TO S3...');

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

           let location = response.body.postResponse.location;

           console.log('SUMMARY PHOTO URI:', location);

           // 2017.06.13: date time is not in the right timezone
          //  so this is displaying correctly on the app screen, but it is saved incorrectly on the api server ???
          // the api shows: "dateObserved": "2017-06-13T15:05:32.981Z"
          // the app shows: "dateObserved":"06-13-2017 10:05:48 am"
          // i dont do any conversion in the api !
          // ???
           let now = Date.now();
           let t = moment.tz(now, "America/Chicago");
           let dateObserved = t.format("MM-DD-YYYY h:mm:ss a");
           console.log('>>>>>> dateObserved: ', dateObserved);

          //  let dateObserved = moment(now).format("MM-DD-YYYY h:mm:ss a");           

           let data = {summaryComments: this.state.summaryComments, summaryPhoto: location, dateObserved: dateObserved};
           let item = this.state.item;

           // 2017.06.13: kroach: this is where you could open a modal for the comments 
           this.setState({summaryPhoto: location, dateObserved: dateObserved});

           this.persistData(item.id, data, null);

           this.setModalVisible(true);

          //  let newimages = [];
          //  let item = this.state.item;
          //  let images = item.images;
          //  if (images) newimages = images;
          //  newimages.push({image: location});

           //let data = {comments: this.state.summaryComments, images: newimages, dateObserved: now};

          // let data =  "summary": [{
          //   "category": "Front Exterior",
          //   "area": "Roof/Trim",
          //   "comments": this.state.comments,
          //   "photoUrl": location,
          //   "dateTaken": "02/16/2017 7:30 PM (CST)",
          //   "userId": "987654321"
          // }];

           // this.setState({comments: JSON.stringify(data)});
           // alert('item.id: '+item.id);

          //  if (item){
          //    this.persistData(item.id, data, null);
          //  } else {
          //    this.persistData('', data, null);
          //  }

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


// THIS WORKED!
// {"where": {"and": [{"rank": "999"},{"images.image":{ "like": "pros-estimates" }}, {"active":{ "eq": "true"}}]}}

// 🍕

// UPDATE YOUR modified DATE!!!

// {"where": {"and": [{"rank": "999"}, {"comments": { "neq": ""}}]}}
// find all images
// {"where": {"and": [{"rank": "999"},{"images.image":{ "inq": [".png"] }}

// {"where": {"and": [{"rank": "999"},{"images.image":{ "inq": [".png"] }}, {"active":{ "eq": "true"}}]}}
//
// {"where": {"and": [{"rank": "999"},{"images.image":{ "like": "%pros-estimates%" }}, {"active":{ "eq": "true"}}]}}
//
// {"where": {"and": [{"rank": "999"},{"images.image":{ "neq": "" }}, {"active":{ "eq": "true"}}]}}

// {"where": {"and": [{"rank": "999"}, {"active":{ "eq": "true"}}]}}
// "divisionid": "583bb445f1328800127f6207"  -- Front Exterior
// {"where": {"and": [{"rank": "999"},{"divisionid":{ "eq": "583bb445f1328800127f6207" }}, {"active":{ "eq": "true"}}]}}

   // _maybeRenderPhotos() {
   //    console.log('>>> ENTERED _maybeRenderPhotos...');
   //    if (this.state.item.images) {
   //       let photos = this.state.item.images;
   //       let date = new Date();
   //       let modified = this.state.item.modified;
   //       // moment().format('MMMM Do YYYY, h:mm:ss a');
   //       let formattedDate = moment(modified).format('YYYYMMDD h:mm:ss a');
   //       if (photos && photos.length>0){
   //          for (var i = 0; i < photos.length; i++) {
   //             let uri = photos[i].image;
   //             console.log('>>> uri:', uri);
   //             if (uri && uri.length>0){
   //                return (
   //                   <View style={{flex: 1, flexDirection: 'row'}}>
   //
   //                   <Image
   //
   //                      source={{uri}}
   //                      style={{width:75,height:75, borderWidth:1, borderColor:'#333'}}
   //                      >
   //                      <Text style={{color:'#333',fontSize:6}}>{formattedDate}</Text>
   //                   </Image>
   //
   //
   //                   </View>
   //
   //                );
   //             }
   //          }
   //       } else {
   //          // nothing to render
   //          return (<View></View>);
   //
   //       }
   //    } else {
   //       // nothing to render
   //       return (<View></View>);
   //    }
   // }

  //  fetchTemplateItem(itemId){
  //    console.log('>>> ENTERED DetailRow::fetchTemplateItem');
  //    if (!itemId) {
  //       console.log('Invalid itemId');
  //       return;
  //    }
  //    let query = Config.PRICING_ITEMS_API + '?filter={"where": {"id": "' + itemId + '"}}';
  //    fetch(query).then((response) => response.json()).then((responseData) => {
  //       let templateItem = responseData[0];
  //       console.log('>>> templateItem:', templateItem);
  //       this.setState({
  //         templateItem: templateItem
  //       });
  //       this.fetchWalkthroughItem(templateItem);
  //    }).done();
  //  }

  // {"where": {"and": [{"rank": "999"},{"userId": "rJirzIMsx"},{"PropertyCategoryId":{ "eq": "133b63ad-cdd2-4b50-bbba-401f15d7ed81"}}]}}

   fetchWalkthroughItem(itemId){
     console.log('>>> ENTERED DetailRow::fetchWalkthroughItem');
     console.log('>>> itemId:', itemId);
     AsyncStorage.getItem("userId")
     .then( (userId) =>
       {
          // console.log('>>> userId:', userId);
          let query = Config.PROPERTY_ITEMS_API + '?filter={"where": {"and": [{"id": "' + itemId + '"}]}}';
          // console.log('query: ', query);
          fetch(query).then((response) => response.json()).then((responseData) => {
            //  console.log('>>> responseData:', responseData);
             let item = responseData[0];
            //  console.log('>>> item:', item);
             if (item) {

              // 2017.06.13: kroach: render the dateObserved in proper timezone
              let dateObserved = '';
              if (item.dateObserved&&item.dateObserved.length>0){
                let t = moment.tz(item.dateObserved, "America/Chicago");
                dateObserved = t.format("MM-DD-YYYY h:mm:ss a");
                console.log('>>>>>> dateObserved: ', dateObserved);
              }

               this.setState({
                 item: item,
                 selectedOption: item.selectedOption,
                 loaded: true,
                 summaryPhoto: item.summaryPhoto,
                 summaryComments: item.summaryComments,
                 dateObserved: dateObserved
               });
             }
          }).done();
           this.setState({"userId": userId});
         }
     )
     .done( );
   }

   persistData(id, data, doCheck) {
       if (!data) {
         alert('Invalid parameter: data');
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

          if (responseData.summaryComments && responseData.summaryComments.length>0){
            this.setState({summaryComments: responseData.summaryComments});
          }

          if (doCheck) {
            this.checkAction(responseData);
          }
          //this.setState({comments: JSON.stringify(responseData)});
       }).catch((error) => {
          console.error(error);
       }).done();
      //  if (!id) {
      //    // POST data
      //    url = Config.PROPERTY_ITEMS_API + '/';
      //    let template = this.state.templateItem;
      //    if (template){
      //      let postData = {
      //        "name": template.name,
      //        "userId": this.state.userId,
      //        "rank": template.rank,
      //        "active": template.active,
      //        "deleted": template.deleted,
      //        "PropertyItemId": template.id,
      //        "PropertyCategoryId": template.divisionid,
      //        "cost": template.cost,
      //        "selectedOption": template.selectedOption,
      //        "allObservedSwitchIsOn": template.allObservedSwitchIsOn,
      //        "images": data.images,
      //        "comments": data.comments,
      //        "created": now
      //      };
      //      // POST
      //      fetch(url, {
      //        method: 'post',
      //        headers: {
      //          'Accept': 'application/json',
      //          'Content-Type': 'application/json',
      //        },
      //        body: JSON.stringify(postData)
      //      }).then((response) => response.json()).then((responseData) => {
      //         console.log('responseData: ', responseData);
      //         if (doCheck) {
      //           this.checkAction(responseData);
      //         }
      //         //this.setState({comments: JSON.stringify(responseData)});
      //      }).catch((error) => {
      //         console.error(error);
      //      }).done();
      //    } else {
      //      console.warn('templateItem not found');
      //      alert('templateItem not found');
      //      return;
      //    }
      //  } else {
      //    //PATCH data
      //    url = Config.PROPERTY_ITEMS_API + '/' + id;
      //    fetch(url, {
      //      method: 'PATCH',
      //      headers: {
      //        'Accept': 'application/json',
      //        'Content-Type': 'application/json',
      //      },
      //      body: JSON.stringify(data)
      //    }).then((response) => response.json()).then((responseData) => {
      //       console.log('responseData: ', responseData);
      //       if (doCheck) {
      //         this.checkAction(responseData);
      //       }
      //       //this.setState({comments: JSON.stringify(responseData)});
      //    }).catch((error) => {
      //       console.error(error);
      //    }).done();
      //  }
   }

   checkAction(data) {
      if (data.selectedOption === 'Needs Attention') {
        //this.navigateTo('commentsAndPhotos');
         console.log('Taking Photo...');
         this._takePhoto();
      }
   }

   setSelectedOption(selectedOption) {
      let selectedItemId = this.state.item.id;
      this.setState({
         selectedOption: selectedOption.value
      });
      // let data = {selectedOption: selectedOption.value};

      let item = this.state.item;
      // let template = this.state.templateItem;
      let data = {};
      let modified = new Date();

      data = {selectedOption: selectedOption.value, modified: modified};
      this.persistData(item.id, data, true);

      // if (item.id != template.id){
      //   data = {selectedOption: selectedOption.value, modified: modified};
      //   this.persistData(item.id, data, true);
      // } else {
      //   data = {selectedOption: selectedOption.value, modified: modified};
      //   this.persistData('', data, true);
      // }

      // this.persistData(selectedOption.item.id, data, true);
   }

   renderSegmentControl(item) {
      if(!item) return;

      // const a = ' <Image src="https://s3-us-west-2.amazonaws.com/mywalkthru-pm-files/photos/Ok-48.png" />';

      const options = [
        {
          label: 'Observed',
          value: 'Observed',
          item: item
        },
        {
          label: 'N/A',
          value: 'N/A',
          item: item
       },
       {
         label: '📷 Photos/Comments',
         value: 'Needs Attention',
         item: item
       },
      ];

      let selectedIndex = -1;
      let itemSelectedOption = item.selectedOption;
      let selectedOption = itemSelectedOption;
      if (this.state.selectedOption !== itemSelectedOption) {
         selectedOption = this.state.selectedOption;
      }

      switch(selectedOption) {
         case 'Observed':
            selectedIndex = 0;
            break;
         case 'N/A':
            selectedIndex = 1;
            break;
         case 'Needs Attention':
            selectedIndex = 2;
            break;
         default:
            selectedIndex = -1;
            break;
      }

      return (
        <View style={{marginTop: 10, backgroundColor: 'white'}}>
          <SegmentedControls          
            options={options}
            onSelection={this.setSelectedOption.bind(this)}
            selectedIndex={selectedIndex}
            extractText={(option) => option.label}
            optionContainerStyle={{ flex: 1 }}
            optionStyle= {{
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center'
            }}
            containerStyle= {{
              marginLeft: 5,
              marginRight: 5,
            }}
          />
        </View>
      );
    }

   onRefresh = () => {
     try {
         this.setState({isRefreshing: true});
         setTimeout(() => {
            this.setState({isRefreshing: false});
         }, 1500);
     }catch(e){}
   }

   render() {
       let { image } = this.state;
       if (!this.state.loaded) {
          return this.renderLoadingView();
       }
       return this.renderWalkthroughItem();
   }

   renderLoadingView() {
      return (
        <View style={styles.header}>
            <View style={styles.container}>
                <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, {height: 80}]}
                    size="large"
                />
            </View>
        </View>
      );
   }

}  // end class

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.id
})

function bindAction(dispatch) {
    return {
        openDrawer: ()=>dispatch(openDrawer()),
        popRoute: () => dispatch(popRoute()),
        replaceRoute:(route)=>dispatch(replaceRoute(route)),
        replaceOrPushRoute:(route)=>dispatch(replaceOrPushRoute(route)),
    }
}

export default connect(null, bindAction)(DetailRow);

// export default DetailRow;
