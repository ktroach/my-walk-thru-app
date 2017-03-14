// index.js -- Category List

import React from 'react';

import {
   StyleSheet,
   View,
   ListView,
   TouchableHighlight,
   TouchableOpacity,
   Image,
   Text,
   TextInput,
   ActivityIndicator,
   RefreshControl,
   RecyclerViewBackedScrollView,
} from 'react-native';

// Tools
import Config from '../../config'
import Toolbar from '../../toolbar'

// StyleSheet
import styles from './styles/list';

// Category Components
import CategoryRow from './row';

class CategoryList extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
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

    fetchAll () {
      var url = 'https://mywalkthruapi.herokuapp.com/api/v1/PropertyCategories?filter={"where": {"and": [{"active": "true"},{"userId":{ "eq": "rJirzIMsx"}}]}}';
      fetch(url).then((response) => response.json()).then((responseData) => {
            this.setState({
               categories: responseData,
               dataSource: this.state.dataSource.cloneWithRows(responseData),
               loaded: true,
               categoryCount: responseData.length
            });
            this.props.onSetCategories(responseData);
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
             onCategoryDetails={this.props.onCategoryDetails}
             onCancel={this.props.onCancel}
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

   onActionSelected(position) {
      if (position === 0) {
           this.onRefresh();
      } else if (position === 1) {
         this.props.onShowMoreActions();
      }
   }

   renderListView() {
      var title =  "  Categories (" + this.state.categoryCount + ")";
      return (
        <View style={styles.container}>
           <Toolbar
               title={title}
               noback={true}
               style={styles.toolbar}
               titleColor={'#fff'}
               actions={[
                   {title: 'Reload', iconName: 'ios-refresh-circle', iconColor: '#fff', show: 'always'},
                   {title: 'Sort', iconName: 'ios-arrow-dropdown-circle-outline', iconColor: '#fff', show: 'always'},
               ]}
               onActionSelected={this.onActionSelected.bind(this)} />

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
        </View>
      );
   }
}

CategoryList.propTypes = {
   onShowMoreActions: React.PropTypes.func.isRequired,
   onAddCategoryStarted: React.PropTypes.func.isRequired,
   onCategoryDetails: React.PropTypes.func.isRequired,
   categories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
   onSetCategories: React.PropTypes.func.isRequired,
};

export default CategoryList;
