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
       progressColor: 'red'
   }

    componentDidMount() {
      this.fetchProgressSummary();
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

      return (
        
         <View style={{
             borderWidth: 2,
             borderColor: '#C8C7CC'
            }}>
            <TouchableOpacity  style={styles.card} onPress={() => this.navigateTo('subcategories')}>
               <CardItem style={styles.cardHeader}  header  onPress={() => this.navigateTo('subcategories')}>

                   {/*<Thumbnail circular size={50} source={require(icon)} />*/}

                   <Thumbnail circular size={50} source={require('../../assets/images/beds.png')} />

                   <H3 style={{ color: '#333', fontWeight:'bold', marginLeft: 8, marginTop: 5 }}>{name}</H3>

                   <Text style={styles.arrow}><Icon name="ios-arrow-forward" style={{ color: '#333'}} /></Text>
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
