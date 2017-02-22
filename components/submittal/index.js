'use strict';

import React, { Component } from 'react';
import { Image, Linking, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, View } from 'native-base';

import { Checkbox } from 'nachos-ui'

import theme from '../../themes/form-theme';
import styles from './styles';

class Submittal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updating: false,
            processStatus: '',
            firstChecked: true
       };
    }

    popRoute() {
        this.props.popRoute();
    }

    replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    handleFirstCheckboxChange = (firstChecked) => {
      this.setState({ firstChecked })
    }

    openLink() {
       Linking.openURL('http://www.mywalkthru.com/');
    }

    submitWalkThru(){
      // alert('Creating Walkthru Report...');
      this.setState({updating: true, processStatus: 'Creating Walkthru Report...'});

      // this.replaceRoute('home');
    }

    render() {
       if (this.state.updating) {
          return this.renderLoadingView();
       }
       return this.renderSubmittalForm();
    }

    renderLoadingView() {
       return (
         <Container theme={theme} style={{backgroundColor: '#333'}}>
            <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                <Header>
                    <Button transparent onPress={() => this.replaceRoute('home')}>
                        <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                    </Button>

                    <Title>{this.state.processStatus}</Title>

                    <Button transparent onPress={this.props.openDrawer}>
                        <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                    </Button>
                </Header>
                <Content padder style={{backgroundColor: 'transparent'}}>
                   <ActivityIndicator
                       animating={this.state.updating}
                       style={[styles.activityIndicator, {height: 80}]}
                       size="large"
                   />
                </Content>
             </Image>
         </Container>
       );
    }

    renderSubmittalForm() {
      const checkboxStyle = { margin: 5 }
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}}>
               <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('home')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Submit Your Walkthru</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                        <View style={styles.box}>
                            <Card foregroundColor='#000'>
                                <CardItem header>
                                    <Text>Are you sure you want to Complete your WalkThru?</Text>
                                    <Checkbox
                                      style={checkboxStyle} 
                                      kind='circle'
                                      checked={this.state.firstChecked}
                                      onValueChange={this.handleFirstCheckboxChange}
                                    />
                                </CardItem>

                                <CardItem header>
                                    <Text onPress={() => this.openLink()}>Read Checklist</Text>
                                </CardItem>

                                <CardItem header>
                                    <Text onPress={() => this.openLink()}>View Pending Items</Text>
                                </CardItem>

                                <CardItem header>
                                    <Text>By Signing you agree that your WalkThru is complete</Text>
                                </CardItem>

                                <CardItem>
                                    <Text>
                                        Write Your Signature HERE
                                    </Text>
                                </CardItem>

                                <CardItem header>
                                    <Button rounded block
                                      style={{backgroundColor: '#00c497', paddingHorizontal: 15}} textStyle={{color: '#fff'}}
                                      onPress={() => this.submitWalkThru()}>
                                        <Text>SUBMIT YOUR WALKTHRU</Text>
                                    </Button>
                                </CardItem>
                            </Card>
                        </View>
                    </Content>
                </Image>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        openDrawer: ()=>dispatch(openDrawer()),
        popRoute: () => dispatch(popRoute()),
        replaceRoute:(route)=>dispatch(replaceRoute(route))
    }
}

export default connect(null, bindAction)(Submittal);
