import React, {
  PropTypes
} from 'react';
import {
   StyleSheet,
   Text,
   TextInput,
   View,
   TouchableHighlight,
   Alert,
   Button,
   Clipboard,
   Image,
   Share,
   ListView,
   TouchableOpacity,
   ActivityIndicator,
   RefreshControl,
   RecyclerViewBackedScrollView,
   StatusBar,
   Switch
} from 'react-native';
import Expo, {
   Components,
   Permissions,
   Location,
   Constants,
   ImagePicker,
} from 'expo';
import Config from '../../../config'
import styles from './styles/details';
import rowStyles from './styles/row';
import AttributeMap from '../../attributemap';
import Toolbar from '../../toolbar'
import shortid from 'shortid';
import { SegmentedControls } from 'react-native-radio-buttons';
import {
  FontAwesome,
} from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const Icon = Ionicons;

import Photo from './Photo';

class CategoryDetails extends React.Component {
   constructor(props, context) {
      super(props, context);
      this.state = {
           isRefreshing: false,
           isLoaded: false,
           dataSource : new ListView.DataSource({
                rowHasChanged : (row1, row2) => row1 !== row2,
           }),
           item: {},
           itemCount: 0,
           category: {},
           categories: [],
           selectedSegmentIndex: undefined,
           selectedTab: 'All',
           toolbarTitle: this.props.category.name + " Items ",
           image: null,
           uploading: false,
           categoryId: this.props.category.id,
           categoryIndex: 0,
           nextCategory: {},
           categoryName: "",
           allObservedSwitchIsOn: false,
           selectedItem: {},
           selectedoptions: [],
           selectedindexset: [],
           associatedArray: {},
           subcategories: []
      };
   }

   componentDidMount() {
      this.fetchWalkthroughItems();
   }

   renderWalkthrough() {
      return (
        <View style={styles.container}>
           <Toolbar
               title={this.state.toolbarTitle}
               style={styles.toolbar}
               titleColor={'#fff'}
               actions={[
                   {title: 'Back', iconName: 'md-arrow-back', iconColor: '#fff', show: 'false'},
                   {title: 'Prev', iconName: 'md-arrow-dropleft-circle', iconColor: '#fff', show: 'always'},
                   {title: 'Next', iconName: 'md-arrow-dropright-circle', iconColor: '#fff', show: 'always'},
                   {title: 'Refresh', iconName: 'md-refresh', iconColor: '#fff', show: 'always'},
               ]}
               onActionSelected={this.onActionSelected.bind(this)} />

            <View style={[styles.subHeaderBar]}>
                <View style={{flex: 1,justifyContent: 'space-between',flexDirection: 'row', padding: 10}}>
                   <View>
                       <Switch onValueChange={(value) => this.toggleAllObserved(value)}
                          onTintColor="#00ff00"
                          thumbTintColor="#0000ff"
                          tintColor="#C8C7CC"
                          value={this.state.allObservedSwitchIsOn} />
                       <Text style={{color:'#333', fontSize:10, fontWeight:'500', textAlign: 'center', paddingTop: 3}}>
                       All Observed</Text>
                   </View>
                </View>
            </View>

            {
             this.renderListView()
            }

            <StatusBar barStyle="default" />

        </View>
      );
   }

   fetchWalkthroughItems() {
      let query = Config.PRICING_ITEMS_API + '?filter={"where": {"rank": 999, "divisionid": "'+this.state.categoryId+'"}}';
      let count = 0;
      let categoryName = this.state.categoryName;

      if(!categoryName||categoryName===''){
         categoryName = this.props.category.name;
      }

      fetch(query).then((response) => response.json()).then((responseData) => {
         let count = responseData.length;
         this.setState({
           dataSource: this.state.dataSource.cloneWithRows(responseData),
           loaded: true,
           itemCount: count,
           toolbarTitle: "   " + categoryName + " (" + count + ")"
         });

         this.setState({
            subcategories: responseData
         });

         let associatedarray = {};
         //associatedarray["prop"] = value;
         //var value = associatedarray[key];
         // key will be item.id

         let allobserved = false;
         let items = responseData;
         items.forEach(function(item){
           let value = '';
           let key = item.id;
           if (item.selectedOption) value = item.selectedOption;
           associatedarray[key] = value;
           allobserved = item.allObservedSwitchIsOn;
         });

         this.setState({
            allObservedSwitchIsOn: allobserved
         });

         this.setState({
            associatedArray: associatedarray
         });
      }).done();
   }

   patchItem(id, data) {
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
         this.checkAction(responseData);
      }).catch((error) => {
         console.error(error);
      }).done();
   }

   checkAction(data) {
      if (data.selectedOption === 'Needs Attention') {
         // _takePhoto
         // Photo.TakePhoto();
         this._takePhoto();
         // alert('takePhoto');
      }
   }

   setSelectedOption(selectedOption) {
      if (!selectedOption || !selectedOption.item){
         console.log('setSelectedOption -> selectedOption is undefined');
         return;
      }
      if (!selectedOption.item){
         console.log('setSelectedOption -> item is undefined');
         return;
      }
      if (!selectedOption.value){
         console.log('setSelectedOption -> value is undefined');
         return;
      }

      let seletedItemKey = selectedOption.item.id;

      if (!seletedItemKey){
         console.log('setSelectedOption -> seletedItemKey is undefined');
         return;
      }

      let stateCopy = Object.assign({}, this.state);
      stateCopy.associatedArray[seletedItemKey] = selectedOption.value;
      this.setState(stateCopy);

      let data = {selectedOption: selectedOption.value};
      this.patchItem(selectedOption.item.id, data);
   }

   handleAllObserved(toggleState, value) {
      let stateCopy = Object.assign({}, this.state);
      let subcategories = this.state.subcategories;
      let selectedOption = '';
      // switch on
      if (toggleState === 'on') {
         selectedOption = 'Observed';
      // switch off
      } else {
         selectedOption = '';
      }
      for (var i = 0; i < subcategories.length; i++) {
         let subcategory = subcategories[i];
         let key = subcategory.id;
         if (key) {
            // console.log('setting associatedArray state...[key]: ', key);
            // stateCopy.associatedArray[key] = selectedOption;
            let update1 = {selectedOption: selectedOption};
            console.log('calling patchItem...[update1]:', update1);
            this.patchItem(key, update1);

            let update2 = {allObservedSwitchIsOn: value};
            console.log('calling patchItem...[update2]:', update2);
            this.patchItem(key, update2);
         }
      }
      stateCopy.allObservedSwitchIsOn = value;
      this.setState(stateCopy);
   }

   toggleAllObserved(value) {
      // this.setState({allObservedSwitchIsOn: value});
      if (value) {
         this.handleAllObserved('on',value);
      } else {
         this.handleAllObserved('off',value);
      }

      this.props.onCancel();
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

      let seletedItemKey = item.id;
      if (!seletedItemKey){
         console.log('renderSegmentControl -> seletedItemKey [item.id] is undefined');
         return;
      }

      let selectedOption = this.state.associatedArray[seletedItemKey];
      let selectedIndex = -1;
      let so = item.selectedOption;

      switch(so) {
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

      if (selectedIndex > 0) {
         return (
           <View style={{marginTop: 10, backgroundColor: 'white'}}>
             <SegmentedControls
               options={options}
               onSelection={this.setSelectedOption.bind(this)}
               selectedIndex={selectedIndex}
               extractText={(option) => option.label}
               optionContainerStyle={{ flex: 1 }}
               optionStyle= {{
                 fontSize: 12,
                 fontWeight: 'bold',
               }}
               containerStyle= {{
                 marginLeft: 5,
                 marginRight: 5,
               }}
             />

           </View>
         );
      } else {
         return (
           <View style={{marginTop: 10, backgroundColor: 'white'}}>
             <SegmentedControls
               options={options}
               onSelection={this.setSelectedOption.bind(this)}
               selectedIndex={selectedIndex}
               extractText={(option) => option.label}
               optionContainerStyle={{ flex: 1 }}
               optionStyle= {{
                 fontSize: 12,
                 fontWeight: 'bold',
               }}
               containerStyle= {{
                 marginLeft: 10,
                 marginRight: 10,
               }}
             />

           </View>
         );
      }
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
       return this.renderWalkthrough();
   }

   _maybeRenderUploadingOverlay = () => {
     if (this.state.uploading) {
       return (
         <View style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center'}]}>
           <ActivityIndicator
             color="#fff"
             animating
             size="large"
           />
         </View>
       );
     }
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
             style={{width: 50, height: 50}}
           />
         </View>

         <Text
           onPress={this._copyToClipboard}
           onLongPress={this._share}
           style={{paddingVertical: 10, paddingHorizontal: 10}}>
           {image}
         </Text>
       </View>
     );
   }

   _maybeRenderComments = () => {
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
           <TextInput
             style={{width: 200, height: 100}}
           />
         </View>
       </View>
     );
   }

   _share = () => {
     Share.share({
       message: this.state.image,
       title: 'Check out this photo',
       url: this.state.image,
     });
   }

   _copyToClipboard = () => {
     Clipboard.setString(this.state.image);
     alert('Copied image URL to clipboard');
   }

   _takePhoto = async () => {
console.log('>>> ENTERED _takePhoto');

     let pickerResult = await ImagePicker.launchCameraAsync({
       allowsEditing: true,
       aspect: [4,3]
     });

     this._handleImagePicked(pickerResult);
   }

   _pickImage = async () => {
console.log('>>> ENTERED _pickImage');

     let pickerResult = await ImagePicker.launchImageLibraryAsync({
       allowsEditing: true,
       aspect: [4,3]
     });

     this._handleImagePicked(pickerResult);
   }

   _handleImagePicked = async (pickerResult) => {
console.log('>>> ENTERED _handleImagePicked');

console.log('pickerResult.uri: ', pickerResult.uri);

     let uploadResponse, uploadResult;

     try {

console.log('>>> set state -> uploading: true');

       this.setState({uploading: true});

       if (!pickerResult.cancelled) {
         // uploadResponse = this.uploadImageAsync(pickerResult.uri);
         uploadResponse = await this.uploadImageAsync(pickerResult.uri);
         uploadResult = await uploadResponse.json();

console.log('>>> uploadResponse: ', uploadResponse);

         // uploadResult =  uploadResponse.json();

// console.log('>>> uploadResult: ', uploadResult);

         let filename = uploadResult.result.files.photo[0].name;

console.log('>>> filename: ', filename);

         let location = `https://pros-estimates.herokuapp.com:443/api/Containers/images/download/${filename}`;

console.log('>>> set state -> image:location: ', location);

         this.setState({image: location});
       }
     } catch(e) {

console.log('Failed to upload image');

       console.log({uploadResponse});
       console.log({uploadResult});
       console.log({e});

       alert('Failed to upload image');
       alert(e.message);
     } finally {

console.log('>>> set state -> uploading: false');
       this.setState({uploading: false});
     }
  }

  async uploadImageAsync(uri) {

console.log('>>> ENTERED uploadImageAsync...');
console.log('uri:', uri);

      let apiUrl = 'https://pros-estimates.herokuapp.com:443/api/Containers/images/upload';

      let uriParts = uri.split('.');
      let fileType = 'png'; //uri[uri.length - 1];

      let formData = new FormData();

      let filename = shortid.generate();

console.log('>>> filename: ', filename);

      formData.append('photo', {
        uri,
        name: `${filename}.${fileType}`,
        type: `image/${fileType}`,
      });

console.log('>>> formData image name: ', `${filename}.${fileType}`);

      let options = {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

console.log('>>> POST options: ', options);

//       fetch(apiUrl, options).then((response) => response.json()).then((responseData) => {
// console.log('>>> fetch -> returning -> responseData', responseData);
//          return responseData;
//         }).done();

      return fetch(apiUrl, options);
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

   renderListView() {
      return (
         this.renderAllWalkThroughItems(this.state.dataSource)
      );
   }

   renderAllWalkThroughItems(source) {
      return (
         <ListView
               refreshControl={
                  <RefreshControl
                     refreshing={this.state.isRefreshing}
                     onRefresh={this._onRefresh}
                  />
               }
               renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
               enableEmptySections={true}
               dataSource={source}
               renderRow={this.renderRow.bind(this)} 
          />
       );
   }

   renderRow(item) {
     return (
        <View>
          <TouchableOpacity style={rowStyles.container}>

              <View style={rowStyles.leftContainer}>
                 <Text style={rowStyles.labelLg}>
                    {item.name}
                 </Text>
                   <View style={{width: 360}}>
                       {this.renderSegmentControl(item)}
                   </View>

                   <View style={styles.container}>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={this._takePhoto}>
                           <View style={styles.photoButton}>
                             <Text style={styles.photoButtonText}>
                                 Take Photo
                             </Text>
                           </View>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={this._pickImage}>
                           <View style={styles.photoButton}>
                             <Text style={styles.photoButtonText}>
                                 Pick Photo
                             </Text>
                           </View>
                        </TouchableOpacity>
                      </View>
                       { this._maybeRenderImage() }
                       { this._maybeRenderUploadingOverlay() }
                       { this._maybeRenderComments() }
                   </View>
              </View>




              </TouchableOpacity>
        </View>
        );
   }

   onActionSelected(position) {
      if (position === 0) {
         this.props.onCancel();
      } else if (position === 1) {
         this.onPrevious();
      } else if (position === 2) {
         this.onNext();
      } else if (position === 3) {
         this.onRefresh();
      }
   }

   onSecondToolbarSelected(position) {
      if (position === 0) {
         this.onRefresh(); // All Observed
      } else if (position === 1) {
         this.onRefresh(); // All N/A
      } else if (position === 2) {
         this.onRefresh(); // All Need Attention
      }
   }

   onNext() {
      if (!this.props.categories || this.props.categories.length === 0){
         alert('No Categories found');
         return;
      }
      let nextIndex = this.state.categoryIndex + 1;
      if (nextIndex > this.props.categories.length) return;
      this.setState({categoryIndex: nextIndex});
      let nextCategory = this.props.categories[nextIndex];
      if (!nextCategory || !nextCategory.id){
         alert('Category not found');
         return;
      }
      let nextId = nextCategory.id;
      console.log('nextId', nextId);
      this.setState({categoryId: nextId});
      this.setState({categoryName: nextCategory.name});
      this.onRefresh();
      this.fetchWalkthroughItems();
   }

   onPrevious() {
      if (!this.props.categories || this.props.categories.length === 0){
         alert('No Categories found');
         return;
      }
      let prevIndex = this.state.categoryIndex - 1;
      if (prevIndex < 0) return;
      this.setState({categoryIndex: prevIndex});
      let prevCategory = this.props.categories[prevIndex];
      if (!prevCategory || !prevCategory.id){
         alert('Category not found');
         return;
      }
      let prevId = prevCategory.id;
      console.log('prevId', prevId);
      this.setState({categoryId: prevId});
      this.onRefresh();
      this.fetchWalkthroughItems();
   }

   onPressed(){
      this.props.onCancel();
   }
}

CategoryDetails.propTypes = {
   onWalkthroughItemDetails: React.PropTypes.func.isRequired,
   onCancel: React.PropTypes.func.isRequired,
   category: React.PropTypes.shape({name: React.PropTypes.string.isRequired,}).isRequired,
   categories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default CategoryDetails;
