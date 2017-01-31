'use strict';

import React, { Component } from 'react';
import { AsyncStorage, Image, View, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input, Textarea } from 'native-base';

import moment from 'moment';

import theme from '../../themes/form-theme';
import styles from './styles';

import { SegmentedControls } from 'react-native-radio-buttons'

class Step6 extends Component {
   constructor(props) {
      super(props);
      this.state = {
           email: '',
           fullName: '',
           scroll: false,
           selectedOption: 0,
           trueSwitchIsOn: true,
           falseSwitchIsOn: false,
           termsAcceptedOn: ""
      };
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

     getOptions() {
       var options = [
        "I Accept",
        "I Decline"
       ];
       return options;
    }

     setSelectedOption(selectedOption){
         this.setState({
            selectedOption
         });
     }

     getCurrentDateTime(){
      return moment().format('MMM DD YYYY h:mm:ss a');
     }

     renderOption(option, selected, onSelect, index){
      const style = selected ? { fontWeight: 'bold'} : {};

      return (
         <TouchableWithoutFeedback onPress={onSelect} key={index}>
           <Text style={style}>{option}</Text>
         </TouchableWithoutFeedback>
      );
     }

     renderContainer(optionNodes){
      return <View>{optionNodes}</View>;
     }

     postUser(){
        // create on api user
        // store the userid in device storage!
        // send the user a welcome email 
        // copy the sub category models and patch the user id
        // change the queries to filter by that userid

     }

     createUserAccount(){
         var termsAcceptedOn = "";
         let termsAccepted = this.state.selectedOption === "I Accept" ? true : false;

         termsAcceptedOn = moment().format();

         alert('Thank you for accepting the Terms.  Enjoy the App.  ' + termsAcceptedOn);

         this.setState({"termsAcceptedOn": termsAcceptedOn});

         AsyncStorage.setItem("termsAccepted", this.state.selectedOption );
         AsyncStorage.setItem("termsAcceptedOn", termsAcceptedOn);

         this.replaceRoute('home', {email: this.state.email, fullName: this.state.fullName});
     }

     maybeProceed() {
        if (this.state.selectedOption === 'I Accept'){
           this.createUserAccount();
        } else {
           alert('Please Accept the Terms to proceed to the App')
        }
     }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('signup-step5')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Last Step.  Accept the Terms of Service (required)</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                        <Card transparent foregroundColor="#000">
                            <CardItem header>
                                <Text>Terms</Text>
                            </CardItem>
                            <CardItem>
                                 <Textarea placeholder="Terms Service Agreement" style={{height: 40}} />
                            </CardItem>
                            <CardItem>
                               <SegmentedControls
                                tint={'#007AFF'}
                                selectedTint= {'#ffffff'}
                                backTint= {'#ffffff'}
                                options={ this.getOptions() }
                                allowFontScaling={ true }
                                onSelection={ this.setSelectedOption.bind(this) }
                                selectedOption={ this.state.selectedOption }
                                optionStyles={{fontFamily: 'AvenirNext-Medium'}}
                                optionContainerStyle={{flex: 1}}
                              />
                           </CardItem>
                        </Card>
                    </Content>

                    <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}} onPress={() => this.maybeProceed()}>
                        Next
                    </Button>
                </Image>
            </Container>
        )
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

export default connect(null, bindActions)(Step6);
