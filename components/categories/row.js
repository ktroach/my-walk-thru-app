import React from 'react';

import {
   AsyncStorage,
   StyleSheet,
   Image,
   View,
   TouchableHighlight,
   TouchableOpacity,
   ProgressViewIOS
} from 'react-native';

import {
  FontAwesome,
} from '@expo/vector-icons';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, List, ListItem, Thumbnail, H1, H2, H3 } from 'native-base';

import { connect } from 'react-redux';

import { closeDrawer } from '../../actions/drawer';
import { replaceOrPushRoute } from '../../actions/route';
import { toggleTodo } from '../../actions/sub';

import Config from '../../config'
import styles from './styles/row';

class CategoryRow extends React.Component {

   state = {
       progress: 0,
       progressColor: 'red',
       pending: true,
       complete: false,
       subcategories: [],
       userId: '',
       itemCount: 0,
       loaded: false,
       status: '',
       iconName: 'ios-information-circle-outline',
       iconColor: '#333'
   }

    componentDidMount() {
     AsyncStorage.getItem("userId")
     .then( (userId) =>
           {
               this.setState({userId: userId});
               this.fetchWalkthroughItems(userId);

               if(this.state.subcategories && this.state.subcategories.length>0){
                 console.log('subcategories[0]:', this.state.subcategories[0]);
               }
           }
     )
     .done();
      
      // this.fetchStatus();
    }

    // fetchStatus(){
    //   this.setState({pending: true});
    // }

    fetchWalkthroughItems(userId) {
        console.log('>>> ENTERED: fetchWalkthroughItems');

        let filter = '{"where": {"and": [{"rank": "999"},{"userId": "' + userId + '"},{"PropertyCategoryId":{ "eq": "' + this.props.category.id + '"}}]}}';
        let query = Config.PROPERTY_ITEMS_API + '?filter={"where": {"rank": 999, "PropertyCategoryId": "' + this.props.category.id + '", "active": true}}';
        let count = 0;
        let categoryName = this.state.categoryName;
        let subcategories = [];
        let itemCount = 0;
        let pending = false;
        let completed = false;

        Array.prototype.contains = function (element) {
          return this.indexOf(element) > -1;
        };

        fetch(query).then((response) => response.json()).then((responseData) => {
          let count = responseData.length;
          if (categoryName === 'Hallway / Stairway') {
            let ds = [];
            let filter = [];
            filter.push('Flooring');
            filter.push('Ceiling');
            filter.push('Walls/Paint');
            filter.push('Doors');
            filter.push('Smoke Alarm');
            filter.push('Windows');
            filter.push('Switch Covers');
            responseData.forEach(function (item) {
              if (item.name) {
                if (filter.contains(item.name)) {
                  ds.push(item);
                }
              }
            });
            const data = ds;
            let seenNames = {};
            data = data.filter(function (currentObject) {
              if (currentObject.name in seenNames) {
                return false;
              } else {
                seenNames[currentObject.name] = true;
                return true;
              }
            });
            itemCount = data.length;

            subcategories = data;

          } else {

            itemCount = responseData.length;

            subcategories = responseData;
          }

          let completedCount = 0;

          // console.log(subcategories);

          subcategories.forEach(function(item) {
            if (item.dateObserved && item.dateObserved.length > 0) {
              completedCount++;
            }
          });

          console.log('itemCount/completedCount: ', itemCount, completedCount);

          let status = '';
          let iconName = 'ios-arrow-dropright-outline';
          let iconColor = 'rgba(0, 122, 255, 1)';          

          if (itemCount === completedCount) {
            status = 'compeleted';
            iconName = 'ios-checkmark-circle-outline';
            iconColor = 'green'; 
          } else {
            status = 'pending';
            iconName = 'ios-arrow-dropright-outline';
            iconColor = '#fe7013';            
          }

          this.setState({loaded: true, itemCount: count, subcategories: subcategories, status: status, iconName: iconName, iconColor: iconColor});

        }).done();
    }

    fetchProgressSummary(){
      this.updateProgress();

      var x = JSON.stringify(this.props.category);
      // alert(x);
    }

    updateProgress() {
      var progress = this.state.progress + 0.01;
      this.setState({ progress });
      // this.requestAnimationFrame(() => this.updateProgress());
    }

    getProgress(offset) {
      var progress = this.state.progress + offset;
      return Math.sin(progress % Math.PI) % 1;
    }

    navigateTo(route) {
      AsyncStorage.setItem("categoryId", this.props.category.id);
      AsyncStorage.setItem("categoryName", this.props.category.name);
      this.props.toggleTodo(this.props.category.id);
      this.props.closeDrawer();
      this.props.replaceOrPushRoute(route);
    }

   render() {
      // Category name ( trim it )
      var name = '';
      var categoryname = this.props.category.name;

      // let tagged = false;
      // let summaryComment = '';
      // if(this.props.category.summaryComment){
      //   summaryComment = this.props.category.summaryComment;
      //   if(summaryComment.length>0) summaryComment.trim();
      //   tagged = (summaryComment.length>0);
      // }

      // if (tagged){

      // }

      if (categoryname && categoryname.length > 0) {
         name = categoryname.trim();
      } else {
         // oops categoryname is null ??
         name = 'undefined';
      }

      // Start description details
      var description = '';
      if (!this.props.category.description || this.props.category.description === 'undefined') {
         description = '';
      } else {
         description = this.props.category.description;
      }
      if (description && description.length > 100) {
         description=description.subString(20) + '...';
      }
      // End description details

      // var icon = '../../assets/images/house.png';
      // if (name.indexOf('Bedroom'>0)){
      //   icon = '../../assets/images/beds.png';
      // }
      //  else if (name.indexOf('Bath'>0)){
      //   icon = '../../assets/images/baths.png';
      // } else {
      //   icon = '../../assets/images/beds.png';
      // }

      // const icon = <Thumbnail circular size={50} source={require('../../assets/images/beds.png')} />;

    //   ios-information-circle-outline

      // let icon = 'ios-arrow-dropright-outline';
      // let iconColor = 'rgba(0, 122, 255, 1)';
      // let status = this.state.status;

      // if (!status || status === ''){
      //   icon = 'ios-arrow-dropright-outline';
      //   iconColor = 'rgba(0, 122, 255, 1)';
      // } else if (status === 'complete'){
      //   icon = 'ios-checkmark-circle-outline';
      //   iconColor = '#8EC5AD';
      // } else if (status === 'pending') {
      //   icon = 'ios-information-circle-outline';
      //   iconColor = '#333';
      // }

      return (
        
         <View style={{
             borderWidth: 2,
             borderColor: '#C8C7CC'
            }}>
            <TouchableOpacity  style={styles.card} onPress={() => this.navigateTo('subcategories')}>
               <CardItem style={styles.cardHeader}  header  onPress={() => this.navigateTo('subcategories')}>

                   {/*<Thumbnail circular size={50} source={require(icon)} />*/}

                   {/*<Icon name={icon} style={{fontSize: 32, color: iconColor}} />*/}

                   {/*<Thumbnail circular size={50} source={require('../../assets/images/beds.png')} />*/}

                   <H3 style={{ color: '#333', fontWeight:'bold', marginLeft: 8, marginTop: 5 }}>{name}</H3>

                   <Text style={styles.arrow}>
                     {/*<Icon name="ios-arrow-forward" style={{ color: '#333'}} />*/}
                     <Icon name={this.state.iconName} style={{fontSize: 30, fontWeight:'bold', color: this.state.iconColor}} />
                   </Text>
               </CardItem>
               {/*<CardItem style={styles.cardItem}   onPress={() => this.navigateTo('subcategories')}>
                  <List>
                       <ListItem style={{borderBottomWidth: 0}}>
                           <Text style={{color: '#333'}}>{description}</Text>
                       </ListItem>
                  </List>
               </CardItem>               */}
               {/*
               <CardItem style={styles.cardItem}   onPress={() => this.navigateTo('subcategories')}>
                  <List>
                       <ListItem style={{borderBottomWidth: 0}}>
                           <ProgressViewIOS style={styles.progressView} progressTintColor={this.state.progressColor} progress={this.getProgress(1.0)}/>
                       </ListItem>
                  </List>
               </CardItem>
               */}
            </TouchableOpacity>
         </View>
      );

    } // end render

}

CategoryRow.propTypes = {
    category: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
    }).isRequired,
};

function bindAction(dispatch) {
    return {
    	closeDrawer: ()=>dispatch(closeDrawer()),
      replaceOrPushRoute:(route)=>dispatch(replaceOrPushRoute(route)),
      toggleTodo: (id)=>dispatch(toggleTodo(id))
    }
}

export default connect(null, bindAction)(CategoryRow);
