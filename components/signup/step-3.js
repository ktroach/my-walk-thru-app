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

class Step3 extends Component {

   constructor(props) {
      super(props);
      this.state = {
           pm_companyname: '',
           pm_contactname: '',
           pm_email: '',
           pm_phone: '',
           validForm: false
      };
   }

   saveInputs(route) {
      console.log(">>> ENTERED: step-3 saveInputs");
      if (this.inputsValidated()) {
         this.setState({validForm: true});
         try {
            // AsyncStorage.setItem("pm_companyname", this.state.pm_companyname);
            // AsyncStorage.setItem("pm_contactname", this.state.pm_contactname);
            // AsyncStorage.setItem("pm_email", this.state.pm_email);
            // AsyncStorage.setItem("pm_phone", this.state.pm_phone);

            AsyncStorage.setItem("pm_companyname", this.state.pm_companyname)
            .then( () =>
                  {
                    return AsyncStorage.setItem("pm_contactname", this.state.pm_contactname)
                  }
            )
            .then( () =>
                {
                    return AsyncStorage.setItem("pm_email", this.state.pm_email)
                }
            )
            .then( () =>
                {
                    return AsyncStorage.setItem("pm_phone", this.state.pm_phone)
                }
            )
            .done( );

            console.log("<<< FINISHED: step-3 saveInputs AsyncStorage.setItem");

            this.props.replaceRoute(route);
         } catch(err) {
            console.log(err);
         }
      }
   }

   inputsValidated() {
      if (!this.state.pm_companyname || this.state.pm_companyname.length===0) return this.invalidInput('Property Management Company');
      if (!this.state.pm_email || this.state.pm_email.length===0) return this.invalidInput('Property Managers Email');
      if (!this.state.pm_phone || this.state.pm_phone.length===0) return this.invalidInput('Property Managers Phone');
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
                        <Button transparent onPress={() => this.replaceRoute('signup-step2')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Who is your Property Manager?</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                        <Card transparent foregroundColor="#000">

                            <CardItem header>
                                <Text>Property Management Company</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-briefcase-outline" style={{color: '#000'}} />
                                    <Input placeholder="Company Name" placeholderTextColor="#878787" style={{color: '#000'}}
                                    onChangeText={(pm_companyname) => this.setState({pm_companyname})} value={this.state.pm_companyname} />
                                </InputGroup>
                            </CardItem>

                            <CardItem header>
                                <Text>Property Manager's Name (if different than company)</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-man-outline" style={{color: '#000'}} />
                                    <Input placeholder="Contact Name" placeholderTextColor="#878787" style={{color: '#000'}}
                                    onChangeText={(pm_contactname) => this.setState({pm_contactname})} value={this.state.pm_contactname} />
                                </InputGroup>
                            </CardItem>

                            <CardItem header>
                                <Text>Property Manager's Email</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-mail-outline" style={{color: '#000'}} />
                                    <Input placeholder="Email" placeholderTextColor="#878787" style={{color: '#000'}}
                                    onChangeText={(pm_email) => this.setState({pm_email})} value={this.state.pm_email} />
                                </InputGroup>
                            </CardItem>

                            <CardItem header>
                                <Text>Property Manager's Phone #</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-call-outline" style={{color: '#000'}} />
                                    <Input placeholder="Phone" placeholderTextColor="#878787" style={{color: '#000'}}
                                    onChangeText={(pm_phone) => this.setState({pm_phone})} value={this.state.pm_phone} />
                                </InputGroup>
                            </CardItem>


                        </Card>
                    </Content>

                    <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}} onPress={() => this.replaceRoute('signup-step4', {pm_companyname: this.state.pm_companyname, pm_contactname: this.state.pm_contactname, pm_email: this.state.pm_email, pm_phone: this.state.pm_phone })}>
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

export default connect(null, bindActions)(Step3);
