import React, {Component} from 'react';

import {
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    Switch
} from 'react-native';

import styles from './styles';

var ToolbarAndroid = require('ToolbarAndroid');

import { Ionicons } from '@expo/vector-icons';
const Icon = Ionicons;

import { FontAwesome} from '@expo/vector-icons';
const FIcon = FontAwesome;

// const {ToolbarAndroid} = Icon;

class Toolbar extends Component {
   constructor(props, context) {
      super(props, context);
      this.state = {
           toggleStates: [{position: 0, stateOn: false, icon: 'toggle-off'}],
           trueSwitchIsOn: true,
           falseSwitchIsOn: false,
      };
   }

   componentDidMount() {
      this.props.actions.map((action, i) => {
          this.state.toggleStates.push({position: i, stateOn: false, icon: 'toggle-off'});
      });
   }

    onIconBtnClick(position) {
        this.props.onActionSelected(position);
    }

    onToggleClick(position) {
      let toggleState = this.state.toggleStates[position].stateOn;
      this.state.toggleStates[position].stateOn = !toggleState;
      this.props.onActionSelected(position);
    }

    _renderTitle(props) {
      if (props.noback){
         return(
            <Text style={styles.title}>
               {props.title}
            </Text>
         );
      } else {
         return(
            <TouchableOpacity key='8g4a2' onPress={this.onIconBtnClick.bind(this, 0)}>
               <Text style={styles.title}>
                  <Icon name='ios-arrow-back' size={20} color='#fff' />
                  {props.title}
               </Text>
            </TouchableOpacity>
         );
      }
   }

    render() {
        var props = {
            title: this.props.title,
            style: [styles.toolbar, this.props.style],
            titleColor: this.props.titleColor,
            noback: this.props.noback
        };

        if (this.props.logo) props = Object.assign({}, props, {logo: this.props.logo});

        if (this.props.navIconName) props = Object.assign({}, props, {navIconName: this.props.navIconName});

        if (this.props.onIconClicked) props = Object.assign({}, props, {onIconClicked: this.props.onIconClicked});

        if (this.props.actions) props = Object.assign({}, props, {actions: this.props.actions});

        if (this.props.onActionSelected) props = Object.assign({}, props, {onActionSelected: this.props.onActionSelected});

        if (this.props.noback) props = Object.assign({}, props, {noback: this.props.noback});

        if (Platform.OS == 'android') {
            return (
                 <ToolbarAndroid style={styles.toolbar} logo={this.props.logo} title={this.props.title} actions={this.props.actions} onActionSelected={this.props.onActionSelected} />
            );
        } else {
          if (this.props.isToggleToolbar) {
             throw new Error('BLARG!');
          } else {
             return (
                <View style={[styles.toolbarIOS, props.style]}>
                    <View style={styles.left}>
                        {this._renderTitle(props)}
                    </View>
                    <View style={styles.right}>
                        {
                           this.props.actions.map((action, i) => {
                              if (action.title !== 'Back') {
                                 return (
                                    <TouchableOpacity style={styles.iconBtn} key={i} onPress={this.onIconBtnClick.bind(this, i)}>
                                        <View>

                                           <Icon name={action.iconName} size={20} color={action.iconColor} />

                                           <Text style={{color:'#fff',fontSize:8,fontWeight:'300'}}>{action.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                              }
                        })
                     }
                    </View>
                </View>
            );
          }
        }
    }
}

export default Toolbar;
