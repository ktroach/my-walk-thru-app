'use strict';

import React, { Component } from 'react';

import {
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

import theme from './form-theme';
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
           user: {}
      };
   }

   componentDidMount() {
      this.fetchAll();
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
         <Container theme={theme} style={{backgroundColor: '#333'}} >
             <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                 <Header>
                    <Button transparent> </Button>

                    <Title>Categories</Title>

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
      var title =  "  Categories (" + this.state.categoryCount + ")";
      return (
         <Container theme={theme} style={{backgroundColor: '#FBFAFA'}} >
             <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
             <Header>
                <Button transparent> </Button>

                <Title>My Walk Thru - Categories</Title>

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
                      renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                      enableEmptySections={true}
                      dataSource={this.state.dataSource}
                      renderRow={this.renderRow.bind(this)}
                 />
               </Content>
             </Image>
         </Container>
      );
    }

    fetchAll () {
      fetch(Config.PRICING_API_URL).then((response) => response.json()).then((responseData) => {
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
          this.fetchAll();
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
