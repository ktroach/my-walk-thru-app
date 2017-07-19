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

class Step1 extends Component {

   constructor(props) {
      super(props);
      this.state = {
           email: '',
           username: '',
           validForm: false
      };
   }

    replaceRouteProxy(route) {
        console.log('>>>>> entered: [replaceRoute]: ', route);
        this.props.navigation.navigate(route);
    }     

   saveInputs(route) {
      if (this.inputsValidated()) {
         this.setState({validForm: true});
         try {
            AsyncStorage.setItem("username", this.state.username);
            AsyncStorage.setItem("email", this.state.email);
            
            this.replaceRouteProxy(route);
         } catch(err) {
            console.log(err);
         }
      }
   }

   inputsValidated() {
      if (!this.state.username || this.state.username.length===0) return this.invalidInput('Name');
      if (!this.state.email || this.state.email.length===0) return this.invalidInput('Email');
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
                        <Button transparent onPress={() => this.replaceRoute('step0')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>WELCOME TO YOUR NEW HOME!</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                        <Card transparent foregroundColor="#000">
                            <CardItem header>
                                <Text>What's your name</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-person" style={{color: '#000'}} />
                                    <Input placeholder="First Name Last Name" placeholderTextColor="#878787" style={{color: '#000'}} onChangeText={(username) => this.setState({username})} value={this.state.username} />
                                </InputGroup>
                            </CardItem>
                            <CardItem header>
                                <Text>What's your Email address?</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-mail-outline" style={{color: '#000'}} />
                                    <Input placeholder="youremail@someemail.com" placeholderTextColor="#878787" style={{color: '#000'}}  onChangeText={(email) => this.setState({email})} value={this.state.email} />
                                </InputGroup>
                            </CardItem>
                        </Card>
                    </Content>

                    <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}} onPress={() => this.replaceRoute('signup-step2', {email: this.state.email, username: this.state.username})}>
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

export default connect(null, bindActions)(Step1);
