import React, {
  Component,
  PropTypes
} from 'react';
import {
   AsyncStorage,
   StyleSheet,
   // Text,
   TextInput,
   View,
   TouchableHighlight,
   Alert,
   // Button,
   // Clipboard,
   // Image,
   // Share,
   ListView,
   TouchableOpacity,
   ActivityIndicator,
   RefreshControl,
   RecyclerViewBackedScrollView,
   StatusBar,
   Switch,
    Image
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

import DetailRow from './detailrow';

import { connect } from 'react-redux'
import { toggleTodo } from '../../actions/sub'


import { openDrawer } from '../../actions/drawer';
import { popRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Button, List, ListItem, Text } from 'native-base';

// import AttributeMap from '../../attributemap';
import Toolbar from '../toolbar'
// import shortid from 'shortid';
// import { SegmentedControls } from 'react-native-radio-buttons';

import {
  FontAwesome,
} from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const Icon = Ionicons;

import theme from '../../themes/form-theme';

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
           toolbarTitle: " Items ",
           uploading: false,
           categoryId: '',
           categoryIndex: 0,
           nextCategory: {},
           categoryName: "",
           allObservedSwitchIsOn: true,
           selectedItem: {},
           selectedoptions: [],
           selectedindexset: [],
           subCategoryStates: {},
           subcategories: [],
           userId: ''
      };
   }

   componentDidMount() {
      var categoryId = '';
      var userId = '';
      AsyncStorage.getItem("userId").then((userId) => {
         this.setState({"userId": userId});
         console.log('userId: '+userId);
      }).then(res => {
        AsyncStorage.getItem("categoryId").then((categoryId) => {
           this.setState({"categoryId": categoryId});
           if (categoryId) {
              AsyncStorage.getItem("categoryName").then((categoryName) => {
                 this.setState({"categoryName": categoryName});
                 console.log('categoryName: '+categoryName);
                 this.fetchWalkthroughItems(categoryId);
              }).then(res => {
              });
           }
        }).then(res => {
        });
      });

      

      // AsyncStorage.getItem("categoryId").then((categoryId) => {
      //    this.setState({"categoryId": categoryId});
      //    if (categoryId) {
      //       AsyncStorage.getItem("categoryName").then((categoryName) => {
      //          this.setState({"categoryName": categoryName});
      //          console.log('categoryName: '+categoryName);
      //          this.fetchWalkthroughItems(categoryId);
      //       }).then(res => {
      //       });
      //    }
      // }).then(res => {
      // });
   }

    updateDateObserved(items){  
        if(items && items.length> 0) {
            items.forEach(function(item){
                let itemId = item.id;
                if(itemId && itemId.length>0){
                    let now = new Date();
                    let url = 'https://mywalkthruapi.herokuapp.com/api/v1/PropertyItems/' + itemId;
                    let data = {dateObserved: now, modified: now};
                    fetch(url, {
                        method: 'PATCH',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    }).then((response) => response.json()).then((responseData) => {
                        console.log('responseData: ', responseData);
                    }).catch((error) => {
                        console.error(error);
                    }).done();
                }
            }); 
        }


        // let id = this.state.item.id;
        // let now = new Date();
        // let data = {dateObserved: now, modified: now};
        // this.persistData(id, data);
    }

    // persistData(id, data) {
    //     if (!id) {
    //         alert('Invalid parameter: id');
    //         return;
    //     }          
    //     if (!data) {
    //         alert('Invalid parameter: data');
    //         return;
    //     }
    //     //PATCH data
    //     let url = 'https://mywalkthruapi.herokuapp.com/api/v1/PropertyItems/' + id;
    //     fetch(url, {
    //         method: 'PATCH',
    //         headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(data)
    //     }).then((response) => response.json()).then((responseData) => {
    //         console.log('responseData: ', responseData);
    //     }).catch((error) => {
    //         console.error(error);
    //     }).done();
    // }  

    // replaceRoute(route) {
    //     this.props.replaceRoute(route);
    // }

    replaceRoute(route) {
      console.log('>>>>> entered: [replaceRoute]: ', route);
      this.props.navigation.navigate(route);
    }    

    popRoute() {
        this.props.popRoute();
    }


    renderWalkthrough() {
      return (
          <Container theme={theme} style={{backgroundColor: '#fff'}}>
          
              <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                   <Header>
                      <Button transparent onPress={() => this.replaceRoute('categories')}>
                          <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32, color: '#fff'}} />
                      </Button>

                       <Title style={{fontSize: 20}}>{this.state.toolbarTitle}</Title>

                       <Button transparent onPress={this.props.openDrawer} >
                           <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32, color: '#fff'}} />
                       </Button>
                   </Header>

                   {/*<View style={{marginTop: 5, marginLeft:15, marginBottom: 5}}>
                       <Text style={{color:'#333', fontSize:14}}>All Observed</Text>
                       <Switch 
                          onValueChange={(value) => this.setState({allObservedSwitchIsOn: value})}
                          onTintColor='#8EC5AD'
                          thumbTintColor='rgba(0, 122, 255, 1)'
                          tintColor='#C8C7CC'
                          value={this.state.allObservedSwitchIsOn} 
                        />
                   </View>                   */}

                   <Content padder style={{backgroundColor: 'transparent'}}>
                        {
                        this.renderListView()
                        }
                   </Content>
              </Image>
          </Container>
      );
   }


   // xrenderWalkthrough() {
   //    return (
   //      <View style={styles.container}>
   //         <Toolbar
   //             title={this.state.toolbarTitle}
   //             style={styles.toolbar}
   //             titleColor={'#fff'}
   //             actions={[
   //                 {title: 'Back', iconName: 'md-arrow-back', iconColor: '#fff', show: 'false'},
   //                 {title: 'Prev', iconName: 'md-arrow-dropleft-circle', iconColor: '#fff', show: 'always'},
   //                 {title: 'Next', iconName: 'md-arrow-dropright-circle', iconColor: '#fff', show: 'always'},
   //                 {title: 'Refresh', iconName: 'md-refresh', iconColor: '#fff', show: 'always'},
   //                 {title: 'Add Item', iconName: 'md-add', iconColor: '#fff', show: 'always'},
   //             ]}
   //             onActionSelected={this.onActionSelected.bind(this)} />
   //
   //          <View style={[styles.subHeaderBar]}>
   //              <View style={{flex: 1,justifyContent: 'space-between',flexDirection: 'row', padding: 10}}>
                //    <View>
                //        <Switch onValueChange={(value) => this.toggleAllObserved(value)}
                //           onTintColor="#00ff00"
                //           thumbTintColor="#0000ff"
                //           tintColor="#C8C7CC"
                //           value={this.state.allObservedSwitchIsOn} />
                //        <Text style={{color:'#333', fontSize:10, fontWeight:'500', textAlign: 'center', paddingTop: 3}}>
                //        All Observed</Text>
                //    </View>
   //              </View>
   //          </View>
   //
   //          {
   //           this.renderListView()
   //          }
   //
   //          <StatusBar barStyle="default" />
   //
   //      </View>
   //    );
   // }

   fetchWalkthroughItems(categoryId) {

     var userId = this.state.userId;

     var filter = '{"where": {"and": [{"rank": "999"},{"userId": "'+userId+'"},{"PropertyCategoryId":{ "eq": "'+categoryId+'"}}]}}';

     let query = Config.PROPERTY_ITEMS_API + '?filter={"where": {"rank": 999, "PropertyCategoryId": "'+categoryId+'", "active": true}}';

      // let query = Config.PRICING_ITEMS_API + '?filter={"where": {"rank": 999, "divisionid": "'+categoryId+'"}}';
      let count = 0;
      let categoryName = this.state.categoryName;

      // if(!categoryName||categoryName===''){
      //    categoryName = this.props.category.name;
      // }

        Array.prototype.contains = function(element){
            return this.indexOf(element) > -1;
        };

        fetch(query).then((response) => response.json()).then((responseData) => {

            let count = responseData.length;
        
            if (categoryName === 'Hallway / Stairway'){

                
                
                let ds = [];
                let filter = [];

                // making a best guess at what is at the property in a certain area 
                // based on common areas on a property site 

                filter.push('Flooring');
                filter.push('Ceiling');
                filter.push('Walls/Paint');
                filter.push('Doors');
                filter.push('Smoke Alarm');
                filter.push('Windows');
                filter.push('Switch Covers');

                responseData.forEach(function(item){
                    if (item.name){
                        if (filter.contains(item.name)){
                            ds.push(item);
                        }
                    }
                });

                const data = ds;

                // dedup es6 style didnt work?
                // const set = new Set(data.map(item => JSON.stringify(item)));
                // const dedup = [...set].map(item => JSON.parse(item));

                // dedpup using array filter
                let seenNames = {};
                data = data.filter(function(currentObject) {
                    if (currentObject.name in seenNames) {
                        return false;
                    } else {
                        seenNames[currentObject.name] = true;
                        return true;
                    }
                });

                console.log(`Removed ${data.length - ds.length} elements`);
                // console.log(data);  

                // update new count 
                count = data.length;

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(data),
                    loaded: true,
                    itemCount: count,
                    toolbarTitle: "   " + categoryName + " (" + count + ")"
                });            
                this.setState({subcategories: data});
            } else {
                // you might need to dedup all cases, such as the user added a duplicate 
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    loaded: true,
                    itemCount: count,
                    toolbarTitle: "   " + categoryName + " (" + count + ")"
                });
                this.setState({subcategories: responseData});
            }      

            this.updateDateObserved(responseData);


           

            // let subCategoryStates = {};
            // //subCategoryStates["prop"] = value;
            // //var value = subCategoryStates[key];
            // // key will be item.id
            //
            // let allobserved = false;
            // let items = responseData;
            // items.forEach(function(item){
            //   let value = '';
            //   let key = item.id;
            //   if (item.selectedOption) value = item.selectedOption;
            //   subCategoryStates[key] = value;
            //   allobserved = item.allObservedSwitchIsOn;
            // });
            //
            // this.setState({
            //    allObservedSwitchIsOn: allobserved
            // });
            //
            // this.setState({
            //    subCategoryStates: subCategoryStates
            // });
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

   // toggleAllObserved(value) {
   //    if (value) {
   //       this.handleAllObserved('on',value);
   //    } else {
   //       this.handleAllObserved('off',value);
   //    }
   //    //
   //    // this.props.onCancel();
   // }

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
               enableEmptySections={true}
               dataSource={this.state.dataSource}
               renderRow={this.renderRow.bind(this)}
          />
       );
   }

   renderRow(item) {
     return (
        <View>
            <DetailRow itemId={item.id} allObservedSwitchIsOn={this.state.allObservedSwitchIsOn} />
        </View>
        );
   }


   onActionSelected(position) {
      if (position === 0) {
         this.replaceRoute('categories')
         // this.props.onCancel();
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
      // this.props.onCancel();

   }
}

// const mapStateToProps = (state) => ({
//   id: state.id
// });

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.id
})



   // category: React.PropTypes.shape({name: React.PropTypes.string.isRequired,}).isRequired,

CategoryDetails.propTypes = {
   // onWalkthroughItemDetails: React.PropTypes.func.isRequired,
   // onCancel: React.PropTypes.func.isRequired,
   // category: React.PropTypes.shape({name: React.PropTypes.string.isRequired,}).isRequired,
   // categories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
   // onAddWalkthroughItem: React.PropTypes.func.isRequired,
};

// export default CategoryDetails;

// export default connect(mapStateToProps)(CategoryDetails)


function bindAction(dispatch) {
    return {
        openDrawer: ()=>dispatch(openDrawer()),
        popRoute: () => dispatch(popRoute()),
        replaceRoute:(route)=>dispatch(replaceRoute(route))
    }
}

export default connect(null, bindAction)(CategoryDetails);
