'use strict';

import React, { Component } from 'react';
import { AsyncStorage, Image, View } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

class Step2 extends Component {

   constructor(props) {
      super(props);
      this.state = {
           street1: '',
           street2: '',
           city: '',
           stateabbr: '',
           zip: '',
           validForm: false
      };
   }

   saveInputs(route) {
      if (this.inputsValidated()) {
         this.setState({validForm: true});
         try {
            AsyncStorage.setItem("street1", this.state.street1);
            AsyncStorage.setItem("street2", this.state.street2);
            AsyncStorage.setItem("city", this.state.city);
            AsyncStorage.setItem("state", this.state.stateabbr);
            AsyncStorage.setItem("zip", this.state.zip);
            this.props.replaceRoute(route);
         } catch(err) {
            console.log(err);
         }
      }
   }

   inputsValidated() {
      if (!this.state.street1 || this.state.street1.length===0) return this.invalidInput('street1');
      if (!this.state.city || this.state.city.length===0) return this.invalidInput('city');
      if (!this.state.stateabbr || this.state.stateabbr.length===0) return this.invalidInput('state');
      if (!this.state.zip || this.state.zip.length===0) return this.invalidInput('zip');
      return true;
   }

   invalidInput(inputName) {
      alert(inputName + ' is required.');
      this.setState({validForm: false});
      return false;
   }

   replaceRoute(route) {
      this.saveInputs();
      if (this.state.validForm) {
         this.props.replaceRoute(route);
      }
   }

   pushNewRoute(route) {
        this.props.pushNewRoute(route);
   }

    popRoute() {
        this.props.popRoute();
    }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('signup-step1')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Where is your new Home?</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                        <Card transparent foregroundColor="#000">
                            <CardItem header>
                                <Text>Street Address 1</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-home-outline" style={{color: '#000'}} />
                                    <Input placeholder="" placeholderTextColor="#878787" style={{color: '#000'}}
                                    onChangeText={(street1) => this.setState({street1})} value={this.state.street1} />
                                </InputGroup>
                            </CardItem>
                            <CardItem header>
                                <Text>Street Address 2 (optional)</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-home-outline" style={{color: '#000'}} />
                                    <Input placeholder="" placeholderTextColor="#878787" style={{color: '#000'}}
                                    onChangeText={(street2) => this.setState({street2})} value={this.state.street2} />
                                </InputGroup>
                            </CardItem>
                            <CardItem header>
                                <Text>City</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-home-outline" style={{color: '#000'}} />
                                    <Input placeholder="" placeholderTextColor="#878787" style={{color: '#000'}}
                                    onChangeText={(city) => this.setState({city})} value={this.state.city} />
                                </InputGroup>
                            </CardItem>
                            <CardItem header>
                                <Text>State</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-home-outline" style={{color: '#000'}} />
                                    <Input placeholder="" placeholderTextColor="#878787" style={{color: '#000'}}
                                    onChangeText={(stateabbr) => this.setState({stateabbr})} value={this.state.stateabbr} />
                                </InputGroup>
                            </CardItem>
                            <CardItem header>
                                <Text>Zip</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-home-outline" style={{color: '#000'}} />
                                    <Input placeholder="" placeholderTextColor="#878787" style={{color: '#000'}}
                                    onChangeText={(zip) => this.setState({zip})} value={this.state.zip} />
                                </InputGroup>
                            </CardItem>
                        </Card>
                    </Content>

                    <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}} onPress={() => this.replaceRoute('signup-step3', {street1: this.state.street1, street2: this.state.street2, city: this.state.city, stateabbr: this.state.stateabbr})}>
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

export default connect(null, bindActions)(Step2);
