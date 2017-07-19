'use strict';

import React, { Component } from 'react';
import { AsyncStorage, Image, View, TouchableWithoutFeedback, Switch } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

import { SegmentedControls } from 'react-native-radio-buttons'

class Step4 extends Component {
   constructor(props) {
      super(props);
      this.state = {
        email: '',
        username: '',
        validForm: false,
        scroll: false,
        selectedOption: 0,
        trueSwitchIsOn: true,
        falseSwitchIsOn: false,
        tenant_phone: '',
        preferred_contact: '',
        sms_alerts: 'true'
      };
   }

   saveInputs(route) {
      if (this.inputsValidated()) {
         this.setState({validForm: true});
         try {
            if (this.state.tenant_phone && this.state.tenant_phone !== '' ) {
                AsyncStorage.setItem("tenant_phone", this.state.tenant_phone);
             }
             if (this.state.selectedOption && this.state.selectedOption !== '' ) {
                AsyncStorage.setItem("preferred_contact", this.state.selectedOption);
             }
             if (this.state.trueSwitchIsOn) {
                AsyncStorage.setItem("sms_alerts", "true");
             } else {
                AsyncStorage.setItem("sms_alerts", "false");
             }
            this.replaceRouteProxy(route);
         } catch(err) {
            console.log(err);
         }
      }
   }

   inputsValidated() {
      if(this.state.selectedOption === 'Phone' && this.state.tenant_phone === '' ){
         alert('Please enter your Phone Number.');
         return false;
      }
      return true;
   }

   invalidInput(inputName) {
      alert(inputName + ' is required.');
      this.setState({validForm: false});
      return false;
   }

   replaceRoute(route) {
      this.saveInputs(route);
   }

    replaceRouteProxy(route) {
        console.log('>>>>> entered: [replaceRoute]: ', route);
        this.props.navigation.navigate(route);
    }     

   pushNewRoute(route) {
        this.props.pushNewRoute(route);
   }

    popRoute() {
        this.props.popRoute();
    }

    getOptions() {
      var options = [
       "Phone",
       "Email",
       "Text/SMS"
      ];
      return options;
   }

    setSelectedOption(selectedOption){
     this.setState({
        selectedOption
     });
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

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('signup-step3')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Your Contact Options</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                        <Card transparent foregroundColor="#000">
                            <CardItem header>
                                <Text>Your Phone Number</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-call-outline" style={{color: '#000'}} />
                                    <Input placeholder="(888) 888-5555" placeholderTextColor="#878787" style={{color: '#000'}}
                                    onChangeText={(tenant_phone) => this.setState({tenant_phone})} value={this.state.tenant_phone} />
                                </InputGroup>
                            </CardItem>
                            <CardItem header>
                                <Text>Preferred Contact Method</Text>
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
                           <CardItem header>
                              <Text>Do you want to receive SMS text alerts?</Text>
                           </CardItem>
                           <CardItem>
                                 <Switch
                                   onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
                                   value={this.state.trueSwitchIsOn} />
                           </CardItem>

                        </Card>
                    </Content>

                    <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}} onPress={() => this.replaceRoute('signup-step5', {email: this.state.email, fullName: this.state.fullName})}>
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

export default connect(null, bindActions)(Step4);
