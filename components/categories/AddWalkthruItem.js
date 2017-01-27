import React from 'react';
import {
   StyleSheet,
   Text,
   TextInput,
   View,
   TouchableHighlight,
   Alert,
   ActivityIndicator,
   Image,
   ListView,
   TouchableOpacity,
   ScrollView
} from 'react-native';
import Toolbar from '../../toolbar'
import Config from '../../../config'
import styles from './styles/add';

class AddWalkthruItem extends React.Component {
    constructor(props, context) {
        super(props, context);

         var _name = ' ';
         var _description = '';
         var _subitems = [];

         this.state = {
            name: _name,
            description: _description,
            subitems: _subitems
         };

    }

    static route = {
       navigationBar: {
           title: 'Add Item ',
       },
    }

    onCancel() {
      this.props.onCancel();
    }

    updateName(value) {
       this.setState({name: value});
    }

    updateDescription(value) {
      this.setState({description: value});
    }

    onSaveItem() {
      console.log('onSaveItem...');

      if (!this.state.name || this.state.name === ' ') {
         alert('Item Name is required');
         return;
      }

      if (!this.state.description || this.state.description === 0) {
         alert('Item Description is required');
         return;
      }

      if (!this.props.category.id) {
         alert('Category Id is required');
         return;
      }

      var now = new Date();
      // alert('todo: saved');
      var url = Config.PRICING_ITEMS_API + '/';
      var edits = JSON.stringify({
         "name": this.state.name,
         "description": this.state.description,
         "divisionid": this.props.category.id,
         "subitems": this.state.subitems,
         "rank": "999",
         "modified": now,
         "created": now
      });
      fetch(url, {
             method: 'post',
             headers: {
               "Content-type": "application/json; charset=UTF-8"
             },
            body: edits
        }).then((response) => response.json()).then((responseData) => {

         console.log('Request succeeded with JSON response', responseData);

         this.props.onSaved(responseData);

         // alert('Item Saved');

        }).done();
    }

   onActionSelected(position) {
     if (position === 0) {
         this.onCancel();
     } else if (position === 1) {
        this.onSaveItem();
     }
   }

   render() {
        var title = 'Add Walkthru Item';
        return (
            <View style={styles.container}>
               <Toolbar
                   title={title}
                   style={styles.toolbar}
                   titleColor={'#fff'}
                   actions={[
                       {title: 'Back', iconName: 'md-arrow-back', iconColor: '#fff', show: 'always', 'iconType':'ion'},
                       {title: 'Save', iconName: 'md-checkmark', iconColor: '#fff', show: 'always', 'iconType':'fa'},
                   ]}
                  onActionSelected={this.onActionSelected.bind(this)} />

                  <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>

                        <View style={styles.container1}>
                           <TextInput
                             placeholder='Item Name'
                             onChangeText={this.updateName.bind(this)}
                             style={styles.input}
                             />
                        </View>

                        <View style={styles.container1}>
                           <TextInput
                             placeholder='Item Description'
                             onChangeText={this.updateDescription.bind(this)}
                             style={styles.input}
                             />
                        </View>


               </ScrollView>
            </View>
        );
    }

}

AddWalkthruItem.propTypes = {
    onAdd: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onSaved: React.PropTypes.func.isRequired,
    category: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
    }).isRequired,
};

export default AddWalkthruItem;
