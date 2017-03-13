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
// import Lightbox from 'react-native-lightbox';
// import RNAssetThumbnail from  'react-native-asset-thumbnail';
// import PhotoBrowser from 'react-native-photo-browser';

import { Container, Header, Title, Content, Text, Button, List, ListItem, Card, CardItem } from 'native-base';

import { connect } from 'react-redux'
import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { replaceOrPushRoute } from '../../actions/route';
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
           comments: '',
           photolist: [],
           userId:'',
           templateItem: {}
      };
   }

   componentDidMount() {
     AsyncStorage.setItem("photoUri", "")
     .then( () =>
         {
         }
     )
     .done( );
      // this.fetchWalkthroughItem();
      this.fetchTemplateItem(this.props.itemId);
   }

   replaceRoute(route) {
       this.props.replaceRoute(route);
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
             borderColor: '#333'
            }}>

            <Header style={{backgroundColor: '#fff'}}>
                <Title style={{fontSize: 20, color: '#333'}}>{this.state.item.name}</Title>
            </Header>
            <Content padder style={{backgroundColor: '#fff'}} >
                <Card transparent foregroundColor="#000">
                    <CardItem header>
                       <Text>Condition</Text>
                    </CardItem>
                    <CardItem>
                       {this.renderSegmentControl(this.state.item)}
                    </CardItem>
                    <CardItem header>
                       <Text>Comments/Photos</Text>
                    </CardItem>
                    <CardItem>
                      <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}} onPress={() => this.navigateTo('commentsAndPhotos')}>
                          <Text style={{fontSize: 16, fontWeight: '500', color: '#fff'}}>Add Comments/Photos</Text>
                      </Button>
                    </CardItem>
                </Card>
            </Content>

         </View>
      </View>
     );
   }

   navigateTo(route) {
     AsyncStorage.setItem("subItemId", this.props.itemId)
     .then( () =>
         {
             this.props.replaceOrPushRoute(route);
         }
     )
     .done( );
   }

   _takePhoto = async () => {
     let pickerResult = await ImagePicker.launchCameraAsync({
       allowsEditing: true,
       aspect: [4,3]
     });

     console.log('pickerResult:', pickerResult);

     AsyncStorage.setItem("photoUri", pickerResult.uri)
     .then( () =>
         {
             this.navigateTo('commentsAndPhotos');
         }
     )
     .done( );
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

   fetchTemplateItem(itemId){
     console.log('>>> ENTERED DetailRow::fetchTemplateItem');
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
        this.fetchWalkthroughItem(templateItem);
     }).done();
   }

   fetchWalkthroughItem(templateItem){
     console.log('>>> ENTERED DetailRow::fetchWalkthroughItem');
     console.log('>>> templateItem.id:', templateItem.id);
     AsyncStorage.getItem("userId")
     .then( (userId) =>
       {
          let query = Config.PROPERTY_ITEMS_API + '?filter={"where": {"and": [{"userId": "' + userId + '"}, {"PropertyItemId": "' + templateItem.id + '"}]}}';
          // console.log('query: ', query);

          fetch(query).then((response) => response.json()).then((responseData) => {
              // console.log('>>> responseData:', responseData);
             let item = responseData[0];
            //  console.log('>>> item:', item);
             if (item) {
               this.setState({
                 item: item,
                 selectedOption: item.selectedOption,
                 loaded: true
               });
             } else {
               // item does not exist
               this.setState({
                 item: templateItem,
                 selectedOption: templateItem.selectedOption,
                 loaded: true
               });
             }
          }).done();
           this.setState({"userId": userId})
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
              if (doCheck) {
                this.checkAction(responseData);
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
            if (doCheck) {
              this.checkAction(responseData);
            }
            //this.setState({comments: JSON.stringify(responseData)});
         }).catch((error) => {
            console.error(error);
         }).done();
       }
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
      let template = this.state.templateItem;
      let data = {};
      let modified = new Date();
      if (item.id != template.id){
        data = {selectedOption: selectedOption.value, modified: modified};
        this.persistData(item.id, data, true);
      } else {
        data = {selectedOption: selectedOption.value, modified: modified};
        this.persistData('', data, true);
      }

      // this.persistData(selectedOption.item.id, data, true);
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
