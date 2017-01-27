import React from 'react';

import {
   StyleSheet,
   Image,
   View,
   ListItem,
   TouchableHighlight,
   TouchableOpacity,
   ProgressViewIOS
} from 'react-native';

import {
  FontAwesome,
} from '@exponent/vector-icons';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, Thumbnail } from 'native-base';

// import { Ionicons } from '@exponent/vector-icons';
// const Icon = Ionicons;

import Config from '../../config'
import styles from './styles/row';

class CategoryRow extends React.Component {

   state = {
       progress: 0
   }

    componentDidMount() {
      this.updateProgress();
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


   // Start Press Event
   onPressed() {
     this.props.onCategoryDetails(this.props.category);
   }
   // End Press Event

   // Start React LifeCycles
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
          // TODO: hard-coded Exterior
          if(this.props.category.name === 'Exterior'){
             description="Driveway, Sidewalks, Fence, Sprinklers...";
          } else {
             description="No description";
          }
      } else {
         description=this.props.category.description;
      }
      if (description && description.length > 100) {
         description=description.subString(20) + '...';
      }
      // End description details

      // Start Estimates badge count
      var details = ''; // TODO: get this from props
      // Start Estimates badge count

      return (
        <View>

          <TouchableOpacity onPress={this.onPressed.bind(this)}>
              <Card transparent foregroundColor='#fff' style={styles.card}>
                  <CardItem style={styles.cardHeader}  header>
                      <Thumbnail source='http://' />
                      <Text>{name}</Text>
                      <Text note style={{marginTop: -8}}>{description}</Text>
                      <Text style={styles.date}></Text>
                  </CardItem>

                  <CardItem style={styles.cardItem} >
                     <ProgressViewIOS style={styles.progressView} progressTintColor="orange" progress={this.getProgress(0.6)}/>
                  </CardItem>

                  <CardItem style={styles.cardItem} >
                     <Icon style={styles.chevronLg} name="ios-arrow-forward" size={48} color="#C8C7CC" />
                  </CardItem>
              </Card>
         </TouchableOpacity>

        </View>
      );
    } // end render

    // End React LifeCycles
}

CategoryRow.propTypes = {
    onCategoryDetails: React.PropTypes.func.isRequired,
    category: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
    }).isRequired,
};

export default CategoryRow;
