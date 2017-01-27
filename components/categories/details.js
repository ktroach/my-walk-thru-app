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
   // Clipboard,
   // Image,
   // Share,
   ListView,
   TouchableOpacity,
   ActivityIndicator,
   RefreshControl,
   RecyclerViewBackedScrollView,
   StatusBar,
   Switch
} from 'react-native';
import Exponent, {
   Components,
   Permissions,
   Location,
   Constants,
   ImagePicker,
} from 'exponent';
import Config from '../../../config'
import styles from './styles/details';
import rowStyles from './styles/row';

import DetailRow from './detailrow';

// import AttributeMap from '../../attributemap';
import Toolbar from '../../toolbar'
// import shortid from 'shortid';
// import { SegmentedControls } from 'react-native-radio-buttons';

import {
  FontAwesome,
} from '@exponent/vector-icons';
import { Ionicons } from '@exponent/vector-icons';
const Icon = Ionicons;

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
           uploading: false,
           categoryId: this.props.category.id,
           categoryIndex: 0,
           nextCategory: {},
           categoryName: "",
           allObservedSwitchIsOn: false,
           selectedItem: {},
           selectedoptions: [],
           selectedindexset: [],
           subCategoryStates: {},
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
                   {title: 'Add Item', iconName: 'md-add', iconColor: '#fff', show: 'always'},
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

         let subCategoryStates = {};
         //subCategoryStates["prop"] = value;
         //var value = subCategoryStates[key];
         // key will be item.id

         let allobserved = false;
         let items = responseData;
         items.forEach(function(item){
           let value = '';
           let key = item.id;
           if (item.selectedOption) value = item.selectedOption;
           subCategoryStates[key] = value;
           allobserved = item.allObservedSwitchIsOn;
         });

         this.setState({
            allObservedSwitchIsOn: allobserved
         });

         this.setState({
            subCategoryStates: subCategoryStates
         });
      }).done();
   }

   handleAllObserved(toggleState, value) {
      // let stateCopy = Object.assign({}, this.state);
      // let subcategories = this.state.subcategories;
      // let selectedOption = '';
      // // switch on
      // if (toggleState === 'on') {
      //    selectedOption = 'Observed';
      // // switch off
      // } else {
      //    selectedOption = '';
      // }
      // for (var i = 0; i < subcategories.length; i++) {
      //    let subcategory = subcategories[i];
      //    let key = subcategory.id;
      //    if (key) {
      //       // console.log('setting subCategoryStates state...[key]: ', key);
      //       // stateCopy.subCategoryStates[key] = selectedOption;
      //       let update1 = {selectedOption: selectedOption};
      //       console.log('calling patchItem...[update1]:', update1);
      //       this.patchItem(key, update1);
      //
      //       let update2 = {allObservedSwitchIsOn: value};
      //       console.log('calling patchItem...[update2]:', update2);
      //       this.patchItem(key, update2);
      //    }
      // }
      // stateCopy.allObservedSwitchIsOn = value;
      // this.setState(stateCopy);
   }

   toggleAllObserved(value) {
      // if (value) {
      //    this.handleAllObserved('on',value);
      // } else {
      //    this.handleAllObserved('off',value);
      // }
      //
      // this.props.onCancel();
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
       if (!this.state.loaded) {
          return this.renderLoadingView();
       }
       return this.renderWalkthrough();
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
         <ListView
               refreshControl={
                  <RefreshControl
                     refreshing={this.state.isRefreshing}
                     onRefresh={this._onRefresh}
                  />
               }
               renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
               enableEmptySections={true}
               dataSource={this.state.dataSource}
               renderRow={this.renderRow.bind(this)}
          />
       );
   }

   renderRow(item) {
     return (
        <View>
            <DetailRow itemId={item.id} />
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
      } else if (position === 4) {
         this.props.onAddWalkthroughItem(this.props.category);
      }
   }

   onNext() {
      // if (!this.props.categories || this.props.categories.length === 0){
      //    alert('No Categories found');
      //    return;
      // }
      // let nextIndex = this.state.categoryIndex + 1;
      // if (nextIndex > this.props.categories.length) return;
      // this.setState({categoryIndex: nextIndex});
      // let nextCategory = this.props.categories[nextIndex];
      // if (!nextCategory || !nextCategory.id){
      //    alert('Category not found');
      //    return;
      // }
      // let nextId = nextCategory.id;
      // console.log('nextId', nextId);
      // this.setState({categoryId: nextId});
      // this.setState({categoryName: nextCategory.name});
      // this.onRefresh();
      // this.fetchWalkthroughItems();
   }

   onPrevious() {
      // if (!this.props.categories || this.props.categories.length === 0){
      //    alert('No Categories found');
      //    return;
      // }
      // let prevIndex = this.state.categoryIndex - 1;
      // if (prevIndex < 0) return;
      // this.setState({categoryIndex: prevIndex});
      // let prevCategory = this.props.categories[prevIndex];
      // if (!prevCategory || !prevCategory.id){
      //    alert('Category not found');
      //    return;
      // }
      // let prevId = prevCategory.id;
      // console.log('prevId', prevId);
      // this.setState({categoryId: prevId});
      // this.onRefresh();
      // this.fetchWalkthroughItems();
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
   onAddWalkthroughItem: React.PropTypes.func.isRequired,
};

export default CategoryDetails;
