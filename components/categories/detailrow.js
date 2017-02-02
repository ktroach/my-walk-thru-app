import React, {
  PropTypes
} from 'react';
import {
   StyleSheet,
   TextInput,
   View,
   TouchableHighlight,
   Alert,
   Clipboard,
   Image,
   Share,
   ListView,
   TouchableOpacity,
   ActivityIndicator,
   RefreshControl,
   RecyclerViewBackedScrollView,
   StatusBar,
   Switch,
   ScrollView
} from 'react-native';
import Exponent, {
   Components,
   Permissions,
   Location,
   Constants,
   ImagePicker,
} from 'exponent';
import Config from '../../config'
import styles from './styles/details';
import rowStyles from './styles/row';
import Toolbar from '../toolbar'
import shortid from 'shortid';
import { SegmentedControls } from 'react-native-radio-buttons';
import {
  FontAwesome,
} from '@exponent/vector-icons';
import { Ionicons } from '@exponent/vector-icons';
const Icon = Ionicons;
import moment from 'moment';
import Lightbox from 'react-native-lightbox';
import RNAssetThumbnail from  'react-native-asset-thumbnail';
import PhotoBrowser from 'react-native-photo-browser';

import { Container, Header, Title, Content, Text, Button, List, ListItem, Card, CardItem } from 'native-base';
import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';
import { pushNewRoute, replaceRoute } from '../../actions/route';

class DetailRow extends React.Component {
   constructor(props, context) {
      super(props, context);
      this.state = {
           isRefreshing: false,
           isLoaded: false,
           item: {},
           image: null,
           uploading: false,
           selectedOption: {},
           images: [],
           thumbnails: [],
           dataSource : new ListView.DataSource({
                rowHasChanged : (row1, row2) => row1 !== row2,
           }),
           comments: '',
           photolist: []
      };
   }

   componentDidMount() {
      this.fetchWalkthroughItem();
   }

   _maybeRenderComments = () => {
      let commentstext = this.state.comments;
      if (this.state.item && this.state.item.comments) {
         if (this.state.item.comments.length>0){
            commentstext = this.state.item.comments;
         }
      }
     return (
       <View style={{
         marginTop: 30,
         borderRadius: 3,
         elevation: 2,
         shadowColor: 'rgba(0,0,0,1)',
         shadowOpacity: 0.2,
         shadowOffset: {width: 4, height: 4},
         shadowRadius: 5,
       }}>
       <Text style={{color:'#333'}}>
          <Icon name='ios-chatboxes-outline' size={20} color='#333'  />
          <Text> Comments</Text>
       </Text>
         <View style={{borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden'}}>
           <TextInput
             style={{height: 100, textAlign: 'left'}}
             multiline={true}
             autoCapitalize="none"
             placeholder="Enter your comments..."
             autoCorrect={true}
             onBlur={() => this.updateText()}
             onChangeText={(comments) => this.setState({comments})}
             value={commentstext}
           />
         </View>
       </View>
     );
   }

   // value={this.state.text}

   updateText(text) {
      let itemId = this.state.item.id;
      let comments = this.state.comments; //.split(' ').map((word) => word && '🍕').join(' ');
      if (!comments || comments.length===0) return;
      // alert(comments);
      let data = {comments: comments};
      this.patchItem(itemId, data, false);
   }

   renderWalkthroughItem() {
     return (
      <View style={rowStyles.container}>
         <View style={{
             flex: 1,
             flexDirection: 'column',
             justifyContent: 'center',
            }}>

            <Header>
                <Title>{this.state.item.name}</Title>
            </Header>
            <Content padder style={{backgroundColor: 'transparent'}} >
                <Card transparent foregroundColor="#000">
                    <CardItem header>
                       <Text>Actions</Text>
                    </CardItem>
                    <CardItem>
                       {this.renderSegmentControl(this.state.item)}
                    </CardItem>
                </Card>
            </Content>
            <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}} onPress={() => this.replaceRoute('categories')}>
                Comments and Photos
            </Button>




         </View>
      </View>
     );
   }

   onActionSelected(position) {
      if (position === 0) {
         console.log(position);
      } else if (position === 1) {
         console.log(position);
      }
   }

   _onPhotoSelectionChanged(){
      console.log('>>> ENTERED _onPhotoSelectionChanged...');
   }

   _onPhotoActionButton(){
      console.log('>>> ENTERED _onPhotoActionButton...');
   }

   // _maybeRenderPhotos() {
   //    return(
   //       <PhotoBrowser
   //         mediaList={this.state.photolist}
   //         initialIndex={0}
   //         displayNavArrows={false}
   //         displaySelectionButtons={false}
   //         displayActionButton={true}
   //         startOnGrid={true}
   //         enableGrid={true}
   //         onSelectionChanged={this._onPhotoSelectionChanged}
   //         onActionButton={this._onPhotoActionButton}
   //       />
   //    );
   // }


   // onPressPhoto(uri) {
   //    alert(uri);
   //
   // }

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

   fetchWalkthroughItem() {
      let itemId = this.props.itemId;

      if (!itemId) {
         console.log('Invalid key');
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
           selectedOption: item.selectedOption,
           loaded: true,
           images: item.images,
           thumbnails: thumbnails,
           dataSource: this.state.dataSource.cloneWithRows(responseData)
         });
      }).done();
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
         // console.log('responseData: ', responseData);
         // alert(responseData);
         if (doCheck) this.checkAction(responseData);
      }).catch((error) => {
         console.error(error);
      }).done();
   }

   checkAction(data) {
      if (data.selectedOption === 'Needs Attention') {
         // console.log('Taking Photo...');
         // this._takePhoto();

      }
   }

   setSelectedOption(selectedOption) {
      let selectedItemId = this.state.item.id;
      this.setState({
         selectedOption: selectedOption.value
      });
      let data = {selectedOption: selectedOption.value};
      this.patchItem(selectedOption.item.id, data, true);
   }

   renderSegmentControl(item) {
      if(!item) return;
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
         label: 'Needs Attention',
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

  //  _maybeRenderUploadingOverlay = () => {
  //    if (this.state.uploading) {
  //      return (
  //        <View style={
  //           [StyleSheet.absoluteFill,
  //           {backgroundColor: 'rgba(0,0,0,0.4)',
  //           alignItems: 'center',
  //           justifyContent: 'center'
  //        }]
  //        }>
  //          <ActivityIndicator
  //            color="#fff"
  //            animating
  //            size="large"
  //          />
  //        </View>
  //      );
  //    }
  //  }
  //
  //  _maybeRenderImage = () => {
  //    let { image } = this.state;
  //    if (!image) {
  //      return;
  //    }
  //    return (
  //      <View style={{
  //        marginTop: 30,
  //        width: 250,
  //        borderRadius: 3,
  //        elevation: 2,
  //        shadowColor: 'rgba(0,0,0,1)',
  //        shadowOpacity: 0.2,
  //        shadowOffset: {width: 4, height: 4},
  //        shadowRadius: 5,
  //      }}>
  //        <View style={{borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden'}}>
  //          <Image
  //            source={{uri: image}}
  //            style={{width: 50, height: 50}}
  //          />
  //        </View>
  //        <Text
  //          onPress={this._copyToClipboard}
  //          onLongPress={this._share}
  //          style={{paddingVertical: 10, paddingHorizontal: 10}}>
  //          {image}
  //        </Text>
  //      </View>
  //    );
  //  }
  //
  //  _share = () => {
  //    Share.share({
  //      message: this.state.image,
  //      title: 'Check out this photo',
  //      url: this.state.image,
  //    });
  //  }
  //
  //  _copyToClipboard = () => {
  //    Clipboard.setString(this.state.image);
  //    alert('Copied image URL to clipboard');
  //  }
  //
  //  _takePhoto = async () => {
  //     // console.log('>>> ENTERED _takePhoto');
  //
  //    let pickerResult = await ImagePicker.launchCameraAsync({
  //      allowsEditing: true,
  //      aspect: [4,3]
  //    });
  //
  //    this._handleImagePicked(pickerResult);
  //  }
  //
  //  _pickImage = async () => {
  //     // console.log('>>> ENTERED _pickImage');
  //
  //    let pickerResult = await ImagePicker.launchImageLibraryAsync({
  //       allowsEditing: true,
  //      aspect: [4,3]
  //     });
  //
  //     this._handleImagePicked(pickerResult);
  //  }
  //
  //  _handleImagePicked = async (pickerResult) => {
  //
  //     // console.log('>>> ENTERED _handleImagePicked');
  //
  //     // console.log('pickerResult.uri: ', pickerResult.uri);
  //
  //     let uploadResponse, uploadResult;
  //
  //     try {
  //
  //     //   console.log('>>> set state -> uploading: true');
  //
  //      this.setState({uploading: true});
  //
  //      if (!pickerResult.cancelled) {
  //        // uploadResponse = this.uploadImageAsync(pickerResult.uri);
  //        uploadResponse = await this.uploadImageAsync(pickerResult.uri);
  //        uploadResult = await uploadResponse.json();
  //
  //        // console.log('>>> uploadResponse: ', uploadResponse);
  //
  //        // uploadResult =  uploadResponse.json();
  //
  //        // console.log('>>> uploadResult: ', uploadResult);
  //
  //        let filename = uploadResult.result.files.photo[0].name;
  //
  //        // console.log('>>> filename: ', filename);
  //
  //        // let location = Config.IMAGE_UPLOADER_PHOTOS_API +
  //
  //        let location = `https://pros-estimates.herokuapp.com:443/api/Containers/images/download/${filename}`;
  //
  //        // console.log('>>> set state -> image:location: ', location);
  //
  //        this.setState({image: location});
  //
  //        let newimages = [];
  //        let item = this.state.item;
  //        let images = item.images;
  //        if (!images) newimages = [];
  //        if (images) newimages = images;
  //        newimages.push({image: location});
  //
  //        let data = {images: newimages};
  //        this.patchItem(item.id, data, false);
  //
  //      }
  //    } catch(e) {
  //
  //      console.log('Failed to upload image');
  //
  //      console.log({uploadResponse});
  //      console.log({uploadResult});
  //      console.log({e});
  //
  //      alert('Failed to upload image');
  //      alert(e.message);
  //    } finally {
  //
  //       console.log('>>> set state -> uploading: false');
  //       this.setState({uploading: false});
  //    }
  // }
  //
  // async uploadImageAsync(uri) {
  //
  //  //   console.log('>>> ENTERED uploadImageAsync...');
  //  //   console.log('uri:', uri);
  //
  //     let apiUrl = 'https://pros-estimates.herokuapp.com:443/api/Containers/images/upload';
  //
  //     let uriParts = uri.split('.');
  //     let fileType = 'png'; //uri[uri.length - 1];
  //
  //     let formData = new FormData();
  //
  //     let filename = shortid.generate();
  //
  //     // console.log('>>> filename: ', filename);
  //
  //     formData.append('photo', {
  //       uri,
  //       name: `${filename}.${fileType}`,
  //       type: `image/${fileType}`,
  //     });
  //
  //     // console.log('>>> formData image name: ', `${filename}.${fileType}`);
  //
  //     let options = {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     };
  //
  //     // console.log('>>> POST options: ', options);
  //
  //     return fetch(apiUrl, options);
  //   }

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

   // renderRow(item) {
   //    console.log('>>> ENTERED renderRow');
   //    // console.log(item.images);
   //
   //    // if (!item.images || item.images.length === 0){
   //    //    return (<View></View>);
   //    // }
   //
   //    let imagesString = JSON.stringify(item.images);
   //
   //   return (
   //      <View>
   //          <Text>{imagesString}</Text>
   //      </View>
   //      );
   //
   //    //  return (
   //    //     <View>
   //    //        <Image resizeMode="cover"
   //    //               source={{uri: item}}
   //    //               style={[{
   //    //                  height: 50,
   //    //                  width: 50
   //    //               }]}
   //    //        />
   //    //     </View>
   //    //  );
   // }

   // _maybeRenderThumbnails() {
   //    console.log('>>> ENTERED _maybeRenderThumbnails.....');
   //    console.log('this.state.dataSource', this.state.dataSource);
   //    console.log('>>> Rendering ListView....');
   //    return (
   //       <ListView
   //             renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
   //             enableEmptySections={true}
   //             dataSource={this.state.dataSource}
   //             renderRow={this.renderRow.bind(this)}
   //          />
   //    );
   // }

   // renderRow(item) {
   //    console.log('>>> ENTERED renderRow.....');
   //   return (
   //      <View>
   //          <Text>{item.name}</Text>
   //      </View>
   //      );
   // }



}  // end class

export default DetailRow;
