'use strict';

import React, { Component } from 'react';
import { Image, View, TouchableWithoutFeedback, Switch } from 'react-native';
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
           fullName: '',
           scroll: false,
           selectedOption: 0,
           trueSwitchIsOn: true,
           falseSwitchIsOn: false
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

                        <Title>Your Contact Info</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                        <Card transparent foregroundColor="#000">
                            <CardItem header>
                                <Text>Your best contact #</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-call-outline" style={{color: '#000'}} />
                                    <Input placeholder="Phone" placeholderTextColor="#878787" style={{color: '#000'}} />
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
