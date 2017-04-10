'use strict';

import React, { Component } from 'react';

import {
   AsyncStorage,
   StyleSheet,
   View,
   ListView,
   TouchableHighlight,
   TouchableOpacity,
   Image,
   TextInput,
   ActivityIndicator,
   RefreshControl,
   RecyclerViewBackedScrollView,
} from 'react-native';

import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input, Thumbnail } from 'native-base';

import Config from '../../config'
import Toolbar from '../toolbar'

// import theme from './form-theme';
import theme from '../../themes/form-theme';

import styles from './styles';
// import styles from './styles/list';
import CategoryRow from './row';

// ad241f

class TopCategories extends Component {

   constructor(props) {
      super(props);
      this.state = {
           email: '',
           fullName: '',
           scroll: false,
           isRefreshing: false,
           isLoaded: false,
           dataSource : new ListView.DataSource({
               rowHasChanged : (row1, row2) => row1 !== row2,
           }),
           categories: [],
           category: {},
           categoryCount: 0,
           user: {},
           userId: ''
      };
   }

   componentWillMount() {
     AsyncStorage.getItem("userId")
     .then( (userId) =>
           {
               console.log('>>>AsyncStorage>>>userId', userId);
               
               this.setState({userId: userId});

               this.fetchAll(userId);
           }
     )
     .done();
      
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

    onActionSelected(position) {
      if (position === 0) {
            this.onRefresh();
      } else if (position === 1) {
          this.props.onShowMoreActions();
      }
    }

    renderLoadingView() {
      return (
         <Container theme={theme} style={{backgroundColor: '#fff'}} >
             <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                 <Header>

                   <Button transparent onPress={() => this.replaceRoute('home')}>
                       <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                   </Button>

                    <Title style={{fontSize: 20}}>Categories</Title>

                    <Button transparent onPress={this.props.openDrawer} >
                        <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                    </Button>

                 </Header>

                 <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, {height: 80}]}
                    size="large"
                />
             </Image>
         </Container>
      );
    }

    renderListView() {
      var title = "  Categories (" + this.state.categoryCount + ")";
      return (
         <Container theme={theme} style={{backgroundColor: '#FBFAFA'}} >
             <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
             <Header>

               <Button transparent onPress={() => this.replaceRoute('home')}>
                   <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
               </Button>

                <Title style={{fontSize: 20}}>{title}</Title>

                <Button transparent onPress={this.props.openDrawer} >
                    <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                </Button>
                
             </Header>
                <Content style={{backgroundColor: 'transparent'}}>
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
               </Content>
             </Image>
         </Container>
      );
    }

    // Important: Sort order is controlled by Loopback defualt order by property on the persisted model.
    fetchAll (userId) {

      var url = 'https://mywalkthruapi.herokuapp.com/api/v1/PropertyCategories?filter={"where": {"and": [{"active": "true"},{"userId":{ "eq": "'+userId+'"}}]}}';

      console.log('>>>top>>>fetchAll>>>url:', url);
      console.log('>>>top>>>fetchAll>>>userId:', userId);

      fetch(url).then((response) => response.json()).then((responseData) => {
            this.setState({
               categories: responseData,
               dataSource: this.state.dataSource.cloneWithRows(responseData),
               loaded: true,
               categoryCount: responseData.length
            });
        }).done();
    }

    onRefresh = () => {
       this.setState({isRefreshing: true});
       setTimeout(() => {
         this.setState({isRefreshing: false});
      }, 500);
    }

   renderRow(category) {
     return (
         <CategoryRow
             category={category}
         />
        );
   }

    render() {
      if (this.state.isRefreshing) {
          this.fetchAll(userId);
      }
      if (!this.state.loaded) {
          return this.renderLoadingView();
      }
      return this.renderListView();
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

export default connect(null, bindActions)(TopCategories);
