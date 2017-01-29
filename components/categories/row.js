import React from 'react';

import {
   StyleSheet,
   Image,
   View,
   TouchableHighlight,
   TouchableOpacity,
   ProgressViewIOS
} from 'react-native';

import {
  FontAwesome,
} from '@exponent/vector-icons';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, List, ListItem, Thumbnail, H1, H2, H3 } from 'native-base';

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
         description = '10 Areas, 0 Comments, 0 Photos';
      } else {
         description=this.props.category.description;
      }
      if (description && description.length > 100) {
         description=description.subString(20) + '...';
      }
      // End description details

      return (

          <TouchableOpacity onPress={this.onPressed.bind(this)}>
              <Card transparent  style={styles.card}>
                  <CardItem style={styles.cardHeader}  header>
                      <Thumbnail circular size={50} source={require('../../assets/images/3d-house-1.png')} />
                      <H3 style={{ color: '#333' }}>{name}</H3>
                      <Text note style={{ color: '#333' }}>{description}</Text>
                      <Text style={styles.arrow}><Icon name="ios-arrow-forward" style={{ color: '#333' }} /></Text>
                  </CardItem>

                  <CardItem style={styles.cardItem} >
                     <List>
                          <ListItem style={{borderBottomWidth: 0}}>
                              <ProgressViewIOS style={styles.progressView} progressTintColor="orange" progress={this.getProgress(0.6)}/>
                          </ListItem>
                     </List>
                  </CardItem>

              </Card>
         </TouchableOpacity>

      );

    } // end render

    // End React LifeCycles
}

CategoryRow.propTypes = {
    category: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
    }).isRequired,
};

export default CategoryRow;
